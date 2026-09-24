import { describe, it, expect } from 'vitest'
import { checkRateLimit } from '../lib/rate-limiter'

describe('Rate Limiter Utility', () => {
  it('allows requests within the configured threshold', () => {
    const id = `test-ip-${Date.now()}`
    const result1 = checkRateLimit(id, { limit: 3, windowMs: 10000 })
    expect(result1.allowed).toBe(true)
    expect(result1.remaining).toBe(2)

    const result2 = checkRateLimit(id, { limit: 3, windowMs: 10000 })
    expect(result2.allowed).toBe(true)
    expect(result2.remaining).toBe(1)
  })

  it('rejects requests when rate limit is exceeded', () => {
    const id = `test-blocked-ip-${Date.now()}`
    checkRateLimit(id, { limit: 2, windowMs: 10000 })
    checkRateLimit(id, { limit: 2, windowMs: 10000 })

    const result = checkRateLimit(id, { limit: 2, windowMs: 10000 })
    expect(result.allowed).toBe(false)
    expect(result.remaining).toBe(0)
  })
})
