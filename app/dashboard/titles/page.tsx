"use client"

import { useState } from "react"
import { generateTitlesAction } from "@/app/actions/titles"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Loader2, Sparkles, Copy, Check, Zap, Target, TrendingUp } from "lucide-react"
import { toast } from "sonner"

export default function TitlesPage() {
  const [topic, setTopic] = useState("")
  const [titles, setTitles] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleGenerate = async () => {
    if (!topic) return
    setLoading(true)
    try {
      const res = await generateTitlesAction(topic)
      if (res.success && res.titles) {
        setTitles(res.titles)
      } else {
        toast.error("Failed to generate titles")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string, index: number) => {
    void navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    toast.success("Copied to clipboard")
    setTimeout(() => { setCopiedIndex(null); }, 2000)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-200 via-fuchsia-200 to-purple-100 bg-clip-text text-transparent">
          AI Title Generator
        </h1>
        <p className="text-muted-foreground">Generate viral, click-worthy titles for your shorts in seconds.</p>
      </div>

      <Card className="p-6 bg-accent/5 border-border backdrop-blur-xl">
        <div className="flex gap-4">
          <Input 
            placeholder="What is your video about?" 
            value={topic}
            onChange={(e) => { setTopic(e.target.value); }}
            className="bg-background border-border h-12 rounded-xl focus:ring-violet-500/20"
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          />
          <Button 
            onClick={handleGenerate} 
            disabled={loading || !topic}
            className="group relative h-12 px-8 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-90 transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(168,85,247,0.2)] overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2 font-semibold">
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4 group-hover:rotate-12 transition-transform" />}
              Generate
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shine_1.5s_infinite]" />
          </Button>
        </div>
      </Card>

      {titles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {titles.map((title, index) => {
            const icons = [Zap, Target, Sparkles, TrendingUp, Sparkles, Zap, Target, TrendingUp, Sparkles, Zap];
            const Icon = icons[index % icons.length];
            
            return (
              <div 
                key={index}
                onClick={() => { copyToClipboard(title, index); }}
                style={{ animationDelay: `${index * 50}ms` }}
                className="group relative flex items-center gap-4 p-5 rounded-3xl bg-accent/5 border border-border hover:bg-accent/10 hover:border-violet-500/30 transition-all duration-300 cursor-pointer hover:scale-[1.02] active:scale-[0.98] animate-in fade-in slide-in-from-bottom-4 fill-mode-both"
              >
                <div className="size-12 shrink-0 flex items-center justify-center rounded-2xl bg-violet-600/10 border border-violet-500/20 group-hover:bg-violet-600/20 transition-all duration-500">
                  <Icon className="size-5 text-violet-400 group-hover:scale-110 group-hover:rotate-12 transition-transform" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-mono text-violet-500/60 uppercase tracking-widest mb-1">Variation {index + 1}</div>
                  <span className="text-foreground font-semibold text-lg leading-tight block truncate group-hover:text-white transition-colors">
                    {title}
                  </span>
                </div>

                <div className="shrink-0">
                  {copiedIndex === index ? (
                    <div className="size-8 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30 animate-in zoom-in duration-300">
                      <Check className="size-4 text-green-400" />
                    </div>
                  ) : (
                    <div className="size-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                      <Copy className="size-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600/0 via-violet-600/5 to-violet-600/0 -translate-x-full group-hover:animate-[shine_2s_infinite] pointer-events-none" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  )
}
