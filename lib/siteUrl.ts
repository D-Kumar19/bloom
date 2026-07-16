import { DEFAULT_SITE_URL } from '@/lib/site'

function isLocalDevelopmentHost(hostname: string): boolean {
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '[::1]' ||
    hostname.endsWith('.localhost')
  )
}

function getBrowserOrigin(): string | null {
  if (typeof window === 'undefined') {
    return null
  }

  return window.location.origin
}

/**
 * Public site origin for share links and metadata.
 * In the browser on localhost, always uses the current origin so copied links
 * stay on your dev server even when NEXT_PUBLIC_SITE_URL points at production.
 * Set NEXT_PUBLIC_SITE_URL in production so copied links never use localhost.
 */
export function getSiteOrigin(): string {
  const browserOrigin = getBrowserOrigin()

  if (browserOrigin) {
    try {
      const { hostname } = new URL(browserOrigin)
      if (isLocalDevelopmentHost(hostname)) {
        return browserOrigin
      }
    } catch {
      // Fall through to configured origin.
    }
  }

  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
  if (configured) {
    return configured
  }

  if (browserOrigin) {
    return browserOrigin
  }

  return DEFAULT_SITE_URL
}

export function getSiteMetadataBase(): URL {
  return new URL(getSiteOrigin())
}
