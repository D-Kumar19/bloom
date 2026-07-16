import { describe, expect, it } from 'vitest'

import { canProceedMessageStep, hasMessageContent, shouldShowNoteCard } from '@/lib/message'

describe('messageValidation', () => {
  it('requires to, from, and message before continuing', () => {
    expect(hasMessageContent('')).toBe(false)
    expect(canProceedMessageStep('', '', '')).toBe(false)
    expect(canProceedMessageStep('Sam', '', '')).toBe(false)
    expect(canProceedMessageStep('Sam', 'Alex', '')).toBe(false)
    expect(canProceedMessageStep('', 'Alex', 'Hello')).toBe(false)
    expect(canProceedMessageStep('Sam', '', 'Hello')).toBe(false)
    expect(canProceedMessageStep('Sam', 'Alex', 'Hello')).toBe(true)
  })

  it('ignores html wrappers when checking message content', () => {
    expect(hasMessageContent('<b>Hi</b>')).toBe(true)
    expect(canProceedMessageStep('Sam', 'Alex', '<b>Hi</b>')).toBe(true)
  })

  it('hides note cards without message content', () => {
    expect(shouldShowNoteCard('')).toBe(false)
    expect(shouldShowNoteCard('Hello')).toBe(true)
  })
})
