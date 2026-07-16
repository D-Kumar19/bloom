export type SoundtrackId =
  | 'none'
  | 'rain'
  | 'thunderstorm'
  | 'piano'
  | 'instrumental'
  | 'wind'
  | 'warm-room'
  | 'cafe'

export type SoundtrackOption = {
  id: SoundtrackId
  label: string
  description: string
}

export const SOUNDTRACK_SOURCES: Record<Exclude<SoundtrackId, 'none'>, string> = {
  rain: '/sounds/rain.mp3',
  thunderstorm: '/sounds/thunderstorm.mp3',
  piano: '/sounds/piano.mp3',
  instrumental: '/sounds/instrumental.mp3',
  wind: '/sounds/wind.mp3',
  'warm-room': '/sounds/warm-room.mp3',
  cafe: '/sounds/cafe.mp3',
}

export const SOUNDTRACK_OPTIONS: SoundtrackOption[] = [
  { id: 'none', label: 'Silent', description: 'No ambient sound' },
  { id: 'rain', label: 'Soft rain', description: 'Gentle rainfall on a still night' },
  { id: 'thunderstorm', label: 'Thunderstorm', description: 'Distant thunder with steady rain' },
  { id: 'piano', label: 'Piano', description: 'Slow, reflective piano' },
  {
    id: 'instrumental',
    label: 'Instrumental',
    description: 'Soft instrumental bed for a quiet moment',
  },
  { id: 'wind', label: 'Wind', description: 'Soft breeze through the trees' },
  { id: 'warm-room', label: 'Warm room', description: 'Campfire crackle on a quiet evening' },
  { id: 'cafe', label: 'Cafe', description: 'Muted café chatter in the background' },
]

export function getSoundtrackSrc(id: Exclude<SoundtrackId, 'none'>): string {
  return SOUNDTRACK_SOURCES[id]
}

export function isSoundtrackId(value: string): value is SoundtrackId {
  return SOUNDTRACK_OPTIONS.some((option) => option.id === value)
}
