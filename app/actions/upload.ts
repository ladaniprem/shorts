"use server"

import { uploadToS3 } from "@/lib/s3"

export async function uploadVideoAction(formData: FormData) {
  const file = formData.get("file") as File
  if (!file) throw new Error("No file provided")

  const buffer = Buffer.from(await file.arrayBuffer())
  const url = await uploadToS3(buffer, file.name, file.type)
  
  return { success: true, url }
}
