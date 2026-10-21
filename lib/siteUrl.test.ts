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

  it('keeps copied links on the active deployment even with a different configured canonical origin', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://bloom.app')
    vi.stubGlobal('window', {
      location: { origin: 'https://bloom-preview.vercel.app' },
    } as Window & typeof globalThis)

    expect(getSiteOrigin()).toBe('https://bloom-preview.vercel.app')
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
    vi.stubEnv('VERCEL_URL', '')
    const windowSpy = vi
      .spyOn(globalThis, 'window', 'get')
      .mockReturnValue(undefined as unknown as Window & typeof globalThis)

    expect(getSiteOrigin()).toBe(DEFAULT_SITE_URL)

    windowSpy.mockRestore()
  })

  it('uses Vercel deployment origin for server metadata if no canonical is set', () => {
    vi.stubGlobal('window', undefined)
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', '')
    vi.stubEnv('VERCEL_URL', 'bloom-preview.vercel.app')
    expect(getSiteOrigin()).toBe('https://bloom-preview.vercel.app')
  })

  it.each(['javascript:alert(1)', 'https://user:pass@example.com', 'https://example.com/path', 'https://example.com/?q=1'])(
    'rejects an invalid canonical origin: %s', (origin) => {
      vi.stubGlobal('window', undefined)
      vi.stubEnv('NEXT_PUBLIC_SITE_URL', origin)
      expect(() => getSiteOrigin()).toThrow()
    },
  )

  it('builds metadata base from the configured origin', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://bloom.app')
    const windowSpy = vi
      .spyOn(globalThis, 'window', 'get')
      .mockReturnValue(undefined as unknown as Window & typeof globalThis)

    expect(getSiteMetadataBase().toString()).toBe('https://bloom.app/')

    windowSpy.mockRestore()
  })
})
