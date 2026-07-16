import { describe, expect, it } from 'vitest'

import {
  editorNeedsDomCleanup,
  isRichMessage,
  sanitizeMessageHtml,
  stripMessageHtml,
} from '@/lib/message'

describe('sanitizeMessageHtml', () => {
  it('keeps non-breaking spaces so the editor can store trailing spaces', () => {
    expect(sanitizeMessageHtml('Hello&nbsp;')).toBe('Hello&nbsp;')
    expect(stripMessageHtml('Hello&nbsp;')).toBe('Hello\u00a0')
  })

  it('converts div line breaks from contenteditable into br tags', () => {
    expect(sanitizeMessageHtml('<div>Hello</div><div>World</div>')).toBe('Hello<br>World<br>')
    expect(isRichMessage(sanitizeMessageHtml('<div>Hello</div><div>World</div>'))).toBe(true)
  })

  it('keeps allowed inline formatting', () => {
    expect(sanitizeMessageHtml('<b>Hello</b> <i>there</i>')).toBe('<b>Hello</b> <i>there</i>')
  })

  it('strips zero-width spaces used for caret anchoring in the editor', () => {
    expect(sanitizeMessageHtml('Hello<br>\u200B')).toBe('Hello<br>')
    expect(stripMessageHtml('Hello<br>\u200B')).toBe('Hello')
  })
})

describe('isRichMessage', () => {
  it('detects line breaks, formatting tags, and entities', () => {
    expect(isRichMessage('Hello')).toBe(false)
    expect(isRichMessage('Hello<br>')).toBe(true)
    expect(isRichMessage('<b>Hi</b>')).toBe(true)
    expect(isRichMessage('Hello&nbsp;')).toBe(true)
  })
})

describe('editorNeedsDomCleanup', () => {
  it('flags block elements that should be normalized on blur', () => {
    expect(editorNeedsDomCleanup('Hello')).toBe(false)
    expect(editorNeedsDomCleanup('<div>Hello</div>')).toBe(true)
  })
})
