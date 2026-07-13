import type { Greenery } from '../types'

export const GREENERY: Greenery[] = [
  {
    id: 'leafy',
    name: 'Lush Leaves',
    image: '/greenery/leafy.png?v=2',
    meaning: 'A garden in full bloom. For someone who makes everything grow.',
    fact: 'Tropical leaves can grow up to 25 meters long in the wild.',
    perfectFor:
      'Romantic bouquets, thank-yous, or anyone who brings warmth and life into a room.',
  },
  {
    id: 'fern',
    name: 'Fern Fronds',
    image: '/greenery/fern.png?v=2',
    meaning: 'Wild and untamed. For the free spirit.',
    fact: 'Ferns are older than dinosaurs, over 360 million years old.',
    perfectFor:
      'Free spirits, nature lovers, birthdays, or bouquets with a woodland, untamed feel.',
  },
  {
    id: 'eucalyptus',
    name: 'Eucalyptus',
    image: '/greenery/eucalyptus.png?v=2',
    meaning: 'Clean and calm. For the one who is your peace.',
    fact: 'Koalas sleep 22 hours a day because eucalyptus takes so long to digest.',
    perfectFor:
      'Get-well wishes, minimalist tastes, spa-day vibes, or someone who needs a deep breath.',
  },
  {
    id: 'willow',
    name: 'Willow Sprigs',
    image: '/greenery/willow.png?v=2',
    meaning: 'Graceful and flowing. Bends but never breaks.',
    fact: 'Willow bark was the original source of aspirin.',
    perfectFor:
      'Encouragement, sympathy, graduation, or honoring someone who has been through a lot.',
  },
  {
    id: 'olive',
    name: 'Olive Branch',
    image: '/greenery/olive.png?v=1',
    meaning: 'Timeless and wise. For words that carry weight.',
    fact: 'Some olive trees in the Mediterranean are over 2,000 years old.',
    perfectFor: 'Thank-you bouquets, mentors, or anyone with classic, understated taste.',
  },
  {
    id: 'babys-breath',
    name: "Baby's Breath",
    image: '/greenery/babys-breath.png?v=1',
    meaning: 'The gentle whisper between your flowers.',
    fact: 'A single plant can produce over 10,000 tiny blooms.',
    perfectFor: 'Weddings, innocence, first loves, or delicate, dreamy emotions.',
  },
]

export const GREENERY_MAP = new Map(GREENERY.map((g) => [g.id, g]))

export function getGreeneryById(id: string): Greenery | undefined {
  return GREENERY_MAP.get(id)
}
