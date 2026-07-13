'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { BouquetComposition } from '@/components/bouquet/BouquetComposition'
import { MessageCard } from '@/components/cards/MessageCard'
import { PetalRain } from '@/components/ui/PetalRain'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { buildShareMessage } from '@/lib/share'
import { buildShareUrl } from '@/lib/encode'
import type { BouquetState } from '@/lib/types'

export default function ResultPage() {
  const { showToast } = useToast()
  const [state, setState] = useState<BouquetState | null>(null)
  const [shareUrl, setShareUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [showPetals, setShowPetals] = useState(true)

  useEffect(() => {
    queueMicrotask(() => {
      const raw = sessionStorage.getItem('bloom-bouquet')
      if (!raw) {
        return
      }

      try {
        const parsed = JSON.parse(raw) as BouquetState
        setState(parsed)
        setShareUrl(buildShareUrl(parsed))
        fetch('/api/count', { method: 'POST' }).catch(() => undefined)
      } catch {
        setState(null)
      }
    })

    const timer = window.setTimeout(() => setShowPetals(false), 3000)
    return () => window.clearTimeout(timer)
  }, [])

  const handleCopy = async () => {
    if (!state || !shareUrl) {
      return
    }
    const message = buildShareMessage(state)
    await navigator.clipboard.writeText(message)
    setCopied(true)
    showToast('Copied with love! Paste into WhatsApp or iMessage.', 'success')
    window.setTimeout(() => setCopied(false), 2000)
  }

  if (!state) {
    return (
      <main className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-bloom-ink/70">No bouquet found. Start fresh!</p>
        <Button href="/create" className="mt-6">
          Create a bouquet
        </Button>
      </main>
    )
  }

  return (
    <main className="relative mx-auto max-w-2xl px-4 py-10">
      <PetalRain active={showPetals} />
      <header className="mb-8 text-center">
        <h1 className="font-display text-4xl text-bloom-ink">
          Your bouquet is ready!
        </h1>
        <p className="mt-2 text-sm text-bloom-ink/70">
          Share the message below with someone special.
        </p>
      </header>

      <BouquetComposition state={state} animate className="mb-6" />
      <MessageCard
        styleId={state.cardStyle}
        to={state.to}
        message={state.message}
        from={state.from}
        messageFormat={state.messageFormat}
        noteBorder={state.noteBorder}
        photoImage={state.photoCardImage}
        photoNoteStyleId={state.photoNoteStyle}
        className="mb-8"
      />

      <div className="rounded-2xl border border-bloom-rose/20 bg-white p-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-bloom-ink/50">
          Ready to send
        </p>
        <p className="mb-4 text-sm whitespace-pre-wrap text-bloom-ink/80">
          {buildShareMessage(state)}
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button onClick={handleCopy} className="flex-1">
            {copied ? 'Copied!' : 'Copy message + link'}
          </Button>
          <Button href="/create" variant="ghost" className="w-full flex-1">
            Create another bouquet
          </Button>
        </div>
        <Link
          href="/create"
          className="mt-4 block text-center text-xs text-bloom-ink/60 hover:text-brand-pink"
        >
          Send this bouquet to yourself too
        </Link>
      </div>
    </main>
  )
}
