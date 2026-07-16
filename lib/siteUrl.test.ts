import { afterEach, describe, expect, it, vi } from 'vitest'

import { DEFAULT_SITE_URL } from '@/lib/site'
import { getSiteMetadataBase, getSiteOrigin } from '@/lib/siteUrl'

describe('getSiteOrigin', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('uses the browser origin on localhost even when NEXT_PUBLIC_SITE_URL is set', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://bloom.app')
    vi.stubGlobal('window', {
      location: { origin: 'http://localhost:3000' },
    } as Window & typeof globalThis)

    expect(getSiteOrigin()).toBe('http://localhost:3000')
  })

  it('uses NEXT_PUBLIC_SITE_URL in the browser on a non-local host', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://bloom.app')
    vi.stubGlobal('window', {
      location: { origin: 'https://bloom.app' },
    } as Window & typeof globalThis)

    expect(getSiteOrigin()).toBe('https://bloom.app')
  })

  it('strips a trailing slash from the configured URL', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://bloom.app/')
    const windowSpy = vi
      .spyOn(globalThis, 'window', 'get')
      .mockReturnValue(undefined as unknown as Window & typeof globalThis)

    expect(getSiteOrigin()).toBe('https://bloom.app')

    windowSpy.mockRestore()
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
    const windowSpy = vi
      .spyOn(globalThis, 'window', 'get')
      .mockReturnValue(undefined as unknown as Window & typeof globalThis)

    expect(getSiteMetadataBase().toString()).toBe('https://bloom.app/')

    windowSpy.mockRestore()
  })
})
