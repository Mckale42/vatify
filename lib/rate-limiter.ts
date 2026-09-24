/**
 * In-memory sliding-window rate limiter for sensitive API endpoints
 */

interface RateLimitRecord {
  count: number
  resetTime: number
}

const rateLimitMap = new Map<string, RateLimitRecord>()

// Clean up stale entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, record] of rateLimitMap.entries()) {
      if (now > record.resetTime) {
        rateLimitMap.delete(key)
      }
    }
  }, 5 * 60 * 1000)
}

export interface RateLimitOptions {
  limit?: number // Max requests allowed
  windowMs?: number // Time window in milliseconds
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  limit: number
  resetTime: number
}

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): RateLimitResult {
  const limit = options.limit || 10
  const windowMs = options.windowMs || 60 * 1000 // default 1 minute
  const now = Date.now()

  const existing = rateLimitMap.get(identifier)

  if (!existing || now > existing.resetTime) {
    const resetTime = now + windowMs
    rateLimitMap.set(identifier, { count: 1, resetTime })
    return {
      allowed: true,
      remaining: limit - 1,
      limit,
      resetTime,
    }
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      limit,
      resetTime: existing.resetTime,
    }
  }

  existing.count += 1
  return {
    allowed: true,
    remaining: limit - existing.count,
    limit,
    resetTime: existing.resetTime,
  }
}
