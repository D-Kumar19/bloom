import { BUILDER_STEPS } from '@/lib/builder/steps'
import { canProceedMessageStep } from '@/lib/message'
import { isValidBouquetDraft } from '@/lib/sharing/encode'
import type { BouquetState, BuilderStep } from '@/lib/types'

/** @deprecated Legacy sessionStorage keys; migrated on read. */
export const BUILDER_DRAFT_KEY = 'bloom-bouquet'
export const BUILDER_STEP_KEY = 'bloom-builder-step'
export const BUILDER_OPEN_SHARE_KEY = 'bloom-open-share'
export const BUILDER_DRAFT_STORAGE_KEY = 'bloom-builder-draft'
export const BUILDER_DRAFT_TTL_MS = 24 * 60 * 60 * 1000

type StoredDraft = {
  v: 1
  savedAt: number
  state: BouquetState
  step: BuilderStep
  startedFromPreset?: boolean
}

function isBuilderStep(value: unknown): value is BuilderStep {
  return BUILDER_STEPS.some((step) => step === value)
}

function readEnvelope(raw: string | null): StoredDraft | null {
  if (!raw) return null
  try {
    const parsed: unknown = JSON.parse(raw)
    if (
      parsed &&
      typeof parsed === 'object' &&
      'v' in parsed &&
      parsed.v === 1 &&
      'savedAt' in parsed &&
      typeof parsed.savedAt === 'number' &&
      Number.isFinite(parsed.savedAt) &&
      parsed.savedAt <= Date.now() &&
      'state' in parsed &&
      isValidBouquetDraft(parsed.state) &&
      'step' in parsed &&
      isBuilderStep(parsed.step)
    ) {
      return {
        v: 1,
        savedAt: parsed.savedAt,
        state: parsed.state,
        step: parsed.step,
        startedFromPreset: 'startedFromPreset' in parsed && parsed.startedFromPreset === true,
      }
    }
  } catch {
    // Invalid JSON is handled like an invalid envelope below.
  }
  console.warn('Invalid Bloom draft was discarded.')
  localStorage.removeItem(BUILDER_DRAFT_STORAGE_KEY)
  return null
}

function readLegacySessionDraft(): StoredDraft | null {
  const saved = readSessionValue(BUILDER_DRAFT_KEY)
  if (!saved) return null
  try {
    const parsed: unknown = JSON.parse(saved)
    const step = readSessionValue(BUILDER_STEP_KEY)
    if (isValidBouquetDraft(parsed)) {
      return {
        v: 1,
        savedAt: Date.now(),
        state: parsed,
        step: isBuilderStep(step) ? step : 'bouquet',
      }
    }
  } catch {
    // Invalid legacy JSON is discarded, not restored as an empty gift.
  }
  console.warn('Invalid legacy Bloom draft was discarded.')
  clearLegacySessionDraft()
  return null
}

function clearLegacySessionDraft(): void {
  try {
    sessionStorage.removeItem(BUILDER_DRAFT_KEY)
    sessionStorage.removeItem(BUILDER_STEP_KEY)
    sessionStorage.removeItem(BUILDER_OPEN_SHARE_KEY)
  } catch {
    console.warn(
      'Bloom could not clear legacy session storage. The local draft is unchanged.'
    )
  }
}

function readSessionValue(key: string): string | null {
  try {
    return sessionStorage.getItem(key)
  } catch {
    console.warn(
      'Bloom session storage is unavailable; using the local draft without a preview return marker.'
    )
    return null
  }
}

// Storage access errors intentionally reach the builder's visible recovery warning.
export function saveBuilderDraft(
  state: BouquetState,
  step: BuilderStep = 'share',
  startedFromPreset = false,
): void {
  const envelope: StoredDraft = { v: 1, savedAt: Date.now(), state, step, startedFromPreset }
  localStorage.setItem(BUILDER_DRAFT_STORAGE_KEY, JSON.stringify(envelope))
  clearLegacySessionDraft()
}

export function clearBuilderDraft(): void {
  localStorage.removeItem(BUILDER_DRAFT_STORAGE_KEY)
  clearLegacySessionDraft()
}

export function markReturnToShareStep(): void {
  try {
    sessionStorage.setItem(BUILDER_OPEN_SHARE_KEY, '1')
  } catch {
    console.warn(
      'Bloom could not save the preview return marker. The saved draft is unchanged.'
    )
  }
}

export function restoreBuilderDraft(
  setState: (
    value: BouquetState | ((current: BouquetState) => BouquetState)
  ) => void,
  setStep: (step: BuilderStep) => void,
  setStartedFromPreset?: (value: boolean) => void,
): boolean {
  const raw = localStorage.getItem(BUILDER_DRAFT_STORAGE_KEY)
  const stored = readEnvelope(raw)
  const draft = stored ?? readLegacySessionDraft()
  if (!draft) return false
  if (Date.now() - draft.savedAt > BUILDER_DRAFT_TTL_MS) {
    clearBuilderDraft()
    return false
  }

  const openSharePending = readSessionValue(BUILDER_OPEN_SHARE_KEY) === '1'
  let step = openSharePending ? 'share' : draft.step
  if (
    (step === 'theme' || step === 'share') &&
    !canProceedMessageStep(
      draft.state.to,
      draft.state.from,
      draft.state.message
    )
  ) {
    step = 'message'
  }
  if (!stored) {
    saveBuilderDraft(draft.state, step)
  } else {
    clearLegacySessionDraft()
  }
  setState((current) => ({ ...current, ...draft.state }))
  setStep(step)
  setStartedFromPreset?.(draft.startedFromPreset === true)
  return true
}

/** @deprecated Restores every builder step, not just share. */
export const restoreShareDraftIfPresent = restoreBuilderDraft
