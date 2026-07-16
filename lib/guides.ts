import type { BouquetState } from './types'
import { DEFAULT_BOUQUET_ID } from '@/lib/bouquets'

export type GuidePreset = {
  slug: string
  title: string
  subtitle: string
  paragraph: string
  state: BouquetState
}

const base = (overrides: Partial<BouquetState>): BouquetState => ({
  bouquetId: DEFAULT_BOUQUET_ID,
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
      'Crimson roses and ivory accents say what words sometimes cannot. Pair with a midnight card for a message that feels intimate and true.',
    state: base({
      bouquetId: 'crimson-and-cream',
      cardStyle: 'midnight',
      theme: 'midnight',
    }),
  },
  {
    slug: 'birthday',
    title: 'Birthday Bouquets That Mean Something',
    subtitle: 'Celebrate the day they arrived',
    paragraph:
      'Golden sunflowers and wild greenery for someone who lights up every room. A garden card keeps it celebratory without feeling generic.',
    state: base({
      bouquetId: 'sunflower-burst',
      cardStyle: 'garden',
      theme: 'sunset',
    }),
  },
  {
    slug: 'thank-you',
    title: 'Flowers That Say Thank You Better Than Words',
    subtitle: 'Gratitude, gently expressed',
    paragraph:
      'Soft blush peonies feel warm and sincere. Kraft paper and a blush backdrop keep the tone honest and grounded.',
    state: base({
      bouquetId: 'blush-peony-cloud',
      cardStyle: 'kraft',
      theme: 'blush',
    }),
  },
  {
    slug: 'get-well',
    title: 'Sending Strength Through Flowers',
    subtitle: 'Comfort for hard days',
    paragraph:
      'White lilies carry calm and resilience. Watercolor tones feel gentle, like a quiet hand on the shoulder.',
    state: base({
      bouquetId: 'white-lily-still',
      cardStyle: 'watercolor',
      theme: 'sage',
    }),
  },
  {
    slug: 'im-sorry',
    title: "When Words Aren't Enough",
    subtitle: 'A softer way to say sorry',
    paragraph:
      'White roses and eucalyptus create space for humility and care. Keep the message simple. Sincerity is the point.',
    state: base({
      bouquetId: 'eucalyptus-and-white',
      cardStyle: 'classic-cream',
      theme: 'lavender',
    }),
  },
  {
    slug: 'just-because',
    title: 'No Occasion Needed',
    subtitle: 'Because they crossed your mind',
    paragraph:
      'Sometimes the most meaningful bouquets arrive on an ordinary Tuesday. Cheerful daisies and an ocean-calm theme.',
    state: base({
      bouquetId: 'cheerful-daisy-mix',
      cardStyle: 'garden',
      theme: 'ocean',
    }),
  },
]

export const GUIDE_MAP = new Map(GUIDES.map((g) => [g.slug, g]))
