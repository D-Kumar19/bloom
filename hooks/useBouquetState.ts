'use client'

import { useCallback, useEffect, useState } from 'react'

import { decodeBouquet } from '@/lib/sharing'
import { FEATURED_CARD_ID, PHOTO_CARD_ID } from '@/lib/cards'
import { adjustFlowerQuantity } from '@/lib/flowers'
import { DEFAULT_NOTE_BORDER } from '@/lib/cards'
import { DEFAULT_MESSAGE_FORMAT, truncateMessageHtml } from '@/lib/message'
import {
  MAX_MESSAGE_LENGTH,
  MIN_FLOWERS,
  type BouquetState,
  type BuilderStep,
  type MessageFormat,
  type NoteBorder,
} from '@/lib/types'

const DEFAULT_STATE: BouquetState = {
  flowers: [],
  greenery: 'leafy',
  cardStyle: FEATURED_CARD_ID,
  photoNoteStyle: FEATURED_CARD_ID,
  messageFormat: DEFAULT_MESSAGE_FORMAT,
  noteBorder: DEFAULT_NOTE_BORDER,
  to: '',
  message: '',
  from: '',
  theme: 'warm',
}

export function useBouquetState() {
  const [state, setState] = useState<BouquetState>(DEFAULT_STATE)
  const [step, setStep] = useState<BuilderStep>('pick')

  useEffect(() => {
    queueMicrotask(() => {
      const params = new URLSearchParams(window.location.search)
      const preset = params.get('preset')
      if (!preset) {
        return
      }
      const decoded = decodeBouquet(preset)
      if (decoded) {
        setState(decoded)
      }
    })
  }, [])

  const onAdjustFlowerQuantity = useCallback((flowerId: string, delta: number) => {
    setState((current) => ({
      ...current,
      flowers: adjustFlowerQuantity(current.flowers, flowerId, delta),
    }))
  }, [])

  const setGreenery = useCallback((greenery: string) => {
    setState((current) => ({ ...current, greenery }))
  }, [])

  const setCardStyle = useCallback((cardStyle: string) => {
    setState((current) => ({
      ...current,
      cardStyle,
      ...(cardStyle !== PHOTO_CARD_ID ? { photoNoteStyle: cardStyle } : {}),
    }))
  }, [])

  const setPhotoCardImage = useCallback((photoCardImage: string | undefined) => {
    setState((current) => ({ ...current, photoCardImage }))
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

  const canProceed =
    (step === 'pick' && state.flowers.length >= MIN_FLOWERS) ||
    (step === 'greenery' && Boolean(state.greenery)) ||
    (step === 'card' &&
      Boolean(state.cardStyle) &&
      (state.cardStyle !== PHOTO_CARD_ID || Boolean(state.photoCardImage))) ||
    step === 'message' ||
    (step === 'theme' && Boolean(state.theme))

  const goNext = useCallback(() => {
    const order: BuilderStep[] = [
      'pick',
      'greenery',
      'card',
      'message',
      'theme',
      'result',
    ]
    setStep((current) => {
      const index = order.indexOf(current)
      return order[Math.min(index + 1, order.length - 1)]
    })
  }, [])

  const goBack = useCallback(() => {
    const order: BuilderStep[] = [
      'pick',
      'greenery',
      'card',
      'message',
      'theme',
      'result',
    ]
    setStep((current) => {
      const index = order.indexOf(current)
      return order[Math.max(index - 1, 0)]
    })
  }, [])

  return {
    state,
    step,
    setStep,
    onAdjustFlowerQuantity,
    setGreenery,
    setCardStyle,
    setPhotoCardImage,
    setMessageFormat,
    setNoteBorder,
    setTo,
    setMessage,
    setFrom,
    setTheme,
    canProceed,
    goNext,
    goBack,
    minFlowers: MIN_FLOWERS,
    maxMessageLength: MAX_MESSAGE_LENGTH,
  }
}
