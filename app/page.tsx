import Image from 'next/image'
import Link from 'next/link'
import { BouquetCounter } from '@/components/landing/BouquetCounter'
import { Button } from '@/components/ui/Button'
import { DEFAULT_BOUQUET_ID, getBouquetById } from '@/lib/bouquets'
import { getBouquetCount } from '@/lib/counter'
import { buildShareUrl } from '@/lib/sharing'
import { HOME_PRIVACY_LINE } from '@/lib/site'

export const dynamic = 'force-dynamic'

export default async function LandingPage() {
  const bouquetCount = await getBouquetCount()
  const exampleShareUrl = new URL(buildShareUrl({
    bouquetId: DEFAULT_BOUQUET_ID,
    cardStyle: 'classic-cream',
    theme: 'warm',
    to: 'Mira',
    from: 'Jules',
    message: 'A little color for your day.\n\nWish I could bring these over in person. Until then, here is a small way of saying: I am thinking of you.',
    soundtrack: 'none',
  }))
  const exampleUrl = `${exampleShareUrl.pathname}${exampleShareUrl.search}${exampleShareUrl.hash}`
  const primary = getBouquetById('sunflower-burst')!
  const secondary = getBouquetById('single-stem-poppy')!

  return (
    <main className="bloom-home flex-1">
      <section className="bloom-home__hero" aria-labelledby="home-title">
        <div className="bloom-home__invitation">
          <p className="bloom-eyebrow">Digital flowers. A real gesture.</p>
          <h1 id="home-title">Not there?<br />Still care.</h1>
          <p className="bloom-home__intro">
            Send a little color across the distance. Choose their flowers, write your words,
            and give them a moment that&apos;s just theirs.
          </p>
          <Button href="/create" className="bloom-home__cta">
            Create your bouquet <span aria-hidden="true">↗</span>
          </Button>
          <Link href={exampleUrl} className="bloom-home__example">Open an example bouquet</Link>
          <p className="bloom-home__privacy">{HOME_PRIVACY_LINE}</p>
          <BouquetCounter initialCount={bouquetCount} compact />
        </div>
        <div className="bloom-home__gallery" aria-label="A little of what you can send">
          <p className="bloom-home__aside">For a brighter day.</p>
          <figure className="bloom-artwork bloom-home__photo bloom-home__photo--main">
            <Image src={primary.heroImage} alt={primary.name} width={1024} height={1536}
              priority sizes="(max-width: 760px) 58vw, 32vw" />
          </figure>
          <figure className="bloom-artwork bloom-home__photo bloom-home__photo--small">
            <Image src={secondary.heroImage} alt={secondary.name} width={1024} height={1536}
              sizes="(max-width: 760px) 32vw, 18vw" />
          </figure>
          <p className="bloom-home__gallery-caption">Chosen by you. Opened by them.</p>
        </div>
      </section>
      <section className="bloom-home__principles" aria-label="The gesture">
        <p><span className="bloom-eyebrow">The flowers /</span> Chosen by you.</p>
        <p><span className="bloom-eyebrow">The note /</span> Only you could write it.</p>
        <p><span className="bloom-eyebrow">The link /</span> Their moment, anywhere.</p>
      </section>
    </main>
  )
}
