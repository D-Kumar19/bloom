import { Button } from '@/components/ui/Button'

export const metadata = {
  title: 'About',
  description: 'Why Bloom exists: a simple, account-free way to send a digital bouquet and a personal note.',
}

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-2xl space-y-6 px-6 py-16 text-bloom-ink">
      <h1 className="font-display text-4xl">A feeling, made into a gift</h1>
      <p>Bloom is a small digital-gifting project: choose a bouquet, write what you mean,
        and send someone a link they can open without an account.</p>
      <p>These are not physical flowers. They are a way to make a birthday wish, a thank-you,
        or a quiet “thinking of you” feel considered rather than hurried.</p>
      <p>Bloom is still in pre-release. The focus is a reliable, simple gifting experience,
        not more accounts, uploads, or choices to work through.</p>
      <Button href="/create">Create a bouquet</Button>
    </main>
  )
}
