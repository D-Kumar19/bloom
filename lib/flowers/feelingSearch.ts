import { FLOWERS } from './flowers'

const KEYWORD_MAP: Record<string, string[]> = {
  love: ['rose'],
  romance: ['rose'],
  grateful: ['peony', 'camellia', 'carnation'],
  gratitude: ['peony', 'camellia'],
  thank: ['peony', 'camellia', 'daisy'],
  first: ['tulip'],
  morning: ['tulip'],
  thought: ['tulip'],
  friend: ['daisy', 'sunflower'],
  light: ['daisy', 'sunflower'],
  calm: ['lily', 'lavender', 'lotus'],
  peace: ['lavender', 'lotus'],
  sympathy: ['lily', 'lotus'],
  strength: ['lily', 'lotus'],
  resilience: ['lotus'],
  growth: ['lotus'],
  rare: ['orchid'],
  admire: ['orchid', 'camellia'],
  respect: ['orchid', 'camellia'],
  joy: ['sunflower', 'daisy'],
  warmth: ['sunflower'],
  celebrate: ['sunflower', 'peony'],
  sorry: ['lily', 'lavender'],
  apology: ['lily', 'lavender'],
  memory: ['carnation', 'cherry-blossom'],
  farewell: ['cherry-blossom'],
  fleeting: ['cherry-blossom'],
  gentle: ['peony', 'lavender'],
  honest: ['daisy', 'kraft'],
}

export function searchFlowersByFeeling(query: string): string[] {
  const normalized = query.trim().toLowerCase()
  if (!normalized) {
    return []
  }

  const matched = new Set<string>()

  for (const flower of FLOWERS) {
    const haystack = `${flower.name} ${flower.meaning} ${flower.perfectFor}`.toLowerCase()
    if (haystack.includes(normalized)) {
      matched.add(flower.id)
    }
  }

  for (const [keyword, flowerIds] of Object.entries(KEYWORD_MAP)) {
    if (normalized.includes(keyword) || keyword.includes(normalized)) {
      for (const id of flowerIds) {
        matched.add(id)
      }
    }
  }

  return [...matched]
}
