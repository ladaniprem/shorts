'use server'
import { prisma } from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"
import { randomUUID } from "crypto"
import { videoQueue } from "@/lib/queue"

export const createVideo = async (prompt: string, voiceId: string) => {
  const videoId = randomUUID()
  const user = await currentUser()
  const userId = user?.id

  if (!userId) {
    return null
  }

  await prisma.video.create({
    data: {
      videoId,
      userId,
      prompt,
      voiceId,
      processing: true
    }
  })

  await videoQueue.add('process-video', { videoId })
  
  return { videoId }
}

