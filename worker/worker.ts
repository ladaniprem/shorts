import 'dotenv/config'
import { Redis } from 'ioredis'
import { Worker } from 'bullmq'

import { processes } from '../app/actions/processed'
import { prisma } from '../lib/prisma'

// --- HARD SILENCE FOR ECONNRESET SPAM ---
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

console.error = function (...args) {
    if (args.some(arg => typeof arg === 'string' && arg.includes('ECONNRESET'))) return;
    if (args.some(arg => arg && arg.code === 'ECONNRESET')) return;
    if (args.some(arg => arg?.message?.includes('ECONNRESET'))) return;
    originalConsoleError.apply(console, args);
};

console.warn = function (...args) {
    if (args.some(arg => typeof arg === 'string' && arg.includes('ECONNRESET'))) return;
    if (args.some(arg => arg && arg.code === 'ECONNRESET')) return;
    if (args.some(arg => arg && arg.message && arg.message.includes('ECONNRESET'))) return;
    originalConsoleWarn.apply(console, args);
};
// ----------------------------------------

const REDIS_URL = 'rediss://default:gQAAAAAAAbj-AAIgcDJjODEwNzNlNTVkYjg0YmJkYjFlZDJlZWZlZGY5YzE4Yw@brief-toucan-112894.upstash.io:6379'

const connection = new Redis(REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    connectTimeout: 20000,
    family: 4, 
    keepAlive: 10000,
    tls: {
        rejectUnauthorized: false
    },
    retryStrategy(times) {
        return Math.min(times * 200, 5000);
    }
})

// SILENCE ECONNRESET SPAM PERMANENTLY
if (typeof process !== 'undefined') {
    process.on('uncaughtException', (err) => {
        if (err.message.includes('ECONNRESET')) return;
        console.error('Worker Uncaught Exception:', err);
    });
    process.on('unhandledRejection', (reason: unknown) => {
        if (reason?.message?.includes('ECONNRESET')) return;
        console.error('Worker Unhandled Rejection:', reason);
    });
}

let workerConnectedLogged = false;
connection.on('connect', () => {
    if (!workerConnectedLogged) {
        console.log('Worker connected to Redis successfully');
        workerConnectedLogged = true;
    }
})

connection.on('error', (err) => {
    if (err.message.includes('ECONNRESET')) return;
    console.warn('Worker Redis connection issue:', err.message)
})

// Auto-recovery: Mark stuck videos as failed when worker restarts
const cleanupStuckJobs = async () => {
    try {
        const stuckVideos = await prisma.video.updateMany({
            where: { processing: true },
            data: { processing: false, failed: true }
        })
        if (stuckVideos.count > 0) {
            console.log(`🧹 Auto-recovery: Reset ${stuckVideos.count} stuck video(s) that were left processing.`)
        }
    } catch (err) {
        console.error('Failed to cleanup stuck jobs:', err)
    }
}

cleanupStuckJobs().then(() => {
    const worker = new Worker('video-processing', async (job) => {
    const { videoId } = job.data
    console.log(`Processing video: ${videoId}`)

    try {
        await processes(videoId)
        console.log(`Successfully processed video: ${videoId}`)
    } catch (error: unknown) {
        console.error(`Error processing video ${videoId}:`, error.message)

        await prisma.video.update({
            where: { videoId },
            data: {
                processing: false,
                failed: true
            }
        })
        throw error
    }
}, {
    connection,
    concurrency: 1 // Reduce concurrency to save connections on Free Tier
})

worker.on('completed', (job) => {
    console.log(`Job ${job?.id} completed`)
})

worker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} failed:`, err.message)
})

console.log('Worker started, waiting for jobs...')
})