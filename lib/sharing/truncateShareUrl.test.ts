import { describe, expect, it } from 'vitest'

import { formatShareMessagePreview, truncateShareUrl } from '@/lib/sharing/truncateShareUrl'

describe('truncateShareUrl', () => {
  it('middle-ellipsizes long bouquet query strings', () => {
    const longQuery = 'N4IgZg' + 'A'.repeat(80) + 'dSA'
    const url = `https://bloom.app/bouquet?b=${longQuery}`

    expect(truncateShareUrl(url)).toBe(
      `https://bloom.app/bouquet?b=${longQuery.slice(0, 24)}...${longQuery.slice(-4)}`,
    )
  })

  it('leaves short urls unchanged', () => {
    const url = 'https://bloom.app/bouquet?b=short'
    expect(truncateShareUrl(url)).toBe(url)
  })

  it('replaces urls inside a share message preview', () => {
    const longQuery = 'N4IgZg' + 'B'.repeat(60) + 'dSA'
    const message = `I made something for you.\nOpen this when you need a smile:\nhttps://bloom.app/bouquet?b=${longQuery}`
    const preview = formatShareMessagePreview(message)

    expect(preview).toContain('...')
    expect(preview).toContain('N4IgZg')
    expect(preview).not.toContain(longQuery)
  })
})
