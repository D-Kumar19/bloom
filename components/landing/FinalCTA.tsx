import Link from 'next/link'

import { Button } from '@/components/ui/Button'
import { ShareFeelingButton } from '@/components/landing/ShareFeelingButton'

export function FinalCTA() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 text-center md:py-20">
      <h2 className="font-display text-3xl text-bloom-ink">
        Ready to send something real?
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm text-bloom-ink/65">
        Your bouquet lives in the link you share. That is the whole trick.
      </p>
      <div className="mt-8 flex flex-col items-center gap-4">
        <Button href="/create" className="rounded-full px-10 py-3 text-base">
          Create your bouquet
        </Button>
        <Link href="/moments" className="text-sm text-brand-pink hover:underline">
          Or start from a moment
        </Link>
        <ShareFeelingButton />
      </div>
    </section>
  )
}
