'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'

import {
  BUILDER_STEP_META,
  BUILDER_STEP_NOTES,
} from '@/lib/builder/steps'
import type { BuilderStep } from '@/lib/types'

const SPARKLE_OFFSETS = [
  { x: -10, y: -12, delay: 0 },
  { x: 12, y: -10, delay: 0.05 },
  { x: -8, y: 10, delay: 0.1 },
  { x: 10, y: 8, delay: 0.15 },
]

type StepIndicatorProps = {
  currentStep: BuilderStep
  onStepClick?: (step: BuilderStep) => void
}

function stepProgress(index: number): number {
  if (BUILDER_STEP_META.length <= 1) {
    return 0
  }
  return (index / (BUILDER_STEP_META.length - 1)) * 100
}

function StepSparkles({ visible }: { visible: boolean }) {
  if (!visible) {
    return null
  }

  return (
    <>
      {SPARKLE_OFFSETS.map((sparkle, i) => (
        <span
          key={i}
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-1/2 text-[10px] animate-step-sparkle"
          style={
            {
              '--sparkle-x': `${sparkle.x}px`,
              '--sparkle-y': `${sparkle.y}px`,
              animationDelay: `${sparkle.delay}s`,
            } as CSSProperties
          }
        >
          ✨
        </span>
      ))}
    </>
  )
}

function ProgressBurst({ visible }: { visible: boolean }) {
  if (!visible) {
    return null
  }

  return (
    <span data-testid="progress-burst" className="absolute inset-0">
      {SPARKLE_OFFSETS.map((sparkle, i) => (
        <span
          key={i}
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-1/2 text-[11px] animate-progress-burst"
          style={
            {
              '--sparkle-x': `${sparkle.x}px`,
              '--sparkle-y': `${sparkle.y}px`,
              animationDelay: `${sparkle.delay}s`,
            } as CSSProperties
          }
        >
          ✨
        </span>
      ))}
    </span>
  )
}

export function StepIndicator({ currentStep, onStepClick }: StepIndicatorProps) {
  const currentIndex = BUILDER_STEP_META.findIndex((step) => step.id === currentStep)
  const progress = stepProgress(Math.max(currentIndex, 0))
  const [pulseIndex, setPulseIndex] = useState<number | null>(null)
  const [burstActive, setBurstActive] = useState(false)
  const prevIndexRef = useRef(currentIndex)

  useEffect(() => {
    const prev = prevIndexRef.current
    if (currentIndex !== prev) {
      queueMicrotask(() => setPulseIndex(currentIndex))
      queueMicrotask(() => setBurstActive(true))
      const pulseTimer = window.setTimeout(() => {
        setPulseIndex(null)
        setBurstActive(false)
      }, 1200)
      prevIndexRef.current = currentIndex
      return () => window.clearTimeout(pulseTimer)
    }

    prevIndexRef.current = currentIndex
  }, [currentIndex])

  const stepNote = pulseIndex === null ? BUILDER_STEP_NOTES[currentStep] : undefined
  const progressPercent = Math.round(progress)

  return (
    <nav aria-label="Bouquet builder progress" className="mx-auto w-full max-w-2xl px-2">
      <div className="relative pt-1 pb-8">
        <div
          className="relative h-2.5 overflow-visible rounded-full bg-bloom-rose/20 shadow-inner"
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Bouquet builder progress"
        >
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-brand-pink via-bloom-gold to-brand-pink transition-[width] duration-700 ease-in-out motion-reduce:transition-none"
            style={{ width: `${progress}%` }}
          />
          <div
            className="pointer-events-none absolute top-1/2 -translate-x-1/2 -translate-y-1/2 transition-[left] duration-700 ease-in-out motion-reduce:transition-none"
            style={{ left: `${progress}%` }}
            aria-hidden
          >
            <span
              className={`relative block h-2.5 w-2.5 rounded-full bg-surface shadow-[0_0_8px_rgba(233,30,140,0.5)] ${
                currentIndex === 0 && pulseIndex === null
                  ? 'animate-progress-idle'
                  : burstActive
                    ? 'animate-progress-spark'
                    : ''
              }`}
            >
              <span className="absolute inset-0 rounded-full bg-brand-pink/70 blur-[1px]" />
              <ProgressBurst visible={burstActive} />
            </span>
          </div>
        </div>

        <ol className="mt-4 grid grid-cols-3 gap-x-1 gap-y-3 sm:grid-cols-6 sm:gap-y-1">
          {BUILDER_STEP_META.map((step, index) => {
            const isActive = step.id === currentStep
            const isComplete = index < currentIndex
            const isPulsing = pulseIndex === index
            const canNavigateBack = isComplete && Boolean(onStepClick)

            const badgeClassName = `flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold transition-colors duration-500 ${
              isActive
                ? 'bg-brand-pink text-white shadow-md shadow-brand-pink/30'
                : isComplete
                  ? 'bg-bloom-sage text-bloom-ink'
                  : 'bg-surface text-bloom-ink/40 ring-1 ring-bloom-rose/20'
            } ${isPulsing ? 'animate-step-pulse' : ''}`

            const labelClassName = `text-[10px] font-medium sm:text-xs ${
              isActive
                ? 'text-bloom-ink'
                : isComplete
                  ? 'text-bloom-ink/70'
                  : 'text-bloom-ink/40'
            }`

            return (
              <li key={step.id} className="flex flex-col items-center text-center">
                {canNavigateBack ? (
                  <button
                    type="button"
                    data-testid={`step-nav-${step.id}`}
                    aria-label={`Go back to ${step.label}`}
                    onClick={() => onStepClick?.(step.id)}
                    className="group flex flex-col items-center rounded-lg px-1 py-0.5 text-center transition hover:bg-bloom-rose/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink/40"
                  >
                    <span className="relative mb-1 inline-flex">
                      <span className={`${badgeClassName} group-hover:bg-bloom-sage/90`}>
                        ✓
                      </span>
                      <StepSparkles visible={isPulsing} />
                    </span>
                    <span className={`${labelClassName} group-hover:text-bloom-ink`}>
                      {step.label}
                    </span>
                  </button>
                ) : (
                  <>
                    <span
                      className="relative mb-1 inline-flex"
                      aria-current={isActive ? 'step' : undefined}
                    >
                      <span className={badgeClassName}>
                        {isComplete ? '✓' : index + 1}
                      </span>
                      <StepSparkles visible={isPulsing} />
                    </span>
                    <span className={labelClassName}>{step.label}</span>
                  </>
                )}
              </li>
            )
          })}
        </ol>
      </div>

      {stepNote ? (
        <p className="-mt-4 text-center text-sm font-semibold text-bloom-ink">{stepNote}</p>
      ) : null}
    </nav>
  )
}
