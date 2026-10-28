import type { Metadata } from 'next'

import { SITE_NAME } from '@/lib/site'

export const SITE_OG_IMAGE = {
  url: '/og',
  width: 1200,
  height: 630,
  alt: 'Bloom: send a digital bouquet',
}

/** Public pages that should be indexed and appear in the sitemap. */
export const INDEXED_PATHS = [
  '/',
  '/create',
  '/templates',
  '/flowers',
  '/note-styles',
  '/backdrops',
  '/ambient-sound',
  '/explore',
  '/about',
  '/privacy',
  '/contact',
] as const

type IndexedPath = (typeof INDEXED_PATHS)[number]

/** Page-specific title, description, canonical URL, and link previews. */
export function publicPageMetadata({
  title,
  description,
  path,
}: {
  title: string
  description: string
  path: IndexedPath
}): Metadata {
  const previewTitle = `${title} | ${SITE_NAME}`
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: previewTitle,
      description,
      url: path,
      siteName: SITE_NAME,
      type: 'website',
      images: [SITE_OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: previewTitle,
      description,
      images: [SITE_OG_IMAGE.url],
    },
  }
}
