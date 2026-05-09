import 'dotenv/config'
import { prisma } from '../lib/prisma'

async function main() {
  const videoId = 'b6074e42-9539-4750-82c0-61654408305d';
  const video = await prisma.video.findUnique({
    where: { videoId }
  })
  console.dir(video, { depth: null });
}

main()
  .catch(e => { console.error(e); })
