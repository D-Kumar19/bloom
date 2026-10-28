'use client'

import Link from 'next/link'
import { useRef, useState, useSyncExternalStore } from 'react'

import { BackdropLayer } from '@/components/backdrop/BackdropLayer'
import { BouquetHero } from '@/components/bouquet/BouquetHero'
import { SoundtrackPlayer } from '@/components/bouquet/SoundtrackPlayer'
import { MessageCard } from '@/components/cards/MessageCard'
import { ReadyBloom } from '@/components/builder/ReadyBloom'
import { Button, buttonClassName } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { recordBouquetSentOnce } from '@/lib/counter/recordBouquetSent'
import { shouldShowNoteCard } from '@/lib/message'
import {
  buildEmailShareLinks,
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

function subscribeToNativeShare() {
  return () => {}
}

function isNativeShareAvailable() {
  return (
    typeof navigator !== 'undefined' && typeof navigator.share === 'function'
  )
}

export function BouquetShareStep({
  state,
  onCreateAnother,
}: BouquetShareStepProps) {
  const { showToast } = useToast()
  const [copiedMessage, setCopiedMessage] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [copyingMessage, setCopyingMessage] = useState(false)
  const [copyingLink, setCopyingLink] = useState(false)
  const canShare = useSyncExternalStore(
    subscribeToNativeShare,
    isNativeShareAvailable,
    () => false
  )
  const [showManualLink, setShowManualLink] = useState(false)
  const [showMoreOptions, setShowMoreOptions] = useState(false)
  const moreOpen = showMoreOptions || showManualLink
  const manualLinkRef = useRef<HTMLTextAreaElement>(null)
  const shareMessage = buildShareMessage(state)
  const shareMessagePreview = formatShareMessagePreview(shareMessage)
  const shareUrl = buildShareUrl(state)
  const emailLinks = buildEmailShareLinks(state)
  const previewPath = buildRecipientPreviewPath(state)
  const showNote = shouldShowNoteCard(state.message)
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

  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title: 'A bouquet for you',
        text: 'I made something for you.\nOpen this when you need a smile:',
        url: shareUrl,
      })
      void recordBouquetSentOnce(state)
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return
      }
      setShowManualLink(true)
      showToast(
        'Could not open sharing. Select the link below or copy it.',
        'warning'
      )
    }
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
      setShowManualLink(true)
      showToast(
        'Could not copy. Try again or copy the link manually.',
        'warning'
      )
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
      setShowManualLink(true)
      showToast('Could not copy link. Try again.', 'warning')
    } finally {
      setCopyingLink(false)
    }
  }

  const handleEmailShare = () => {
    void recordBouquetSentOnce(state)
  }

  const emailTextLinkClassName =
    'rounded-full px-1 font-medium text-bloom-ink underline underline-offset-4 decoration-bloom-rose/50 hover:text-brand-pink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bloom-ink'

  return (
    <div
      className="relative mx-auto w-full max-w-3xl"
      data-testid="bouquet-share-step"
    >
      <header className="mb-5 text-center">
        <ReadyBloom />
        <h2 className="font-display text-3xl text-bloom-ink md:text-4xl">
          Preview and share
        </h2>
        <p className="mt-2 text-sm text-bloom-ink/70">
          This is what they will see, with your backdrop and ambient sound.
        </p>
      </header>

      <div className="mb-5">
        <SoundtrackPlayer
          soundtrackId={state.soundtrack}
          autoPlay
          variant="inline"
        />
      </div>

      <a
        href="#share-actions"
        className="mb-5 inline-flex min-h-11 items-center rounded-full px-4 text-sm font-medium text-bloom-ink underline underline-offset-4 hover:bg-bloom-rose/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bloom-ink"
      >
        Happy with your gift? Jump to sharing
      </a>

      <BackdropLayer
        theme={state.theme}
        variant="full"
        className="mb-6 rounded-3xl"
        data-testid="share-reveal-backdrop"
      >
        <div className="relative flex flex-col px-4 py-8 md:px-8">
          <p
            className={`mb-6 text-center text-xs font-medium uppercase tracking-[0.2em] ${previewTone.eyebrow}`}
          >
            Recipient preview
          </p>

          <div className="flex flex-col justify-center gap-6">
            <BouquetHero
              bouquetId={state.bouquetId}
              theme={state.theme}
              showBackdrop={false}
              className="!mx-auto !max-w-md"
            />

            {showNote ? (
              <div className="mx-auto w-full max-w-md">
                <MessageCard
                  styleId={state.cardStyle}
                  to={state.to}
                  message={state.message}
                  from={state.from}
                  messageFormat={state.messageFormat}
                  noteBorder={state.noteBorder}
                  className="w-full !shadow-lg"
                />
              </div>
            ) : null}
          </div>

          <p
            className={`mx-auto mt-6 max-w-md rounded-2xl px-4 py-3 text-center text-sm backdrop-blur-sm ${previewTone.scrim} ${previewTone.body}`}
          >
            Open the full reveal in{' '}
            <Link
              href={previewPath}
              className={`underline underline-offset-2 ${previewTone.link}`}
            >
              preview as recipient
            </Link>
          </p>
        </div>
      </BackdropLayer>

      <section
        id="share-actions"
        tabIndex={-1}
        className="scroll-mt-64 rounded-2xl border border-bloom-rose/20 bg-surface p-4 shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bloom-ink sm:p-5"
        aria-label="Share your bouquet"
      >
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-bloom-ink/75">
          Ready to send
        </p>
        <div className="overflow-hidden rounded-xl border border-bloom-rose/15 bg-bloom-cream/40 px-3 py-3 sm:px-4">
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words text-bloom-ink/80 [overflow-wrap:anywhere]">
            {shareMessagePreview}
          </p>
          <p className="mt-2 text-xs text-bloom-ink/75">
            The full link is included when you share or copy.
          </p>
        </div>
        <div className="mt-4 space-y-3">
          {canShare ? (
            <Button
              data-testid="native-share-button"
              onClick={handleNativeShare}
              className="w-full"
            >
              Share bouquet
            </Button>
          ) : (
            <Button
              data-testid="copy-share-button"
              variant={canShare ? 'ghost' : 'primary'}
              onClick={handleCopyMessage}
              disabled={copyingMessage}
              className="w-full"
            >
              {copiedMessage ? 'Copied!' : 'Copy message + link'}
            </Button>
          )}
          <button
            type="button"
            data-testid="more-share-options-toggle"
            onClick={() => {
              if (moreOpen) {
                setShowMoreOptions(false)
                setShowManualLink(false)
              } else {
                setShowMoreOptions(true)
              }
            }}
            aria-expanded={moreOpen}
            aria-controls="more-share-options"
            className="mx-auto flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-bloom-ink/75 transition hover:text-brand-pink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bloom-ink"
          >
            More ways to share
            <span
              aria-hidden="true"
              className={`inline-block transition-transform motion-reduce:transition-none ${moreOpen ? 'rotate-180' : ''}`}
            >
              ▾
            </span>
          </button>
          {moreOpen ? (
            <div
              id="more-share-options"
              className="space-y-2 rounded-xl border border-bloom-rose/15 bg-bloom-cream/30 p-3"
            >
              {canShare ? (
                <Button
                  data-testid="copy-share-button"
                  variant={canShare ? 'ghost' : 'primary'}
                  onClick={handleCopyMessage}
                  disabled={copyingMessage}
                  className="w-full"
                >
                  {copiedMessage ? 'Copied!' : 'Copy message + link'}
                </Button>
              ) : null}
              <Button
                data-testid="copy-link-button"
                variant="ghost"
                onClick={handleCopyLink}
                disabled={copyingLink}
                className="w-full"
              >
                {copiedLink ? 'Copied!' : 'Copy link only'}
              </Button>
              <div data-testid="email-share-options" className="space-y-1.5">
                <a
                  href={emailLinks.mailto}
                  data-testid="email-share-link"
                  onClick={handleEmailShare}
                  className={buttonClassName('ghost', 'w-full')}
                >
                  Send by email
                </a>
                <p className="text-center text-xs text-bloom-ink/70">
                  Or write it in{' '}
                  <a
                    href={emailLinks.gmail}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="gmail-share-link"
                    onClick={handleEmailShare}
                    className={emailTextLinkClassName}
                  >
                    Gmail
                  </a>{' '}
                  or{' '}
                  <a
                    href={emailLinks.outlook}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="outlook-share-link"
                    onClick={handleEmailShare}
                    className={emailTextLinkClassName}
                  >
                    Outlook
                  </a>
                  . It is sent from your own email, so if it does not show up, ask them to
                  check Spam.
                </p>
                {emailLinks.isLong ? (
                  <p
                    data-testid="email-long-link-hint"
                    className="text-center text-xs text-bloom-ink/65"
                  >
                    This is a long link. If it looks cut off in the email, use Copy link
                    only and paste it in.
                  </p>
                ) : null}
              </div>
              {showManualLink ? (
                <div className="space-y-2">
                  <label htmlFor="manual-share-link" className="sr-only">
                    Full bouquet link
                  </label>
                  <textarea
                    id="manual-share-link"
                    ref={manualLinkRef}
                    readOnly
                    rows={3}
                    value={shareUrl}
                    onFocus={(event) => event.currentTarget.select()}
                    onCopy={() => void recordBouquetSentOnce(state)}
                    className="w-full resize-y rounded-xl border border-bloom-rose/20 bg-surface px-3 py-2 text-xs leading-relaxed text-bloom-ink [overflow-wrap:anywhere] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bloom-ink"
                  />
                  <Button
                    variant="ghost"
                    onClick={() => {
                      manualLinkRef.current?.focus()
                      manualLinkRef.current?.select()
                    }}
                    className="w-full"
                  >
                    Select link
                  </Button>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
        <div className="mt-4 border-t border-bloom-rose/15 pt-3 text-center">
          <button
            type="button"
            onClick={onCreateAnother}
            className="rounded-full px-3 py-1.5 text-sm font-medium text-bloom-ink/65 transition hover:text-brand-pink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bloom-ink"
          >
            Create another bouquet
          </button>
        </div>
      </section>
    </div>
  )
}
