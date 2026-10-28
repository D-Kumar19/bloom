import { act, renderHook, waitFor } from '@testing-library/react'
import { StrictMode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useBouquetState } from '@/hooks/useBouquetState'
import { BUILDER_DRAFT_STORAGE_KEY, saveBuilderDraft } from '@/lib/builder/draftSession'
import { GUIDES } from '@/lib/guides'
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
    localStorage.removeItem(BUILDER_DRAFT_STORAGE_KEY)
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

  it('starts a guide starter at the editable message step and preserves unrelated URL state', async () => {
    window.history.replaceState({ preserved: true }, '', '/create?starter=birthday&campaign=test#builder')
    const { result } = renderHook(useBouquetState)
    await waitFor(() => expect(result.current.ready).toBe(true))

    expect(result.current.pendingStarter).toBeNull()
    expect(result.current.step).toBe('message')
    expect(result.current.state).toMatchObject({
      bouquetId: 'sunflower-burst',
      cardStyle: 'garden',
      theme: 'sunset',
      to: '',
      from: '',
      message: '',
    })

    expect(window.location.search).toBe('?campaign=test')
    expect(window.location.hash).toBe('#builder')
    expect(window.history.state).toEqual({ preserved: true })
  })

  it('starts a fresh new bouquet at flowers without applying a template', async () => {
    window.history.replaceState({}, '', '/create?new=1&starter=birthday&campaign=test#builder')
    const { result } = renderHook(useBouquetState)
    await waitFor(() => expect(result.current.ready).toBe(true))
    expect(result.current.step).toBe('bouquet')
    expect(result.current.state.bouquetId).toBe('red-rose-classic')
    expect(result.current.state.to).toBe('')
    expect(result.current.pendingStarter).toBeNull()
    expect(window.location.search).toBe('?campaign=test')
    expect(window.location.hash).toBe('#builder')
  })

  it('preserves the draft when returning through the explicit New bouquet entry', async () => {
    saveBuilderDraft({ ...GUIDES[0].state, to: 'Existing recipient' }, 'message')
    const first = renderHook(useBouquetState)
    await waitFor(() => expect(first.result.current.ready).toBe(true))
    const saved = localStorage.getItem(BUILDER_DRAFT_STORAGE_KEY)
    first.unmount()
    window.history.replaceState({}, '', '/create?new=1')
    const { result, unmount } = renderHook(useBouquetState)
    await waitFor(() => expect(result.current.pendingStarter?.fresh).toBe(true))
    expect(result.current.state.to).toBe('Existing recipient')
    expect(localStorage.getItem(BUILDER_DRAFT_STORAGE_KEY)).toBe(saved)
    act(() => result.current.keepDraft())
    await act(async () => {})
    expect(result.current.pendingStarter).toBeNull()
    expect(result.current.step).toBe('message')
    expect(localStorage.getItem(BUILDER_DRAFT_STORAGE_KEY)).toBe(saved)
    unmount()
    window.history.replaceState({}, '', '/create?new=1')
    const next = renderHook(useBouquetState)
    await waitFor(() => expect(next.result.current.pendingStarter?.fresh).toBe(true))
    act(() => next.result.current.startWithStarter())
    await act(async () => {})
    expect(next.result.current.step).toBe('bouquet')
    expect(next.result.current.state.to).toBe('')
    expect(next.result.current.pendingStarter).toBeNull()
    expect(window.location.search).toBe('')
  })

  it('asks before replacing a saved draft and can keep it without changing its data', async () => {
    const initial = renderHook(useBouquetState)
    await waitFor(() => expect(initial.result.current.ready).toBe(true))
    act(() => {
      initial.result.current.setTo('Keep this recipient')
      initial.result.current.setStep('card')
    })
    await waitFor(() =>
      expect(localStorage.getItem(BUILDER_DRAFT_STORAGE_KEY)).toContain('Keep this recipient')
    )
    const savedDraft = localStorage.getItem(BUILDER_DRAFT_STORAGE_KEY)
    initial.unmount()

    window.history.replaceState({}, '', '/create?starter=birthday&campaign=test#builder')
    const resumed = renderHook(useBouquetState)
    await waitFor(() => expect(resumed.result.current.ready).toBe(true))

    expect(resumed.result.current.pendingStarter?.title).toBe('Celebrate the day they arrived')
    expect(resumed.result.current.step).toBe('card')
    expect(resumed.result.current.state.to).toBe('Keep this recipient')
    expect(localStorage.getItem(BUILDER_DRAFT_STORAGE_KEY)).toBe(savedDraft)

    act(() => resumed.result.current.keepDraft())
    expect(resumed.result.current.pendingStarter).toBeNull()
    expect(window.location.search).toBe('?campaign=test')
    expect(window.location.hash).toBe('#builder')
    expect(localStorage.getItem(BUILDER_DRAFT_STORAGE_KEY)).toBe(savedDraft)
  })

  it('replaces a saved draft with the selected starter only after confirmation', async () => {
    const initial = renderHook(useBouquetState)
    await waitFor(() => expect(initial.result.current.ready).toBe(true))
    act(() => {
      initial.result.current.setTo('Old recipient')
      initial.result.current.setStep('message')
    })
    await waitFor(() =>
      expect(localStorage.getItem(BUILDER_DRAFT_STORAGE_KEY)).toContain('Old recipient')
    )
    const oldGiftId = initial.result.current.state.giftId
    initial.unmount()

    window.history.replaceState({}, '', '/create?starter=birthday')
    const resumed = renderHook(useBouquetState)
    await waitFor(() => expect(resumed.result.current.ready).toBe(true))
    expect(resumed.result.current.pendingStarter?.title).toBe('Celebrate the day they arrived')
    expect(localStorage.getItem(BUILDER_DRAFT_STORAGE_KEY)).toContain('Old recipient')

    act(() => resumed.result.current.startWithStarter())
    expect(resumed.result.current.pendingStarter).toBeNull()
    expect(resumed.result.current.step).toBe('message')
    expect(resumed.result.current.state).toMatchObject({
      bouquetId: 'sunflower-burst',
      to: '',
      from: '',
      message: '',
    })
    expect(resumed.result.current.state.giftId).not.toBe(oldGiftId)
    expect(window.location.search).toBe('')
    expect(JSON.parse(localStorage.getItem(BUILDER_DRAFT_STORAGE_KEY)!)).toMatchObject({
      step: 'message',
      state: { bouquetId: 'sunflower-burst', to: '' },
    })
  })

  it('protects an existing draft when an older encoded preset URL is opened', async () => {
    const initial = renderHook(useBouquetState)
    await waitFor(() => expect(initial.result.current.ready).toBe(true))
    act(() => {
      initial.result.current.setTo('Saved recipient')
      initial.result.current.setStep('card')
    })
    await waitFor(() =>
      expect(localStorage.getItem(BUILDER_DRAFT_STORAGE_KEY)).toContain('Saved recipient')
    )
    const savedDraft = localStorage.getItem(BUILDER_DRAFT_STORAGE_KEY)
    const preset = encodeBouquet({
      ...initial.result.current.state,
      bouquetId: 'sunflower-burst',
      to: 'Linked recipient',
      from: 'Alex',
    })
    initial.unmount()

    window.history.replaceState({}, '', `/create?preset=${preset}`)
    const resumed = renderHook(useBouquetState)
    await waitFor(() => expect(resumed.result.current.ready).toBe(true))

    expect(resumed.result.current.pendingStarter?.title).toBe('the bouquet in this link')
    expect(resumed.result.current.state.to).toBe('Saved recipient')
    expect(resumed.result.current.step).toBe('card')
    expect(localStorage.getItem(BUILDER_DRAFT_STORAGE_KEY)).toBe(savedDraft)
  })

  it.each([
    ['new bouquet', 'new=1', 'bouquet'],
    ['occasion', 'starter=birthday', 'message'],
    ['mood', 'mood=grateful', 'bouquet'],
    ['encoded preset', `preset=${encodeBouquet({ ...GUIDES[1].state, from: 'Alex' })}`, 'bouquet'],
  ] as const)(
    'preserves the saved draft after a failed %s replacement and supports retry',
    async (_, query, expectedStep) => {
      saveBuilderDraft({
        ...GUIDES[0].state,
        giftId: crypto.randomUUID(),
        to: 'Keep my recipient',
        message: '<b>Keep my words</b>',
      }, 'card')
      const saved = localStorage.getItem(BUILDER_DRAFT_STORAGE_KEY)
      window.history.replaceState({ preserved: true }, '', `/create?${query}&campaign=test#builder`)
      const { result, unmount } = renderHook(useBouquetState)
      await waitFor(() => expect(result.current.ready).toBe(true))
      const originalState = result.current.state
      const pending = result.current.pendingStarter
      expect(pending).not.toBeNull()
      const logger = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const write = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new DOMException('Storage full', 'QuotaExceededError')
      })

      act(() => result.current.startWithStarter())
      await act(async () => {})

      expect(localStorage.getItem(BUILDER_DRAFT_STORAGE_KEY)).toBe(saved)
      expect(result.current.state).toEqual(originalState)
      expect(result.current.step).toBe('card')
      expect(result.current.pendingStarter).toBe(pending)
      expect(result.current.storageError).toContain('Your saved bouquet is unchanged')
      expect(window.location.search).toContain(query)
      expect(window.location.hash).toBe('#builder')
      expect(logger).toHaveBeenCalledOnce()

      write.mockRestore()
      act(() => result.current.startWithStarter())
      await act(async () => {})

      expect(result.current.pendingStarter).toBeNull()
      expect(result.current.storageError).toBeNull()
      expect(result.current.step).toBe(expectedStep)
      expect(result.current.state.giftId).not.toBe(originalState.giftId)
      expect(result.current.state.to).toBe('')
      expect(result.current.state.message).toBe('')
      expect(window.location.search).toBe('?campaign=test')
      expect(window.location.hash).toBe('#builder')
      expect(window.history.state).toEqual({ preserved: true })
      const replacement = result.current.state
      expect(JSON.parse(localStorage.getItem(BUILDER_DRAFT_STORAGE_KEY)!)).toMatchObject({
        state: replacement,
        step: expectedStep,
      })
      unmount()
      const restored = renderHook(useBouquetState)
      await waitFor(() => expect(restored.result.current.ready).toBe(true))
      expect(restored.result.current.state).toEqual(replacement)
      expect(restored.result.current.step).toBe(expectedStep)
      expect(restored.result.current.pendingStarter).toBeNull()
    },
  )

  it('can keep and recover the original draft after a failed replacement', async () => {
    saveBuilderDraft({ ...GUIDES[0].state, to: 'Keep this draft' }, 'card')
    const saved = localStorage.getItem(BUILDER_DRAFT_STORAGE_KEY)
    window.history.replaceState({}, '', '/create?starter=birthday')
    const { result, unmount } = renderHook(useBouquetState)
    await waitFor(() => expect(result.current.ready).toBe(true))
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    const write = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Storage blocked', 'SecurityError')
    })

    act(() => result.current.startWithStarter())
    act(() => result.current.keepDraft())
    await act(async () => {})

    expect(result.current.pendingStarter).toBeNull()
    expect(result.current.state.to).toBe('Keep this draft')
    expect(result.current.step).toBe('card')
    expect(localStorage.getItem(BUILDER_DRAFT_STORAGE_KEY)).toBe(saved)
    expect(window.location.search).toBe('')
    write.mockRestore()
    unmount()
    const restored = renderHook(useBouquetState)
    await waitFor(() => expect(restored.result.current.ready).toBe(true))
    expect(restored.result.current.state.to).toBe('Keep this draft')
    expect(restored.result.current.step).toBe('card')
    expect(restored.result.current.pendingStarter).toBeNull()
    expect(localStorage.getItem(BUILDER_DRAFT_STORAGE_KEY)).toBe(saved)
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
