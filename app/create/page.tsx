'use client'

import { useEffect, useRef } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { BouquetComposition } from '@/components/bouquet/BouquetComposition'
import { CardStylePicker } from '@/components/builder/CardStylePicker'
import { FlowerPicker } from '@/components/builder/FlowerPicker'
import { GreeneryPicker } from '@/components/builder/GreeneryPicker'
import { MessageForm } from '@/components/builder/MessageForm'
import { StepIndicator } from '@/components/builder/StepIndicator'
import { ThemePicker } from '@/components/builder/ThemePicker'
import { Button } from '@/components/ui/Button'
import { useBouquetState } from '@/hooks/useBouquetState'
import { DEFAULT_MESSAGE_FORMAT } from '@/lib/messageRichText'
import { DEFAULT_NOTE_BORDER } from '@/lib/noteBorder'
import { FEATURED_CARD_ID } from '@/lib/cards'

export default function CreatePage() {
  const router = useRouter()
  const {
    state,
    step,
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
    maxMessageLength,
  } = useBouquetState()
  const previousStepRef = useRef(step)

  useEffect(() => {
    if (previousStepRef.current !== step) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
      previousStepRef.current = step
    }
  }, [step])

  const handleNext = () => {
    if (step === 'theme') {
      sessionStorage.setItem('bloom-bouquet', JSON.stringify(state))
      router.push('/create/result')
      return
    }
    goNext()
  }

  const showThemePreview = step === 'theme'

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 md:px-6">
      <header className="text-center">
        <Link href="/" className="text-sm font-medium uppercase tracking-[0.2em] text-bloom-rose">
          Bloom
        </Link>
        <h1 className="mt-2 font-display text-3xl text-bloom-ink md:text-4xl">
          Create your bouquet
        </h1>
      </header>

      <div
        data-testid="progress-shell"
        className="sticky top-2 z-20 -mx-2 rounded-3xl bg-bloom-cream/90 px-2 py-3 backdrop-blur-sm md:top-4"
      >
        <StepIndicator currentStep={step} />
      </div>

      <div className="grid gap-6">
        <div key={step} data-testid="step-panel" className="animate-step-enter">
          {step === 'pick' ? (
            <FlowerPicker
              selected={state.flowers}
              onAdjustQuantity={onAdjustFlowerQuantity}
            />
          ) : null}
          {step === 'greenery' ? (
            <GreeneryPicker selectedId={state.greenery} onSelect={setGreenery} />
          ) : null}
          {step === 'card' ? (
            <CardStylePicker
              selectedId={state.cardStyle}
              photoCardImage={state.photoCardImage}
              onSelect={setCardStyle}
              onPhotoCardImageChange={setPhotoCardImage}
            />
          ) : null}
          {step === 'message' ? (
            <MessageForm
              to={state.to}
              message={state.message}
              from={state.from}
              cardStyle={state.cardStyle}
              photoCardImage={state.photoCardImage}
              photoNoteStyle={state.photoNoteStyle ?? FEATURED_CARD_ID}
              messageFormat={state.messageFormat ?? DEFAULT_MESSAGE_FORMAT}
              noteBorder={state.noteBorder ?? DEFAULT_NOTE_BORDER}
              maxLength={maxMessageLength}
              onToChange={setTo}
              onMessageChange={setMessage}
              onFromChange={setFrom}
              onMessageFormatChange={setMessageFormat}
              onNoteBorderChange={setNoteBorder}
            />
          ) : null}
          {step === 'theme' ? (
            <ThemePicker selectedId={state.theme} onSelect={setTheme} />
          ) : null}
        </div>

        {showThemePreview ? (
          <BouquetComposition state={state} />
        ) : null}
      </div>

      <div className="flex justify-between gap-4 pb-4">
        <Button variant="ghost" onClick={goBack} disabled={step === 'pick'}>
          Back
        </Button>
        <Button
          data-testid="next-button"
          disabled={!canProceed}
          onClick={handleNext}
        >
          {step === 'theme' ? 'Create Bouquet' : 'Continue'}
        </Button>
      </div>
    </main>
  )
}
