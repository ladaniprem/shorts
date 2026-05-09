"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { ImageIcon, Loader2, Download, Copy, Check } from "lucide-react"
import { generateThumbnailAction } from "@/app/actions/thumbnails"
import { toast } from "sonner"
import Image from "next/image"

export default function ThumbnailsPage() {
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    if (!prompt) {
      toast.error("Please enter a prompt")
      return
    }

    setLoading(true)
    try {
      const result = await generateThumbnailAction(prompt)
      if (result.success && result.imageUrl) {
        setGeneratedImage(result.imageUrl)
        toast.success("Thumbnail generated successfully!")
      } else {
        toast.error(result.error || "Failed to generate thumbnail")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (generatedImage) {
      void navigator.clipboard.writeText(generatedImage)
      setCopied(true)
      setTimeout(() => { setCopied(false); }, 2000)
      toast.success("Image URL copied to clipboard")
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-200 via-fuchsia-200 to-purple-100 bg-clip-text text-transparent">
          AI Thumbnail Generator
        </h1>
        <p className="text-white/60">Generate eye-catching thumbnails for your short videos using AI.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white">Generate Thumbnail</CardTitle>
            <CardDescription className="text-white/50">
              Describe what you want to see in your thumbnail.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">Prompt</label>
              <Input
                placeholder="e.g. A futuristic city at night with neon lights, 4k, cinematic..."
                value={prompt}
                onChange={(e) => { setPrompt(e.target.value); }}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-purple-500/50"
              />
            </div>
            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white border-none"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Generate
                </>
              )}
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-4 border-t border-white/5 pt-6">
            <h4 className="text-sm font-semibold text-white/70">Pro Tips:</h4>
            <ul className="text-xs text-white/40 space-y-2 list-disc ml-4">
              <li>Use descriptive adjectives (e.g., "cinematic", "vibrant").</li>
              <li>Specify lighting and atmosphere.</li>
              <li>Keep it simple for short video thumbnails.</li>
            </ul>
          </CardFooter>
        </Card>

        <Card className="bg-black/40 border-white/10 backdrop-blur-xl flex flex-col min-h-[400px]">
          <CardHeader>
            <CardTitle className="text-white">Preview</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center p-0 overflow-hidden rounded-b-xl relative group">
            {generatedImage ? (
              <div className="relative w-full h-full aspect-[9/16]">
                <Image
                  src={generatedImage}
                  alt="Generated thumbnail"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                   <Button size="icon" variant="secondary" onClick={copyToClipboard} className="rounded-full bg-white/10 hover:bg-white/20 border-white/20 backdrop-blur-md">
                    {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4 text-white" />}
                  </Button>
                  <a href={generatedImage} download target="_blank" rel="noopener noreferrer">
                    <Button size="icon" variant="secondary" className="rounded-full bg-white/10 hover:bg-white/20 border-white/20 backdrop-blur-md">
                      <Download className="h-4 w-4 text-white" />
                    </Button>
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 text-white/20">
                <ImageIcon className="h-12 w-12" />
                <p className="text-sm">No thumbnail generated yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
