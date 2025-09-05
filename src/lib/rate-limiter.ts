/**
 * Redis-based Rate Limiter for ClueQuest
 * Supports sliding window rate limiting with Redis backend
 * Handles 10K+ concurrent users with low latency
 */

import Redis from 'ioredis'

// Redis client singleton
let redisClient: Redis | null = null

/**
 * Get Redis client with connection pooling
 */
function getRedisClient(): Redis {
  if (!redisClient) {
    redisClient = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      db: parseInt(process.env.REDIS_DB || '0'),
      
      // Connection settings
      maxRetriesPerRequest: 3,
      retryDelayOnFailover: 100,
      enableReadyCheck: false,
      maxLoadingTimeout: 1000,
      
      // Connection pool settings
      family: 4,
      keepAlive: true,
      lazyConnect: true,
      
      // Error handling
      retryStrategy: (times: number) => {
        const delay = Math.min(times * 50, 2000)
        return delay
      }
    })

    // Handle Redis connection errors
    redisClient.on('error', (error) => {
    })

    redisClient.on('connect', () => {
    })
  }

  return redisClient
}

/**
 * Rate limit result interface
 */
export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
  retryAfter?: number
}

/**
 * Sliding window rate limiter with Redis
 * More accurate than fixed window, prevents burst attacks
 */
export async function rateLimit(
  identifier: string,
  limit: number,
  windowMs: number | string
): Promise<RateLimitResult> {
  try {
    const redis = getRedisClient()
    
    // Convert window string to milliseconds
    const window = typeof windowMs === 'string' 
      ? parseTimeString(windowMs)
      : windowMs

    const now = Date.now()
    const windowStart = now - window
    const key = `rate_limit:${identifier}`

    // Lua script for atomic sliding window rate limiting
    const luaScript = `
      local key = KEYS[1]
      local window_start = ARGV[1]
      local now = ARGV[2]
      local limit = tonumber(ARGV[3])
      local ttl = ARGV[4]

      -- Remove expired entries
      redis.call('ZREMRANGEBYSCORE', key, '-inf', window_start)

      -- Count current requests in window
      local current = redis.call('ZCARD', key)

      if current < limit then
        -- Add current request
        redis.call('ZADD', key, now, now)
        redis.call('EXPIRE', key, ttl)
        return {1, limit - current - 1, current + 1}
      else
        -- Rate limit exceeded
        return {0, 0, current}
      end
    `

    const result = await redis.eval(
      luaScript,
      1,
      key,
      windowStart.toString(),
      now.toString(),
      limit.toString(),
      Math.ceil(window / 1000).toString()
    ) as [number, number, number]

    const [success, remaining, used] = result
    const reset = now + window

    if (success === 1) {
      return {
        success: true,
        limit,
        remaining,
        reset
      }
    } else {
      // Calculate retry after time
      const oldestRequest = await redis.zrange(key, 0, 0, 'WITHSCORES')
      const retryAfter = oldestRequest.length > 1 
        ? Math.ceil((parseFloat(oldestRequest[1]) + window - now) / 1000)
        : Math.ceil(window / 1000)

      return {
        success: false,
        limit,
        remaining: 0,
        reset,
        retryAfter
      }
    }

  } catch (error) {
    
    // Fail open - allow request if rate limiter is unavailable
    return {
      success: true,
      limit,
      remaining: limit,
      reset: Date.now() + (typeof windowMs === 'string' ? parseTimeString(windowMs) : windowMs)
    }
  }
}

/**
 * Multi-tier rate limiting for different user types
 */
