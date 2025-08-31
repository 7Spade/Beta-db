/**
 * @fileoverview Redis Client Initialization
 * @description This file initializes the ioredis client for connecting to Redis.
 * It's designed to be reusable across the server-side of the application.
 */
import Redis from 'ioredis';

// This helps preserve the connection across hot reloads in development.
// The globalThis object is not affected by hot-reloading.
declare global {
  // eslint-disable-next-line no-var
  var redis: Redis | undefined;
}

let redis: Redis;
const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  if (process.env.NODE_ENV !== 'production') {
    // In development, if REDIS_URL is not set, we can point to a local default instance.
    // This makes local development easier without needing a .env file.
    console.warn('REDIS_URL not set, falling back to localhost:6379');
    redis = new Redis();
  } else {
    // In production, we must have the REDIS_URL.
    throw new Error('REDIS_URL environment variable is not set.');
  }
} else {
  if (process.env.NODE_ENV === 'production') {
    // In production, we want a single, persistent connection.
    if (!global.redis) {
      global.redis = new Redis(redisUrl, {
        // Recommended settings for production environments like Vercel/Cloud Run
        maxRetriesPerRequest: 3,
        enableReadyCheck: true,
      });
    }
    redis = global.redis;
  } else {
    // In development, we use the global object to prevent multiple connections
    // during hot reloads.
    if (!global.redis) {
      global.redis = new Redis(redisUrl);
    }
    redis = global.redis;
  }
}

redis.on('connect', () => {
  console.log('Successfully connected to Redis!');
});

redis.on('error', (err) => {
  console.error('Could not connect to Redis:', err);
});

export default redis;
