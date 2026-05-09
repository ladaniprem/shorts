import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { videoId: string } }
) {
  const { videoId } = params;

  try {
    const video = await prisma.video.findUnique({
      where: { videoId },
      select: {
        processing: true,
        failed: true,
        content: true,
        imageLinks: true,
        audio: true,
        caption: true,
        duration: true,
        videoUrl: true,
      },
    });

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    let currentStep = 0;
    if (video.processing) {
      currentStep = 1; // "Generating Script"
      if (video.content) {
        currentStep = 2; // "Generating Images"
        // Since images and voice generate in parallel, we try to split the steps if one finishes early
        if (video.imageLinks && video.imageLinks.length > 0) currentStep = 3; // "Generating Voice"
        if (video.audio && video.imageLinks && video.imageLinks.length > 0) currentStep = 4; // "Generating Captions"
        if (video.caption) currentStep = 5; // "Finalizing Video"
      }
    } else if (!video.failed) {
      currentStep = 6; // "Completed"
    }

    return NextResponse.json({
      completed: !video.processing && !video.failed,
      failed: video.failed,
      processing: video.processing,
      currentStep,
    });
  } catch (error) {
    console.error("Error fetching video status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
