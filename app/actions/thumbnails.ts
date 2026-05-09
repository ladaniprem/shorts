"use server"

import { processImage } from "./image"
import { prisma } from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"

export async function generateThumbnailAction(prompt: string) {
  const user = await currentUser()
  if (!user) throw new Error("Unauthorized")

  try {
    const imageUrl = await processImage(prompt)
    return { success: true, imageUrl }
  } catch (error) {
    console.error("Error generating thumbnail:", error)
    return { success: false, error: "Failed to generate thumbnail" }
  }
}
