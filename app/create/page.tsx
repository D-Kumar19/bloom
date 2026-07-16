'use client'

import { useEffect, useMemo, useRef } from 'react'

import { BouquetGalleryPicker } from '@/components/builder/BouquetGalleryPicker'
import { BouquetShareStep } from '@/components/builder/BouquetShareStep'
import { CardStylePicker } from '@/components/builder/CardStylePicker'
import { MessageForm } from '@/components/builder/MessageForm'
import { StepIndicator } from '@/components/builder/StepIndicator'
import { ThemePicker } from '@/components/builder/ThemePicker'
import { Button } from '@/components/ui/Button'
import { useBouquetState } from '@/hooks/useBouquetState'
import { useHeaderSlot } from '@/hooks/useHeaderSlot'
import { BUILDER_STEPS } from '@/lib/builder/steps'
import { DEFAULT_NOTE_BORDER } from '@/lib/cards'
import { DEFAULT_MESSAGE_FORMAT } from '@/lib/message'

export default function CreatePage() {
  const {
    state,
    step,
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
    maxMessageWords,
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

  const progressBar = useMemo(
    () => (
      <div data-testid="progress-shell">
        <StepIndicator currentStep={step} onStepClick={goToStep} />
      </div>
    ),
    [step, goToStep],
  )

  const progressAttached = useHeaderSlot(progressBar)
  const stepNumber = BUILDER_STEPS.indexOf(step) + 1
  const isShareStep = step === 'share'

  return (
    <main
      className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 md:px-6 md:py-8"
    >
      {!isShareStep ? (
        <div className="text-center">
          <h1 className="font-display text-3xl text-bloom-ink md:text-4xl">Create your bouquet</h1>
          <p className="mt-2 text-sm text-bloom-ink/60">
            Step {stepNumber} of {BUILDER_STEPS.length}
          </p>
        </div>
      ) : null}

      {!progressAttached ? (
        <div
          data-testid="progress-shell-fallback"
          className="sticky top-[4.25rem] z-20 -mx-2 rounded-3xl bg-bloom-cream/90 px-2 py-3 backdrop-blur-sm"
        >
          <StepIndicator currentStep={step} onStepClick={goToStep} />
        </div>
      ) : null}

      <div className="grid gap-6">
        <div key={step} data-testid="step-panel" className="animate-step-enter">
          {step === 'bouquet' ? (
            <BouquetGalleryPicker
              selectedId={state.bouquetId}
              onSelect={setBouquet}
            />
          ) : null}
          {step === 'card' ? (
            <CardStylePicker selectedId={state.cardStyle} onSelect={setCardStyle} />
          ) : null}
          {step === 'message' ? (
            <MessageForm
              to={state.to}
              message={state.message}
              from={state.from}
              cardStyle={state.cardStyle}
              messageFormat={state.messageFormat ?? DEFAULT_MESSAGE_FORMAT}
              noteBorder={state.noteBorder ?? DEFAULT_NOTE_BORDER}
              maxWords={maxMessageWords}
              onToChange={setTo}
              onMessageChange={setMessage}
              onFromChange={setFrom}
              onMessageFormatChange={setMessageFormat}
              onNoteBorderChange={setNoteBorder}
              onCardStyleChange={setCardStyle}
            />
          ) : null}
          {step === 'theme' ? (
            <ThemePicker
              selectedId={state.theme}
              soundtrackId={state.soundtrack}
              onSelect={setTheme}
              onSoundtrackSelect={setSoundtrack}
            />
          ) : null}
          {step === 'share' ? (
            <BouquetShareStep state={state} onCreateAnother={startNewBouquet} />
          ) : null}
        </div>
      </div>

      {isShareStep ? (
        <div className="pb-4">
          <Button variant="ghost" onClick={goBack}>
            Back
          </Button>
        </div>
      ) : (
        <div className="flex justify-between gap-4 pb-4">
          <Button variant="ghost" onClick={goBack} disabled={step === 'bouquet'}>
            Back
          </Button>
          <Button
            data-testid="next-button"
            disabled={!canProceed}
            onClick={goNext}
          >
            Continue
          </Button>
        </div>
      )}
    </main>
  )
}
