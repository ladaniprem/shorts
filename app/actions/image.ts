import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";

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
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
            },
        });
    }
    return s3ClientInstance;
};

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

// ── Quality suffix ────────────────────────────────────────────────────────────
// FLUX.1 understands natural language well — no double brackets needed.
const QUALITY_SUFFIX =
    ", masterfully rendered, professional cinematic photography, " +
    "ultra-realistic skin textures, individual pores and fine hair strands, " +
    "perfect human anatomy, exactly five fingers on each hand, " +
    "8K resolution, highly detailed eyes with realistic iris patterns, " +
    "accurate lighting and realistic shadows, sharp focus, " +
    "intricate fabric textures and clothing details, correct spatial proportions, " +
    "cinematic color grading, shot on ARRI Alexa, hyperrealistic.";

const NEGATIVE_PROMPT =
    "deformed, bad anatomy, extra fingers, missing fingers, mutated hands, " +
    "missing limbs, blurry, low quality, watermark, text, cartoon, anime, " +
    "3d render, merged objects, incomplete figure, ugly face, lowres.";

// ── SiliconFlow image generation ─────────────────────────────────────────────
// Docs: https://docs.siliconflow.cn/en/api-reference/images/image-generations
//
// Model chain — FREE first, paid only as last resort:
//   1. Kwai-Kolors/Kolors                       — FREE ✓  Best free model: photorealistic faces & cinematic scenes
//   2. stabilityai/stable-diffusion-xl-base-1.0 — FREE ✓  Reliable SDXL fallback, solid quality
//   3. black-forest-labs/FLUX.1-schnell          — PAID    Ultra-cheap ($0.0014/img) last resort if free models fail
//
const SF_MODELS: Array<{
    id: string;
    steps: number | null; // null = let the API manage inference steps
    timeoutMs: number;
    note: string;
    free: boolean;
}> = [
    { id: "Kwai-Kolors/Kolors",                             steps: 20,  timeoutMs: 90_000,  note: "free · best quality",  free: true  },
    { id: "stabilityai/stable-diffusion-xl-base-1.0",       steps: 20,  timeoutMs: 90_000,  note: "free · reliable",      free: true  },
    { id: "black-forest-labs/FLUX.1-schnell",               steps: 4,   timeoutMs: 60_000,  note: "paid · $0.0014/img",   free: false },
];

const SF_BASE_URL = "https://api.siliconflow.com/v1";

const fetchViaSiliconFlow = async (
    prompt: string,
    model: string,
    steps: number | null,
    timeoutMs: number,
): Promise<Buffer> => {
    const apiKey = process.env.SILICONFLOW_API_KEY;
    if (!apiKey) throw new Error("SILICONFLOW_API_KEY is not set in environment variables.");

    const stepInfo = steps !== null ? ` steps=${steps}` : " (auto steps)";
    console.log(`[siliconflow/${model.split("/")[1]}] Generating image (${stepInfo}, timeout=${timeoutMs / 1000}s)...`);

    const body: Record<string, unknown> = {
        model,
        prompt: prompt + QUALITY_SUFFIX,
        negative_prompt: NEGATIVE_PROMPT,
        image_size: "576x1024",    // Portrait 9:16 — perfect for Shorts
        guidance_scale: 3.5,       // FLUX.1 recommended guidance
        seed: Math.floor(Math.random() * 2_147_483_647),
    };

    // FLUX.1.1-pro manages its own steps — do not send num_inference_steps
    if (steps !== null) {
        body.num_inference_steps = steps;
    }

    const response = await fetch(`${SF_BASE_URL}/images/generations`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        // Give each model its own timeout budget
        signal: AbortSignal.timeout(timeoutMs),
    });

    if (!response.ok) {
        const errBody = await response.text();
        const err = new Error(`SiliconFlow ${model} ${response.status}: ${errBody}`) as Error & { status?: number };
        err.status = response.status;
        throw err;
    }

    const data = await response.json() as { images?: { url?: string }[] };
    const imageUrl = data.images?.[0]?.url;

    if (!imageUrl) {
        throw new Error(`SiliconFlow returned no image URL for model ${model}`);
    }

    // Download the generated image from the temporary URL
    const imgResponse = await fetch(imageUrl, {
        signal: AbortSignal.timeout(60_000),
    });

    if (!imgResponse.ok) {
        throw new Error(`Failed to download image from SiliconFlow CDN: ${imgResponse.status}`);
    }

    const buffer = Buffer.from(await imgResponse.arrayBuffer());
    if (buffer.length < 1000) throw new Error(`Image too small (${buffer.length} bytes) — likely failed render.`);
    return buffer;
};

