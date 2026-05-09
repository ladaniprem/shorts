"use server"

import { prisma } from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

export async function scheduleVideoAction(videoId: string, publishDate: Date | null) {
  const user = await currentUser()
  if (!user) throw new Error("Unauthorized")

  try {
    await prisma.video.update({
      where: { videoId, userId: user.id },
      data: { publishDate },
    })
    revalidatePath("/dashboard/calendar")
    return { success: true }
  } catch (error) {
    console.error("Error scheduling video:", error)
    return { success: false, error: "Failed to schedule video" }
  }
}

export async function getScheduledVideos() {
  const user = await currentUser()
  if (!user) throw new Error("Unauthorized")

  return await prisma.video.findMany({
    where: {
      userId: user.id,
      publishDate: { not: null },
    },
    orderBy: { publishDate: "asc" },
  })
}

export async function getUnscheduledVideos() {
  const user = await currentUser()
  if (!user) throw new Error("Unauthorized")

  return await prisma.video.findMany({
    where: {
      userId: user.id,
      publishDate: null,
    },
    orderBy: { createdAt: "desc" },
  })
}
