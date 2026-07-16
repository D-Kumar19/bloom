import { isValidBouquetState } from '@/lib/sharing/encode'
import type { BouquetState, BuilderStep } from '@/lib/types'

/** @deprecated Legacy sessionStorage keys; migrated on read. */
export const BUILDER_DRAFT_KEY = 'bloom-bouquet'
export const BUILDER_STEP_KEY = 'bloom-builder-step'
export const BUILDER_OPEN_SHARE_KEY = 'bloom-open-share'

export const BUILDER_DRAFT_STORAGE_KEY = 'bloom-builder-draft'

/** Drafts older than this are cleared on restore. */
export const BUILDER_DRAFT_TTL_MS = 24 * 60 * 60 * 1000

type StoredDraft = {
  v: 1
  savedAt: number
  state: BouquetState
  step: BuilderStep
}

function canUseStorage(storage: Storage | undefined): storage is Storage {
  return typeof storage !== 'undefined'
}

function readEnvelope(raw: string | null): StoredDraft | null {
  if (!raw) {
    return null
  }

  try {
    const parsed: unknown = JSON.parse(raw)
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      (parsed as StoredDraft).v !== 1 ||
      typeof (parsed as StoredDraft).savedAt !== 'number' ||
      !isValidBouquetState((parsed as StoredDraft).state) ||
      typeof (parsed as StoredDraft).step !== 'string'
    ) {
      return null
    }

    return parsed as StoredDraft
  } catch {
    return null
  }
}

function isExpired(savedAt: number, now = Date.now()): boolean {
  return now - savedAt > BUILDER_DRAFT_TTL_MS
}

function readLegacySessionDraft(): StoredDraft | null {
  if (!canUseStorage(typeof sessionStorage !== 'undefined' ? sessionStorage : undefined)) {
    return null
  }

  const shouldRestore =
    sessionStorage.getItem(BUILDER_OPEN_SHARE_KEY) === '1' ||
    sessionStorage.getItem(BUILDER_STEP_KEY) === 'share'

  if (!shouldRestore) {
    return null
  }

  const saved = sessionStorage.getItem(BUILDER_DRAFT_KEY)
  if (!saved) {
    return null
  }

  try {
    const parsed: unknown = JSON.parse(saved)
    if (!isValidBouquetState(parsed)) {
      return null
    }

    return {
      v: 1,
      savedAt: Date.now(),
      state: parsed,
      step: 'share',
    }
  } catch {
    return null
  }
}

function clearLegacySessionDraft(): void {
  if (!canUseStorage(typeof sessionStorage !== 'undefined' ? sessionStorage : undefined)) {
    return
  }

  sessionStorage.removeItem(BUILDER_DRAFT_KEY)
  sessionStorage.removeItem(BUILDER_STEP_KEY)
  sessionStorage.removeItem(BUILDER_OPEN_SHARE_KEY)
}

export function saveBuilderDraft(state: BouquetState, step: BuilderStep = 'share'): void {
  if (!canUseStorage(typeof localStorage !== 'undefined' ? localStorage : undefined)) {
    return
  }

  const envelope: StoredDraft = {
    v: 1,
    savedAt: Date.now(),
    state,
    step,
  }

  localStorage.setItem(BUILDER_DRAFT_STORAGE_KEY, JSON.stringify(envelope))
  clearLegacySessionDraft()
}

export function clearBuilderDraft(): void {
  if (canUseStorage(typeof localStorage !== 'undefined' ? localStorage : undefined)) {
    localStorage.removeItem(BUILDER_DRAFT_STORAGE_KEY)
  }

  clearLegacySessionDraft()
}

export function markReturnToShareStep(): void {
  if (!canUseStorage(typeof sessionStorage !== 'undefined' ? sessionStorage : undefined)) {
    return
  }

  sessionStorage.setItem(BUILDER_OPEN_SHARE_KEY, '1')
}

function readStoredDraft(): StoredDraft | null {
  if (canUseStorage(typeof localStorage !== 'undefined' ? localStorage : undefined)) {
    const envelope = readEnvelope(localStorage.getItem(BUILDER_DRAFT_STORAGE_KEY))
    if (envelope) {
      return envelope
    }
  }

  return readLegacySessionDraft()
}

export function restoreShareDraftIfPresent(
  setState: (value: BouquetState | ((current: BouquetState) => BouquetState)) => void,
  setStep: (step: BuilderStep) => void,
): boolean {
  const openSharePending =
    canUseStorage(typeof sessionStorage !== 'undefined' ? sessionStorage : undefined) &&
    sessionStorage.getItem(BUILDER_OPEN_SHARE_KEY) === '1'

  const draft = readStoredDraft()
  if (!draft) {
    if (openSharePending) {
      clearBuilderDraft()
    }
    return false
  }

  if (isExpired(draft.savedAt)) {
    clearBuilderDraft()
    return false
  }

  if (draft.step !== 'share' && !openSharePending) {
    return false
  }

  clearLegacySessionDraft()
  setState((current) => ({ ...current, ...draft.state }))
  setStep('share')
  return true
}
