"use client"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Copy, Download, Trash2, Sparkles } from "lucide-react"
import { useVideoActions } from "../hooks/useVideoActions"
import { useRouter } from "next/navigation"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { AlertDialogDescription, AlertDialogTitle } from "@radix-ui/react-alert-dialog"
import Link from "next/link"
import { generateTitlesAction } from "@/app/actions/titles"
import { toast } from "sonner"
import { useState } from "react"

interface videoActionsPrompt {
    videoId: string
    videoUrl: string | null
    isOwner?: boolean
}

export const VideoActions = ({ videoId, videoUrl, isOwner }: videoActionsPrompt) => {
    const router = useRouter()
    const { handleDownload, handleCopyLink, handleDelete, isDeleting, copied } = useVideoActions({
        videoId,
        videoUrl,
        onDeleteSuccess: () => router.push('/dashboard')
    })

    const [isGeneratingTitles, setIsGeneratingTitles] = useState(false)

    const handleRegenerateTitles = async () => {
        setIsGeneratingTitles(true)
        try {
            // We use a dummy topic or try to get it from the page if possible. 
            // For now, we'll ask for a topic if we don't have one, or just use a generic one.
            const topic = window.prompt("What is the main topic for the new titles?")
            if (!topic) return
            
            const res = await generateTitlesAction(topic, videoId)
            if (res.success) {
                toast.success("Titles regenerated successfully!")
                router.refresh()
            } else {
                toast.error("Failed to regenerate titles")
            }
        } catch (error) {
            toast.error("An error occurred")
        } finally {
            setIsGeneratingTitles(false)
        }
    }

    return (
        <div className="flex flex-col gap-4 mt-10 ml-8 justify-center">
            <Button
                onClick={handleRegenerateTitles}
                disabled={isGeneratingTitles}
                className="group flex items-center gap-2 rounded-full justify-center w-64 cursor-pointer h-12 border-violet-500/30 bg-violet-500/10 text-violet-200 hover:bg-violet-500/20 hover:scale-105 active:scale-95 transition-all duration-300"
            >
                <Sparkles className={`h-4 w-4 transition-all duration-500 ${isGeneratingTitles ? 'animate-spin text-violet-400' : 'group-hover:rotate-12 group-hover:scale-110'}`} />
                Regenerate Titles
            </Button>

            <Button
                onClick={handleDownload}
                className='group relative bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-700 hover:opacity-90 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] text-white rounded-full font-bold flex items-center gap-2 justify-center w-64 cursor-pointer h-14 transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden'
                disabled={!videoUrl}
            >
                <Download className="h-5 w-5 group-hover:translate-y-0.5 transition-transform" />
                Download Video
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shine_1.5s_infinite]" />
            </Button>

            <Button
                variant="outline"
                onClick={handleCopyLink}
                className="group flex items-center gap-2 rounded-full justify-center w-64 cursor-pointer h-12 border-white/10 bg-white/5 text-neutral-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 active:scale-95"
            >
                <Copy className={`h-4 w-4 transition-transform duration-300 ${copied ? 'scale-125 text-green-400' : 'group-hover:rotate-6'}`} />
                {copied ? 'Copied!' : 'Copy Video Link'}
            </Button>

            {
                isOwner && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="outline"
                                className="flex items-center gap-2 text-red-400 hover:bg-red-950/40 border-red-900/30 rounded-full justify-center w-56 cursor-pointer h-12"
                            >
                                <Trash2 className="h-4 w-4" />
                                Delete Permanently
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your
                                    video and remove your video from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="rounded-full cursor-pointer">Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="bg-gradient-to-br from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white rounded-full cursor-pointer"
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )
            }

            <Link href="/dashboard">
                <Button variant="ghost" className="flex item-center gap-2 text-neutral-400 hover:text-white hover:bg-white/5 rounded-full justify-center w-56 cursor-pointer">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Dashboard
                </Button>
            </Link>

        </div>
    )
}