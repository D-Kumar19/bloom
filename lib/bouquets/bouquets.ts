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

export const BOUQUET_MEANING_NOTE =
  'These are suggestions, not universal flower meanings. Personal taste and cultural associations matter more; your note gives the bouquet its meaning.'

export const BOUQUETS: Bouquet[] = [
  {
    id: 'red-rose-classic',
    name: 'Red Rose Classic',
    tagline: 'Deep red roses, green leaves, and a warm paper wrap.',
    description:
      'Deep crimson rose heads sit close together above green leaves, framed by warm brown and red paper. A rich, rounded choice for a heartfelt note.',
    meaning: 'Steady affection: "I still choose you."',
    facts: [
      'Closely gathered crimson rose heads',
      'Green leaves and small pale accents',
      'Layered brown and red wrapping',
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
      'Ruffled pink peonies and smaller pale blooms form a soft, rounded cloud. A blush ribbon and fine greenery keep the picture gentle rather than formal.',
    meaning: 'For the person who makes everything feel lighter.',
    facts: [
      'Blush and pale pink peonies',
      'Loose dome shape with airy greenery',
      'Layered petals and a trailing blush ribbon',
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
      'Dusty mauve roses sit among lavender-colored stems, ruffled blooms, and rounded green leaves. A muted purple palette for affection without a bright-red declaration.',
    meaning: 'Missing someone is its own kind of love.',
    facts: [
      'Lavender stems with muted roses',
      'Rounded green leaves around the flowers',
      'A mix of ruffled petals and fine purple sprigs',
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
      'Crimson roses and open, pointed red blooms contrast with cream roses and dark greenery. Layered wrapping gives this richly colored arrangement a more formal feel.',
    meaning: 'Passion with grace. Bold, but never loud.',
    facts: [
      'Crimson roses with cream accents',
      'Open, pointed red petals among the roses',
      'Dark foliage and layered paper wrapping',
    ],
    perfectFor: 'Anniversaries, date-night notes, and heartfelt declarations',
    mood: 'romantic',
    thumbnailImage: '/bouquets/crimson-and-cream-thumb.png',
    heroImage: '/bouquets/crimson-and-cream-hero.png',
  },
  {
    id: 'sunflower-burst',
    name: 'Sunflower Burst',
    tagline: 'Golden sunflowers with wild greenery.',
    description:
      'Broad golden sunflower heads share the frame with smaller yellow and orange flowers, pale accents, and green leaves. Bright and full, with no confetti to sweep up.',
    meaning: '"I am cheering you on."',
    facts: [
      'Golden sunflowers as the focal bloom',
      'Wild greenery and an organic shape',
      'Yellow and orange accents with tiny pale flowers',
    ],
    perfectFor: 'Congratulations, good news, and cheering someone on',
    mood: 'celebration',
    thumbnailImage: '/bouquets/sunflower-burst-thumb.png',
    heroImage: '/bouquets/sunflower-burst-hero.png',
  },
  {
    id: 'tulip-riot',
    name: 'Tulip Riot',
    tagline: 'Mixed-color tulips in a bright spring wrap.',
    description:
      'Pink, yellow, orange, purple, and pale tulips gather into a tall, rounded bunch. Green leaves and bright pink wrapping make this the colorful market-stall choice.',
    meaning: 'Celebration does not need a reason. This is the reason.',
    facts: [
      'Mixed-color tulips in a spring wrap',
      'Clean stems with bright overlapping petals',
      'Bright pink paper inside a brown outer wrap',
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
      'Angular orange bird-of-paradise flowers rise above vivid pink orchids, red accents, and broad green leaves. An upright, sculptural option when soft pastels are not their thing.',
    meaning: 'For milestones that deserve something unforgettable.',
    facts: [
      'Bird of paradise and orchid focal blooms',
      'Bold tropical foliage throughout',
      'Orange, pink, red, and yellow accents',
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
      'Ruffled pink blooms, pale roses, and little white-and-yellow flowers sit in cream wrapping. A full, soft-edged mix with the lightness of a spring palette.',
    meaning: 'New beginnings wrapped in soft color.',
    facts: [
      'Pale roses and ruffled pink blooms',
      'Soft mixed palette across the bouquet',
      'Cream wrapping and a pale ribbon',
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
      'Open white lilies and tall closed buds stand among green leaves and small pale flowers. Cream wrapping keeps the palette quiet, leaving room for a thoughtful note.',
    meaning: 'Quiet strength. A gentle hand when words fall short.',
    facts: [
      'White lilies with soft greenery',
      'Cream wrap for a calm presentation',
      'Open flowers alongside tall closed buds',
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
      'White rose heads nestle among rounded, silvery-green eucalyptus leaves in a brown paper wrap. A restrained white-and-green choice for a gentle check-in.',
    meaning: 'Peace. That is what you bring, even from far away.',
    facts: [
      'White roses with silver-dollar eucalyptus',
      'Minimal palette with an open composition',
      'Brown paper framing the white-and-green palette',
    ],
    perfectFor: 'Gentle check-ins, sympathy, and "I\'m here" from far away',
    mood: 'sympathy',
    thumbnailImage: '/bouquets/eucalyptus-and-white-thumb.png',
    heroImage: '/bouquets/eucalyptus-and-white-hero.png',
  },
  {
    id: 'dried-herbal',
    name: 'Dried Herbal',
    tagline: 'Dried lavender, wheat, and muted botanicals.',
    description:
      'Wheat-colored grasses, small pale seed heads, and muted purple sprigs fan out from a brown paper wrap. An earthy, textured alternative to fresh-looking petals.',
    meaning: 'A quiet gesture of company, without asking someone to feel better.',
    facts: [
      'Wheat-colored stems and muted purple sprigs',
      'Muted herbal tones throughout',
      'Small pale seed heads and feathery grasses',
    ],
    perfectFor: 'Quiet check-ins, a difficult week, and company without fanfare',
    mood: 'sympathy',
    thumbnailImage: '/bouquets/dried-herbal-thumb.png',
    heroImage: '/bouquets/dried-herbal-hero.png',
  },
  {
    id: 'wildflower-field',
    name: 'Wildflower Field',
    tagline: 'Loose meadow blooms tied with twine.',
    description:
      'Small white daisies, blue-purple blooms, and fine grasses form an open, uneven silhouette. A loose meadow-style bunch for an informal "you crossed my mind."',
    meaning: 'You crossed my mind today. That is all. That is everything.',
    facts: [
      'White-and-yellow flowers with blue-purple accents',
      'Twine tie for an informal feel',
      'Fine grasses and an open, uneven outline',
    ],
    perfectFor: 'Tuesday check-ins, inside jokes, and "saw this and thought of you"',
    mood: 'just-because',
    thumbnailImage: '/bouquets/wildflower-field-thumb.png',
    heroImage: '/bouquets/wildflower-field-hero.png',
  },
  {
    id: 'single-stem-poppy',
    name: 'Single Stem Poppy',
    tagline: 'One red poppy, fine greenery, and a pale paper wrap.',
    description:
      'One open red poppy stands above fine green stems and curved buds, framed by pale paper. The simplest flower choice here: small on purpose, not short on thought.',
    meaning: 'Small gesture. Big feeling. Sometimes one is enough.',
    facts: [
      'Single red poppy as the focal bloom',
      'Fine greenery with curved, unopened buds',
      'Pale paper around a narrow arrangement',
    ],
    perfectFor: 'Crushes, quick hellos, and when less says more',
    mood: 'just-because',
    thumbnailImage: '/bouquets/single-stem-poppy-thumb.png',
    heroImage: '/bouquets/single-stem-poppy-hero.png',
  },
  {
    id: 'garden-herb',
    name: 'Garden Herb',
    tagline: 'Leafy herbs, tiny pale flowers, and a twine tie.',
    description:
      'A leafy green bunch mixes broad leaves, fine upright sprigs, and tiny pale flowers, tied with twine. Garden-gathered character, without needing a garden.',
    meaning: 'Ordinary days made extraordinary. Just because.',
    facts: [
      'Broad leaves and fine upright green sprigs',
      'Earthy, gathered-from-the-yard feel',
      'Tiny pale flowers and a visible twine tie',
    ],
    perfectFor: 'Neighbors, coworkers, and ordinary days you want to honor',
    mood: 'just-because',
    thumbnailImage: '/bouquets/garden-herb-thumb.png',
    heroImage: '/bouquets/garden-herb-hero.png',
  },
  {
    id: 'cheerful-daisy-mix',
    name: 'Cheerful Daisy Mix',
    tagline: 'White-and-yellow daisy shapes in a bright, leafy mix.',
    description:
      'White petals with yellow centers sit beside all-yellow flowers and small pale accents. Green leaves and brown wrapping give the bright mix an easy, everyday feel.',
    meaning: 'Lightness on purpose. A smile in flower form.',
    facts: [
      'White petals with bright yellow centers',
      'Bright yellow centers and airy filler',
      'All-yellow flowers and a brown paper wrap',
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
