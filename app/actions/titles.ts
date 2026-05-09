"use server"

import Groq from "groq-sdk";
import { prisma } from "@/lib/prisma";

export async function generateTitlesAction(topic: string, videoId?: string) {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) throw new Error("Missing GROQ_API_KEY")

  const groq = new Groq({ apiKey })

  const prompt = `You are a viral marketing expert. Generate 10 highly engaging, click-worthy titles for a short video about: "${topic}".
  
  Rules:
  1. Use "Pattern Interrupt" and "Curiosity Gap" techniques.
  2. Keep them short (under 60 characters).
  3. Include emojis where appropriate.
  4. Focus on emotional impact (shock, awe, relatable, mystery).
  5. Output ONLY a valid JSON array of strings. No markdown, no code fences.
  
  Example: ["This Secret will Change Everything 😱", "Why you're doing it WRONG...", "The 1% don't want you to know this."]
  `

  try {
    const chat = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a world-class viral marketer. Output ONLY raw valid JSON — no markdown, no code fences, no explanations.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1024,
    })

    const raw = chat.choices[0]?.message?.content ?? ""
    const cleaned = raw.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim()
    const titles = JSON.parse(cleaned)

    if (videoId) {
      await prisma.video.update({
        where: { videoId },
        data: { suggestedTitles: titles }
      })
    }

    return { success: true, titles }
  } catch (error) {
    console.error("Error generating titles with Groq:", error)
    return { success: false, error: "Failed to generate titles" }
  }
}
