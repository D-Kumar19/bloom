import { act, renderHook, waitFor } from '@testing-library/react'
import { StrictMode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useBouquetState } from '@/hooks/useBouquetState'
import { BUILDER_DRAFT_STORAGE_KEY } from '@/lib/builder/draftSession'
import { countMessageWords } from '@/lib/message'
import { encodeBouquet } from '@/lib/sharing'

describe('builder draft recovery', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    window.history.replaceState({}, '', '/create')
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('keeps a gift ID across edits/reloads, but replaces it for a new bouquet or preset', async () => {
    const first = renderHook(useBouquetState)
    await waitFor(() => expect(first.result.current.ready).toBe(true))
    const id = first.result.current.state.giftId
    expect(id).toMatch(/^[0-9a-f-]{36}$/)
    act(() => first.result.current.setTo('An edit'))
    await waitFor(() => expect(localStorage.getItem(BUILDER_DRAFT_STORAGE_KEY)).toContain(id!))
    first.unmount()
    const restored = renderHook(useBouquetState)
    await waitFor(() => expect(restored.result.current.ready).toBe(true))
    expect(restored.result.current.state.giftId).toBe(id)
    act(() => restored.result.current.startNewBouquet())
    expect(restored.result.current.state.giftId).not.toBe(id)
    const preset = encodeBouquet({ ...restored.result.current.state, from: 'Alex' })
    const presetId = restored.result.current.state.giftId
    restored.unmount()
    window.history.replaceState({}, '', `/create?preset=${preset}`)
    const fromPreset = renderHook(useBouquetState)
    await waitFor(() => expect(fromPreset.result.current.ready).toBe(true))
    expect(fromPreset.result.current.state.giftId).not.toBe(presetId)
  })

  it('saves partial edits and the current step, without overwriting them on remount', async () => {
    const first = renderHook(useBouquetState)
    await waitFor(() => expect(first.result.current.ready).toBe(true))
    act(() => {
      first.result.current.setTo('Someone')
      first.result.current.setMessage('<b>Still writing</b><br>this')
      first.result.current.setStep('message')
    })
    await waitFor(() =>
      expect(
        JSON.parse(localStorage.getItem(BUILDER_DRAFT_STORAGE_KEY)!).step
      ).toBe('message')
    )
    first.unmount()
    const second = renderHook(useBouquetState)
    await waitFor(() => expect(second.result.current.ready).toBe(true))
    expect(second.result.current.step).toBe('message')
    expect(second.result.current.state).toMatchObject({
      to: 'Someone',
      from: '',
      message: '<b>Still writing</b><br>this',
    })
    expect(second.result.current.canProceed).toBe(false)
    const saved = localStorage.getItem(BUILDER_DRAFT_STORAGE_KEY)
    await act(async () => {})
    expect(localStorage.getItem(BUILDER_DRAFT_STORAGE_KEY)).toBe(saved)
  })

  it('keeps 201 words and formatting, blocks Continue, and resumes after editing down', async () => {
    const { result } = renderHook(useBouquetState)
    await waitFor(() => expect(result.current.ready).toBe(true))
    act(() => {
      result.current.setTo('Sam')
      result.current.setFrom('Alex')
      result.current.setStep('message')
      result.current.setMessage(
        `<b>${Array(201).fill('word').join('<br>')}</b>`
      )
    })
    expect(countMessageWords(result.current.state.message)).toBe(201)
    expect(result.current.state.message).toContain('<b>')
    expect(result.current.canProceed).toBe(false)
    act(() => result.current.goNext())
    expect(result.current.step).toBe('message')
    act(() => result.current.setMessage(Array(200).fill('word').join('<br>')))
    expect(result.current.canProceed).toBe(true)
    act(() => result.current.goNext())
    expect(result.current.step).toBe('theme')
  })

  it('keeps start-new cleared rather than autosaving the discarded gift', async () => {
    const { result, unmount } = renderHook(useBouquetState)
    await waitFor(() => expect(result.current.ready).toBe(true))
    act(() => result.current.setTo('Old draft'))
    await waitFor(() =>
      expect(localStorage.getItem(BUILDER_DRAFT_STORAGE_KEY)).not.toBeNull()
    )
    act(() => result.current.startNewBouquet())
    await act(async () => {})
    expect(localStorage.getItem(BUILDER_DRAFT_STORAGE_KEY)).toBeNull()
    unmount()
    const next = renderHook(useBouquetState)
    await waitFor(() => expect(next.result.current.ready).toBe(true))
    expect(next.result.current.state.to).toBe('')
    expect(next.result.current.step).toBe('bouquet')
  })

  it('continues in memory with a visible warning if reading or writing storage is blocked', async () => {
    const logger = vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Blocked')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Blocked')
    })
    const { result } = renderHook(useBouquetState)
    await waitFor(() => expect(result.current.ready).toBe(true))
    expect(result.current.storageError).toContain('Keep this page open')
    act(() => result.current.setTo('Still usable'))
    await act(async () => {})
    expect(result.current.state.to).toBe('Still usable')
    expect(logger).toHaveBeenCalledTimes(1)
  })

  it('does not overwrite a saved draft during Strict Mode hydration', async () => {
    const first = renderHook(useBouquetState)
    await waitFor(() => expect(first.result.current.ready).toBe(true))
    act(() => {
      first.result.current.setTo('Keep me')
      first.result.current.setStep('card')
    })
    await waitFor(() => expect(localStorage.getItem(BUILDER_DRAFT_STORAGE_KEY)).toContain('Keep me'))
    const saved = localStorage.getItem(BUILDER_DRAFT_STORAGE_KEY)
    first.unmount()
    const second = renderHook(useBouquetState, {
      wrapper: ({ children }) => <StrictMode>{children}</StrictMode>,
    })
    await waitFor(() => expect(second.result.current.ready).toBe(true))
    expect(second.result.current.state.to).toBe('Keep me')
    expect(second.result.current.step).toBe('card')
    await act(async () => {})
    expect(localStorage.getItem(BUILDER_DRAFT_STORAGE_KEY)).toBe(saved)
  })

  it('applies a preset once, then recovers edits and step instead of reapplying it', async () => {
    const initial = renderHook(useBouquetState)
    await waitFor(() => expect(initial.result.current.ready).toBe(true))
    const preset = encodeBouquet({
      ...initial.result.current.state, from: 'Alex', message: 'Starter', to: 'Sam',
    })
    initial.unmount()
    window.history.replaceState({ preserved: true }, '', `/create?preset=${preset}&campaign=test#builder`)
    const first = renderHook(useBouquetState)
    await waitFor(() => expect(first.result.current.ready).toBe(true))
    expect(first.result.current.state.message).toBe('Starter')
    expect(window.location.search).toBe('?campaign=test')
    expect(window.location.hash).toBe('#builder')
    expect(window.history.state).toEqual({ preserved: true })
    act(() => {
      first.result.current.setMessage('My own words')
      first.result.current.setStep('message')
    })
    await waitFor(() => expect(localStorage.getItem(BUILDER_DRAFT_STORAGE_KEY)).toContain('My own words'))
    first.unmount()
    const next = renderHook(useBouquetState)
    await waitFor(() => expect(next.result.current.ready).toBe(true))
    expect(next.result.current.state.message).toBe('My own words')
    expect(next.result.current.step).toBe('message')
  })

  it('consumes mood initialization so reload preserves edits and start-new stays new', async () => {
    window.history.replaceState({}, '', '/create?mood=grateful')
    const first = renderHook(useBouquetState)
    await waitFor(() => expect(first.result.current.ready).toBe(true))
    expect(first.result.current.state.bouquetId).toBe('blush-peony-cloud')
    expect(window.location.search).toBe('')
    act(() => {
      first.result.current.setTo('My recipient')
      first.result.current.setStep('message')
    })
    await waitFor(() => expect(localStorage.getItem(BUILDER_DRAFT_STORAGE_KEY)).toContain('My recipient'))
    first.unmount()
    const second = renderHook(useBouquetState)
    await waitFor(() => expect(second.result.current.ready).toBe(true))
    expect(second.result.current.state.to).toBe('My recipient')
    expect(second.result.current.step).toBe('message')
    act(() => second.result.current.startNewBouquet())
    await act(async () => {})
    second.unmount()
    const third = renderHook(useBouquetState)
    await waitFor(() => expect(third.result.current.ready).toBe(true))
    expect(third.result.current.state.bouquetId).toBe('red-rose-classic')
    expect(third.result.current.state.to).toBe('')
  })
})
