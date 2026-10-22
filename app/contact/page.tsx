import Link from 'next/link'

import { CONTACT_EMAIL, CONTACT_MAILTO, CONTACT_NAME } from '@/lib/site'

export const metadata = {
  title: 'Contact',
  description: 'Contact Dheeraj Kumar about Bloom: bugs, ideas, or a little hello.',
}

export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-2xl space-y-6 px-6 py-16 text-bloom-ink">
      <h1 className="font-display text-4xl">Say hello to the human behind the flowers</h1>
      <p>
        Found a bug? Have an idea? Bouquet looking more like a confused salad?
        Contact {CONTACT_NAME}.
      </p>
      <p>
        Dheeraj might read your email before lunch. If lunch wins, please forgive
        the very human behind this very digital flower shop.
      </p>
      <a href={CONTACT_MAILTO} className="inline-block break-all underline underline-offset-4">
        {CONTACT_EMAIL}
      </a>
      <p className="text-sm text-bloom-ink/70">
        No ticket numbers, no support robot, and no promised response time.
        For bugs, include what happened and your browser/device. Please leave
        private gift links and personal notes out of your email.
      </p>
      <Link href="/" className="inline-block underline">Back to Bloom</Link>
    </main>
  )
}
