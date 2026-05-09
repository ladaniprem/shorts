"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Video, Loader2, Sparkles, Wand2, Type } from "lucide-react"
import { analyzeLongVideoAction } from "@/app/actions/analysis"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"

const captionStyles = [
  { id: 'classic', name: 'Classic Pill', desc: 'Yellow highlight with dark background pill', preview: 'bg-yellow-400 text-black px-2 rounded' },
  { id: 'modern', name: 'Modern Neon', desc: 'Clean font with cyan glow and scale effect', preview: 'text-cyan-400 font-bold shadow-[0_0_10px_rgba(34,211,238,0.5)]' },
  { id: 'gamer', name: 'Gamer Tilt', desc: 'Heavy outline, tilted text with magenta color', preview: 'text-fuchsia-500 font-black italic border-2 border-black' },
]

import { uploadVideoAction } from "@/app/actions/upload"
import { Upload, FileVideo, X, ShieldCheck } from "lucide-react"

export default function ConverterPage() {
  const [file, setFile] = useState<File | null>(null)
  const [selectedStyle, setSelectedStyle] = useState("classic")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { user } = useUser()

  const handleConvert = async () => {
    if (!file) {
      toast.error("Please upload a video file first")
      return
    }
    if (!user) return

    setLoading(true)
    try {
      toast.info("Uploading video to secure storage...")
      const formData = new FormData()
      formData.append("file", file)
      
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Upload failed")
      const uploadRes = await response.json()
      
      if (!uploadRes.success) throw new Error("Upload failed")

      toast.info("Analyzing content for viral moments...")
      const result = await analyzeLongVideoAction(uploadRes.url, user.id, selectedStyle)
      
      if (result.success) {
        toast.success(`Success! Created ${result.videoIds?.length} viral shorts.`)
        router.push(`/dashboard`)
      } else {
        toast.error(result.error || "Failed to analyze video")
      }
    } catch (error) {
      console.error(error)
      toast.error("An error occurred during processing")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-2 text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-200 via-fuchsia-200 to-purple-100 bg-clip-text text-transparent">
            Long-to-Short AI Converter
          </h1>
          <div className="px-2 py-0.5 rounded-md bg-violet-500/20 border border-violet-500/30 text-[10px] font-bold text-violet-400 uppercase tracking-tighter">
            9:16 Portrait
          </div>
        </div>
        <p className="text-white/60">Upload your long-form footage and let AI extract viral clips automatically.</p>
      </div>

      <div className="grid gap-8">
        <Card className="bg-black/40 border-white/10 backdrop-blur-xl border-dashed border-2">
          <CardContent className="p-8">
            <div className="space-y-6">
              {!file ? (
                <div className="group relative border-2 border-dashed border-white/5 rounded-3xl p-16 text-center hover:border-violet-500/50 transition-all cursor-pointer bg-white/[0.01] hover:bg-violet-500/[0.03]">
                  <input 
                    type="file" 
                    accept="video/*" 
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center gap-6">
                    <div className="size-20 rounded-3xl bg-white/5 flex items-center justify-center group-hover:bg-violet-500/20 group-hover:scale-110 transition-all duration-500 shadow-xl">
                      <Upload className="size-10 text-violet-400" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xl font-semibold text-white">Select Video File</p>
                      <p className="text-sm text-neutral-500">Drag and drop or click to browse (Max 500MB)</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-6 p-6 rounded-3xl bg-violet-600/10 border border-violet-500/30 animate-in zoom-in duration-500 shadow-2xl shadow-violet-500/10">
                  <div className="size-16 rounded-2xl bg-violet-600 flex items-center justify-center shadow-lg">
                    <FileVideo className="size-8 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-white font-bold text-lg truncate">{file.name}</p>
                      <ShieldCheck className="size-4 text-green-400" />
                    </div>
                    <p className="text-sm text-violet-300/60 font-mono">{(file.size / (1024 * 1024)).toFixed(2)} MB • Ready for Analysis</p>
                  </div>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => setFile(null)}
                    className="text-neutral-400 hover:text-white hover:bg-white/5 rounded-full size-12"
                  >
                    <X className="size-6" />
                  </Button>
                </div>
              )}
              
              <div className="flex items-center justify-center gap-6 text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold">
                <span>MP4 Support</span>
                <span className="size-1 rounded-full bg-neutral-700" />
                <span>MOV Support</span>
                <span className="size-1 rounded-full bg-neutral-700" />
                <span>WEBM Support</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Type className="h-5 w-5 text-purple-400" />
              Caption Styles
            </CardTitle>
            <CardDescription className="text-white/50">
              Choose how your captions will look in the final video.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {captionStyles.map((style) => (
                <div
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer group hover:scale-[1.02] ${
                    selectedStyle === style.id
                      ? "border-purple-500 bg-purple-500/10 shadow-[0_0_20px_rgba(168,85,247,0.2)]"
                      : "border-white/5 bg-white/[0.02] hover:border-white/20"
                  }`}
                >
                  <div className="space-y-3">
                    <h3 className={`font-bold ${selectedStyle === style.id ? "text-white" : "text-white/70"}`}>
                      {style.name}
                    </h3>
                    <p className="text-xs text-white/40 leading-relaxed">{style.desc}</p>
                    <div className="pt-2">
                      <div className={`text-lg uppercase text-center py-2 ${style.preview}`}>
                        SAMPLE
                      </div>
                    </div>
                  </div>
                  {selectedStyle === style.id && (
                    <div className="absolute top-2 right-2">
                      <div className="size-4 rounded-full bg-purple-500 flex items-center justify-center">
                        <Sparkles className="size-2 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-center pt-6 border-t border-white/5">
            <Button
              onClick={handleConvert}
              disabled={loading || !file}
              className="w-full max-w-xs bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:opacity-90 text-white border-none h-12 text-lg font-semibold rounded-full shadow-[0_0_30px_rgba(168,85,247,0.3)]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing Video...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-5 w-5" />
                  Convert to Short
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card className="bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-white/10 backdrop-blur-xl p-6">
        <div className="flex items-start gap-4">
          <div className="size-12 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
            <Sparkles className="size-6 text-purple-400" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-white">How it works</h3>
            <p className="text-sm text-white/50 leading-relaxed">
              Our AI analyzes the audio of your long video, creates a viral script summary, and generates high-quality 
              portrait images to match the narration. The final video is optimized for TikTok, Reels, and YouTube Shorts.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
