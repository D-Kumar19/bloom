'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { markReturnToShareStep } from '@/lib/builder/draftSession'

export default function CreateResultRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    markReturnToShareStep()
    router.replace('/create')
  }, [router])

  return (
    <main className="mx-auto max-w-lg px-4 py-20 text-center">
      <p className="text-bloom-ink/70">Loading your bouquet...</p>
    </main>
  )
}
