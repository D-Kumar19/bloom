'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { BackdropLayer } from '@/components/backdrop/BackdropLayer'
import { BouquetExportSnapshot } from '@/components/bouquet/BouquetExportSnapshot'
import { BouquetHero } from '@/components/bouquet/BouquetHero'
import {
  SoundtrackPlayer,
  type SoundtrackPlayerHandle,
} from '@/components/bouquet/SoundtrackPlayer'
import { MessageCard } from '@/components/cards/MessageCard'
import { Button } from '@/components/ui/Button'
import { RoundIconButton } from '@/components/ui/RoundIconButton'
import { useToast } from '@/components/ui/Toast'
import { getBouquetById } from '@/lib/bouquets'
import { captureElementImage } from '@/lib/export/captureElementImage'
import { downloadImageBlob } from '@/lib/export/downloadImageBlob'
import { decodeBouquet, isRecipientPreviewUrl } from '@/lib/sharing'
import { getBouquetRevealTitle, formatBouquetDocumentTitle } from '@/lib/bouquet/recipientCopy'
import { getRevealTextTone } from '@/lib/bouquet/revealTone'
import { shouldShowNoteCard } from '@/lib/message'
import type { BouquetState } from '@/lib/types'

type ViewerState = {
  status: 'loading' | 'ready' | 'invalid'
  bouquet: BouquetState | null
}

type RevealBeat = 0 | 1 | 2 | 3

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

