import type { Flower } from './types'

export const FLOWERS: Flower[] = [
  {
    id: 'rose',
    name: 'Rose',
    image: '/flowers/rose.png',
    meaning: "I love you. That's it. That's the whole message.",
    fact: 'Cleopatra covered the floor in rose petals to welcome Mark Antony. Victorians used rose color as a secret love code.',
    perfectFor:
      'Romance, anniversaries, Valentine\'s Day, or simply telling someone they matter deeply.',
  },
  {
    id: 'peony',
    name: 'Peony',
    image: '/flowers/peony.png',
    meaning: 'You deserve all the good things coming your way.',
    fact: 'In China, peonies are called the "king of flowers" and symbolize honor and prosperity.',
    perfectFor:
      'Weddings, new beginnings, congratulations, or cheering someone up on a hard day.',
  },
  {
    id: 'tulip',
    name: 'Tulip',
    image: '/flowers/tulip.png?v=3',
    meaning: 'You were my first thought this morning.',
    fact: 'During the 1600s, tulips were more valuable than gold in Holland — a single bulb could buy a house.',
    perfectFor:
      "Early relationships, spring birthdays, or brightening someone's ordinary Tuesday.",
  },
  {
    id: 'daisy',
    name: 'Daisy',
    image: '/flowers/daisy.png?v=3',
    meaning: 'You make ordinary days feel extraordinary.',
    fact: 'Daisies are actually two flowers in one — the white petals and yellow center are separate blooms fused together.',
    perfectFor:
      'Friendships, thank-yous, children, or anyone who brings lightness to your life.',
  },
  {
    id: 'lily',
    name: 'Lily',
    image: '/flowers/lily.png',
    meaning: 'You carry grace in everything you do.',
    fact: 'Lilies have been cultivated for over 3,000 years and appear in art from ancient Egypt to the Renaissance.',
    perfectFor:
      "Sympathy, remembrance, funerals, or honoring someone's quiet strength.",
  },
  {
    id: 'orchid',
    name: 'Orchid',
    image: '/flowers/orchid.png?v=3',
    meaning: "You're rare. And I notice.",
    fact: 'Orchid seeds are so tiny that a single pod can hold millions of them — among the smallest seeds in the plant kingdom.',
    perfectFor:
      'Admiration, mentors, someone you deeply respect, or a love that feels once-in-a-lifetime.',
  },
  {
    id: 'camellia',
    name: 'Camellia',
    image: '/flowers/camellia.png?v=3',
    meaning: 'I admire you more than you know.',
    fact: 'Camellias bloom in winter when little else does — a quiet show of devotion in the coldest months.',
    perfectFor:
      'Gratitude, teachers, parents, or anyone who showed up for you when no one else did.',
  },
  {
    id: 'lotus',
    name: 'Lotus',
    image: '/flowers/lotus.png?v=3',
    meaning: "You grew through everything. And you're still beautiful.",
    fact: 'Lotus flowers grow from mud and murky water, rising clean each morning — a symbol of resilience across cultures.',
    perfectFor:
      'Recovery, encouragement, someone overcoming hardship, or celebrating personal growth.',
  },
  {
    id: 'sunflower',
    name: 'Sunflower',
    image: '/flowers/sunflower.png',
    meaning: 'You are the warmth I always turn toward.',
    fact: 'Young sunflowers track the sun across the sky each day — a phenomenon called heliotropism.',
    perfectFor:
      'Friendship, get-well-soon, kids, or someone going through a dark time who needs light.',
  },
  {
    id: 'lavender',
    name: 'Lavender',
    image: '/flowers/lavender.png?v=3',
    meaning: "Peace. That's what you bring me.",
    fact: 'Lavender has been used for over 2,500 years — Romans added it to baths, and its name comes from the Latin "lavare," to wash.',
    perfectFor:
      'Calm wishes, stress relief, apologies, or telling someone "take care of yourself."',
  },
  {
    id: 'carnation',
    name: 'Carnation',
    image: '/flowers/carnation.png?v=3',
    meaning: "I'll never forget what you did for me.",
    fact: 'Carnations have been worn on lapels since the 1900s to honor mothers, soldiers, and loved ones far away.',
    perfectFor:
      "Mother's Day, teachers, gratitude, or honoring someone who sacrificed for you.",
  },
  {
    id: 'cherry-blossom',
    name: 'Cherry Blossom',
    image: '/flowers/cherry-blossom.png?v=3',
    meaning: "Beautiful because it doesn't last forever.",
    fact: 'Cherry blossoms bloom for only about two weeks each year — in Japan, hanami gatherings celebrate their fleeting beauty.',
    perfectFor:
      'Farewells, graduation, moving away, or celebrating a fleeting but precious moment.',
  },
]

export const FLOWER_MAP = new Map(FLOWERS.map((f) => [f.id, f]))

export function getFlowerById(id: string): Flower | undefined {
  return FLOWER_MAP.get(id)
}
