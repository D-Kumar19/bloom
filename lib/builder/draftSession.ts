import { isValidBouquetState } from '@/lib/sharing/encode'
import type { BouquetState, BuilderStep } from '@/lib/types'

export const BUILDER_DRAFT_KEY = 'bloom-bouquet'
export const BUILDER_STEP_KEY = 'bloom-builder-step'
export const BUILDER_OPEN_SHARE_KEY = 'bloom-open-share'

export function saveBuilderDraft(state: BouquetState, step: BuilderStep = 'share'): void {
  sessionStorage.setItem(BUILDER_DRAFT_KEY, JSON.stringify(state))
  sessionStorage.setItem(BUILDER_STEP_KEY, step)
}

export function clearBuilderDraft(): void {
  sessionStorage.removeItem(BUILDER_DRAFT_KEY)
  sessionStorage.removeItem(BUILDER_STEP_KEY)
  sessionStorage.removeItem(BUILDER_OPEN_SHARE_KEY)
}

export function markReturnToShareStep(): void {
  sessionStorage.setItem(BUILDER_OPEN_SHARE_KEY, '1')
}

export function restoreShareDraftIfPresent(
  setState: (value: BouquetState | ((current: BouquetState) => BouquetState)) => void,
  setStep: (step: BuilderStep) => void,
): boolean {
  const shouldRestore =
    sessionStorage.getItem(BUILDER_OPEN_SHARE_KEY) === '1' ||
    sessionStorage.getItem(BUILDER_STEP_KEY) === 'share'

  if (!shouldRestore) {
    return false
  }

  sessionStorage.removeItem(BUILDER_OPEN_SHARE_KEY)

  const saved = sessionStorage.getItem(BUILDER_DRAFT_KEY)
  if (!saved) {
    return false
  }

  try {
    const parsed: unknown = JSON.parse(saved)
    if (!isValidBouquetState(parsed)) {
      return false
    }

    setState((current) => ({ ...current, ...parsed }))
    setStep('share')
    return true
  } catch {
    return false
  }
}
