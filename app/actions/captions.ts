import { prisma } from "@/lib/prisma";
import Groq from "groq-sdk";

const FPS = 30;
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Parse the actual duration in seconds from a WAV buffer.
 * WAV PCM header layout:
 *   Bytes 22-23: num channels (uint16 LE)
 *   Bytes 24-27: sample rate (uint32 LE)
 *   Bytes 34-35: bits per sample (uint16 LE)
 *   Bytes 40-43: data chunk size in bytes (uint32 LE)
 */
const getWavDurationSecs = (buf: Buffer): number => {
    try {
        if (buf.length < 44) return 0;
        const sampleRate    = buf.readUInt32LE(24);
        const numChannels   = buf.readUInt16LE(22);
        const bitsPerSample = buf.readUInt16LE(34);
        const dataSize      = buf.readUInt32LE(40);
        const bytesPerSample = (bitsPerSample / 8) * numChannels;
        if (bytesPerSample === 0 || sampleRate === 0) return 0;
        return dataSize / (sampleRate * bytesPerSample);
    } catch {
        return 0;
    }
};

/**
 * Generate captions from the narration audio.
 *
 * Priority chain:
 *   1. Groq Whisper — accurate word-level timestamps from real audio
 *   2. Proportional estimation — uses ACTUAL WAV duration (not WPM guess)
 *      so caption timing always matches the real audio length exactly.
 */
export const generateCaptions = async (videoId: string) => {
    const video = await prisma.video.findUnique({ where: { videoId } });
    if (!video) {
        console.error("[captions] Video not found:", videoId);
        return;
    }

    // ── Primary: Groq Whisper — word-level accurate timestamps ───────────────
    if (video.audio && process.env.GROQ_API_KEY) {
        try {
            console.log(`[captions] Requesting transcription from Groq for: ${video.audio}`);

            const audioResponse = await fetch(video.audio);
            if (!audioResponse.ok) throw new Error(`S3 fetch failed: ${audioResponse.statusText}`);

            const audioBlob = await audioResponse.blob();
            const audioFile = new File([audioBlob], "audio.wav", { type: "audio/wav" });

            const transcription = await groq.audio.transcriptions.create({
                file: audioFile,
                model: "whisper-large-v3",
                response_format: "verbose_json",
                timestamp_granularities: ["word"],
            });

            if (transcription.words && transcription.words.length > 0) {
                const captions = transcription.words.map((w: any) => ({
                    text: w.word,
                    startFrame: Math.floor(w.start * FPS),
                    endFrame:   Math.floor(w.end   * FPS),
                }));

                await prisma.video.update({ where: { videoId }, data: { caption: captions } });
                console.log(`[captions] ✓ ${captions.length} accurate captions via Groq Whisper.`);
                return;
            }
        } catch (err: any) {
            const code = err?.error?.error?.code ?? err?.code ?? "";
            if (code === "organization_restricted") {
                console.warn("[captions] Groq account restricted — falling back to estimation.");
            } else {
                console.warn("[captions] Groq Whisper failed:", err?.message ?? err);
            }
        }
    }

    // ── Fallback: proportional estimation matched to REAL audio duration ──────
    console.log("[captions] Estimating caption timing from actual audio duration...");
    try {
        const content = video.content ?? "";
        const words = content.trim().split(/\s+/).filter(Boolean);
        if (words.length === 0) {
            console.error("[captions] No content words — skipping captions.");
            return;
        }

        // Step 1: Read REAL duration
        let durationSecs = 0;
        
        // Helper to convert MM:SS or HH:MM:SS to seconds
        const timeToSecs = (t: string | null) => {
            if (!t) return 0
            const p = t.split(':').map(Number)
            if (p.length === 3) return p[0] * 3600 + p[1] * 60 + p[2]
            if (p.length === 2) return p[0] * 60 + p[1]
            return p[0]
        }

        if (video.isLongToShort && video.startTime && video.endTime) {
            durationSecs = timeToSecs(video.endTime) - timeToSecs(video.startTime)
            console.log(`[captions] Clip duration from timestamps: ${durationSecs.toFixed(2)}s`)
        } else if (video.audio) {
            try {
                const audioRes = await fetch(video.audio);
                if (audioRes.ok) {
                    const wavBuffer = Buffer.from(await audioRes.arrayBuffer());
                    durationSecs = getWavDurationSecs(wavBuffer);
                    console.log(`[captions] Real WAV duration: ${durationSecs.toFixed(2)}s`);
                }
            } catch {
                console.warn("[captions] Could not fetch audio for duration — using WPM estimate.");
            }
        }

        // Step 2: WPM estimate ONLY if all else failed
        if (durationSecs <= 0.5) {
            durationSecs = (words.length / 150) * 60; // 150 WPM average
            console.log(`[captions] WPM estimate: ${durationSecs.toFixed(2)}s`);
        }

        // Step 3: Distribute words proportionally across real frame count
        const totalFrames = Math.round(durationSecs * FPS);
        const totalChars  = words.reduce((sum, w) => sum + w.length, 0);

        let currentFrame = 0;
        const captions = words.map((word, i) => {
            const wordFrames = Math.max(
                1,
                i === words.length - 1
                    ? totalFrames - currentFrame
                    : Math.round((word.length / totalChars) * totalFrames)
            );
            const startFrame = currentFrame;
            const endFrame   = currentFrame + wordFrames;
            currentFrame = endFrame;
            return { text: word, startFrame, endFrame };
        });

        await prisma.video.update({ where: { videoId }, data: { caption: captions } });
        console.log(
            `[captions] ✓ ${captions.length} captions saved — ` +
            `${durationSecs.toFixed(1)}s / ${totalFrames} frames.`
        );
    } catch (fallbackErr) {
        console.error("[captions] Critical fallback error:", fallbackErr);
    }
};