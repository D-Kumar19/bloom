import Link from 'next/link'

import { CONTACT_EMAIL, CONTACT_MAILTO, CONTACT_NAME } from '@/lib/site'

export const metadata = {
  title: 'Contact',
  description: 'Contact Dheeraj Kumar about Bloom: bugs, ideas, or a little hello.',
}

export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-2xl space-y-8 px-6 py-12 leading-relaxed text-bloom-ink md:py-16">
      <header className="space-y-3">
        <p className="text-sm font-medium text-bloom-ink/70">Questions, ideas, or a little hello</p>
        <h1 className="font-display text-4xl">Say hello to the human behind the flowers</h1>
        <p>Found a bug? Have an idea? Bouquet looking more like a confused salad?
          Contact {CONTACT_NAME}.</p>
      </header>
      <section className="space-y-3 rounded-3xl border border-bloom-rose/20 bg-surface-muted p-6">
        <h2 className="font-display text-2xl"><span aria-hidden="true">✉️ </span>Email Dheeraj</h2>
        <p>Tap the address to open your email app, or copy it into the one you use.</p>
        <a href={CONTACT_MAILTO} className="inline-block break-all underline underline-offset-4">
          {CONTACT_EMAIL}
        </a>
        <p className="text-sm text-bloom-ink/70">No ticket numbers, no support robot, and no promised response time.</p>
      </section>
      <section className="space-y-3">
        <h2 className="font-display text-2xl"><span aria-hidden="true">🐛 </span>Something not working?</h2>
        <p>A few details make a bug much easier to find:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Which page or builder step you were on.</li>
          <li>What you tried, what you expected, and what happened instead.</li>
          <li>Your browser and device, plus any error message you saw.</li>
        </ul>
        <p className="text-sm text-bloom-ink/70">Please leave private gift links and personal notes out of your email.
          If you include a screenshot, hide names, notes, and gift URLs first.</p>
      </section>
      <section className="space-y-3">
        <h2 className="font-display text-2xl"><span aria-hidden="true">💡 </span>An idea taking root?</h2>
        <p>Tell me what would make gifting feel easier or more personal.
          A small suggestion is welcome; no polished pitch needed.</p>
        <p>Dheeraj might read your email before lunch. If lunch wins, please forgive
          the very human behind this very digital flower shop.</p>
      </section>
      <Link href="/" className="inline-block underline">Back to Bloom</Link>
    </main>
  )
}
