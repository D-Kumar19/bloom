import type { BouquetState } from '../types'

export type MoodId =
  | 'grateful'
  | 'missing-you'
  | 'sorry'
  | 'celebrating'
  | 'worried'
  | 'just-because'

export type MoodOption = {
  id: MoodId
  label: string
  emoji: string
  handoff: string
  tintClass: string
  preset: Partial<BouquetState>
}

/** Pastel tile backgrounds stay light in dark mode; ink must not follow theme foreground. */
export const FEELING_TILE_INK = 'text-[#3d2f2f]'
export const FEELING_TILE_INK_MUTED = 'text-[#3d2f2f]/65'

export const MOODS: MoodOption[] = [
  {
    id: 'grateful',
    label: 'Grateful',
    emoji: '🙏',
    handoff: 'Say thank you without saying too much',
    tintClass: 'bg-amber-50/80 border-amber-200/60',
    preset: {
      bouquetId: 'blush-peony-cloud',
      cardStyle: 'kraft',
      theme: 'blush',
    },
  },
  {
    id: 'missing-you',
    label: 'Missing you',
    emoji: '🌙',
    handoff: 'For the person who is far away',
    tintClass: 'bg-indigo-50/80 border-indigo-200/50',
    preset: {
      bouquetId: 'dusty-lavender',
      cardStyle: 'midnight',
      theme: 'midnight',
    },
  },
  {
    id: 'sorry',
    label: 'Sorry',
    emoji: '🕊️',
    handoff: 'A softer way to say you mean it',
    tintClass: 'bg-stone-50/90 border-stone-200/60',
    preset: {
      bouquetId: 'white-lily-still',
      cardStyle: 'classic-cream',
      theme: 'lavender',
    },
  },
  {
    id: 'celebrating',
    label: 'Celebrating',
    emoji: '🎉',
    handoff: 'Joy that does not need a speech',
    tintClass: 'bg-orange-50/80 border-orange-200/50',
    preset: {
      bouquetId: 'sunflower-burst',
      cardStyle: 'garden',
      theme: 'sunset',
    },
  },
  {
    id: 'worried',
    label: 'Worried',
    emoji: '🤍',
    handoff: 'Strength for someone on a hard day',
    tintClass: 'bg-sky-50/80 border-sky-200/50',
    preset: {
      bouquetId: 'eucalyptus-and-white',
      cardStyle: 'watercolor',
      theme: 'sage',
    },
  },
  {
    id: 'just-because',
    label: 'Just because',
    emoji: '✨',
    handoff: 'They crossed your mind today',
    tintClass: 'bg-pink-50/80 border-pink-200/50',
    preset: {
      bouquetId: 'cheerful-daisy-mix',
      cardStyle: 'garden',
      theme: 'warm',
    },
  },
]

const MOOD_MAP = new Map(MOODS.map((m) => [m.id, m]))

export function isMoodId(value: string): value is MoodId {
  return MOOD_MAP.has(value as MoodId)
}

export function getMoodById(id: string): MoodOption | undefined {
  return MOOD_MAP.get(id as MoodId)
}

export function applyMoodPreset(
  current: BouquetState,
  moodId: MoodId,
): BouquetState {
  const mood = MOOD_MAP.get(moodId)
  if (!mood) {
    return current
  }
  return { ...current, ...mood.preset }
}
