export type BouquetMood = 'romantic' | 'celebration' | 'sympathy' | 'just-because'

export type Bouquet = {
  id: string
  name: string
  tagline: string
  meaning: string
  mood: BouquetMood
  thumbnailImage: string
  heroImage: string
}

export const BOUQUET_MOODS: { id: BouquetMood; label: string }[] = [
  { id: 'romantic', label: 'Romantic' },
  { id: 'celebration', label: 'Celebration' },
  { id: 'sympathy', label: 'Sympathy & Calm' },
  { id: 'just-because', label: 'Just Because' },
]

export const BOUQUETS: Bouquet[] = [
  {
    id: 'red-rose-classic',
    name: 'Red Rose Classic',
    tagline: 'Twelve deep red roses, wrapped in kraft paper.',
    meaning: 'The bouquet that needs no translation. Love, plainly spoken.',
    mood: 'romantic',
    thumbnailImage: '/bouquets/red-rose-classic-thumb.png',
    heroImage: '/bouquets/red-rose-classic-hero.png',
  },
  {
    id: 'blush-peony-cloud',
    name: 'Blush Peony Cloud',
    tagline: 'Soft pink peonies in a loose, airy dome.',
    meaning: 'For the person who makes everything feel lighter.',
    mood: 'romantic',
    thumbnailImage: '/bouquets/blush-peony-cloud-thumb.png',
    heroImage: '/bouquets/blush-peony-cloud-hero.png',
  },
  {
    id: 'dusty-lavender',
    name: 'Dusty Lavender',
    tagline: 'Lavender stems with muted roses and eucalyptus.',
    meaning: 'Missing someone is its own kind of love.',
    mood: 'romantic',
    thumbnailImage: '/bouquets/dusty-lavender-thumb.png',
    heroImage: '/bouquets/dusty-lavender-hero.png',
  },
  {
    id: 'crimson-and-cream',
    name: 'Crimson and Cream',
    tagline: 'Deep red blooms with ivory accents and ribbon.',
    meaning: 'Passion with grace. Bold, but never loud.',
    mood: 'romantic',
    thumbnailImage: '/bouquets/crimson-and-cream-thumb.png',
    heroImage: '/bouquets/crimson-and-cream-hero.png',
  },
  {
    id: 'sunflower-burst',
    name: 'Sunflower Burst',
    tagline: 'Golden sunflowers with wild greenery.',
    meaning: 'Pure joy. The kind that fills a whole room.',
    mood: 'celebration',
    thumbnailImage: '/bouquets/sunflower-burst-thumb.png',
    heroImage: '/bouquets/sunflower-burst-hero.png',
  },
  {
    id: 'tulip-riot',
    name: 'Tulip Riot',
    tagline: 'Mixed-color tulips in a bright spring wrap.',
    meaning: 'Celebration does not need a reason. This is the reason.',
    mood: 'celebration',
    thumbnailImage: '/bouquets/tulip-riot-thumb.png',
    heroImage: '/bouquets/tulip-riot-hero.png',
  },
  {
    id: 'tropical-bright',
    name: 'Tropical Bright',
    tagline: 'Bird of paradise, orchids, and bold tropical leaves.',
    meaning: 'For milestones that deserve something unforgettable.',
    mood: 'celebration',
    thumbnailImage: '/bouquets/tropical-bright-thumb.png',
    heroImage: '/bouquets/tropical-bright-hero.png',
  },
  {
    id: 'pastel-spring',
    name: 'Pastel Spring',
    tagline: 'Pale pink, butter yellow, and white in a garden mix.',
    meaning: 'New beginnings wrapped in soft color.',
    mood: 'celebration',
    thumbnailImage: '/bouquets/pastel-spring-thumb.png',
    heroImage: '/bouquets/pastel-spring-hero.png',
  },
  {
    id: 'white-lily-still',
    name: 'White Lily Still',
    tagline: 'White lilies and soft greenery on cream paper.',
    meaning: 'Quiet strength. A gentle hand when words fall short.',
    mood: 'sympathy',
    thumbnailImage: '/bouquets/white-lily-still-thumb.png',
    heroImage: '/bouquets/white-lily-still-hero.png',
  },
  {
    id: 'eucalyptus-and-white',
    name: 'Eucalyptus and White',
    tagline: 'White roses with silver-dollar eucalyptus.',
    meaning: 'Peace. That is what you bring, even from far away.',
    mood: 'sympathy',
    thumbnailImage: '/bouquets/eucalyptus-and-white-thumb.png',
    heroImage: '/bouquets/eucalyptus-and-white-hero.png',
  },
  {
    id: 'dried-herbal',
    name: 'Dried Herbal',
    tagline: 'Dried lavender, wheat, and muted botanicals.',
    meaning: 'Calm that lasts. For someone who needs to breathe.',
    mood: 'sympathy',
    thumbnailImage: '/bouquets/dried-herbal-thumb.png',
    heroImage: '/bouquets/dried-herbal-hero.png',
  },
  {
    id: 'wildflower-field',
    name: 'Wildflower Field',
    tagline: 'Loose meadow blooms tied with twine.',
    meaning: 'You crossed my mind today. That is all. That is everything.',
    mood: 'just-because',
    thumbnailImage: '/bouquets/wildflower-field-thumb.png',
    heroImage: '/bouquets/wildflower-field-hero.png',
  },
  {
    id: 'single-stem-poppy',
    name: 'Single Stem Poppy',
    tagline: 'One perfect red poppy in a simple glass wrap.',
    meaning: 'Small gesture. Big feeling. Sometimes one is enough.',
    mood: 'just-because',
    thumbnailImage: '/bouquets/single-stem-poppy-thumb.png',
    heroImage: '/bouquets/single-stem-poppy-hero.png',
  },
  {
    id: 'garden-herb',
    name: 'Garden Herb',
    tagline: 'Herbs, daisies, and soft greens from the garden.',
    meaning: 'Ordinary days made extraordinary. Just because.',
    mood: 'just-because',
    thumbnailImage: '/bouquets/garden-herb-thumb.png',
    heroImage: '/bouquets/garden-herb-hero.png',
  },
  {
    id: 'cheerful-daisy-mix',
    name: 'Cheerful Daisy Mix',
    tagline: 'White daisies with yellow centers and baby\'s breath.',
    meaning: 'Lightness on purpose. A smile in flower form.',
    mood: 'just-because',
    thumbnailImage: '/bouquets/cheerful-daisy-mix-thumb.png',
    heroImage: '/bouquets/cheerful-daisy-mix-hero.png',
  },
]

export const BOUQUET_MAP = new Map(BOUQUETS.map((bouquet) => [bouquet.id, bouquet]))

export function getBouquetById(id: string): Bouquet | undefined {
  return BOUQUET_MAP.get(id)
}

export function bouquetExists(id: string): boolean {
  return BOUQUET_MAP.has(id)
}

export function getBouquetsByMood(mood: BouquetMood): Bouquet[] {
  return BOUQUETS.filter((bouquet) => bouquet.mood === mood)
}

export const DEFAULT_BOUQUET_ID = BOUQUETS[0].id
