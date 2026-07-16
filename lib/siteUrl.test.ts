import { describe, expect, it, vi, afterEach } from 'vitest'

import { DEFAULT_SITE_URL } from '@/lib/site'
import { getSiteMetadataBase, getSiteOrigin } from '@/lib/siteUrl'

describe('getSiteOrigin', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('prefers NEXT_PUBLIC_SITE_URL over window origin', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://bloom.app')

    expect(getSiteOrigin()).toBe('https://bloom.app')
  })

  it('strips a trailing slash from the configured URL', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://bloom.app/')

    expect(getSiteOrigin()).toBe('https://bloom.app')
  })

  it('falls back to the default site URL when unset and not in a browser', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', '')
    const windowSpy = vi
      .spyOn(globalThis, 'window', 'get')
      .mockReturnValue(undefined as unknown as Window & typeof globalThis)

    expect(getSiteOrigin()).toBe(DEFAULT_SITE_URL)

    windowSpy.mockRestore()
  })

  it('builds metadata base from the configured origin', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://bloom.app')

    expect(getSiteMetadataBase().toString()).toBe('https://bloom.app/')
  })
})