// ── NVIDIA NIM image generation ──────────────────────────────────────────────
const fetchViaNvidia = async (
    prompt: string,
    timeoutMs: number,
): Promise<Buffer> => {
    const apiKey = process.env.NVIDIA_API_KEY;
    if (!apiKey) throw new Error("NVIDIA_API_KEY is not set.");

    console.log(`[nvidia/flux-schnell] Generating image (timeout=${timeoutMs / 1000}s)...`);

    const response = await fetch(`https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux-1-schnell`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify({
            prompt: prompt + QUALITY_SUFFIX,
            image_size: "576x1024",
            num_inference_steps: 4,
            guidance_scale: 3.5,
            seed: Math.floor(Math.random() * 2_147_483_647),
        }),
        signal: AbortSignal.timeout(timeoutMs),
    });

    if (!response.ok) {
        const errBody = await response.text();
        throw new Error(`NVIDIA API ${response.status}: ${errBody}`);
    }

    const data = await response.json() as { images?: { url?: string }[] };
    const imageUrl = data?.images?.[0]?.url;

    if (!imageUrl) {
        throw new Error("NVIDIA API returned no image data.");
    }

    // NVIDIA usually returns base64 data URL: "data:image/png;base64,..."
    if (imageUrl.startsWith("data:image")) {
        const base64Data = imageUrl.split(",")[1];
        return Buffer.from(base64Data, "base64");
    }

    // Fallback if it's a direct URL
    const imgRes = await fetch(imageUrl);
    return Buffer.from(await imgRes.arrayBuffer());
};

// ── Upload helper ─────────────────────────────────────────────────────────────
const uploadToS3 = async (buffer: Buffer, contentType: string): Promise<string> => {
    const bucketName = getBucketName();
    if (!bucketName) throw new Error("Missing S3 bucket name.");
    const ext = contentType.includes("png") ? "png" : "jpg";
    const fileName = `${randomUUID()}.${ext}`;
    await getS3Client().send(new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: buffer,
        ContentType: contentType,
    }));
    return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
};

// ── Core processor ────────────────────────────────────────────────────────────
export const processImage = async (prompt: string): Promise<string> => {
    // 1. Try NVIDIA first (High performance)
    try {
        const buffer = await fetchViaNvidia(prompt, 60_000);
        const s3Url = await uploadToS3(buffer, "image/png");
        console.log(`[nvidia] ✓ Uploaded: ${s3Url}`);
        return s3Url;
    } catch (err: unknown) {
        console.warn(`[nvidia] Failed: ${err.message}. Falling back to SiliconFlow...`);
    }

    // 2. Fallback to SiliconFlow chain
    for (const { id: model, steps, timeoutMs, note, free } of SF_MODELS) {
        const badge = free ? "🆓 FREE" : "💰 PAID";
        const maxAttempts = 3;
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                console.log(`[siliconflow] ${badge} ${model.split("/")[1]} (${note}) attempt ${attempt}/${maxAttempts}: "${prompt.slice(0, 60)}..."`);
                const buffer = await fetchViaSiliconFlow(prompt, model, steps, timeoutMs);
                const s3Url = await uploadToS3(buffer, "image/jpeg");
                console.log(`[siliconflow] ✓ Uploaded: ${s3Url}`);
                return s3Url;
            } catch (error: unknown) {
                const err = error as { status?: number; name?: string; message?: string };
                console.warn(`[siliconflow/${model.split("/")[1]}] Attempt ${attempt} failed: ${err.message}`);

                if (err.status === 429) {
                    // Exponential backoff for rate limits
                    const waitMs = attempt * 20_000;
                    console.warn(`[siliconflow] Rate limited — waiting ${waitMs / 1000}s...`);
                    await sleep(waitMs);
                    continue;
                }

                if (err.status === 402) {
                    // Insufficient credits — skip to cheaper model immediately
                    console.warn(`[siliconflow] Insufficient credits for ${model} — trying cheaper model...`);
                    break;
                }

                // Timeout or server error — give the server more time before retrying
                if (err.name === "TimeoutError" || (err.status && err.status >= 500)) {
                    const waitMs = attempt * 15_000;
                    console.warn(`[siliconflow] Server error/timeout — waiting ${waitMs / 1000}s...`);
                    await sleep(waitMs);
                    continue;
                }

                // Network-level failure (fetch failed, ECONNRESET, ENOTFOUND etc.) — retriable
                if (!err.status) {
                    const waitMs = attempt * 12_000;
                    console.warn(`[siliconflow] Network error — waiting ${waitMs / 1000}s before retry...`);
                    await sleep(waitMs);
                    continue;
                }

                // Non-retriable HTTP error — try next model
                break;
            }
        }
        console.warn(`[siliconflow] ${model.split("/")[1]} all attempts failed — trying next model...`);
    }

    throw new Error("Image generation failed on all SiliconFlow models. Check your SILICONFLOW_API_KEY and account credits.");
};

// ── Main export ───────────────────────────────────────────────────────────────
export const generateImages = async (videoId: string) => {
    try {
        const video = await prisma.video.findFirst({
            where: { videoId },
        });

        if (!video) return null;

        const imageLinks: string[] = [];

        for (let i = 0; i < video.imagePrompts.length; i++) {
            const img = video.imagePrompts[i];
            console.log(`\n[AI-WORKER] [${videoId}] 🖼️ Generating Image ${i + 1}/${video.imagePrompts.length}: "${img.slice(0, 40)}..."`);

            const link = await processImage(img);
            imageLinks.push(link);

            // Small cooldown between requests to avoid rate limits
            if (i < video.imagePrompts.length - 1) {
                console.log(`[AI-WORKER] [${videoId}] ⏱️ 3s cooldown before next image...`);
                await sleep(3_000);
            }
        }

        await prisma.video.update({
            where: { videoId },
            data: {
                imageLinks,
                thumbnail: imageLinks[0],
            },
        });

        console.log(`[AI-WORKER] [${videoId}] 🖼️ ✔ All ${imageLinks.length} images generated and saved.`);
    } catch (error) {
        console.error("Error generating images:", error);
        throw error;
    }
};