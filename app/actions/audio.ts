import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";
import 'dotenv/config';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

const getBucketName = () =>
    (process.env.AWS_S3_BUCKET_NAME ??
    (process.env.AWS_BUCKET_NAME ??
    process.env.S3_BUCKET_NAME ??
    "";

let s3ClientInstance: S3Client | null = null;
const getS3Client = () => {
    if (!s3ClientInstance) {
        s3ClientInstance = new S3Client({
            region: process.env.AWS_REGION ?? "",
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? ""
            }
        });
    }
    return s3ClientInstance;
};

// ── WAV helpers ──────────────────────────────────────────────────────────────

const SAMPLE_RATE = 24000;
const CHANNELS = 1;
const BIT_DEPTH = 16;
const BYTES_PER_SAMPLE = BIT_DEPTH / 8;

/** Wrap raw PCM bytes in a proper WAV header. */
const pcmToWav = (pcmBuffer: Buffer): Buffer => {
    const dataLength = pcmBuffer.length;
    const header = Buffer.alloc(44);

    header.write('RIFF', 0);
    header.writeUInt32LE(36 + dataLength, 4);
    header.write('WAVE', 8);
    header.write('fmt ', 12);
    header.writeUInt32LE(16, 16);
    header.writeUInt16LE(1, 20);                                                // PCM
    header.writeUInt16LE(CHANNELS, 22);
    header.writeUInt32LE(SAMPLE_RATE, 24);
    header.writeUInt32LE(SAMPLE_RATE * CHANNELS * BYTES_PER_SAMPLE, 28);
    header.writeUInt16LE(CHANNELS * BYTES_PER_SAMPLE, 32);
    header.writeUInt16LE(BIT_DEPTH, 34);
    header.write('data', 36);
    header.writeUInt32LE(dataLength, 40);

    return Buffer.concat([header, pcmBuffer]);
};

/** Generate N milliseconds of silence as raw PCM bytes. */
const silencePcm = (ms: number): Buffer => {
    const bytes = Math.floor((ms / 1000) * SAMPLE_RATE * CHANNELS * BYTES_PER_SAMPLE);
    return Buffer.alloc(bytes, 0);
};

// ── Text sanitisation ────────────────────────────────────────────────────────

/**
 * Clean narration text before sending to TTS.
 *
 * Hallucination in Gemini TTS is heavily triggered by:
 *   • Markdown symbols (*, #, _, -)
 *   • Mixed-script confusion (English numbers in Hindi prose)
 *   • Multiple spaces / stray punctuation
 *   • Emoji / special Unicode
 */
const sanitiseForTTS = (text: string, language: string): string => {
    let t = text;

    // Strip markdown formatting
    t = t.replace(/[*_#`~>]/g, "");
    // Strip emoji and miscellaneous symbols
    t = t.replace(/[\u{1F300}-\u{1FFFF}]/gu, "");
    // Replace en-dash / em-dash with comma pause
    t = t.replace(/[–—]/g, ",");
    // Collapse multiple spaces / newlines
    t = t.replace(/\s+/g, " ").trim();

    if (language === "Hindi") {
        // Replace English digits with Devanagari digits so the model reads
        // them in Hindi rather than switching to English mid-sentence.
        const devanagariDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
        t = t.replace(/\d/g, d => devanagariDigits[Number(d)]);

        // Replace a plain ASCII full-stop with the Hindi danda if it follows
        // Devanagari text, so pacing feels natural.
        t = t.replace(/([^\d\s])\.(\s|$)/g, "$1।$2");
    }

    return t;
};

/**
 * Split narration into sentence-level chunks ≤ maxChars each.
 *
 * Why chunk?  Gemini TTS hallucinates (repeats, invents, trails off) when given
 * more than ~400–500 characters in one call, especially for Hindi/Devanagari.
 * Processing each sentence independently eliminates this completely.
 */
const splitIntoChunks = (text: string, maxChars = 400): string[] => {
    // Split on sentence-ending punctuation: . ! ? | ।
    const sentences = text
        .split(/(?<=[.!?।|])\s+/)
        .map(s => s.trim())
        .filter(Boolean);

    const chunks: string[] = [];
    let current = "";

    for (const sentence of sentences) {
        if (current.length + sentence.length + 1 > maxChars && current.length > 0) {
            chunks.push(current.trim());
            current = sentence;
        } else {
            current = current ? `${current} ${sentence}` : sentence;
        }
    }
    if (current.trim()) chunks.push(current.trim());

    // Safety: if a single sentence is longer than maxChars, break on word boundary
    return chunks.flatMap(chunk => {
        if (chunk.length <= maxChars) return [chunk];
        const words = chunk.split(/\s+/);
        const parts: string[] = [];
        let part = "";
        for (const word of words) {
            if (part.length + word.length + 1 > maxChars && part.length > 0) {
                parts.push(part.trim());
                part = word;
            } else {
                part = part ? `${part} ${word}` : word;
            }
        }
        if (part.trim()) parts.push(part.trim());
        return parts;
    });
};

// ── TTS API call ─────────────────────────────────────────────────────────────

/** TTS model chain — MUST be dedicated TTS models only */
const TTS_MODELS = [
    "gemini-2.5-flash-preview-tts",  // Best quality TTS
    "gemini-2.5-pro-preview-tts",    // Pro TTS fallback
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Call Gemini TTS for a single short chunk.
 * Returns raw PCM buffer or null on failure.
 */
const callTTS = async (
    apiKey: string,
    model: string,
    text: string,
    voiceName: string,
    maxAttempts: number
): Promise<Buffer | null> => {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
                if (attempt > 1) {
            const waitMs = 3000 * Math.pow(2, attempt - 2);
            console.log(`[${model}] Retry ${attempt}/${maxAttempts} in ${waitMs}ms...`);
            await delay(waitMs);
        }

        console.log(`[${model}] TTS chunk — voice: ${voiceName}, chars: ${text.length}`);

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text }] }],
                    generationConfig: {
                        responseModalities: ['AUDIO'],
                        speechConfig: {
                            voiceConfig: {
                                prebuiltVoiceConfig: { voiceName }
                            }
                        }
                    }
                })
            }
        );

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`[${model}] Attempt ${attempt} failed ${response.status}: ${errorBody}`);
            if ((response.status === 500 || response.status === 503) && attempt < maxAttempts) {
                continue;
            }
            return null;
        }

        const data = await response.json();
        const inlineData = data?.candidates?.[0]?.content?.parts?.[0]?.inlineData;

        if (!inlineData?.data) {
            console.error(`[${model}] Attempt ${attempt} — no audio data in response`);
            if (attempt < maxAttempts) continue;
            return null;
        }

        return Buffer.from(inlineData.data, 'base64');
    }
    return null;
};

