"use client"
/* eslint-disable @next/next/no-img-element */
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AlertDialogDescription } from "@/components/ui/alert-dialog"
import { DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Copy, Download, MoreVertical, Trash2 } from "lucide-react"
import Link from "next/link"
import { useVideoActions } from "@/hooks/useVideoActions"


type VideoCardVideo = {
    videoId: string
    prompt?: string | null
    createdAt: string | Date
    thumbnail?: string | null
    videoUrl?: string | null
    title?: string | null
    isLongToShort?: boolean
    processing?: boolean
}

import { Clock, Play, Layers } from "lucide-react"

export const VideoCard = ({ video }: { video: VideoCardVideo }) => {
    const { handleDownload, handleCopyLink, handleDelete, isDeleting } = useVideoActions({
        videoId: video.videoId,
        videoUrl: video.videoUrl || null,
        onDeleteSuccess: () => {}
    })

    return (
        <div className="group bg-black/40 border border-white/10 rounded-[32px] overflow-hidden hover:shadow-[0_0_40px_-10px_rgba(168,85,247,0.2)] hover:border-violet-500/30 transition-all duration-500 relative flex flex-col h-full backdrop-blur-xl">
            <Link href={`/videos/${video.videoId}`} className="block relative flex-1">
                <div className="aspect-[16/10] bg-white/[0.02] relative overflow-hidden">
                    {video.thumbnail ? (
                        <img
                            src={video.thumbnail}
                            alt={"video thumbnail"}
                            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full gap-3">
                            <div className="size-12 rounded-2xl bg-white/5 flex items-center justify-center animate-pulse">
                                <Play className="size-6 text-white/20" />
                            </div>
                            <span className="text-[10px] uppercase tracking-widest text-white/20 font-bold">
                                Initializing...
                            </span>
                        </div>
                    )}
                    
                    {/* Status Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {video.isLongToShort && (
                            <div className="px-3 py-1 rounded-full bg-fuchsia-500/20 border border-fuchsia-500/30 backdrop-blur-md flex items-center gap-2">
                                <Layers className="size-3 text-fuchsia-400" />
                                <span className="text-[10px] font-bold text-fuchsia-300 uppercase tracking-tighter">AI Clip</span>
                            </div>
                        )}
                        {video.processing && (
                            <div className="px-3 py-1 rounded-full bg-violet-500/20 border border-violet-500/30 backdrop-blur-md flex items-center gap-2">
                                <div className="size-1.5 rounded-full bg-violet-400 animate-pulse" />
                                <span className="text-[10px] font-bold text-violet-300 uppercase tracking-tighter">Processing</span>
                            </div>
                        )}
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                        <div className="size-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            <Play className="size-5 fill-white" />
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-3">
                    <div className="space-y-1">
                        <h3 className="font-bold text-lg text-white leading-tight line-clamp-2 group-hover:text-violet-300 transition-colors">
                            {video.title || video.prompt || "Untitled Short"}
                        </h3>
                        <div className="flex items-center gap-2 text-neutral-500">
                            <Clock className="size-3" />
                            <p className="text-[11px] font-medium" suppressHydrationWarning>
                                {new Date(video.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                        </div>
                    </div>
                </div>
            </Link>

            <div className="absolute top-4 right-4 z-20">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="size-10 rounded-full p-0 bg-black/40 backdrop-blur-md border border-white/5 hover:bg-white/10 hover:border-white/20 text-white cursor-pointer transition-all"
                            onClick={(e) => e.preventDefault()}
                        >
                            <MoreVertical className="h-4 w-4 " />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-neutral-900/95 backdrop-blur-2xl border-white/10 rounded-2xl p-2" align="end">
                        <DropdownMenuItem onClick={handleDownload} className="cursor-pointer rounded-xl py-2.5 focus:bg-white/10 transition-colors">
                            <Download className="mr-3 h-4 w-4 text-violet-400" />
                            <span className="font-medium">Download HD</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer rounded-xl py-2.5 focus:bg-white/10 transition-colors">
                            <Copy className="mr-3 h-4 w-4 text-violet-400" />
                            <span className="font-medium">Copy Project Link</span>
                        </DropdownMenuItem>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                    onSelect={(e) => e.preventDefault()}
                                    className="text-red-400 hover:bg-red-500/10 focus:bg-red-500/10 hover:text-red-400 focus:text-red-400 cursor-pointer rounded-xl py-2.5 transition-colors"
                                >
                                    <Trash2 className="mr-3 h-4 w-4" />
                                    <span className="font-medium">Delete Forever</span>
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-neutral-900 border-white/10 rounded-[32px] p-8">
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-2xl font-bold text-white">Delete this video?</AlertDialogTitle>
                                    <AlertDialogDescription className="text-neutral-400 mt-2">
                                        This action cannot be undone. All generated assets and AI data associated with this short will be permanently removed.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="mt-8 gap-3">
                                    <AlertDialogCancel className="rounded-full h-12 px-8 border-white/10 hover:bg-white/5 transition-all">Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDelete}
                                        disabled={isDeleting}
                                        className="bg-red-500 hover:bg-red-600 text-white rounded-full h-12 px-8 transition-all font-bold"
                                    >
                                        Delete Forever
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}
