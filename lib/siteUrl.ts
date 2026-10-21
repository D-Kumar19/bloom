import { DEFAULT_SITE_URL } from '@/lib/site'

function getBrowserOrigin(): string | null {
  if (typeof window === 'undefined') {
    return null
  }

  return window.location.origin
}

/**
 * Public site origin for share links and metadata.
 * Browser links stay on the current deployment, including preview deployments.
 * Server metadata uses the configured canonical origin or Vercel's deployment URL.
 */
export function getSiteOrigin(): string {
  const browserOrigin = getBrowserOrigin()

  if (browserOrigin) {
    return browserOrigin
  }

  const configured = process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : DEFAULT_SITE_URL)
  const url = new URL(configured)
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password ||
    url.pathname !== '/' || url.search || url.hash) {
    throw new Error('NEXT_PUBLIC_SITE_URL must be an HTTP(S) origin without credentials, path, query, or hash')
  }
  return url.origin
}

export function getSiteMetadataBase(): URL {
  return new URL(getSiteOrigin())
}
