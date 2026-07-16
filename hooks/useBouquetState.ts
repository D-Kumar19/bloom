'use client'

import { useCallback, useEffect, useState } from 'react'

import { decodeBouquet } from '@/lib/sharing'
import { BUILDER_STEPS } from '@/lib/builder/steps'
import { restoreShareDraftIfPresent, clearBuilderDraft } from '@/lib/builder/draftSession'
import { DEFAULT_BOUQUET_ID } from '@/lib/bouquets'
import { FEATURED_CARD_ID } from '@/lib/cards'
import { DEFAULT_NOTE_BORDER } from '@/lib/cards'
import { DEFAULT_MESSAGE_FORMAT, truncateMessageHtml } from '@/lib/message'
import { canProceedMessageStep } from '@/lib/message'
import { applyMoodPreset, isMoodId } from '@/lib/moods'
import {
  MAX_MESSAGE_LENGTH,
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

  useEffect(() => {
    queueMicrotask(() => {
      const params = new URLSearchParams(window.location.search)
      const preset = params.get('preset')
      const moodParam = params.get('mood')

      if (preset) {
        const decoded = decodeBouquet(preset)
        if (decoded) {
          setState((current) => ({ ...current, ...decoded }))
        }
        return
      }

      if (moodParam && isMoodId(moodParam)) {
        setState((current) => applyMoodPreset(current, moodParam))
        return
      }

      restoreShareDraftIfPresent(setState, setStep)
    })
  }, [])

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
      message: truncateMessageHtml(message, MAX_MESSAGE_LENGTH),
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
    setStep((current) => {
      const index = BUILDER_STEPS.indexOf(current)
      return BUILDER_STEPS[Math.min(index + 1, BUILDER_STEPS.length - 1)]
    })
  }, [])

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
    clearBuilderDraft()
    setState(DEFAULT_STATE)
    setStep('bouquet')
  }, [])

  return {
    state,
    step,
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
    maxMessageLength: MAX_MESSAGE_LENGTH,
  }
}
