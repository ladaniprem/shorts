import { prisma } from "@/lib/prisma"
export const VideoDuration = async (videoId: string) => {
    const video = await prisma.video.findUnique({
        where: {
            videoId: videoId
        },
    })

    if (!video || !video.caption) {
        console.error('Video or caption not found for duration calculation:', videoId)
        return
    }

    const captions = video.caption as Array<{ endFrame: number }>
    if (captions.length === 0) {
        console.error('Empty captions for videoId:', videoId)
        return
    }

    const calculatedDuration = captions[captions.length - 1].endFrame

    await prisma.video.update({
        where: {
            videoId: videoId
        },
        data: {
            duration: Math.round(calculatedDuration)
        }
    })
}