export async function multiTierRateLimit(
  identifier: string,
  userType: 'anonymous' | 'authenticated' | 'premium' | 'api',
  endpoint: string
): Promise<RateLimitResult> {
  // Rate limits by user type and endpoint
  const rateLimits: Record<string, Record<string, { requests: number; window: string }>> = {
    anonymous: {
      'auth': { requests: 10, window: '15m' },
      'public': { requests: 100, window: '1h' },
      'default': { requests: 50, window: '1h' }
    },
    authenticated: {
      'api': { requests: 1000, window: '1h' },
      'upload': { requests: 50, window: '1h' },
      'default': { requests: 500, window: '1h' }
    },
    premium: {
      'api': { requests: 5000, window: '1h' },
      'upload': { requests: 200, window: '1h' },
      'default': { requests: 2000, window: '1h' }
    },
    api: {
      'default': { requests: 10000, window: '1h' }
    }
  }

  const limits = rateLimits[userType] || rateLimits.authenticated
  const endpointLimit = limits[endpoint] || limits.default

  return rateLimit(
    `${userType}:${identifier}:${endpoint}`,
    endpointLimit.requests,
    endpointLimit.window
  )
}

/**
 * Rate limit with burst allowance
 * Allows short bursts while maintaining average rate
 */
export async function burstRateLimit(
  identifier: string,
  sustainedLimit: number,
  burstLimit: number,
  windowMs: number
): Promise<RateLimitResult> {
  try {
    const redis = getRedisClient()
    const now = Date.now()
    const key = `burst_limit:${identifier}`

    // Lua script for token bucket-style rate limiting
    const luaScript = `
      local key = KEYS[1]
      local sustained_limit = tonumber(ARGV[1])
      local burst_limit = tonumber(ARGV[2])
      local window_ms = tonumber(ARGV[3])
      local now = tonumber(ARGV[4])

      local bucket = redis.call('HMGET', key, 'tokens', 'last_refill')
      local tokens = tonumber(bucket[1]) or burst_limit
      local last_refill = tonumber(bucket[2]) or now

      -- Calculate tokens to add based on time elapsed
      local time_elapsed = now - last_refill
      local tokens_to_add = math.floor(time_elapsed * sustained_limit / window_ms)
      
      tokens = math.min(tokens + tokens_to_add, burst_limit)

      if tokens >= 1 then
        tokens = tokens - 1
        redis.call('HMSET', key, 'tokens', tokens, 'last_refill', now)
        redis.call('EXPIRE', key, math.ceil(window_ms / 1000))
        return {1, tokens, burst_limit - tokens}
      else
        redis.call('HMSET', key, 'last_refill', now)
        redis.call('EXPIRE', key, math.ceil(window_ms / 1000))
        return {0, 0, burst_limit}
      end
    `

    const result = await redis.eval(
      luaScript,
      1,
      key,
      sustainedLimit.toString(),
      burstLimit.toString(),
      windowMs.toString(),
      now.toString()
    ) as [number, number, number]

    const [success, remaining, used] = result

    return {
      success: success === 1,
      limit: burstLimit,
      remaining,
      reset: now + windowMs
    }

  } catch (error) {
    
    return {
      success: true,
      limit: burstLimit,
      remaining: burstLimit,
      reset: Date.now() + windowMs
    }
  }
}

/**
 * Distributed rate limiting for multiple server instances
 */
