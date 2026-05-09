import 'dotenv/config'
import { videoQueue } from '../lib/queue'

async function checkQueue() {
  const waiting = await videoQueue.getWaitingCount()
  const active = await videoQueue.getActiveCount()
  const delayed = await videoQueue.getDelayedCount()
  const failed = await videoQueue.getFailedCount()
  
  console.log(`Waiting: ${waiting}, Active: ${active}, Delayed: ${delayed}, Failed: ${failed}`)
  
  const jobs = await videoQueue.getJobs(['waiting', 'active', 'failed'])
  const jobStates = await Promise.all(jobs.map(async j => ({ id: j.id, name: j.name, data: j.data, state: await j.getState() })))
  console.log('Jobs:', jobStates)
}

checkQueue().then(() => process.exit(0)).catch((e: unknown) => { console.error(e); process.exit(1); })
