import { afterEach, describe, expect, it, vi } from 'vitest'
import { CounterError, logCounterFailure } from './errors'

describe('safe counter diagnostics', () => {
  afterEach(() => vi.restoreAllMocks())

  it('logs only a controlled code and HTTP status, not error details', () => {
    const logger = vi.spyOn(console, 'error').mockImplementation(() => {})
    logCounterFailure(
      'read',
      new CounterError('redis_http_error', 'private-token-and-url', 401)
    )
    expect(logger).toHaveBeenCalledWith('Bouquet counter read failed.', {
      code: 'redis_http_error',
      httpStatus: 401,
    })
    expect(JSON.stringify(logger.mock.calls)).not.toContain('private')
  })

  it('never prints arbitrary upstream errors', () => {
    const logger = vi.spyOn(console, 'error').mockImplementation(() => {})
    logCounterFailure('recording', new Error('private token'))
    expect(logger).toHaveBeenCalledWith('Bouquet counter recording failed.', {
      code: 'unexpected_counter_error',
    })
  })
})