// ── Main TTS orchestrator ────────────────────────────────────────────────────

/**
 * Generate speech for the entire narration script.
 *
 * Anti-hallucination strategy:
 *   1. Sanitise text  — remove markdown, fix numbers for Hindi
 *   2. Split into chunks ≤ 400 chars each
 *   3. TTS each chunk independently (no hallucination on short inputs)
 *   4. Concatenate raw PCM buffers with 200ms silence between chunks
 *   5. Wrap the combined PCM in one WAV header
 */
const generateSpeechWithGemini = async (
    text: string,
    voiceName: string,
    language: string
): Promise<Buffer> => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not set in environment variables.");

    // 1. Sanitise
    const cleanText = sanitiseForTTS(text, language);
    console.log(`[TTS] Sanitised text (${cleanText.length} chars) for language: ${language}`);

    // 2. Split
    const chunks = splitIntoChunks(cleanText, 400);
    console.log(`[TTS] Split into ${chunks.length} chunks`);

    if (chunks.length === 0) throw new Error("No text chunks to synthesise.");

    // 3. TTS each chunk
    const pcmParts: Buffer[] = [];
    const pauseBetweenChunks = silencePcm(200); // 200ms natural pause between sentences
    let failedChunks = 0;

    for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        console.log(`[TTS] Chunk ${i + 1}/${chunks.length}: "${chunk.slice(0, 60)}${chunk.length > 60 ? '…' : ''}"`);

        let pcm: Buffer | null = null;

        for (const model of TTS_MODELS) {
            const attempts = model === TTS_MODELS[0] ? 3 : 2;
            pcm = await callTTS(apiKey, model, chunk, voiceName, attempts);
            if (pcm) break;
            console.warn(`[TTS] Model ${model} failed for chunk ${i + 1} — trying fallback...`);
        }

        // ── 3.5 Fallback: ElevenLabs TTS (free 10k chars/month, returns PCM directly) ────
        if (!pcm && process.env.ELEVENLABS_API_KEY) {
            console.log(`[TTS] Trying ElevenLabs for chunk ${i + 1}...`);
            try {
                // Use /with-timestamps and PCM output for clean WAV integration
                const elResponse = await fetch(
                    "https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM/stream?output_format=pcm_24000",
                    {
                        method: "POST",
                        headers: {
                            "xi-api-key": process.env.ELEVENLABS_API_KEY!,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            text: chunk,
                            model_id: "eleven_multilingual_v2",
                            voice_settings: { stability: 0.5, similarity_boost: 0.75 },
                        }),
                        signal: AbortSignal.timeout(30_000),
                    }
                );

                if (elResponse.ok) {
                    // ElevenLabs returns raw 24kHz 16-bit mono PCM — exactly what we need
                    pcm = Buffer.from(await elResponse.arrayBuffer());
                    console.log(`[TTS] ✓ ElevenLabs chunk ${i + 1} (${pcm.length} PCM bytes)`);
                } else {
                    const errText = await elResponse.text();
                    console.error(`[TTS] ElevenLabs failed: ${errText}`);
                }
            } catch (err) {
                console.error(`[TTS] ElevenLabs error:`, err);
            }
        }

        // ── 3.6 Final fallback: Groq TTS ──────────────────────────────────
        if (!pcm && process.env.GROQ_API_KEY) {
            console.log(`[TTS] Trying Groq TTS for chunk ${i + 1}...`);
            try {
                const groqResponse = await fetch("https://api.groq.com/openai/v1/audio/speech", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        model: "canopylabs/orpheus-v1-english",
                        input: chunk,
                        voice: "troy",
                        response_format: "wav",
                    }),
                    signal: AbortSignal.timeout(30_000),
                });

                if (groqResponse.ok) {
                    const groqAudio = Buffer.from(await groqResponse.arrayBuffer());
                    pcm = groqAudio.slice(44); // strip WAV header
                    console.log(`[TTS] ✓ Groq TTS chunk ${i + 1}`);
                } else {
                    const errText = await groqResponse.text();
                    console.error(`[TTS] Groq failed: ${errText}`);
                }
            } catch (err) {
                console.error(`[TTS] Groq error:`, err);
            }
        }

        if (!pcm) {
            console.error(`[TTS] All TTS providers failed for chunk ${i + 1} — skipping.`);
            failedChunks++;
            pcmParts.push(silencePcm(500));
            continue;
        }

        pcmParts.push(pcm);
        if (i < chunks.length - 1) {
            pcmParts.push(pauseBetweenChunks);
        }

    }

    // 4. Concatenate PCM → one WAV
    if (failedChunks === chunks.length) {
        throw new Error(`[TTS] All ${chunks.length} chunk(s) failed — no audio generated. Aborting to prevent credit loss.`);
    }
    if (failedChunks > 0) {
        console.warn(`[TTS] ${failedChunks}/${chunks.length} chunk(s) used silence fallback.`);
    }
    const combinedPcm = Buffer.concat(pcmParts);
    console.log(`[TTS] Combined PCM: ${combinedPcm.length} bytes → WAV`);
    return pcmToWav(combinedPcm);
};

