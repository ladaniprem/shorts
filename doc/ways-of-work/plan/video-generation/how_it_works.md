# How It Works: In-Depth Functionality

This document explains the step-by-step functionality of the Shorts AI video generation pipeline.

## 1. User Input & Job Creation
1. **Authentication**: A user logs in via **Clerk**.
2. **Submission**: The user submits a prompt (e.g., "Tell a scary story about a haunted house")  for a long-to-short conversion.
3. **Database Entry**: A Server Action creates a new `Video` record in the Supabase PostgreSQL database via **Prisma**. The record is marked as `processing: true`.
4. **Queueing**: A job containing the `videoId` is pushed to the **BullMQ** queue (`video-processing`) hosted on Upstash Redis.

## 2. Background Worker Processing
A dedicated worker script (`worker.ts`) constantly listens to the Redis queue. To optimize costs and prevent rate-limiting, concurrency is managed carefully.
- **Auto-Recovery**: When the worker starts, it cleans up "stuck" jobs (jobs that were interrupted) by marking them as `failed`.
- **Job Execution**: When a job is picked up, it calls the `processes(videoId)` function, kicking off the generation pipeline.

## 3. The Generation Pipeline
The pipeline operates in sequential stages:

### A. Script Generation
An AI language model (usually Gemini or a Groq-hosted model) takes the user's prompt and generates a structured script. It dictates the narration text, image prompts for different scenes, and overall pacing.

### B. Audio (TTS) Generation
This is one of the most resilient parts of the system:
1. **Sanitization**: The script text is cleaned. Markdown is removed, and specific language rules are applied (e.g., converting English numbers to Devanagari for Hindi narration) to prevent AI hallucination.
2. **Chunking**: The script is split into short, sentence-level chunks (max 400 chars). This prevents the TTS model from cutting off or hallucinating on long paragraphs.
3. **Multi-Model Fallback Chain**: For each chunk, the system tries:
   - *Gemini 2.5 TTS*: The primary engine.
   - *ElevenLabs*: Fallback if Gemini fails.
   - *Groq TTS*: Final fallback.
4. **Concatenation**: The raw PCM audio buffers are merged, separated by 200ms of silence, and wrapped in a `.wav` header.
5. **Storage**: The final audio file is uploaded to **AWS S3**.

### C. Image Generation
Based on the image prompts from the script, image generation APIs (like SiliconFlow/Flux, SD 3.5) are called. 
- It uses a "Bring Your Own Pollen" (BYOP) structure, incorporating rate limit management and retries. 
- Generated images are saved/linked for the video renderer.

### D. Captioning & Syncing
The generated audio is analyzed (often using AssemblyAI) to get word-level timestamps. This allows the video renderer to display dynamic, karaoke-style captions perfectly synced with the narration.

### E. Video Assembly
Finally, **Remotion** takes the audio, the sequence of images, and the timed captions. It programmatically renders the final `.mp4` video. The final video is uploaded to S3, and the database record is updated (`processing: false`, `videoUrl: s3_url`).

## 4. Output & Delivery
The Next.js frontend polls or subscribes to changes in the database. Once `processing` becomes `false`, the UI updates to show the final video, allowing the user to view, share, or download it.
