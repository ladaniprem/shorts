import { currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Sparkles } from "lucide-react"
import { SignOutButton } from "@clerk/nextjs"
import { VideoCard } from "@/components/videoCard"

const Dashboard = async () => {
    const user = await currentUser()

    if (!user) {
        return null
    }
    const videos = await prisma.video.findMany({
        where: {
            userId: user.id
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="size-10 relative rounded-xl overflow-hidden bg-white/5 border border-white/10 p-1 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                        <img src="/ai-shorts-logo.png" alt="Logo" className="w-full h-full object-contain" />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-200 via-fuchsia-200 to-purple-100 bg-clip-text text-transparent">
                        Your Videos
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/dashboard/titles">
                        <Button 
                            variant="outline" 
                            className="group relative rounded-full border-violet-500/30 bg-violet-500/5 text-violet-200 hover:text-white hover:bg-violet-500/20 h-11 px-6 transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                <Sparkles className="size-4 text-violet-400 group-hover:rotate-12 transition-transform" />
                                Title Generator
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/0 via-violet-600/10 to-violet-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        </Button>
                    </Link>
                    <Link href="/new">
                        <Button 
                            className="group relative rounded-full bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-700 text-white font-semibold h-11 px-8 cursor-pointer overflow-hidden shadow-[0_0_20px_rgba(168,85,247,0.2)] hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all duration-300 hover:scale-105 active:scale-95"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                                Create New Short
                            </span>
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Button>
                    </Link>
                </div>
            </div>

            {
                videos.length === 0 ? (
                    <div className="rounded-3xl border border-violet-500/10 bg-white/[0.02] px-6 py-20 text-center backdrop-blur-xl">
                        <p className="mb-6 text-xl text-white/40">You haven't created any videos yet</p>
                        <Link href='/new'>
                            <Button className="bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-700 text-white rounded-full font-medium h-12 px-8 cursor-pointer hover:opacity-90 hover:shadow-[0_0_24px_rgba(168,85,247,0.35)] transition-all">
                                Create your first video
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {videos.map((video) => (
                            <VideoCard key={video.videoId} video={video} />
                        ))}
                    </div>
                )
            }
        </div>
    )
}

export default Dashboard