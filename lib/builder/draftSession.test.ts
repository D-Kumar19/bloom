import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  BUILDER_DRAFT_STORAGE_KEY,
  BUILDER_DRAFT_TTL_MS,
  BUILDER_OPEN_SHARE_KEY,
  clearBuilderDraft,
  restoreShareDraftIfPresent,
  saveBuilderDraft,
} from '@/lib/builder/draftSession'
import type { BouquetState } from '@/lib/types'

const sampleState: BouquetState = {
  bouquetId: 'red-rose-classic',
  cardStyle: 'classic-cream',
  to: 'Sam',
  from: 'Alex',
  message: 'Thinking of you.',
  theme: 'warm',
  soundtrack: 'none',
}

describe('draftSession', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-07-16T10:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('restores a fresh share draft from localStorage', () => {
    saveBuilderDraft(sampleState, 'share')
    const setState = vi.fn()
    const setStep = vi.fn()

    expect(restoreShareDraftIfPresent(setState, setStep)).toBe(true)
    expect(setStep).toHaveBeenCalledWith('share')
    expect(setState).toHaveBeenCalled()
  })

  it('clears and ignores drafts older than 24 hours', () => {
    saveBuilderDraft(sampleState, 'share')
    vi.setSystemTime(new Date('2026-07-17T11:00:01Z'))

    const setState = vi.fn()
    const setStep = vi.fn()

    expect(restoreShareDraftIfPresent(setState, setStep)).toBe(false)
    expect(localStorage.getItem(BUILDER_DRAFT_STORAGE_KEY)).toBeNull()
    expect(setState).not.toHaveBeenCalled()
  })

  it('keeps drafts within the 24 hour window', () => {
    saveBuilderDraft(sampleState, 'share')
    vi.setSystemTime(new Date(Date.now() + BUILDER_DRAFT_TTL_MS - 1_000))

    const setState = vi.fn()
    const setStep = vi.fn()

    expect(restoreShareDraftIfPresent(setState, setStep)).toBe(true)
    expect(setStep).toHaveBeenCalledWith('share')
  })

  it('clears draft storage when starting fresh', () => {
    saveBuilderDraft(sampleState, 'share')
    clearBuilderDraft()
    expect(localStorage.getItem(BUILDER_DRAFT_STORAGE_KEY)).toBeNull()
  })

  it('restores when returning from preview with the open-share flag', () => {
    saveBuilderDraft(sampleState, 'share')
    sessionStorage.setItem(BUILDER_OPEN_SHARE_KEY, '1')

    const setState = vi.fn()
    const setStep = vi.fn()

    expect(restoreShareDraftIfPresent(setState, setStep)).toBe(true)
    expect(sessionStorage.getItem(BUILDER_OPEN_SHARE_KEY)).toBeNull()
  })
})
