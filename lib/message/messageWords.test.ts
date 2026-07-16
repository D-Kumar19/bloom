import { describe, expect, it } from 'vitest'

import {
  countMessageWords,
  countWords,
  truncateMessageHtml,
} from '@/lib/message/messageWords'

describe('countWords', () => {
  it('counts whitespace-separated words', () => {
    expect(countWords('Thinking of you.')).toBe(3)
    expect(countWords('  one   two  ')).toBe(2)
    expect(countWords('')).toBe(0)
  })
})

describe('truncateMessageHtml', () => {
  it('limits message html to a word count', () => {
    const html = 'one two three four five'
    expect(truncateMessageHtml(html, 3)).toBe('one two three')
  })

  it('preserves html when under the word limit', () => {
    const html = '<b>Hello</b> there'
    expect(truncateMessageHtml(html, 5)).toBe('<b>Hello</b> there')
  })
})

describe('countMessageWords', () => {
  it('counts words in stored message html', () => {
    expect(countMessageWords('<b>Hello</b> there friend')).toBe(3)
  })
})
