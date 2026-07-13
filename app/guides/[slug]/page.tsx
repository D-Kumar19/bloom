import { notFound } from 'next/navigation'

import { Button } from '@/components/ui/Button'
import { GUIDE_MAP } from '@/lib/guides'
import { encodeBouquet } from '@/lib/sharing'

type GuidePageProps = {
  params: Promise<{ slug: string }>
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params
  const guide = GUIDE_MAP.get(slug)

  if (!guide) {
    notFound()
  }

  const preset = encodeBouquet(guide.state)

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <p className="text-sm uppercase tracking-wide text-bloom-rose">Guide</p>
      <h1 className="mt-2 font-display text-4xl text-bloom-ink">{guide.title}</h1>
      <p className="mt-2 text-lg text-bloom-ink/70">{guide.subtitle}</p>
      <p className="mt-6 leading-relaxed text-bloom-ink/80">{guide.paragraph}</p>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Button href={`/create?preset=${preset}`}>Use this bouquet</Button>
        <Button href="/guides" variant="ghost">
          All guides
        </Button>
      </div>
    </main>
  )
}
