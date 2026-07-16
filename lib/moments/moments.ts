import type { BouquetState } from '../types'
import { DEFAULT_BOUQUET_ID } from '../bouquets'

export type Moment = {
  id: string
  text: string
  preset: Partial<BouquetState>
}

const base = (overrides: Partial<BouquetState>): Partial<BouquetState> => ({
  bouquetId: DEFAULT_BOUQUET_ID,
  cardStyle: 'classic-cream',
  theme: 'warm',
  ...overrides,
})

export const MOMENTS: Moment[] = [
  {
    id: 'new-job',
    text: 'Your friend got the job they were terrified they would not get',
    preset: base({
      bouquetId: 'sunflower-burst',
      cardStyle: 'garden',
      theme: 'sunset',
    }),
  },
  {
    id: 'surgery-well',
    text: "Your dad's surgery went well",
    preset: base({
      bouquetId: 'white-lily-still',
      cardStyle: 'watercolor',
      theme: 'sage',
    }),
  },
  {
    id: 'wedding-kindness',
    text: 'Your ex was unexpectedly kind to you at a wedding',
    preset: base({
      bouquetId: 'pastel-spring',
      cardStyle: 'linen',
      theme: 'blush',
    }),
  },
  {
    id: 'long-distance',
    text: 'You miss someone who lives in another time zone',
    preset: base({
      bouquetId: 'dusty-lavender',
      cardStyle: 'midnight',
      theme: 'midnight',
    }),
  },
  {
    id: 'bad-week',
    text: 'Someone you love had a week that broke them a little',
    preset: base({
      bouquetId: 'eucalyptus-and-white',
      cardStyle: 'classic-cream',
      theme: 'lavender',
    }),
  },
  {
    id: 'teacher-thanks',
    text: 'A teacher changed how you see yourself',
    preset: base({
      bouquetId: 'blush-peony-cloud',
      cardStyle: 'kraft',
      theme: 'warm',
    }),
  },
  {
    id: 'new-parent',
    text: 'Your sister just became a parent and you are proud and scared for her',
    preset: base({
      bouquetId: 'pastel-spring',
      cardStyle: 'blush',
      theme: 'blush',
    }),
  },
  {
    id: 'apology-repair',
    text: 'You need to apologize without making it about you',
    preset: base({
      bouquetId: 'white-lily-still',
      cardStyle: 'classic-cream',
      theme: 'sage',
    }),
  },
  {
    id: 'ordinary-tuesday',
    text: 'It is an ordinary Tuesday and they deserve to know they matter',
    preset: base({
      bouquetId: 'wildflower-field',
      cardStyle: 'garden',
      theme: 'ocean',
    }),
  },
  {
    id: 'graduation',
    text: 'Someone you love is graduating and you want them to feel seen',
    preset: base({
      bouquetId: 'tulip-riot',
      cardStyle: 'rose-gold',
      theme: 'sunset',
    }),
  },
  {
    id: 'first-date-nerves',
    text: 'Your friend is nervous before a first date and you want them to feel brave',
    preset: base({
      bouquetId: 'red-rose-classic',
      cardStyle: 'blush',
      theme: 'warm',
    }),
  },
  {
    id: 'grief-anniversary',
    text: 'Today marks a loss they never fully got over',
    preset: base({
      bouquetId: 'dried-herbal',
      cardStyle: 'vintage',
      theme: 'lavender',
    }),
  },
]

export const MOMENT_MAP = new Map(MOMENTS.map((m) => [m.id, m]))
