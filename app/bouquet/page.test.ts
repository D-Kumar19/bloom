import { describe, expect, it } from 'vitest'
import { metadata } from '@/app/bouquet/page'

describe('gift crawler metadata', () => {
  it('is generic and opts out of search indexing and referrer disclosure', () => {
    expect(metadata.title).toBe('A bouquet is waiting for you')
    expect(metadata.robots).toMatchObject({ index: false, follow: false })
    expect(metadata.referrer).toBe('no-referrer')
    expect(metadata.openGraph).toMatchObject({
      images: [{ url: '/bouquet/og', width: 1200, height: 630 }],
    })
    expect(JSON.stringify(metadata)).not.toContain('?b=')
  })
})
