import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  BUILDER_DRAFT_STORAGE_KEY,
  BUILDER_DRAFT_TTL_MS,
  BUILDER_OPEN_SHARE_KEY,
  BUILDER_DRAFT_KEY,
  BUILDER_STEP_KEY,
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

  it.each([undefined, true, false, 'true'])('restores preset context only for a true marker (%s)', (marker) => {
    localStorage.setItem(BUILDER_DRAFT_STORAGE_KEY, JSON.stringify({
      v: 1, savedAt: Date.now(), state: sampleState, step: 'message',
      startedFromPreset: marker,
    }))
    const setStartedFromPreset = vi.fn()
    expect(restoreShareDraftIfPresent(vi.fn(), vi.fn(), setStartedFromPreset)).toBe(true)
    expect(setStartedFromPreset).toHaveBeenCalledWith(marker === true)
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

  it.each(['bouquet', 'card', 'message'] as const)(
    'restores incomplete edits and the %s step',
    (step) => {
      saveBuilderDraft(
        { ...sampleState, to: '', from: '', message: 'Still writing<br>this' },
        step
      )
      const setState = vi.fn()
      const setStep = vi.fn()
      expect(restoreShareDraftIfPresent(setState, setStep)).toBe(true)
      expect(setStep).toHaveBeenCalledWith(step)
      expect(setState.mock.calls[0][0](sampleState)).toMatchObject({
        from: '',
        to: '',
        message: 'Still writing<br>this',
      })
    }
  )

  it('migrates partial legacy drafts without losing the actual step', () => {
    sessionStorage.setItem(
      BUILDER_DRAFT_KEY,
      JSON.stringify({ ...sampleState, from: '' })
    )
    sessionStorage.setItem(BUILDER_STEP_KEY, 'message')
    const setStep = vi.fn()
    expect(restoreShareDraftIfPresent(vi.fn(), setStep)).toBe(true)
    expect(setStep).toHaveBeenCalledWith('message')
    expect(localStorage.getItem(BUILDER_DRAFT_STORAGE_KEY)).not.toBeNull()
    expect(sessionStorage.getItem(BUILDER_DRAFT_KEY)).toBeNull()
  })

  it('does not let an unfinished or over-limit restored gift skip validation', () => {
    saveBuilderDraft(
      { ...sampleState, message: Array(201).fill('word').join('<br>') },
      'share'
    )
    const setStep = vi.fn()
    restoreShareDraftIfPresent(vi.fn(), setStep)
    expect(setStep).toHaveBeenCalledWith('message')
  })

  it.each(['theme', 'share'] as const)('returns a one-letter %s draft to Message without losing it', (step) => {
    saveBuilderDraft({ ...sampleState, message: '<b>x</b>' }, step, true)
    const saved = localStorage.getItem(BUILDER_DRAFT_STORAGE_KEY)
    const setState = vi.fn()
    const setStep = vi.fn()
    const setStartedFromPreset = vi.fn()
    expect(restoreShareDraftIfPresent(setState, setStep, setStartedFromPreset)).toBe(true)
    expect(setStep).toHaveBeenCalledWith('message')
    expect(setState.mock.calls[0][0](sampleState).message).toBe('<b>x</b>')
    expect(setStartedFromPreset).toHaveBeenCalledWith(true)
    expect(localStorage.getItem(BUILDER_DRAFT_STORAGE_KEY)).toBe(saved)
  })

  it('discards an unknown step rather than restoring it', () => {
    const logger = vi.spyOn(console, 'warn').mockImplementation(() => {})
    localStorage.setItem(
      BUILDER_DRAFT_STORAGE_KEY,
      JSON.stringify({
        v: 1,
        state: sampleState,
        savedAt: Date.now(),
        step: 'broken',
      })
    )
    expect(restoreShareDraftIfPresent(vi.fn(), vi.fn())).toBe(false)
    expect(logger).toHaveBeenCalled()
    logger.mockRestore()
  })
})
