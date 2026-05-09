import { prisma } from "@/lib/prisma"
import { findPrompt } from "@/lib/findPrompt"
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text"
import { currentUser } from "@clerk/nextjs/server"
import { ArrowRightIcon, TrendingUp, Zap, Target, Sparkles, Link as LinkIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text"
import { TypingAnimation } from "@/components/magicui/typing-animation"
import { VideoActions } from "@/components/videoActions"
import { toast } from "sonner"

const page = async ({ params }: {
    params: Promise<{
        videoId: string
    }>
}) => {
    const { videoId } = await params
    const user = await currentUser()
    const userId = user?.id
    const prompt = await findPrompt(videoId)

    if (!prompt) {
        return null
    }

    const video = await prisma.video.findUnique({
        where: { videoId }
    })

    if (!video) {
        return null
    }

    const isOwner = userId === video.userId
    const videoUrl = video.videoUrl
    const transcript = video.content

    if (!transcript) {
        return null
    }

    return (
        <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex flex-col lg:flex-row gap-12 items-start">

                    {/* Left: Video Preview */}
                    <div className="w-full lg:w-[450px] shrink-0">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative aspect-[9/16] bg-neutral-900 rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex items-center justify-center">
                                {video.processing ? (
                                    <div className="relative w-full h-full bg-black flex flex-col items-center justify-center gap-4">
                                        {/* Minimal Buffering Spinner */}
                                        <div className="relative size-16">
                                            <div className="absolute inset-0 border-4 border-violet-500/20 rounded-full" />
                                            <div className="absolute inset-0 border-4 border-t-violet-500 rounded-full animate-spin" />
                                            <div className="absolute inset-0 bg-violet-500/10 blur-xl animate-pulse rounded-full" />
                                        </div>
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="text-sm font-medium text-white/80 tracking-tight animate-pulse">
                                                Buffering...
                                            </span>
                                            <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">
                                                AI Extraction
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <video
                                        key={videoId}
                                        className="w-full h-full object-cover"
                                        controls
                                        playsInline
                                        src={videoUrl ?? undefined}
                                    >
                                        Your browser doesn't support the video tag.
                                    </video>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Content & Actions */}
                    <div className="flex-1 space-y-10">
                        <div className="space-y-6">
                            {video.title && (
                                <div className="space-y-4">
                                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-200 via-fuchsia-200 to-purple-100 bg-clip-text text-transparent tracking-tight">
                                        {video.title}
                                    </h1>
                                    
                                    {video.suggestedTitles && video.suggestedTitles.length > 0 && (
                                        <div className="space-y-4 pt-4">
                                            <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 uppercase tracking-widest">
                                                <TrendingUp className="size-3 text-fuchsia-500" />
                                                Viral Alternatives
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {video.suggestedTitles.map((alt, idx) => {
                                                    const icons = [Zap, Target, Sparkles, TrendingUp];
                                                    const Icon = icons[idx % icons.length];
                                                    return (
                                                        <div 
                                                            key={idx} 
                                                            onClick={() => {
                                                                void navigator.clipboard.writeText(alt);
                                                                toast.success("Title copied!");
                                                            }}
                                                            className="group flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.07] hover:border-violet-500/30 transition-all duration-300 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                                                        >
                                                            <div className="size-8 shrink-0 flex items-center justify-center rounded-lg bg-violet-500/10 border border-violet-500/20 group-hover:bg-violet-500/20 transition-colors">
                                                                <Icon className="size-4 text-violet-400 group-hover:scale-110 transition-transform" />
                                                            </div>
                                                            <span className="text-sm text-neutral-300 group-hover:text-white transition-colors font-medium line-clamp-1">
                                                                {alt}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 flex items-center gap-2">
                                            <AnimatedShinyText className="text-sm font-medium flex items-center gap-2">
                                                <span className="text-violet-400">✨</span>
                                                <span className="text-violet-200">AI Script</span>
                                                <ArrowRightIcon className="size-3 text-violet-400" />
                                            </AnimatedShinyText>
                                        </div>
                                        {prompt.startsWith("Clip from:") && (
                                            <a 
                                                href={prompt.replace("Clip from:", "").trim()} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="group/link flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-violet-500/30 transition-all text-[10px] font-bold text-neutral-400 hover:text-white uppercase tracking-tighter"
                                            >
                                                <LinkIcon className="size-3 text-violet-400 group-hover/link:rotate-12 transition-transform" />
                                                View Source
                                            </a>
                                        )}
                                </div>

                                <div className="p-4 rounded-2xl bg-neutral-900/50 border border-white/5 backdrop-blur-sm">
                                    <p className="text-neutral-300 leading-relaxed italic">
                                        "{prompt.replace("Clip from:", "Segment analyzed from original footage:").trim()}"
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="group relative flex items-center justify-center rounded-full px-4 py-2 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f]">
                                    <span className="absolute inset-0 block h-full w-full animate-gradient rounded-[inherit] bg-gradient-to-r from-[#b0b0b0]/20 via-purple-500/20 to-[#b0b0b0]/20 bg-[length:300%_100%] p-[1px]" />
                                    <AnimatedGradientText className="text-sm font-semibold text-purple-200">
                                        Transcript
                                    </AnimatedGradientText>
                                </div>
                            </div>

                            <div className="p-6 rounded-2xl bg-neutral-900/80 border border-white/10 backdrop-blur-md shadow-inner overflow-hidden min-h-[200px]">
                                <TypingAnimation className="text-lg leading-relaxed text-left font-light tracking-wide text-neutral-200">
                                    {transcript}
                                </TypingAnimation>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/5">
                            <VideoActions videoId={videoId} videoUrl={videoUrl} isOwner={isOwner} />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default page