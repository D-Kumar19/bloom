'use client'

import Link from 'next/link'
import { useState } from 'react'

import { BackdropLayer } from '@/components/backdrop/BackdropLayer'
import { GiftComposition } from '@/components/bouquet/GiftComposition'
import { SoundtrackPlayer } from '@/components/bouquet/SoundtrackPlayer'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { recordBouquetSentOnce } from '@/lib/counter/recordBouquetSent'
import {
  buildRecipientPreviewPath,
  buildShareMessage,
  buildShareUrl,
  formatShareMessagePreview,
} from '@/lib/sharing'
import { getThemeById } from '@/lib/themes'
import type { BouquetState } from '@/lib/types'

type BouquetShareStepProps = {
  state: BouquetState
  onCreateAnother: () => void
}

export function BouquetShareStep({ state, onCreateAnother }: BouquetShareStepProps) {
  const { showToast } = useToast()
  const [copiedMessage, setCopiedMessage] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [copyingMessage, setCopyingMessage] = useState(false)
  const [copyingLink, setCopyingLink] = useState(false)
  const shareMessage = buildShareMessage(state)
  const shareMessagePreview = formatShareMessagePreview(shareMessage)
  const shareUrl = buildShareUrl(state)
  const previewPath = buildRecipientPreviewPath(state)
  const onDark = getThemeById(state.theme)?.dark ?? false
  const previewTone = onDark
    ? {
        eyebrow: 'text-white/85',
        body: 'text-white/95',
        link: 'text-white font-semibold decoration-white/80 hover:decoration-white',
        scrim: 'bg-black/45 ring-1 ring-white/15',
      }
    : {
        eyebrow: 'text-[#2a2420]/75',
        body: 'text-[#2a2420]',
        link: 'text-[#9a4a50] font-semibold decoration-[#9a4a50]/80 hover:decoration-[#9a4a50]',
        scrim: 'bg-white/88 ring-1 ring-[#2a2420]/8 shadow-sm',
      }

  const handleCopyMessage = async () => {
    if (copyingMessage) {
      return
    }

    setCopyingMessage(true)
    try {
      await navigator.clipboard.writeText(shareMessage)
      void recordBouquetSentOnce(state)
      setCopiedMessage(true)
      showToast('Copied with love! Paste into WhatsApp or iMessage.', 'success')
      window.setTimeout(() => setCopiedMessage(false), 2000)
    } catch {
      showToast('Could not copy. Try again or copy the link manually.', 'warning')
    } finally {
      setCopyingMessage(false)
    }
  }

  const handleCopyLink = async () => {
    if (copyingLink) {
      return
    }

    setCopyingLink(true)
    try {
      await navigator.clipboard.writeText(shareUrl)
      void recordBouquetSentOnce(state)
      setCopiedLink(true)
      showToast('Link copied.', 'success')
      window.setTimeout(() => setCopiedLink(false), 2000)
    } catch {
      showToast('Could not copy link. Try again.', 'warning')
    } finally {
      setCopyingLink(false)
    }
  }

  return (
    <div className="bloom-share relative mx-auto w-full" data-testid="bouquet-share-step">
      <header className="mb-8">
        <p className="bloom-eyebrow">Made by you. Ready for them.</p>
        <h2 className="font-display text-3xl text-bloom-ink md:text-4xl">Preview and share</h2>
        <p className="mt-2 text-sm text-bloom-ink/70">
          This is what they will see, with your backdrop and ambient sound.
        </p>
      </header>

      <div className="mb-5">
        <SoundtrackPlayer soundtrackId={state.soundtrack} autoPlay variant="inline" />
      </div>

      <div className="bloom-share__layout">
      <BackdropLayer
        theme={state.theme}
        variant="full"
        className="bloom-share__preview"
        data-testid="share-reveal-backdrop"
      >
        <div className="relative flex flex-col p-5 md:p-8">
          <p
            className={`mb-6 text-center text-xs font-medium uppercase tracking-[0.2em] ${previewTone.eyebrow}`}
          >
            Recipient preview
          </p>

          <GiftComposition bouquet={state} />

          <p
            className={`mx-auto mt-6 max-w-md rounded-2xl px-4 py-3 text-center text-sm backdrop-blur-sm ${previewTone.scrim} ${previewTone.body}`}
          >
            Open the full reveal in{' '}
            <Link href={previewPath} className={`underline underline-offset-2 ${previewTone.link}`}>
              preview as recipient
            </Link>
          </p>
        </div>
      </BackdropLayer>

      <section className="bloom-share__actions border border-bloom-rose/30 bg-surface p-5 sm:p-6" aria-label="Share your bouquet">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-bloom-ink/75">
          Ready to send
        </p>
        <div className="overflow-hidden rounded-xl border border-bloom-rose/15 bg-bloom-cream/40 px-3 py-3 sm:px-4">
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words text-bloom-ink/80 [overflow-wrap:anywhere]">
            {shareMessagePreview}
          </p>
          <p className="mt-2 text-xs text-bloom-ink/75">
            The full link is copied when you tap the button.
          </p>
        </div>
        <div className="mt-4 space-y-3">
          <Button
            data-testid="copy-share-button"
            onClick={handleCopyMessage}
            disabled={copyingMessage}
            className="w-full"
          >
            {copiedMessage ? 'Copied!' : 'Copy message + link'}
          </Button>
          <Button
            data-testid="copy-link-button"
            variant="ghost"
            onClick={handleCopyLink}
            disabled={copyingLink}
            className="w-full"
          >
            {copiedLink ? 'Copied!' : 'Copy link only'}
          </Button>
          <button
            type="button"
            onClick={onCreateAnother}
            className="w-full py-2 text-sm font-medium text-bloom-ink/65 transition hover:text-brand-pink"
          >
            Create another bouquet
          </button>
        </div>
      </section>
      </div>
    </div>
  )
}
