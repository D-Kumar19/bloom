import Link from 'next/link'
import type { ReactNode } from 'react'

import { Button } from '@/components/ui/Button'

export function TemplatesInvitation() {
  return (
    <section className="mt-14 rounded-3xl border border-bloom-rose/20 bg-surface-muted p-6 text-center md:p-10">
      <h2 className="font-display text-2xl">Want a little starting magic?</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-bloom-ink/75">
        Explore occasion templates with flowers, stationery, and a backdrop already paired.
        Your words stay yours, and every choice is editable.
      </p>
      <Button magical href="/templates" variant="ghost" className="mt-5 rounded-full">
        Explore templates
      </Button>
    </section>
  )
}

export function DiscoveryPage({
  title,
  introduction,
  children,
  templates = true,
}: {
  title: string
  introduction: string
  children: ReactNode
  templates?: boolean
}) {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12 text-bloom-ink md:py-16">
      <Link href="/explore" className="text-sm underline underline-offset-4">All things Bloom</Link>
      <header className="my-8 max-w-2xl space-y-4">
        <h1 className="font-display text-4xl md:text-5xl">{title}</h1>
        <p className="leading-relaxed text-bloom-ink/80">{introduction}</p>
      </header>
      {children}
      <div className="mt-10">
        <Button magical href="/create?new=1" className="rounded-full">Start a new bouquet</Button>
        <p className="mt-3 text-sm text-bloom-ink/70">
          Start with the flowers. If you have a saved draft, we will ask before replacing it.
        </p>
      </div>
      {templates ? <TemplatesInvitation /> : null}
    </main>
  )
}