export function BouquetViewer() {
  const router = useRouter()
  const { showToast } = useToast()
  const [viewer, setViewer] = useState<ViewerState>({
    status: 'loading',
    bouquet: null,
  })
  const [beat, setBeat] = useState<RevealBeat>(0)
  const [saving, setSaving] = useState(false)
  const [isCreatorPreview, setIsCreatorPreview] = useState(false)
  const soundtrackRef = useRef<SoundtrackPlayerHandle>(null)

  useEffect(() => {
    document.body.classList.add('bouquet-immersive')
    return () => document.body.classList.remove('bouquet-immersive')
  }, [])

  useEffect(() => {
    queueMicrotask(() => {
      const preview = isRecipientPreviewUrl(window.location.search)
      const nextViewer = readBouquetFromUrl()
      setViewer(nextViewer)
      setIsCreatorPreview(preview)

      if (preview && nextViewer.status === 'ready' && nextViewer.bouquet) {
        const showNote = shouldShowNoteCard(nextViewer.bouquet.message)
        setBeat(showNote ? 2 : 1)
      }
    })
  }, [])

  useEffect(() => {
    if (!viewer.bouquet) {
      return
    }

    document.title = formatBouquetDocumentTitle(viewer.bouquet.from)
  }, [viewer.bouquet])

  const hasNote = useMemo(() => {
    if (!viewer.bouquet) {
      return true
    }

    return shouldShowNoteCard(viewer.bouquet.message)
  }, [viewer.bouquet])

  const finalBeat: RevealBeat = hasNote ? 3 : 1

  const advance = useCallback(() => {
    soundtrackRef.current?.startPlayback()
    setBeat((current) => (current < finalBeat ? ((current + 1) as RevealBeat) : current))
  }, [finalBeat])

  const handleRevealKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (beat >= finalBeat) {
        return
      }

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        advance()
      }
    },
    [advance, beat, finalBeat],
  )

  const handleSaveImage = async () => {
    const element = document.getElementById('bouquet-export-snapshot')
    if (!element) {
      showToast('Could not find bouquet to save.', 'warning')
      return
    }

    setSaving(true)
    try {
      const blob = await captureElementImage(element)
      await downloadImageBlob(blob, 'bloom-bouquet.png')
      showToast('Image saved.', 'success')
    } catch (error) {
      console.error('Save image failed:', error)
      showToast('Could not save image. Try again.', 'warning')
    } finally {
      setSaving(false)
    }
  }

  if (viewer.status === 'loading') {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-bloom-cream px-4">
        <div className="w-full max-w-md text-center">
          <div className="h-48 w-full animate-pulse rounded-3xl bg-bloom-rose/10" />
          <p className="mt-4 text-sm text-bloom-ink/60">Unwrapping your bouquet...</p>
        </div>
      </main>
    )
  }

  if (viewer.status === 'invalid' || !viewer.bouquet) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center bg-bloom-cream px-4 py-12 text-center">
        <h1 className="font-display text-3xl text-bloom-ink">
          This bouquet could not be found
        </h1>
        <p className="mt-3 text-sm text-bloom-ink/70">
          The link may be broken or unreadable.
        </p>
        <Button href="/create" className="mt-8">
          Create your own bouquet
        </Button>
      </main>
    )
  }

  const bouquet = viewer.bouquet
  const sender = bouquet.from.trim() || 'Someone'
  const revealTitle = getBouquetRevealTitle(bouquet.from)
  const bouquetMeta = getBouquetById(bouquet.bouquetId)
  const revealComplete = beat >= finalBeat
  const showActions = revealComplete
  const tone = getRevealTextTone(bouquet.theme)
  const canAdvanceReveal = beat < finalBeat

  return (
    <BackdropLayer
      theme={bouquet.theme}
      variant={beat === 0 ? 'muted' : 'full'}
      className="min-h-dvh"
      data-testid="bouquet-page-backdrop"
    >
      {isCreatorPreview ? (
        <button
          type="button"
          data-testid="preview-dismiss-backdrop"
          className="fixed inset-0 z-20"
          aria-label="Exit preview"
          onClick={() => router.push('/create')}
        />
      ) : null}

      <main
        className="relative z-30 mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-4 py-6 md:px-6 md:py-8"
        onClick={(event) => event.stopPropagation()}
        onMouseDown={(event) => event.stopPropagation()}
      >
        {isCreatorPreview ? (
          <RoundIconButton
            data-testid="preview-back-button"
            aria-label="Back to share step"
            onClick={() => router.push('/create')}
            className={`absolute top-4 left-4 z-40 ${tone.iconButton}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M15 18l-6-6 6-6"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </RoundIconButton>
        ) : null}

        <SoundtrackPlayer
          ref={soundtrackRef}
          soundtrackId={bouquet.soundtrack}
          autoPlay={isCreatorPreview}
          toggleClassName={tone.iconButton}
          className="absolute top-4 right-4 z-40"
        />

        {beat > 0 ? (
          <header className="mb-6 pt-10 text-center md:pt-12">
            <h1 className={`font-display text-3xl md:text-4xl ${tone.title}`}>
              {revealTitle}
            </h1>
          </header>
        ) : (
          <div className="pt-12" />
        )}

        <div
          data-testid="reveal-stage"
          role={canAdvanceReveal ? 'button' : undefined}
          tabIndex={canAdvanceReveal ? 0 : undefined}
          onClick={canAdvanceReveal ? advance : undefined}
          onKeyDown={canAdvanceReveal ? handleRevealKeyDown : undefined}
          className={`flex-1 text-left ${canAdvanceReveal ? 'cursor-pointer' : 'cursor-default'}`}
          aria-label={canAdvanceReveal ? 'Tap to continue the reveal' : undefined}
        >
          <div className="space-y-6">
            {beat === 0 ? (
              <div
                data-testid="reveal-beat-wrap"
                className={`flex min-h-[50vh] flex-col items-center justify-center rounded-3xl border p-8 backdrop-blur-[2px] ${tone.beat0Card}`}
              >
                <div
                  className={`h-28 w-28 rounded-full border-2 border-dashed ${tone.beat0Ring}`}
                />
                <p className={`mt-6 font-display text-xl ${tone.title}`}>{revealTitle}</p>
                <p
                  className={`mt-3 rounded-full px-4 py-1.5 text-sm font-medium backdrop-blur-sm ${tone.hint} ${tone.hintScrim}`}
                >
                  Tap to open
                </p>
              </div>
            ) : null}

            {beat >= 1 ? (
              <BouquetHero
                bouquetId={bouquet.bouquetId}
                theme={bouquet.theme}
                showBackdrop={false}
              />
            ) : null}

            {beat >= 2 && hasNote ? (
              <div className="text-center">
                <MessageCard
                  styleId={bouquet.cardStyle}
                  to={bouquet.to}
                  message={beat >= 3 ? bouquet.message : ''}
                  from={beat >= 3 ? bouquet.from : ''}
                  messageFormat={bouquet.messageFormat}
                  noteBorder={bouquet.noteBorder}
                  folded={beat < 3}
                  onClick={beat === 2 ? () => setBeat(3) : undefined}
                />
              </div>
            ) : null}
          </div>

          {canAdvanceReveal && beat > 0 ? (
            <p
              className={`mx-auto mt-4 w-fit rounded-full px-4 py-1.5 text-center text-xs font-medium backdrop-blur-sm ${tone.hint} ${tone.hintScrim}`}
            >
              Tap to continue
            </p>
          ) : null}
        </div>

        {revealComplete ? (
          <p className={`mt-6 text-center text-sm italic ${tone.body}`}>
            This bouquet was made for you, quietly, on purpose.
          </p>
        ) : null}

        {revealComplete ? (
          <p className={`mt-4 text-center text-sm ${tone.body}`}>
            {sender} sent you{' '}
            <span className={`font-medium ${tone.title}`}>
              {bouquetMeta?.name ?? 'a bouquet'}
            </span>
            {bouquetMeta ? (
              <>
                <span className={`mx-2 ${tone.muted}`}>·</span>
                <span className="italic">{bouquetMeta.meaning}</span>
              </>
            ) : null}
          </p>
        ) : null}

        {showActions && !isCreatorPreview ? (
          <>
            <BouquetExportSnapshot bouquet={bouquet} />
            <div className="mt-10 flex flex-col items-center gap-3 pb-6 sm:flex-row sm:justify-center">
              <Button onClick={handleSaveImage} disabled={saving}>
                {saving ? 'Saving...' : 'Save as Image'}
              </Button>
              <Button href="/create" variant="ghost" className={tone.ghostButton}>
                Send a bouquet back
              </Button>
            </div>
          </>
        ) : null}
      </main>
    </BackdropLayer>
  )
}
