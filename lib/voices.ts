export interface Voice {
  id: string;        // Gemini TTS prebuiltVoiceConfig voiceName
  name: string;
  language: "English" | "Hindi";
  description: string;
  flag: string;
}

// Best single voice per language for Gemini TTS
export const BEST_ENGLISH_VOICE: Voice = {
  id: "Aoede",
  name: "Aoede",
  language: "English",
  description: "Warm · Natural · Cinematic",
  flag: "🇬🇧",
}

export const BEST_HINDI_VOICE: Voice = {
  id: "Kore",
  name: "Kore",
  language: "Hindi",
  description: "Clear · Expressive · Natural",
  flag: "🇮🇳",
}

export const LANGUAGE_VOICES = [BEST_ENGLISH_VOICE, BEST_HINDI_VOICE]

export const DEFAULT_LANGUAGE: "English" | "Hindi" = "English"
