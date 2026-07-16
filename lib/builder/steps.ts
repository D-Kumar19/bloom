import type { BuilderStep } from '@/lib/types'

export const BUILDER_STEPS: BuilderStep[] = [
  'bouquet',
  'card',
  'message',
  'theme',
  'share',
]

export const BUILDER_STEP_META: { id: BuilderStep; label: string }[] = [
  { id: 'bouquet', label: 'Bouquet' },
  { id: 'card', label: 'Note' },
  { id: 'message', label: 'Message' },
  { id: 'theme', label: 'Backdrop' },
  { id: 'share', label: 'Share' },
]

export const BUILDER_STEP_NOTES: Partial<Record<BuilderStep, string>> = {
  bouquet: 'Pick the bouquet that fits the moment',
  card: 'Every bouquet deserves a love note',
  message: 'Now say what your heart already knows',
  theme: 'Set the mood when they open it',
  share: 'Your bouquet is ready to send',
}
