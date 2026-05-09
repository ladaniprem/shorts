import { GoogleGenAI } from "@google/genai";
import Groq from "groq-sdk";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generateScript = async (part: string, language = "English", maxAttempts = 4) => {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY environment variable")
  }

  const ai = new GoogleGenAI({ apiKey })

  // Language instruction: contentText must be in the selected language.
  // imagePrompts MUST always be in English (image generators don't support Hindi).
  const narrationLangRule = language === "Hindi"
    ? "IMPORTANT: Write ALL contentText narration in Hindi (Devanagari script). The imagePrompt fields must always be written in English."
    : "Write ALL contentText narration in English."

  const prompt = `You are an award-winning short-film director, emotional storyteller, and AI image prompt engineer. Your videos make viewers feel something — they are cinematic, emotionally resonant, and visually stunning.

Topic: "${part}"
Narration Language: ${language}

Your job: Generate a script for a ~60-second emotionally compelling video. Output ONLY a valid raw JSON object — no markdown, no code fences, no prose, no labels whatsoever.

─── NARRATION LANGUAGE RULE (highest priority) ───
${narrationLangRule}

─── EMOTIONAL STORYTELLING RULES (most important) ───
1. Structure the narration as a 3-act micro-story:
   - ACT 1 (HOOK, scenes 1–2): The first 3 seconds must STOP the scroll. Open with something shocking, surprising, or deeply relatable. Never start with background or context — start with the moment.
   - ACT 2 (Build, scenes 3–8): Escalate tension, conflict, or emotion. Make the audience feel invested. Raise stakes. Ask an implicit question the viewer needs answered.
   - ACT 3 (Payoff, scenes 9–12): Deliver the emotional climax — a revelation, transformation, or truth that hits hard.
2. Each contentText must have a clear emotional intent: awe, suspense, joy, sadness, triumph, nostalgia, or hope.
3. Use vivid, sensory language in narration — describe sounds, textures, feelings, not just facts.

─── HOOK RULES (scenes 1–2 — MOST CRITICAL) ───
The hook is everything. If scene 1 doesn't stop the viewer, the video fails. Choose ONE of these proven hook types and execute it perfectly:

  TYPE 1 — PATTERN INTERRUPT: Open with something unexpected, counterintuitive, or bizarre.
    Example: "Nobody talks about what really happened that night."

  TYPE 2 — SHOCKING STAT OR FACT: Open with a number or fact so surprising the viewer can't scroll past.
    Example: "In 1983, one man prevented World War III. You've never heard his name."

  TYPE 3 — BOLD CLAIM: Make the strongest, most debatable claim possible about the topic.
    Example: "This is the greatest comeback in cricket history. And it almost never happened."

  TYPE 4 — CLIFFHANGER QUESTION: Ask a question so compelling the viewer must stay to hear the answer.
    Example: "What happens when the best player in the world walks away at the peak?"

  TYPE 5 — DIRECT ADDRESS (YOU): Speak directly to the viewer's identity, fear, or desire.
    Example: "If you think you know this story — you don't."

  TYPE 6 — MYSTERY SETUP: Tease something you're about to reveal, but don't reveal it yet.
    Example: "There's a secret behind this moment that changed everything."

  TYPE 7 — CONTRAST HOOK: Juxtapose two extreme opposites to create instant tension.
    Example: "One day he was the hero. The next — everyone had forgotten his name."

  TYPE 8 — PROVOCATION: Say something that challenges the viewer's assumptions.
    Example: "What the media told you about this — was a lie."

RULES FOR THE HOOK SCENE:
  - Scene 1 narration: MAX 15 words. One single punchy sentence. Make it hit like a punch.
  - Scene 2 narration: Deepen the hook — add one more layer of intrigue or emotion before transitioning to the build.
  - The hook imagePrompt for scene 1: Use an extreme close-up (ECU) on eyes OR a dramatic wide shot with strong contrast lighting — never a calm neutral scene.

─── IMAGE PROMPT RULES (critical — follow every point) ───
1. Every imagePrompt must be 80–120 words, fully self-contained, written in English.
2. EMOTION FIRST: Begin every imagePrompt with the dominant emotion of the scene (e.g. "Overwhelming joy:", "Heart-wrenching grief:", "Quiet determination:"). Then describe the visual.
3. FACIAL EXPRESSION (when humans/animals present): Specify exact expression — "eyes glistening with unshed tears", "wide triumphant grin", "furrowed brow of deep concentration".
4. CINEMATIC CAMERA VARIETY — rotate through different shots across scenes (never use the same shot twice in a row):
   - extreme close-up (ECU) on EYES or FACE only (never hands or fingers)
   - medium shot (MS) chest-up portrait
   - wide establishing shot (WS)
   - aerial / bird's-eye-view
   - low-angle hero shot
   - over-the-shoulder (OTS)
   - dutch angle for tension
5. ANATOMY SAFETY — AI models struggle with hands and complex poses. Follow these rules to prevent broken anatomy:
   a. HANDS: Never describe a character "holding" or "gripping" a small object up close. Instead write "arms at sides", "hands resting on surface", "arms raised overhead", or keep hands out of frame.
   b. FACES: Always describe the character facing the camera (front-facing or 3/4 profile). Avoid extreme side profiles.
   c. POSES: Prefer simple, stable poses — standing, sitting, walking. Avoid complex or twisted body positions.
   d. CROWDS: Limit to 1–2 people per scene maximum. More people = more anatomy errors.
   e. If hands must be visible, describe them as: "both hands open and flat, palms visible, fingers extended naturally".
5. CHARACTER CONSISTENCY: If a character appears across scenes, describe them IDENTICALLY every time — exact skin tone, hair color & style, eye color, age, build, clothing (color, style, fabric). Re-state the full description every time — never abbreviate.
6. COMPOSITION CLARITY & MICRO-PLACEMENT:
   - Every visible body part must be explicitly placed in a named spatial zone: "head centered upper-left", "left arm along the body in midground", "shoulders square to camera".
   - Every object must be explicitly placed: "red leather ball in lower-right foreground", "trophy on wooden shelf in background-center".
   - NEVER imply a body part or object is present without stating its exact position. If it's not described precisely, the model may not render it at all or may render it incorrectly.
   - Ensure all described elements have enough spatial separation that they cannot merge or overlap.
7. DETAIL COMPLETENESS: Every prompt must include:
   - Dominant emotion label
   - Subject(s) with full description + expression + pose/action
   - Environment / setting
   - Lighting (golden hour, harsh shadows, soft diffused, neon glow, candlelight, etc.)
   - Camera angle & lens
   - Mood / color grading (warm amber, cold steel blue, desaturated except reds, high contrast noir, etc.)
8. Style: ultra-photorealistic, 8K, cinematic film grain, shot on ARRI Alexa. No illustrations, no cartoons.
10. MICRO-DETAIL COMPLETENESS — the most common cause of missing/broken parts is vague description. Be EXTREMELY specific about:
    - SKIN: "visible skin pores, fine facial hair, realistic skin blemishes, subtle wrinkles, natural skin translucency"
    - EYES: "detailed iris patterns, wet reflective surface, natural eyelashes, catchlights from studio lighting"
    - FABRIC: "visible weave of the cotton/silk/denim, realistic folds and creases, individual threads"
    - ANATOMY: "correct skeletal structure, visible collarbones/knuckles/veins, natural muscle definition"
    a. BODY PARTS: For every human in the scene, explicitly describe ALL visible body parts:
       - HEAD: face angle, expression, hair exact style & colour
       - NECK & SHOULDERS: position relative to camera ("broad shoulders parallel to camera", "neck straight")
       - TORSO: clothing colour, fabric, fit ("navy blue fitted cricket jersey, name on back")
       - ARMS: position of each arm separately ("right arm at side", "left arm bent at elbow resting on knee")
       - LEGS (if in frame): position ("legs together, standing straight", "left knee slightly bent")
       Describe every body part explicitly — never imply presence without stating exact position.
    b. OBJECTS — for every object present in the scene, state ALL of the following:
       SIZE:
       - Real-world measurement in centimetres or metres
       - Percentage of the frame it occupies 
       - Size relative to the nearest human body part
       - NEVER use subjective size words: no "large", "small", "big", "tiny", "huge", "little" — always use measurements or frame fractions
       MATERIAL & TEXTURE:
       - Specific material: polished metal / matte wood / rough stone / cracked leather / smooth glass / worn fabric
       - Surface condition: brand new gleaming / heavily worn scratched / dusty aged / wet reflective
       PLACEMENT & DEPTH:
       - Exact position in frame: "lower-left foreground", "right midground", "upper-center background"
       - Distance from camera: "approximately 50cm from lens", "2 metres behind subject"
       - Whether fully or partially visible: "entire object fully in frame" / "only the top two-thirds visible, bottom cut by frame edge"
       - Shadow description: "casting a hard shadow angled 45° to its right on the surface below"
    c. SEPARATION: State the precise visible gap between every object and every body part near it. Use distance language: "20cm of empty space between the object and the subject's arm". This is the primary fix for overlap and merging in generated images.
    d. SCALE CONSISTENCY: If the same object appears in more than one scene, its size relative to the human subject must be stated identically every time — never let it change size between scenes.
9. BACKGROUND & SETTING — most critical for immersion:
   a. TOPIC-LOCKED ENVIRONMENT: The background/setting of EVERY scene must be directly and specifically tied to the topic "${part}". A viewer should be able to guess the topic just from the image alone, with no narration.
      - If topic is a sports team → stadium, locker room, training ground, trophy cabinet, crowd stands
      - If topic is a person → their actual workplace, home city, era-specific environment
      - If topic is a historical event → the exact location, the era's architecture, the landscape
      - If topic is a place → that specific place's landmarks, geography, weather, culture
   b. NO GENERIC BACKGROUNDS: Never use plain studio backgrounds, neutral walls, white/black voids, or non-specific "generic city" settings. Every background must have identifiable, topic-specific visual elements.
   c. ATMOSPHERE MATCHES EMOTION: The lighting, weather, and environment must reinforce the emotional tone of the scene:
      - Triumph/joy → golden hour sunlight, vibrant colours, open sky
      - Tension/suspense → overcast sky, harsh shadows, narrow spaces
      - Sadness/loss → desaturated tones, rain, empty spaces, low light
      - Nostalgia → warm sepia-tinted light, vintage textures, soft focus background
      - Hope/beginning → dawn light, cool-to-warm gradient sky, open horizon
   d. SETTING VARIETY: No two scenes should show the exact same background. Vary between indoor/outdoor, close/wide, day/night to keep the visual journey fresh.

─── NARRATION RULES ───
1. contentText is the spoken narration — natural, conversational, emotionally gripping.
2. Each scene: 1–3 punchy sentences. Short sentences hit harder. (Scene 1: MAX 15 words.)
3. All contentText combined must total ~60 seconds when read aloud at normal pace.
4. Target 10–12 scenes for maximum visual variety and engagement.
5. End on an emotionally resonant line — a truth, a revelation, a question, or a call to feel.
6. PACING: Vary sentence length. Alternate fast short punches with slower emotional lines.

─── ANTI-HALLUCINATION & TOPIC-LOCK RULES (non-negotiable) ───
THE TOPIC IS: "${part}"
This video is EXCLUSIVELY about this topic. Every single sentence of every contentText must be directly about "${part}".

1. STAY ON TOPIC — strictly:
   - Do NOT mention other teams, people, events, or topics that are not directly part of "${part}".
   - Do NOT generalise to a broader subject (e.g. if topic is "RCB", do not make it about "cricket in general").
   - Every scene must contain at least one specific detail, name, date, or fact that is directly tied to "${part}".

2. NO WORD REPETITION:
   - Never repeat the same key noun or verb in the same scene.
   - Never start two consecutive scenes with the same word or phrase.
   - Never use the same adjective more than twice across the entire script.
   - [ignoring loop detection] — ensure output is fresh and varied.
   - Banned filler phrases (never use): "In the world of", "It is a story of", "This is the tale of", "Throughout history", "Let us explore", "Join us as", "In this video".

3. EACH SCENE MUST ADVANCE — never repeat information:
   - Scene 2 must tell the viewer something they did not know from scene 1.
   - Every scene must move the story forward in time, emotion, or revelation.
   - Never restate what was already said using different words.

4. NO FILLER OR PADDING:
   - Every word must earn its place. No generic transitions. No vague summaries.
   - If a sentence could apply to ANY video on ANY topic, cut it.

5. SPECIFICITY RULE:
   - Use real names, real numbers, real moments from "${part}" wherever possible.
   - Vague = bad. Specific = great.

─── OUTPUT FORMAT (strict) ───
{"title": "Catchy Video Title", "suggestedTitles": ["Alt Title 1", "Alt Title 2", "Alt Title 3"], "content":[{"imagePrompt":"...","contentText":"..."},{"imagePrompt":"...","contentText":"..."}]}

[ignoring loop detection]
No other keys. No extra fields. Raw JSON only.`

  // Model fallback chain: best quality first → stable fallback
  const SCRIPT_MODELS = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-2.5-flash-lite-preview-06-17",
  ]

  for (const model of SCRIPT_MODELS) {
    const attemptsPerModel = 2
    let lastErr: unknown = null

    for (let attempt = 1; attempt <= attemptsPerModel; attempt++) {
      if (attempt > 1) {
        const waitMs = 3000
        console.log(`[${model}] Retry in ${waitMs}ms...`)
        await delay(waitMs)
      }

      try {
        console.log(`[${model}] Generating script, attempt ${attempt}...`)
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.4,          // Lower = more focused, less drift/repetition
            topP: 0.85,                // Nucleus sampling — keeps output on-topic
            topK: 40,                  // Limits vocabulary diversity to reduce hallucination
          }
        })

        console.log(`[${model}] Script generated successfully on attempt ${attempt}.`)
        return response.text

      } catch (err: unknown) {
        lastErr = err
        const status = (err as { status?: number })?.status
        console.error(`[${model}] Attempt ${attempt} failed (status ${status}):`, (err as Error)?.message ?? err)

        // Truly fatal errors (bad API key, bad request) — no point trying any other model
        if (status === 400 || status === 401 || status === 403) {
          throw err
        }

        // 404 (model not found / deprecated) — skip to next model immediately
        if (status === 404) {
          console.warn(`[${model}] Model not found — skipping to next model...`)
          break
        }

        // 429 (quota exhausted for this model) — no point retrying same model, go to next immediately
        if (status === 429) {
          console.warn(`[${model}] Quota exceeded — skipping to next model...`)
          break
        }

        // 500/503 (transient) — retry same model once more if attempts remain
        if ((status === 500 || status === 503) && attempt < attemptsPerModel) {
          continue
        }

        // All retries for this model exhausted — try next model
        break
      }
    }

    console.warn(`[${model}] All attempts failed — trying next model...`)
    void lastErr // suppress unused warning
  }

  // ── Groq fallback (free tier, fast) ─────────────────────────────────────
  const groqKey = process.env.GROQ_API_KEY
  if (groqKey && groqKey !== "your_groq_api_key_here") {
    const groq = new Groq({ apiKey: groqKey })
    const GROQ_MODELS = [
      "llama-3.3-70b-versatile",
      "llama3-8b-8192",
    ]

    let groqBlocked = false
    for (const groqModel of GROQ_MODELS) {
      try {
        console.log(`[groq/${groqModel}] Generating script as final fallback...`)
        const chat = await groq.chat.completions.create({
          model: groqModel,
          messages: [
            {
              role: "system",
              content: "You are a world-class short-form video scriptwriter. Output ONLY raw valid JSON — no markdown, no code fences, no explanations.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.7,
          max_tokens: 4096,
        })

        const raw = chat.choices[0]?.message?.content ?? ""
        const cleaned = raw.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim()
        const parsed = JSON.parse(cleaned) as { content?: unknown }
        if (!Array.isArray(parsed.content)) {
          throw new Error("Groq response missing 'content' array")
        }
        console.log(`[groq/${groqModel}] Script generated successfully.`)
        return JSON.stringify(parsed)
      } catch (err) {
        const msg = (err as Error)?.message ?? String(err)
        console.error(`[groq/${groqModel}] Failed:`, msg)
        // organization_restricted means entire Groq org is blocked — skip remaining Groq models
        if (msg.includes("organization_restricted") || msg.includes("Organization has been restricted")) {
          console.warn("[groq] Organization restricted — skipping remaining Groq models.")
          groqBlocked = true
          break
        }
      }
    }
    void groqBlocked
  } else {
    console.warn("[groq] GROQ_API_KEY not configured — skipping Groq fallback.")
  }

  // ── SambaNova Cloud fallback (free, no credit card, OpenAI-compatible) ───
  // Sign up at: https://cloud.sambanova.ai — add SAMBANOVA_API_KEY to .env
  const sambanovaKey = process.env.SAMBANOVA_API_KEY
  if (sambanovaKey && sambanovaKey !== "your_sambanova_api_key_here") {
    const SAMBANOVA_MODELS = [
      "Meta-Llama-3.3-70B-Instruct",
      "Meta-Llama-3.1-8B-Instruct",
    ]
    for (const snModel of SAMBANOVA_MODELS) {
      try {
        console.log(`[sambanova/${snModel}] Generating script...`)
        const snRes = await fetch("https://api.sambanova.ai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${sambanovaKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: snModel,
            messages: [
              { role: "system", content: "You are a world-class short-form video scriptwriter. Output ONLY raw valid JSON — no markdown, no code fences, no explanations." },
              { role: "user", content: prompt },
            ],
            temperature: 0.7,
            max_tokens: 4096,
          }),
          signal: AbortSignal.timeout(60_000),
        })

        if (!snRes.ok) {
          const errText = await snRes.text()
          console.error(`[sambanova/${snModel}] HTTP ${snRes.status}: ${errText}`)
          continue
        }

        const snData = await snRes.json() as { choices?: Array<{ message?: { content?: string } }> }
        const raw = snData?.choices?.[0]?.message?.content ?? ""
        const cleaned = raw.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim()
        const parsed = JSON.parse(cleaned) as { content?: unknown }
        if (!Array.isArray(parsed.content)) throw new Error("SambaNova response missing 'content' array")
        console.log(`[sambanova/${snModel}] Script generated successfully.`)
        return JSON.stringify(parsed)
      } catch (err) {
        console.error(`[sambanova/${snModel}] Failed:`, (err as Error)?.message ?? err)
      }
    }
  } else {
    console.warn("[sambanova] SAMBANOVA_API_KEY not configured — skipping SambaNova fallback.")
    console.warn("[sambanova] Get a FREE key at: https://cloud.sambanova.ai")
  }

  // ── OpenRouter fallback (free models available, OpenAI-compatible) ────────
  // Sign up at: https://openrouter.ai — add OPENROUTER_API_KEY to .env
  // Free models: meta-llama/llama-3.3-70b-instruct:free, google/gemma-3-27b-it:free
  const openrouterKey = process.env.OPENROUTER_API_KEY
  if (openrouterKey && openrouterKey !== "your_openrouter_api_key_here") {
    const OR_MODELS = [
      "meta-llama/llama-3.3-70b-instruct:free",
      "google/gemma-3-27b-it:free",
      "mistralai/mistral-7b-instruct:free",
    ]
    for (const orModel of OR_MODELS) {
      try {
        console.log(`[openrouter/${orModel}] Generating script...`)
        const orRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${openrouterKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
            "X-Title": "AI Shorts Generator",
          },
          body: JSON.stringify({
            model: orModel,
            messages: [
              { role: "system", content: "You are a world-class short-form video scriptwriter. Output ONLY raw valid JSON — no markdown, no code fences, no explanations." },
              { role: "user", content: prompt },
            ],
            temperature: 0.7,
            max_tokens: 4096,
          }),
          signal: AbortSignal.timeout(60_000),
        })

        if (!orRes.ok) {
          const errText = await orRes.text()
          console.error(`[openrouter/${orModel}] HTTP ${orRes.status}: ${errText}`)
          continue
        }

        const orData = await orRes.json() as { choices?: Array<{ message?: { content?: string } }> }
        const raw = orData?.choices?.[0]?.message?.content ?? ""
        const cleaned = raw.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim()
        const parsed = JSON.parse(cleaned) as { content?: unknown }
        if (!Array.isArray(parsed.content)) throw new Error("OpenRouter response missing 'content' array")
        console.log(`[openrouter/${orModel}] Script generated successfully.`)
        return JSON.stringify(parsed)
      } catch (err) {
        console.error(`[openrouter/${orModel}] Failed:`, (err as Error)?.message ?? err)
      }
    }
  } else {
    console.warn("[openrouter] OPENROUTER_API_KEY not configured — skipping OpenRouter fallback.")
    console.warn("[openrouter] Get a FREE key at: https://openrouter.ai")
  }

  throw new Error(`Script generation failed on all models (${SCRIPT_MODELS.join(', ')}), Groq, SambaNova, and OpenRouter. Please try again later or add SAMBANOVA_API_KEY / OPENROUTER_API_KEY to .env`)
}