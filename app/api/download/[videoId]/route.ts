import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ videoId: string }> }
) {
    try {
        const { videoId } = await params;

        const video = await prisma.video.findUnique({
            where: { videoId }
        });

        if (!video?.videoUrl) {
            return new NextResponse("Video not found", { status: 404 });
        }

        const response = await fetch(video.videoUrl);
        if (!response.ok) throw new Error("Failed to fetch video from storage");

        const blob = await response.blob();
        
        return new NextResponse(blob, {
            headers: {
                "Content-Type": "video/mp4",
                "Content-Disposition": `attachment; filename="video-${videoId}.mp4"`,
            },
        });
    } catch (error) {
        console.error("Download error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