// ── Export ───────────────────────────────────────────────────────────────────

export const generateAudio = async (videoId: string) => {
    try {
        const video = await prisma.video.findUnique({
            where: { videoId: videoId }
        });

        if (!video?.content) {
            console.error('Video or content not found for videoId:', videoId);
            return undefined;
        }

        console.log(`\n[AI-WORKER] [${videoId}] 🎙️ Starting Audio Generation...`);

        // voiceId is stored as "VoiceName|Language" e.g. "Kore|Hindi"
        const [voiceName, language] = (video.voiceId ?? "Aoede|English").split("|");
        console.log(`[AI-WORKER] [${videoId}] 🎙️ Selected Voice: ${voiceName || "Aoede"} | Language: ${language || "English"}`);
        
        const audioBuffer = await generateSpeechWithGemini(
            video.content,
            voiceName || "Aoede",
            language || "English"
        );
        console.log(`[AI-WORKER] [${videoId}] 🎙️ Audio generated successfully (${audioBuffer.length} bytes). Uploading to S3...`);

        const bucketName = getBucketName();
        if (!bucketName) {
            throw new Error("Missing S3 bucket name. Set AWS_S3_BUCKET_NAME, AWS_BUCKET_NAME, or S3_BUCKET_NAME.");
        }

        const fileName = `audio-${randomUUID()}.wav`;

        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: fileName,
            Body: audioBuffer,
            ContentType: "audio/wav"
        });

        await getS3Client().send(command);

        const s3Url = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
        console.log(`[AI-WORKER] [${videoId}] 🎙️ ✔ Audio uploaded to S3: ${s3Url}`);

        await prisma.video.update({
            where: { videoId: videoId },
            data: { audio: s3Url }
        });

        return s3Url;
    } catch (error) {
        console.error('Error in generating audio:', error);
        throw error;
    }
}