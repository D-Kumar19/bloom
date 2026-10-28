import type { MetadataRoute } from 'next'

import { INDEXED_PATHS } from '@/lib/pageMetadata'
import { getSiteOrigin } from '@/lib/siteUrl'

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = getSiteOrigin()
  return INDEXED_PATHS.map((path) => ({ url: `${origin}${path === '/' ? '' : path}` }))
}