export async function distributedRateLimit(
  identifier: string,
  limit: number,
  windowMs: number,
  serverId: string = process.env.SERVER_ID || 'default'
): Promise<RateLimitResult> {
  try {
    const redis = getRedisClient()
    const now = Date.now()
    const windowStart = now - windowMs
    const globalKey = `dist_limit:${identifier}`
    const serverKey = `${globalKey}:${serverId}`

    // Lua script for distributed rate limiting
    const luaScript = `
      local global_key = KEYS[1]
      local server_key = KEYS[2]
      local window_start = ARGV[1]
      local now = ARGV[2]
      local limit = tonumber(ARGV[3])
      local ttl = ARGV[4]

      -- Clean up expired entries
      redis.call('ZREMRANGEBYSCORE', global_key, '-inf', window_start)
      redis.call('ZREMRANGEBYSCORE', server_key, '-inf', window_start)

      -- Count global requests
      local global_count = redis.call('ZCARD', global_key)
      
      if global_count < limit then
        -- Add request to both global and server-specific keys
        redis.call('ZADD', global_key, now, server_key .. ':' .. now)
        redis.call('ZADD', server_key, now, now)
        redis.call('EXPIRE', global_key, ttl)
        redis.call('EXPIRE', server_key, ttl)
        
        return {1, limit - global_count - 1, global_count + 1}
      else
        return {0, 0, global_count}
      end
    `

    const result = await redis.eval(
      luaScript,
      2,
      globalKey,
      serverKey,
      windowStart.toString(),
      now.toString(),
      limit.toString(),
      Math.ceil(windowMs / 1000).toString()
    ) as [number, number, number]

    const [success, remaining, used] = result

    return {
      success: success === 1,
      limit,
      remaining,
      reset: now + windowMs
    }

  } catch (error) {
    
    return {
      success: true,
      limit,
      remaining: limit,
      reset: Date.now() + windowMs
    }
  }
}

/**
 * Rate limit status check (doesn't consume quota)
 */
export async function checkRateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  try {
    const redis = getRedisClient()
    const now = Date.now()
    const windowStart = now - windowMs
    const key = `rate_limit:${identifier}`

    // Clean and count without consuming
    await redis.zremrangebyscore(key, '-inf', windowStart)
    const current = await redis.zcard(key)

    return {
      success: current < limit,
      limit,
      remaining: Math.max(0, limit - current),
      reset: now + windowMs
    }

  } catch (error) {
    
    return {
      success: true,
      limit,
      remaining: limit,
      reset: Date.now() + windowMs
    }
  }
}

/**
 * Clear rate limit for identifier (admin function)
 */
export async function clearRateLimit(identifier: string): Promise<void> {
  try {
    const redis = getRedisClient()
    const pattern = `*${identifier}*`
    
    const keys = await redis.keys(pattern)
    if (keys.length > 0) {
      await redis.del(...keys)
    }
  } catch (error) {
  }
}

/**
 * Get rate limit statistics
 */
export async function getRateLimitStats(
  identifier: string
): Promise<{
  requests: number
  windowStart: number
  oldestRequest: number
  newestRequest: number
}> {
  try {
    const redis = getRedisClient()
    const key = `rate_limit:${identifier}`

    const requests = await redis.zcard(key)
    const range = await redis.zrange(key, 0, -1, 'WITHSCORES')

    let oldestRequest = 0
    let newestRequest = 0

    if (range.length > 0) {
      oldestRequest = parseFloat(range[1])
      newestRequest = parseFloat(range[range.length - 1])
    }

    return {
      requests,
      windowStart: Date.now() - 3600000, // 1 hour default
      oldestRequest,
      newestRequest
    }

  } catch (error) {
    
    return {
      requests: 0,
      windowStart: Date.now(),
      oldestRequest: 0,
      newestRequest: 0
    }
  }
}

/**
 * Parse time string to milliseconds
 */
function parseTimeString(timeStr: string): number {
  const units: Record<string, number> = {
    's': 1000,
    'm': 60 * 1000,
    'h': 60 * 60 * 1000,
    'd': 24 * 60 * 60 * 1000
  }

  const match = timeStr.match(/^(\d+)([smhd])$/)
  if (!match) {
    throw new Error(`Invalid time string: ${timeStr}`)
  }

  const [, value, unit] = match
  return parseInt(value) * units[unit]
}

/**
 * Close Redis connection (for graceful shutdown)
 */
export async function closeRedis(): Promise<void> {
  if (redisClient) {
    await redisClient.quit()
    redisClient = null
  }
}

export default {
  rateLimit,
  multiTierRateLimit,
  burstRateLimit,
  distributedRateLimit,
  checkRateLimit,
  clearRateLimit,
  getRateLimitStats,
  closeRedis
}