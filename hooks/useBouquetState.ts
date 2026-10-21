'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { decodeBouquet } from '@/lib/sharing'
import { BUILDER_STEPS } from '@/lib/builder/steps'
import {
  restoreBuilderDraft,
  saveBuilderDraft,
  clearBuilderDraft,
} from '@/lib/builder/draftSession'
import { DEFAULT_BOUQUET_ID } from '@/lib/bouquets'
import { FEATURED_CARD_ID } from '@/lib/cards'
import { DEFAULT_NOTE_BORDER } from '@/lib/cards'
import { DEFAULT_MESSAGE_FORMAT, sanitizeMessageHtml } from '@/lib/message'
import { canProceedMessageStep } from '@/lib/message'
import { applyMoodPreset, isMoodId } from '@/lib/moods'
import {
  MAX_MESSAGE_WORDS,
  type BouquetState,
  type BuilderStep,
  type MessageFormat,
  type NoteBorder,
} from '@/lib/types'

const DEFAULT_STATE: BouquetState = {
  bouquetId: DEFAULT_BOUQUET_ID,
  cardStyle: FEATURED_CARD_ID,
  messageFormat: DEFAULT_MESSAGE_FORMAT,
  noteBorder: DEFAULT_NOTE_BORDER,
  to: '',
  message: '',
  from: '',
  theme: 'warm',
  soundtrack: 'none',
}

export function useBouquetState() {
  const [state, setState] = useState<BouquetState>(DEFAULT_STATE)
  const [step, setStep] = useState<BuilderStep>('bouquet')
  const [ready, setReady] = useState(false)
  const [storageError, setStorageError] = useState<string | null>(null)
  const lastSaved = useRef(JSON.stringify({ state: DEFAULT_STATE, step: 'bouquet' }))
  const storageErrorReported = useRef(false)

  const reportStorageError = useCallback(() => {
    if (!storageErrorReported.current) {
      console.warn('Bloom draft storage is unavailable. Draft recovery cannot be guaranteed.')
      storageErrorReported.current = true
    }
    setStorageError(
      'Draft recovery is unavailable in this browser. Keep this page open until you copy your gift link.',
    )
  }, [])

  useEffect(() => {
    let active = true
    queueMicrotask(() => {
      if (!active) return
      const params = new URLSearchParams(window.location.search)
      const preset = params.get('preset')
      const moodParam = params.get('mood')

      let initialState = DEFAULT_STATE
      let initialStep: BuilderStep = 'bouquet'
      let initializedFromLink = false
      try {
        const decoded = preset ? decodeBouquet(preset) : null
        if (decoded) {
          initialState = { ...DEFAULT_STATE, ...decoded }
          initializedFromLink = true
        } else if (moodParam && isMoodId(moodParam)) {
          initialState = applyMoodPreset(DEFAULT_STATE, moodParam)
          initializedFromLink = true
        } else {
          restoreBuilderDraft(
            (value) => {
              initialState = typeof value === 'function' ? value(DEFAULT_STATE) : value
            },
            (value) => {
              initialStep = value
            },
          )
        }
      } catch {
        reportStorageError()
      }
      if (initializedFromLink) {
        // Presets initialize once; reloads must recover the user's subsequent edits.
        params.delete('preset')
        params.delete('mood')
        const search = params.size ? `?${params.toString()}` : ''
        window.history.replaceState(
          window.history.state,
          '',
          `${window.location.pathname}${search}${window.location.hash}`,
        )
      } else {
        lastSaved.current = JSON.stringify({
          state: initialState,
          step: initialStep,
        })
      }
      setState(initialState)
      setStep(initialStep)
      setReady(true)
    })
    return () => {
      active = false
    }
  }, [reportStorageError])

  useEffect(() => {
    if (!ready) return
    let active = true
    queueMicrotask(() => {
      if (!active) return
      const snapshot = JSON.stringify({ state, step })
      if (snapshot === lastSaved.current) return
      try {
        saveBuilderDraft(state, step)
        lastSaved.current = snapshot
        setStorageError(null)
      } catch {
        reportStorageError()
      }
    })
    return () => {
      active = false
    }
  }, [state, step, ready, reportStorageError])

  const setBouquet = useCallback((bouquetId: string) => {
    setState((current) => ({ ...current, bouquetId }))
  }, [])

  const setCardStyle = useCallback((cardStyle: string) => {
    setState((current) => ({ ...current, cardStyle }))
  }, [])

  const setMessageFormat = useCallback((messageFormat: MessageFormat) => {
    setState((current) => ({ ...current, messageFormat }))
  }, [])

  const setNoteBorder = useCallback((noteBorder: NoteBorder) => {
    setState((current) => ({ ...current, noteBorder }))
  }, [])

  const setTo = useCallback((to: string) => {
    setState((current) => ({ ...current, to }))
  }, [])

  const setMessage = useCallback((message: string) => {
    setState((current) => ({
      ...current,
      message: sanitizeMessageHtml(message),
    }))
  }, [])

  const setFrom = useCallback((from: string) => {
    setState((current) => ({ ...current, from }))
  }, [])

  const setTheme = useCallback((theme: string) => {
    setState((current) => ({ ...current, theme }))
  }, [])

  const setSoundtrack = useCallback((soundtrack: string) => {
    setState((current) => ({ ...current, soundtrack }))
  }, [])

  const canProceed =
    (step === 'bouquet' && Boolean(state.bouquetId)) ||
    (step === 'card' && Boolean(state.cardStyle)) ||
    (step === 'message' && canProceedMessageStep(state.to, state.from, state.message)) ||
    (step === 'theme' && Boolean(state.theme))

  const goNext = useCallback(() => {
    if (!canProceed) return
    setStep((current) => {
      const index = BUILDER_STEPS.indexOf(current)
      return BUILDER_STEPS[Math.min(index + 1, BUILDER_STEPS.length - 1)]
    })
  }, [canProceed])

  const goBack = useCallback(() => {
    setStep((current) => {
      const index = BUILDER_STEPS.indexOf(current)
      return BUILDER_STEPS[Math.max(index - 1, 0)]
    })
  }, [])

  const goToStep = useCallback((target: BuilderStep) => {
    setStep((current) => {
      const currentIndex = BUILDER_STEPS.indexOf(current)
      const targetIndex = BUILDER_STEPS.indexOf(target)
      if (targetIndex < 0 || targetIndex >= currentIndex) {
        return current
      }
      return target
    })
  }, [])

  const startNewBouquet = useCallback(() => {
    try {
      clearBuilderDraft()
    } catch {
      reportStorageError()
    }
    lastSaved.current = JSON.stringify({
      state: DEFAULT_STATE,
      step: 'bouquet',
    })
    setState(DEFAULT_STATE)
    setStep('bouquet')
  }, [reportStorageError])

  return {
    state,
    step,
    ready,
    storageError,
    setStep,
    setBouquet,
    setCardStyle,
    setMessageFormat,
    setNoteBorder,
    setTo,
    setMessage,
    setFrom,
    setTheme,
    setSoundtrack,
    canProceed,
    goNext,
    goBack,
    goToStep,
    startNewBouquet,
    maxMessageWords: MAX_MESSAGE_WORDS,
  }
}
