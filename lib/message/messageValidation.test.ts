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
    expect(canProceedMessageStep('Sam', 'Alex', 'Hello')).toBe(false)
    expect(canProceedMessageStep('Sam', 'Alex', 'Love you')).toBe(true)
  })

  it('ignores html wrappers when checking message content', () => {
    expect(hasMessageContent('<b>Hi</b>')).toBe(true)
    expect(canProceedMessageStep('Sam', 'Alex', '<b>Hi</b>')).toBe(false)
    expect(canProceedMessageStep('Sam', 'Alex', '<b>Love</b><br>you')).toBe(true)
  })

  it.each([
    ['', false], ['x', false], ['Love', false], ['Love you', true],
    ['I love you', true], [' Love\n you ', true],
    ['<p>Love</p><p>you</p>', true],
    ['<b></b><br>', false],
    [Array(200).fill('word').join(' '), true],
    [Array(201).fill('word').join(' '), false],
  ])('enforces the 2-200 word range for %s', (message, expected) => {
    expect(canProceedMessageStep('Sam', 'Alex', message)).toBe(expected)
  })
  it('hides note cards without message content', () => {
    expect(shouldShowNoteCard('')).toBe(false)
    expect(shouldShowNoteCard('Hello')).toBe(true)
  })
})
