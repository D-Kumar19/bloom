import { SUPPORT_EMAIL } from '@/lib/site'

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="font-display text-3xl text-bloom-ink">Contact</h1>
      <p className="mt-4 text-bloom-ink/70">
        Questions, feedback, or licensing requests:{' '}
        <a href={`mailto:${SUPPORT_EMAIL}`} className="text-brand-pink hover:underline">
          {SUPPORT_EMAIL}
        </a>
      </p>
    </main>
  )
}
