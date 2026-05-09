"use server"

import { GoogleGenAI } from "@google/genai";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

import { videoQueue } from "@/lib/queue";
import Groq from "groq-sdk";

export async function analyzeLongVideoAction(sourceUrl: string, userId: string, captionStyle: string) {
  const apiKey = process.env.GEMINI_API_KEY
  const groqKey = process.env.GROQ_API_KEY
  
  if (!apiKey && !groqKey) throw new Error("Missing AI API Keys")

  const ai = new GoogleGenAI({ apiKey: apiKey ?? "" })
  const groq = new Groq({ apiKey: groqKey ?? "" })
  
  const prompt = `Analyze this long video: ${sourceUrl}. 
  Your task is to identify 3 viral, stand-alone short segments (under 60 seconds each).
  
  CRITICAL: You must provide the EXACT start and end timestamps for each segment.
  
  For each segment, provide:
  1. A catchy title.
  2. The exact 'startTime' (in MM:SS or HH:MM:SS format).
  3. The exact 'endTime' (in MM:SS or HH:MM:SS format).
  4. The full word-for-word 'transcript' of this segment.
  5. A brief description of why this segment is viral.
  
  Output ONLY a valid JSON array of objects with the following structure:
  [
    {
      "title": "Segment Title",
      "startTime": "01:20",
      "endTime": "01:50",
      "transcript": "The exact words spoken...",
      "description": "Why it is viral..."
    },
    ...
  ]
  `

  let segments = null
  let lastError = null

  // Helper to prevent APIs from hanging the Server Action indefinitely
  const fetchWithTimeout = async (url: string, options: unknown, timeoutMs = 8000) => {
    const controller = new AbortController();
    const id = setTimeout(() => { controller.abort(); }, timeoutMs);
    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  };

  // ── Step 1: Try SambaNova (Llama 3.3 70B) — Fastest Free Inference ─────────────────────────
  const sambaKey = process.env.SAMBANOVA_API_KEY
  if (!segments && sambaKey) {
    try {
      console.log(`[analysis] Trying SambaNova (Llama 3.3 70B)...`)
      const res = await fetchWithTimeout("https://api.sambanova.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${sambaKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "Meta-Llama-3.3-70B-Instruct",
          messages: [
            { role: "system", content: "You are a viral video expert. Output ONLY valid JSON array of segments." },
            { role: "user", content: prompt }
          ],
          response_format: { type: "json_object" }
        })
      }, 8000) // 8s timeout
      const data = await res.json()
      const content = data.choices?.[0]?.message?.content
      if (content) {
        const parsed = JSON.parse(content)
        segments = Array.isArray(parsed) ? parsed : (parsed.segments || parsed.data || [parsed])
      }
    } catch (error) {
      console.warn("[analysis] SambaNova failed or timed out:", error)
    }
  }

  // ── Step 2: Try SiliconFlow (DeepSeek-V3) — High Fidelity Free Inference ──────────────────────
  const siliconKey = process.env.SILICONFLOW_API_KEY
  if (!segments && siliconKey) {
    try {
      console.log(`[analysis] Trying SiliconFlow (DeepSeek-V3)...`)
      const res = await fetchWithTimeout("https://api.siliconflow.cn/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${siliconKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "deepseek-ai/DeepSeek-V3", 
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" }
        })
      }, 10000) // 10s timeout
      const data = await res.json()
      const content = data.choices?.[0]?.message?.content
      if (content) {
        const parsed = JSON.parse(content)
        segments = Array.isArray(parsed) ? parsed : (parsed.segments || parsed.data || [parsed])
      }
    } catch (error) {
      console.warn("[analysis] SiliconFlow failed or timed out:", error)
    }
  }

  // ── Step 3: Try Groq (Llama 3.3 70B) ────────────────────────────────────────────────────────
  if (!segments && groqKey) {
    try {
      console.log(`[analysis] Trying Groq (Llama 3.3 70B)...`)
      const chat = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      }, { timeout: 8000 }) // 8s timeout for Groq SDK
      const content = chat.choices[0]?.message?.content ?? ""
      const parsed = JSON.parse(content)
      segments = Array.isArray(parsed) ? parsed : (parsed.segments || parsed.data || [parsed])
    } catch (error) {
      console.warn("[analysis] Groq failed or timed out:", error)
    }
  }

  // ── Step 4: Final Fallback to Gemini ────────────────────────────────────────────────────────
  if (!segments && apiKey) {
    const models = ["gemini-2.0-flash", "gemini-1.5-flash"]
    for (const model of models) {
      try {
        console.log(`[analysis] Final fallback to Gemini: ${model}`)
        const res = await ai.models.generateContent({
          model,
          contents: prompt,
          config: { responseMimeType: "application/json" }
        })
        segments = JSON.parse(res.text)
        if (segments) break
      } catch (error) {
        console.warn(`[analysis] Gemini ${model} failed:`, error)
        lastError = error
      }
    }
  }

  if (!segments) {
    console.error("All AI models failed to analyze video.", lastError)
    return { success: false, error: "All AI models are currently busy or failed to analyze the video. Please try again." }
  }

  try {
    const createdVideoIds = []

    for (const segment of segments) {
      const videoId = randomUUID()
      console.log(`[analysis] Creating database record for segment: ${segment.title}`)
      await prisma.video.create({
        data: {
          videoId,
          userId,
          prompt: `Clip from: ${sourceUrl}`,
          title: segment.title,
          content: segment.transcript,
          processing: true,
          isLongToShort: true,
          sourceUrl: sourceUrl,
          startTime: segment.startTime,
          endTime: segment.endTime,
          captionStyle,
        }
      })
      
      console.log(`[analysis] Successfully created video record: ${videoId}. Adding to queue...`)
      
      // TRIGGER THE WORKER
      await videoQueue.add('video-processing', { videoId })
      console.log(`[analysis] Job added to queue for video: ${videoId}`)
      
      createdVideoIds.push(videoId)
    }

    return { success: true, videoIds: createdVideoIds }
  } catch (error) {
    console.error("Error analyzing long video:", error)
    return { success: false, error: "Failed to analyze video" }
  }
}
