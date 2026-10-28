import { describe, expect, it } from 'vitest'

import { metadata as flowers } from '@/app/flowers/page'
import { metadata as preRelease } from '@/app/pre-release/page'
import { INDEXED_PATHS, SITE_OG_IMAGE, publicPageMetadata } from '@/lib/pageMetadata'
import robots from '@/app/robots'
import sitemap from '@/app/sitemap'

describe('public page metadata', () => {
  it('gives each page its own link preview, canonical URL, and site image', () => {
    const meta = publicPageMetadata({ title: 'Flowers', description: 'Petals.', path: '/flowers' })
    expect(meta.alternates).toEqual({ canonical: '/flowers' })
    expect(meta.openGraph).toMatchObject({
      title: 'Flowers | Bloom',
      description: 'Petals.',
      url: '/flowers',
      siteName: 'Bloom',
      images: [SITE_OG_IMAGE],
    })
    expect(meta.twitter).toMatchObject({ card: 'summary_large_image', title: 'Flowers | Bloom' })
    expect(flowers.openGraph).toMatchObject({ title: 'Flowers | Bloom', url: '/flowers' })
  })

  it('keeps unlinked and gift pages out of search and the sitemap', () => {
    expect(preRelease.title).toBe('Pre-release')
    expect(preRelease.robots).toMatchObject({ index: false })
    const urls = sitemap().map(({ url }) => new URL(url).pathname)
    expect(urls).toHaveLength(INDEXED_PATHS.length)
    expect(urls).toContain('/flowers')
    expect(urls.some((path) => /bouquet|pre-release|result|api/.test(path))).toBe(false)
    const rules = robots().rules
    expect(rules).toMatchObject({ disallow: ['/api/', '/create/result'] })
    expect(JSON.stringify(rules)).not.toContain('/bouquet')
  })
})
