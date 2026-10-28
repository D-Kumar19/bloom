import type { MetadataRoute } from 'next'

import { getSiteOrigin } from '@/lib/siteUrl'

export default function robots(): MetadataRoute.Robots {
  return {
    // Gift pages stay crawlable so crawlers can read their noindex directives.
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/create/result'] },
    sitemap: `${getSiteOrigin()}/sitemap.xml`,
  }
}
