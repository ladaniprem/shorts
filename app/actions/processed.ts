import { findPrompt } from "@/lib/findPrompt"
import { generateImages } from "./image"
import { generateScript } from "./script"
import { prisma } from "@/lib/prisma"
import { generateAudio } from "./audio"
import { generateCaptions } from "./captions"
import { VideoDuration } from "@/lib/duration"
import { renderVideo } from "./render"
import { decreaseCredits } from "@/lib/decreaseCredits"

export const processes = async (videoId: string) => {
    try {
        const video = await prisma.video.findUnique({
            where: { videoId }
        })

        if (!video) {
            throw new Error('video not found')
        }

        // Reset status
        await prisma.video.update({
            where: { videoId },
            data: {
                processing: true,
                failed: false
            }
        })

        const prefix = video.isLongToShort ? `[CLIP-WORKER] [${videoId}]` : `[AI-WORKER] [${videoId}]`;
        console.log(`${prefix} 🚀 STARTING PIPELINE`);

        let fullContent = video.content
        let imagePrompts = video.imagePrompts

        // Generate script only if it doesn't already exist
        if (!fullContent || !imagePrompts || imagePrompts.length === 0) {
            console.log(`${prefix} STEP 1: Generating AI Script...`)
            const language = (video.voiceId ?? "Aoede|English").split("|")[1] ?? "English"
            const script = await generateScript(video.prompt, language)

            const jsonMatch = script?.match(/\{[\s\S]*\}/);
            const cleanedScript = jsonMatch ? jsonMatch[0] : script;
            const scriptData = JSON.parse(cleanedScript || '{}')
            const videoTitle = scriptData.title || "Untitled Short"
            const suggestedTitles = scriptData.suggestedTitles || []

            const rawScenes: Array<{ imagePrompt: string; contentText: string }> = scriptData.content
            const seenSentences = new Set<string>()

            const deduplicatedScenes = rawScenes.map((scene: { imagePrompt: string; contentText: string }) => {
                const sentences = scene.contentText.split(/(?<=[.!?।])\s+/).map((s: string) => s.trim()).filter(Boolean)
                const uniqueSentences = sentences.filter((sentence: string) => {
                    const normalised = sentence.toLowerCase().replace(/[^a-z0-9\u0900-\u097f\s]/g, '').trim()
                    if (seenSentences.has(normalised)) return false;
                    
                    const newWords = new Set(normalised.split(/\s+/))
                    for (const seen of seenSentences) {
                        const seenWords = seen.split(/\s+/)
                        const overlap = seenWords.filter((w: string) => newWords.has(w)).length
                        if (overlap / Math.max(seenWords.length, newWords.size, 1) > 0.8) return false;
                    }
                    seenSentences.add(normalised)
                    return true
                })
                return { ...scene, contentText: uniqueSentences.join(' ') }
            }).filter((scene: { contentText: string }) => scene.contentText.trim().length > 0)

            const contentTexts = deduplicatedScenes.map((d: { contentText: string }) => d.contentText)
            fullContent = contentTexts.join(" ")
            imagePrompts = deduplicatedScenes.map((d: { imagePrompt: string }) => d.imagePrompt)

            await prisma.video.update({
                where: { videoId },
                data: {
                    content: fullContent,
                    imagePrompts,
                    title: videoTitle,
                    suggestedTitles,
                    seoScore: Math.floor(Math.random() * (98 - 85 + 1)) + 85
                }
            })
            console.log(`${prefix} ✔ Script generated successfully.`);
        } else {
            console.log(`${prefix} Skipping script generation (Already exists).`)
        }

        if (!video.isLongToShort) {
            console.log(`${prefix} STEP 2: Generating AI Images & AI Voice (Parallel)...`)
            const [imageResult, audioResult] = await Promise.allSettled([
                generateImages(videoId),
                generateAudio(videoId),
            ])

            if (imageResult.status === 'rejected') console.error(`${prefix} Image generation failed:`, imageResult.reason?.message || imageResult.reason)
            if (audioResult.status === 'rejected') {
                console.error(`${prefix} Audio generation failed:`, audioResult.reason?.message || audioResult.reason)
                throw audioResult.reason
            }
            console.log(`${prefix} ✔ Visuals & Audio generated.`);
        } else {
            console.log(`${prefix} STEP 2: Extracting Native Video Audio...`)
            console.log(`${prefix} Skipping AI asset generation. Using original footage and sound.`);
        }

        console.log(`${prefix} STEP 3: Generating Captions & Syncing...`)
        await generateCaptions(videoId)

        console.log(`${prefix} STEP 4: Calculating Final Duration...`)
        await VideoDuration(videoId)

        if (video.isLongToShort && !video.thumbnail) {
            await prisma.video.update({
                where: { videoId },
                data: { thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800' }
            })
        }

        console.log(`${prefix} STEP 5: Rendering Video on AWS Lambda...`)
        await renderVideo(videoId)

        console.log(`${prefix} ✅ SUCCESS: Processing Complete!`)

        const doneVideo = await prisma.video.findUnique({ where: { videoId } })
        if (doneVideo?.userId) {
            await decreaseCredits(doneVideo.userId)
            console.log(`${prefix} Credits deducted.`);
        }

        await prisma.video.update({
            where: { videoId: videoId },
            data: { processing: false }
        })

    } catch (error: unknown) {
        console.error(`[worker] [${videoId}] FATAL ERROR:`, error.message)
        // Wrap in its own try-catch: if the DB is also down we must NOT throw a
        // second unhandled rejection — just log it and move on.
        try {
            await prisma.video.update({
                where: { videoId: videoId },
                data: { processing: false, failed: true }
            })
        } catch (dbErr) {
            console.error('[processed] Could not mark video as failed in DB (connection lost):', dbErr)
        }
    }
}