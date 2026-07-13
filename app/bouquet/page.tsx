'use client'

import { useEffect, useState } from 'react'

import { BouquetComposition } from '@/components/bouquet/BouquetComposition'
import { MessageCard } from '@/components/cards/MessageCard'
import { Button } from '@/components/ui/Button'
import { decodeBouquet } from '@/lib/sharing'
import { PHOTO_CARD_ID } from '@/lib/cards'
import { getFlowerCountMeaning } from '@/lib/flowers'
import type { BouquetState } from '@/lib/types'

type ViewerState = {
  status: 'loading' | 'ready' | 'invalid'
  bouquet: BouquetState | null
}

function readBouquetFromUrl(): ViewerState {
  const params = new URLSearchParams(window.location.search)
  const encoded = params.get('b') ?? window.location.hash.slice(1)

  if (!encoded) {
    return { status: 'invalid', bouquet: null }
  }

  const decoded = decodeBouquet(encoded)
  if (!decoded) {
    return { status: 'invalid', bouquet: null }
  }

  return { status: 'ready', bouquet: decoded }
}

export default function BouquetViewerPage() {
  const [viewer, setViewer] = useState<ViewerState>({
    status: 'loading',
    bouquet: null,
  })
  const [cardRevealed, setCardRevealed] = useState(false)
  const [photoFlipped, setPhotoFlipped] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    queueMicrotask(() => {
      setViewer(readBouquetFromUrl())
    })
  }, [])

  const handleSaveImage = async () => {
    const element = document.getElementById('bouquet-export')
    if (!element) {
      return
    }

    setSaving(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(element, {
        backgroundColor: null,
        scale: 2,
      })
      const link = document.createElement('a')
      link.download = 'bloom-bouquet.png'
      link.href = canvas.toDataURL('image/png')
      link.click()
    } finally {
      setSaving(false)
    }
  }

  if (viewer.status === 'loading') {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-4xl flex-col items-center justify-center px-4 py-12">
        <div className="h-48 w-full max-w-md animate-pulse rounded-3xl bg-bloom-rose/10" />
        <p className="mt-4 text-sm text-bloom-ink/60">Unwrapping your bouquet...</p>
      </main>
    )
  }

  if (viewer.status === 'invalid' || !viewer.bouquet) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-12 text-center">
        <h1 className="font-display text-3xl text-bloom-ink">
          This bouquet could not be found
        </h1>
        <p className="mt-3 text-sm text-bloom-ink/70">
          The link may be broken or expired.
        </p>
        <Button href="/create" className="mt-8">
          Create your own bouquet
        </Button>
      </main>
    )
  }

  const bouquet = viewer.bouquet
  const sender = bouquet.from || 'Someone'
  const count = bouquet.flowers.length
  const isPhotoCard = bouquet.cardStyle === PHOTO_CARD_ID

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 md:py-14">
      <header className="mb-8 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-bloom-rose">
          Bloom
        </p>
        <h1 className="mt-2 font-display text-4xl text-bloom-ink">
          Someone sent you a bouquet
        </h1>
      </header>

      <div id="bouquet-export" className="space-y-6">
        <BouquetComposition state={bouquet} revealUnwrap animate />
        <div className="text-center">
          <MessageCard
            styleId={bouquet.cardStyle}
            to={bouquet.to}
            message={bouquet.message}
            from={bouquet.from}
            messageFormat={bouquet.messageFormat}
            noteBorder={bouquet.noteBorder}
            photoImage={bouquet.photoCardImage}
            photoNoteStyleId={bouquet.photoNoteStyle}
            photoFlipped={photoFlipped}
            onPhotoFlip={() => setPhotoFlipped(true)}
            showPhotoFlipHint={isPhotoCard && !photoFlipped}
            folded={!isPhotoCard && !cardRevealed}
            onClick={!isPhotoCard ? () => setCardRevealed(true) : undefined}
          />
        </div>
      </div>

      {cardRevealed || photoFlipped ? (
        <p className="mt-6 text-center text-sm italic text-bloom-ink/70">
          This bouquet was made with love, just for you.
        </p>
      ) : null}

      <p className="mt-4 text-center text-xs text-bloom-ink/50">
        {sender} chose {count} {count === 1 ? 'flower' : 'flowers'} for you. In
        the language of flowers, that means: {getFlowerCountMeaning(count)}
      </p>

      <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Button onClick={handleSaveImage} disabled={saving} variant="secondary">
          {saving ? 'Saving...' : 'Save as Image'}
        </Button>
        <Button href="/create">Send a bouquet back</Button>
      </div>
    </main>
  )
}
