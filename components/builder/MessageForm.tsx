'use client'

import { useRef, useState } from 'react'

import { NoteBorderPicker } from '@/components/builder/NoteBorderPicker'
import {
  RichMessageEditor,
  focusMessageEditorEnd,
} from '@/components/builder/RichMessageEditor'
import { MessageCard } from '@/components/cards/MessageCard'
import { getDisplayCardLabel, PHOTO_CARD_ID } from '@/lib/cards'
import { INSPIRATION_PROMPTS } from '@/lib/message'
import { formatCharactersLeft } from '@/lib/message'
import { plainTextToMessageHtml, stripMessageHtml } from '@/lib/message'
import { SUPPORT_EMAIL } from '@/lib/site'
import type { MessageFormat, NoteBorder } from '@/lib/types'

type MessageFormProps = {
  to: string
  message: string
  from: string
  cardStyle: string
  photoCardImage?: string
  photoNoteStyle: string
  messageFormat: MessageFormat
  noteBorder: NoteBorder
  maxLength: number
  onToChange: (value: string) => void
  onMessageChange: (value: string) => void
  onFromChange: (value: string) => void
  onMessageFormatChange: (format: MessageFormat) => void
  onNoteBorderChange: (border: NoteBorder) => void
}

const inputClassName =
  'w-full rounded-2xl border border-bloom-rose/20 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/15'

export function MessageForm({
  to,
  message,
  from,
  cardStyle,
  photoCardImage,
  photoNoteStyle,
  messageFormat,
  noteBorder,
  maxLength,
  onToChange,
  onMessageChange,
  onFromChange,
  onMessageFormatChange,
  onNoteBorderChange,
}: MessageFormProps) {
  const [showInspiration, setShowInspiration] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)
  const charsLeft = maxLength - stripMessageHtml(message).length
  const isPhotoCard = cardStyle === PHOTO_CARD_ID
  const cardLabel = getDisplayCardLabel({ cardStyle, photoNoteStyle })

  const applyInspiration = (starter: string) => {
    const html = plainTextToMessageHtml(starter)
    onMessageChange(html)
    requestAnimationFrame(() => {
      focusMessageEditorEnd(editorRef.current, html)
    })
  }

  return (
    <div className="mx-auto w-full max-w-6xl" data-testid="message-form">
      <div className="mb-6 text-center md:mb-8">
        <h2 className="font-display text-2xl text-bloom-ink md:text-3xl">Write your words</h2>
        <p className="mt-2 text-sm leading-relaxed text-bloom-ink/60">
          Watch them land on the card you chose — that is the satisfying part.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
        <div className="space-y-5 rounded-3xl border border-bloom-rose/15 bg-white/80 p-5 shadow-sm ring-1 ring-bloom-rose/10 md:p-7">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="recipient" className="mb-1.5 block text-sm font-medium text-bloom-ink">
                To
              </label>
              <input
                id="recipient"
                value={to}
                onChange={(e) => onToChange(e.target.value)}
                placeholder="Who is this for?"
                className={inputClassName}
              />
            </div>
            <div>
              <label htmlFor="sender" className="mb-1.5 block text-sm font-medium text-bloom-ink">
                From
              </label>
              <input
                id="sender"
                value={from}
                onChange={(e) => onFromChange(e.target.value)}
                placeholder="Your name"
                className={inputClassName}
              />
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-baseline justify-between gap-3">
              <label htmlFor="message" className="text-sm font-medium text-bloom-ink">
                Your message
              </label>
              <span
                data-testid="chars-left"
                className="shrink-0 text-xs tabular-nums text-bloom-ink/50"
              >
                {formatCharactersLeft(charsLeft)}
              </span>
            </div>
            <RichMessageEditor
              ref={editorRef}
              message={message}
              messageFormat={messageFormat}
              maxLength={maxLength}
              onMessageChange={onMessageChange}
              onMessageFormatChange={onMessageFormatChange}
            />
          </div>

          <div className="rounded-2xl border border-brand-pink/15 bg-gradient-to-br from-white to-brand-pink/[0.05] p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-bloom-ink">Need inspiration?</p>
                <p className="mt-0.5 text-xs text-bloom-ink/55">
                  Tap a mood to drop in a starter line — edit it until it sounds like you.
                </p>
              </div>
              <button
                type="button"
                data-testid="inspiration-toggle"
                onClick={() => setShowInspiration((value) => !value)}
                className="rounded-full border border-brand-pink/30 bg-white px-4 py-1.5 text-xs font-semibold text-brand-pink shadow-sm transition hover:border-brand-pink hover:bg-brand-pink/5"
              >
                {showInspiration ? 'Hide prompts' : 'Show prompts'}
              </button>
            </div>

            {showInspiration ? (
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {INSPIRATION_PROMPTS.map((prompt) => (
                  <button
                    key={prompt.id}
                    type="button"
                    data-testid={`inspiration-${prompt.id}`}
                    aria-label={`${prompt.label}: ${prompt.starter}`}
                    onClick={() => applyInspiration(prompt.starter)}
                    className="rounded-xl border border-bloom-rose/20 bg-white/90 p-3 text-left transition hover:border-brand-pink/40 hover:bg-brand-pink/[0.04] hover:shadow-sm"
                  >
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-brand-pink">
                      <span aria-hidden>{prompt.emoji} </span>
                      {prompt.label}
                    </span>
                    <p className="mt-1.5 text-xs leading-relaxed text-bloom-ink/70 line-clamp-3">
                      {prompt.starter}
                    </p>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start space-y-4">
          <p className="text-sm font-medium text-bloom-ink/70">Live preview</p>
          <MessageCard
            styleId={cardStyle}
            to={to}
            message={message}
            from={from}
            messageFormat={messageFormat}
            noteBorder={noteBorder}
            photoImage={photoCardImage}
            photoNoteStyleId={photoNoteStyle}
            photoStackedPreview={isPhotoCard && Boolean(photoCardImage)}
          />
          <p className="text-center text-sm text-bloom-ink/60">{cardLabel}</p>
          <NoteBorderPicker noteBorder={noteBorder} onNoteBorderChange={onNoteBorderChange} />
        </div>
      </div>

      <p className="mt-8 text-center text-xs leading-relaxed text-bloom-ink/55">
        These blooms are here to charm people, not train somebody&apos;s AI cousin or become stock
        photos on a random website. The flower, petal, foliage, and bouquet visuals belong to
        Bloom, so please don&apos;t download, redistribute, or reuse them outside the app without
        permission. See the{' '}
        <a href="/privacy" className="underline hover:text-bloom-ink">
          Privacy Policy
        </a>{' '}
        or email{' '}
        <a href={`mailto:${SUPPORT_EMAIL}`} className="underline hover:text-bloom-ink">
          {SUPPORT_EMAIL}
        </a>{' '}
        if you need to use them properly.
      </p>
    </div>
  )
}
