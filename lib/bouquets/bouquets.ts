export type BouquetMood = 'romantic' | 'celebration' | 'sympathy' | 'just-because'

export type Bouquet = {
  id: string
  name: string
  tagline: string
  description: string
  meaning: string
  facts: string[]
  perfectFor: string
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
    description:
      'A dozen roses in deep crimson, wrapped simply. No filler, no apology. The classic gesture, done honestly.',
    meaning: 'The bouquet that needs no translation. Love, plainly spoken.',
    facts: [
      '12 long-stem red roses',
      'Kraft paper wrap with satin ribbon',
      'Roses symbolize love and devotion',
    ],
    perfectFor: 'Anniversaries, Valentine\'s Day, and "I still choose you" messages',
    mood: 'romantic',
    thumbnailImage: '/bouquets/red-rose-classic-thumb.png',
    heroImage: '/bouquets/red-rose-classic-hero.png',
  },
  {
    id: 'blush-peony-cloud',
    name: 'Blush Peony Cloud',
    tagline: 'Soft pink peonies in a loose, airy dome.',
    description:
      'Oversized peony heads in the softest pink, loosely gathered so the bouquet feels light in the hand.',
    meaning: 'For the person who makes everything feel lighter.',
    facts: [
      'Blush and pale pink peonies',
      'Loose dome shape with airy greenery',
      'Peonies bloom briefly, which makes them feel even more special',
    ],
    perfectFor: 'New love, spring birthdays, and making someone\'s day softer',
    mood: 'romantic',
    thumbnailImage: '/bouquets/blush-peony-cloud-thumb.png',
    heroImage: '/bouquets/blush-peony-cloud-hero.png',
  },
  {
    id: 'dusty-lavender',
    name: 'Dusty Lavender',
    tagline: 'Lavender stems with muted roses and eucalyptus.',
    description:
      'Muted lavender stems with dusty roses and eucalyptus. Romantic without being loud.',
    meaning: 'Missing someone is its own kind of love.',
    facts: [
      'Lavender stems with muted roses',
      'Eucalyptus for texture and calm',
      'Lavender is tied to devotion and remembrance',
    ],
    perfectFor: 'Long-distance love, missing someone, and quiet "thinking of you" notes',
    mood: 'romantic',
    thumbnailImage: '/bouquets/dusty-lavender-thumb.png',
    heroImage: '/bouquets/dusty-lavender-hero.png',
  },
  {
    id: 'crimson-and-cream',
    name: 'Crimson and Cream',
    tagline: 'Deep red blooms with ivory accents and ribbon.',
    description:
      'Deep red blooms balanced with ivory roses and a satin ribbon. Passionate, but composed.',
    meaning: 'Passion with grace. Bold, but never loud.',
    facts: [
      'Crimson roses with cream accents',
      'Contrasting wrap and ribbon detail',
      'Red for desire, white for sincerity',
    ],
    perfectFor: 'Date nights, apologies done right, and bold declarations',
    mood: 'romantic',
    thumbnailImage: '/bouquets/crimson-and-cream-thumb.png',
    heroImage: '/bouquets/crimson-and-cream-hero.png',
  },
  {
    id: 'sunflower-burst',
    name: 'Sunflower Burst',
    tagline: 'Golden sunflowers with wild greenery.',
    description:
      'Sunflowers turned toward the light, with wild greenery spilling out. Impossible to open without smiling.',
    meaning: 'Pure joy. The kind that fills a whole room.',
    facts: [
      'Golden sunflowers as the focal bloom',
      'Wild greenery and an organic shape',
      'Sunflowers symbolize loyalty and joy',
    ],
    perfectFor: 'Congratulations, good news, and cheering someone up fast',
    mood: 'celebration',
    thumbnailImage: '/bouquets/sunflower-burst-thumb.png',
    heroImage: '/bouquets/sunflower-burst-hero.png',
  },
  {
    id: 'tulip-riot',
    name: 'Tulip Riot',
    tagline: 'Mixed-color tulips in a bright spring wrap.',
    description:
      'A joyful mix of tulip colors, wrapped like you grabbed them from the best stall at the market.',
    meaning: 'Celebration does not need a reason. This is the reason.',
    facts: [
      'Mixed-color tulips in a spring wrap',
      'Clean stems with bright overlapping petals',
      'Tulips mean perfect love and cheerful news',
    ],
    perfectFor: 'Birthdays, promotions, and celebrating for no reason at all',
    mood: 'celebration',
    thumbnailImage: '/bouquets/tulip-riot-thumb.png',
    heroImage: '/bouquets/tulip-riot-hero.png',
  },
  {
    id: 'tropical-bright',
    name: 'Tropical Bright',
    tagline: 'Bird of paradise, orchids, and bold tropical leaves.',
    description:
      'Bird of paradise, orchids, and glossy tropical leaves. For moments that deserve something unforgettable.',
    meaning: 'For milestones that deserve something unforgettable.',
    facts: [
      'Bird of paradise and orchid focal blooms',
      'Bold tropical foliage throughout',
      'Tropical arrangements signal celebration and admiration',
    ],
    perfectFor: 'Big milestones, graduations, and "you did something huge" energy',
    mood: 'celebration',
    thumbnailImage: '/bouquets/tropical-bright-thumb.png',
    heroImage: '/bouquets/tropical-bright-hero.png',
  },
  {
    id: 'pastel-spring',
    name: 'Pastel Spring',
    tagline: 'Pale pink, butter yellow, and white in a garden mix.',
    description:
      'Pale pink, butter yellow, and white in a loose garden mix. Feels like the first warm week of the year.',
    meaning: 'New beginnings wrapped in soft color.',
    facts: [
      'Pastel garden roses and seasonal fillers',
      'Soft mixed palette across the bouquet',
      'Light colors read as hope and new beginnings',
    ],
    perfectFor: 'Baby showers, new homes, and fresh starts',
    mood: 'celebration',
    thumbnailImage: '/bouquets/pastel-spring-thumb.png',
    heroImage: '/bouquets/pastel-spring-hero.png',
  },
  {
    id: 'white-lily-still',
    name: 'White Lily Still',
    tagline: 'White lilies and soft greenery on cream paper.',
    description:
      'White lilies on cream paper with quiet greenery. Dignified, gentle, and unhurried.',
    meaning: 'Quiet strength. A gentle hand when words fall short.',
    facts: [
      'White lilies with soft greenery',
      'Cream wrap for a calm presentation',
      'Lilies often carry sympathy and restored hope',
    ],
    perfectFor: 'Condolences, difficult news, and sitting with someone in grief',
    mood: 'sympathy',
    thumbnailImage: '/bouquets/white-lily-still-thumb.png',
    heroImage: '/bouquets/white-lily-still-hero.png',
  },
  {
    id: 'eucalyptus-and-white',
    name: 'Eucalyptus and White',
    tagline: 'White roses with silver-dollar eucalyptus.',
    description:
      'White roses nestled in silver eucalyptus. Peaceful, clean, and steady.',
    meaning: 'Peace. That is what you bring, even from far away.',
    facts: [
      'White roses with silver-dollar eucalyptus',
      'Minimal palette with an open composition',
      'Eucalyptus adds calm and a sense of protection',
    ],
    perfectFor: 'Hospital check-ins, sympathy, and "I\'m here" from far away',
    mood: 'sympathy',
    thumbnailImage: '/bouquets/eucalyptus-and-white-thumb.png',
    heroImage: '/bouquets/eucalyptus-and-white-hero.png',
  },
  {
    id: 'dried-herbal',
    name: 'Dried Herbal',
    tagline: 'Dried lavender, wheat, and muted botanicals.',
    description:
      'Dried lavender, wheat, and muted botanicals that feel like a deep breath.',
    meaning: 'Calm that lasts. For someone who needs to breathe.',
    facts: [
      'Dried lavender and wheat stems',
      'Muted herbal tones throughout',
      'Dried flowers symbolize lasting comfort',
    ],
    perfectFor: 'Burnout recovery, anxiety, and sending calm without fanfare',
    mood: 'sympathy',
    thumbnailImage: '/bouquets/dried-herbal-thumb.png',
    heroImage: '/bouquets/dried-herbal-hero.png',
  },
  {
    id: 'wildflower-field',
    name: 'Wildflower Field',
    tagline: 'Loose meadow blooms tied with twine.',
    description:
      'Loose meadow stems tied with twine, like you walked through a field and picked what caught your eye.',
    meaning: 'You crossed my mind today. That is all. That is everything.',
    facts: [
      'Mixed meadow blooms and seasonal color',
      'Twine tie for an informal feel',
      'Wildflowers suggest spontaneity and affection',
    ],
    perfectFor: 'Tuesday check-ins, inside jokes, and "saw this and thought of you"',
    mood: 'just-because',
    thumbnailImage: '/bouquets/wildflower-field-thumb.png',
    heroImage: '/bouquets/wildflower-field-hero.png',
  },
  {
    id: 'single-stem-poppy',
    name: 'Single Stem Poppy',
    tagline: 'One perfect red poppy in a simple glass wrap.',
    description:
      'One perfect poppy in a simple glass wrap. Small on purpose. The feeling is not small.',
    meaning: 'Small gesture. Big feeling. Sometimes one is enough.',
    facts: [
      'Single red poppy as the focal bloom',
      'Minimal glass-style wrap',
      'One stem can read more intimate than a dozen',
    ],
    perfectFor: 'Crushes, quick hellos, and when less says more',
    mood: 'just-because',
    thumbnailImage: '/bouquets/single-stem-poppy-thumb.png',
    heroImage: '/bouquets/single-stem-poppy-hero.png',
  },
  {
    id: 'garden-herb',
    name: 'Garden Herb',
    tagline: 'Herbs, daisies, and soft greens from the garden.',
    description:
      'Herbs, daisies, and soft greens from the garden. Homemade energy without the mess.',
    meaning: 'Ordinary days made extraordinary. Just because.',
    facts: [
      'Herbs, daisies, and soft garden greens',
      'Earthy, gathered-from-the-yard feel',
      'Herbs add warmth and an everyday intimacy',
    ],
    perfectFor: 'Neighbors, coworkers, and ordinary days you want to honor',
    mood: 'just-because',
    thumbnailImage: '/bouquets/garden-herb-thumb.png',
    heroImage: '/bouquets/garden-herb-hero.png',
  },
  {
    id: 'cheerful-daisy-mix',
    name: 'Cheerful Daisy Mix',
    tagline: 'White daisies with yellow centers and baby\'s breath.',
    description:
      'White daisies with yellow centers and baby\'s breath. Lightness on purpose.',
    meaning: 'Lightness on purpose. A smile in flower form.',
    facts: [
      'White daisies with baby\'s breath',
      'Bright yellow centers and airy filler',
      'Daisies symbolize innocence and cheerful affection',
    ],
    perfectFor: 'Pick-me-ups, kid-at-heart friends, and simple joy',
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
