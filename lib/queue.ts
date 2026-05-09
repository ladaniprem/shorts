import { Queue } from 'bullmq'
import { Redis } from 'ioredis'

// --- HARD SILENCE FOR ECONNRESET SPAM ---
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

console.error = function (...args) {
    if (args.some(arg => typeof arg === 'string' && arg.includes('ECONNRESET'))) return;
    if (args.some(arg => arg && arg.code === 'ECONNRESET')) return;
    if (args.some(arg => arg && arg.message && arg.message.includes('ECONNRESET'))) return;
    originalConsoleError.apply(console, args);
};

console.warn = function (...args) {
    if (args.some(arg => typeof arg === 'string' && arg.includes('ECONNRESET'))) return;
    if (args.some(arg => arg && arg.code === 'ECONNRESET')) return;
    if (args.some(arg => arg && arg.message && arg.message.includes('ECONNRESET'))) return;
    originalConsoleWarn.apply(console, args);
};
// ----------------------------------------

const globalForRedis = global as unknown as { redis: Redis }

const REDIS_URL = 'rediss://default:gQAAAAAAAbj-AAIgcDJjODEwNzNlNTVkYjg0YmJkYjFlZDJlZWZlZGY5YzE4Yw@brief-toucan-112894.upstash.io:6379'

const connection = globalForRedis.redis || new Redis(REDIS_URL, {
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

// NUCLEAR FIX: Global process listener to silence ECONNRESET spam on Windows
if (typeof process !== 'undefined') {
    process.on('uncaughtException', (err) => {
        if (err.message?.includes('ECONNRESET')) return;
        console.error('Uncaught Exception:', err);
    });
    
    process.on('unhandledRejection', (reason: any) => {
        if (reason?.message?.includes('ECONNRESET')) return;
        console.error('Unhandled Rejection:', reason);
    });
}

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = connection

let queueConnectedLogged = false;
connection.on('connect', () => {
    if (!queueConnectedLogged) {
        console.log('Redis connected successfully');
        queueConnectedLogged = true;
    }
})

connection.on('error', (err) => {
    // Suppress logs for transient resets
    if (err.message.includes('ECONNRESET')) return;
    console.warn('Redis connection issue:', err.message)
})

export const videoQueue = new Queue('video-processing', {
    connection,
    defaultJobOptions: {
        removeOnComplete: 10,
        removeOnFail: 5,
    }
})
