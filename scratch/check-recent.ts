import 'dotenv/config'
import { prisma } from '../lib/prisma'

async function check() {
  const videos = await prisma.video.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  })
  console.table(videos.map(v => ({
    id: v.videoId,
    prompt: v.prompt,
    processing: v.processing,
    failed: v.failed,
    contentExists: !!v.content,
    audioExists: !!v.audio,
    created: v.createdAt
  })))
}

void check().then(() => process.exit(0))
