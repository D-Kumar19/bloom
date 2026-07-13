import type { BouquetState } from './types'

export type GuidePreset = {
  slug: string
  title: string
  subtitle: string
  paragraph: string
  state: BouquetState
}

const base = (overrides: Partial<BouquetState>): BouquetState => ({
  flowers: ['rose', 'peony', 'tulip'],
  greenery: 'leafy',
  cardStyle: 'classic-cream',
  to: '',
  message: '',
  from: '',
  theme: 'warm',
  ...overrides,
})

export const GUIDES: GuidePreset[] = [
  {
    slug: 'love-letter',
    title: 'How to Say I Love You with Flowers',
    subtitle: 'A love letter in petals',
    paragraph:
      'Seven roses whisper what words sometimes cannot. Pair them with deep greenery and a midnight card for a message that feels intimate and true.',
    state: base({
      flowers: ['rose', 'rose', 'rose', 'peony', 'tulip', 'orchid', 'lily'],
      greenery: 'leafy',
      cardStyle: 'midnight',
      theme: 'midnight',
    }),
  },
  {
    slug: 'birthday',
    title: 'Birthday Bouquets That Mean Something',
    subtitle: 'Celebrate the day they arrived',
    paragraph:
      'Bright, joyful flowers for someone who lights up every room. Golden tones and a garden card keep it celebratory without feeling generic.',
    state: base({
      flowers: ['daisy', 'tulip', 'peony', 'camellia'],
      greenery: 'fern',
      cardStyle: 'garden',
      theme: 'sunset',
    }),
  },
  {
    slug: 'thank-you',
    title: 'Flowers That Say Thank You Better Than Words',
    subtitle: 'Gratitude, gently expressed',
    paragraph:
      'Soft peonies and daisies feel warm and sincere. Eucalyptus greenery and kraft paper keep the tone honest and grounded.',
    state: base({
      flowers: ['peony', 'daisy', 'daisy', 'lily'],
      greenery: 'eucalyptus',
      cardStyle: 'kraft',
      theme: 'blush',
    }),
  },
  {
    slug: 'get-well',
    title: 'Sending Strength Through Flowers',
    subtitle: 'Comfort for hard days',
    paragraph:
      'Lilies and lotus carry calm and resilience. Willow greenery and watercolor tones feel gentle, like a quiet hand on the shoulder.',
    state: base({
      flowers: ['lily', 'lotus', 'lotus', 'orchid'],
      greenery: 'willow',
      cardStyle: 'watercolor',
      theme: 'sage',
    }),
  },
  {
    slug: 'im-sorry',
    title: "When Words Aren't Enough",
    subtitle: 'A softer way to say sorry',
    paragraph:
      'White-toned blooms and quiet lavender create space for humility and care. Keep the message simple. Sincerity is the point.',
    state: base({
      flowers: ['lily', 'daisy', 'orchid', 'camellia'],
      greenery: 'eucalyptus',
      cardStyle: 'classic-cream',
      theme: 'lavender',
    }),
  },
  {
    slug: 'just-because',
    title: 'No Occasion Needed',
    subtitle: 'Because they crossed your mind',
    paragraph:
      'Sometimes the most meaningful bouquets arrive on an ordinary Tuesday. Playful flowers, leafy greenery, and an ocean-calm theme.',
    state: base({
      flowers: ['daisy', 'tulip', 'peony', 'camellia'],
      greenery: 'leafy',
      cardStyle: 'garden',
      theme: 'ocean',
    }),
  },
]

export const GUIDE_MAP = new Map(GUIDES.map((g) => [g.slug, g]))
