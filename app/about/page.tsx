import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { publicPageMetadata } from '@/lib/pageMetadata'

export const metadata = publicPageMetadata({
  title: 'About',
  description:
    'Why Bloom exists: a simple, account-free way to send a digital bouquet and a personal note.',
  path: '/about',
})

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-2xl space-y-8 px-6 py-12 leading-relaxed text-bloom-ink md:py-16">
      <header className="space-y-3">
        <p className="text-sm font-medium text-bloom-ink/70">A little about Bloom</p>
        <h1 className="font-display text-4xl">A feeling, made into a gift</h1>
        <p>A birthday wish, a thank-you, or a quiet “thinking of you”.
          Bloom helps you turn it into a digital bouquet and a note that feels like you.</p>
      </header>
      <section className="space-y-4 rounded-3xl border border-bloom-rose/20 bg-surface-muted p-6">
        <h2 className="font-display text-2xl"><span aria-hidden="true">💐 </span>A small gift, in three parts</h2>
        <ol className="list-decimal space-y-4 pl-5">
          <li><strong>Make it theirs.</strong> Choose flowers and a note style.
            Prefer a starting point? Pick an editable template.</li>
          <li><strong>Make it personal.</strong> Add your names and 2-200 words,
            then choose a backdrop. Sound is optional.</li>
          <li><strong>Send a little joy.</strong> Preview the gift, then share its link.
            They can open it without an account.</li>
        </ol>
      </section>
      <section className="space-y-3">
        <h2 className="font-display text-2xl"><span aria-hidden="true">🌷 </span>Real thought. Digital flowers.</h2>
        <p>There is no physical delivery: your gift opens in a browser.
          The flowers are digital; the reason you picked them is yours.</p>
        <p>Bloom is still in pre-release. The focus is a reliable, simple gifting experience,
          not more accounts, uploads, or choices to work through.</p>
      </section>
      <section className="space-y-3">
        <h2 className="font-display text-2xl"><span aria-hidden="true">🔗 </span>A quick note before sharing</h2>
        <p>Anyone with a gift link can read it, including someone it is forwarded to.
          Keep sensitive details out of your note.</p>
        <Link href="/privacy" className="underline underline-offset-4">Understand gift-link privacy</Link>
      </section>
      <div className="flex flex-wrap items-center gap-4">
        <Button href="/create?new=1">Create a bouquet</Button>
        <Link href="/templates" className="underline underline-offset-4">Find a template</Link>
      </div>
    </main>
  )
}
