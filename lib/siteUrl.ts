import { DEFAULT_SITE_URL } from '@/lib/site'

/**
 * Public site origin for share links and metadata.
 * Set NEXT_PUBLIC_SITE_URL in production so copied links never use localhost.
 */
export function getSiteOrigin(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
  if (configured) {
    return configured
  }

  if (typeof window !== 'undefined') {
    return window.location.origin
  }

  return DEFAULT_SITE_URL
}

export function getSiteMetadataBase(): URL {
  return new URL(getSiteOrigin())
}
