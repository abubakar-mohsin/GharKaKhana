import { Redis } from '@upstash/redis';

// Re-use a single client instance across hot-reloads in development
const globalForRedis = globalThis;

export const redis =
  globalForRedis.redis ??
  new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForRedis.redis = redis;
}

// ─── Cache helpers ────────────────────────────────────────────────────────────

/**
 * Get a cached value. Returns null on miss.
 * @param {string} key
 */
export async function getCache(key) {
  return redis.get(key);
}

/**
 * Set a cached value with an optional TTL in seconds (default 60 s).
 * @param {string} key
 * @param {*} value
 * @param {number} [ttl=60]
 */
export async function setCache(key, value, ttl = 60) {
  return redis.set(key, value, { ex: ttl });
}

/**
 * Delete a cached value.
 * @param {string} key
 */
export async function deleteCache(key) {
  return redis.del(key);
}
