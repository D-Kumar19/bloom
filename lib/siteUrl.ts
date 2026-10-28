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
 * Server metadata uses the configured canonical origin, Vercel's stable production
 * host in production, or the deployment URL elsewhere.
 */
export function getSiteOrigin(): string {
  const browserOrigin = getBrowserOrigin()

  if (browserOrigin) {
    return browserOrigin
  }

  // Production must not use VERCEL_URL: that per-deployment host sits behind
  // Vercel authentication, so crawlers cannot fetch preview images from it.
  const productionHost = process.env.VERCEL_ENV === 'production'
    ? process.env.VERCEL_PROJECT_PRODUCTION_URL
    : undefined
  const deploymentHost = productionHost || process.env.VERCEL_URL
  const configured = process.env.NEXT_PUBLIC_SITE_URL ||
    (deploymentHost ? `https://${deploymentHost}` : DEFAULT_SITE_URL)
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
