'use client'

import { useLayoutEffect, useRef, useState } from 'react'

import { CardStyleQuickPicker } from '@/components/builder/CardStyleQuickPicker'
import { NoteBorderPicker } from '@/components/builder/NoteBorderPicker'
import { RichMessageEditor, focusMessageEditorEnd } from '@/components/builder/RichMessageEditor'
import { MessageCard } from '@/components/cards/MessageCard'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import {
  INSPIRATION_PROMPTS,
  countMessageWords,
  formatWordsLeft,
  hasMessageContent,
  plainTextToMessageHtml,
} from '@/lib/message'
import { MIN_MESSAGE_WORDS, type MessageFormat, type NoteBorder } from '@/lib/types'

type MessageFormProps = {
  to: string
  message: string
  from: string
  cardStyle: string
  messageFormat: MessageFormat
  noteBorder: NoteBorder
  maxWords: number
  onToChange: (value: string) => void
  onMessageChange: (value: string) => void
  onFromChange: (value: string) => void
  onMessageFormatChange: (format: MessageFormat) => void
  onNoteBorderChange: (border: NoteBorder) => void
  onCardStyleChange: (styleId: string) => void
  onChangeBouquet?: () => void
}

const inputClassName =
  'w-full rounded-2xl border border-bloom-rose/20 bg-surface px-4 py-2.5 text-sm text-bloom-ink outline-none transition focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/15'

const inputErrorClassName = 'border-brand-pink/60 focus:border-brand-pink focus:ring-brand-pink/25'

export function MessageForm({
  to,
  message,
  from,
  cardStyle,
  messageFormat,
  noteBorder,
  maxWords,
  onToChange,
  onMessageChange,
  onFromChange,
  onMessageFormatChange,
  onNoteBorderChange,
  onCardStyleChange,
  onChangeBouquet,
}: MessageFormProps) {
  const [showInspiration, setShowInspiration] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [cardPickerOpen, setCardPickerOpen] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)
  const pendingEditorFocus = useRef(false)
  const wordCount = countMessageWords(message)
  const wordsLeft = maxWords - wordCount
  const messageFilled = hasMessageContent(message)
  const toMissing = !to.trim()
  const fromMissing = !from.trim()
  const messageTooShort = wordCount < MIN_MESSAGE_WORDS

  const previewMessage = messageFilled ? message : ''

  useLayoutEffect(() => {
    if (!pendingEditorFocus.current) return
    pendingEditorFocus.current = false
    focusMessageEditorEnd(editorRef.current, message)
  })

  const applyInspiration = (starter: string, appendToNote = false) => {
    const starterHtml = plainTextToMessageHtml(starter)
    const html = appendToNote && messageFilled ? `${message}<br><br>${starterHtml}` : starterHtml
    pendingEditorFocus.current = true
    onMessageChange(html)
    setShowInspiration(false)
  }

  const handleQuickNoteStyle = (styleId: string) => {
    onCardStyleChange(styleId)
    setCardPickerOpen(false)
  }

  return (
    <div className="mx-auto w-full max-w-6xl" data-testid="message-form">
      <div className="mb-6 text-center md:mb-8">
        <h2 className="font-display text-2xl text-bloom-ink md:text-3xl">Write your words</h2>
        <p className="mt-2 text-sm leading-relaxed text-bloom-ink/60">
          Watch them land on the card you chose. That is the satisfying part.
        </p>
        {onChangeBouquet ? (
          <Button
            variant="ghost"
            className="mt-4 rounded-full"
            onClick={onChangeBouquet}
          >
            Change bouquet
          </Button>
        ) : null}
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-10">
        <div className="space-y-5 rounded-3xl border border-bloom-rose/15 bg-surface-muted p-5 shadow-sm ring-1 ring-bloom-rose/10 md:p-7">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="recipient"
                className="mb-1.5 block text-sm font-medium text-bloom-ink"
              >
                To
              </label>
              <input
                id="recipient"
                value={to}
                onChange={(e) => onToChange(e.target.value)}
                placeholder="Who is this for?"
                aria-invalid={toMissing}
                className={`${inputClassName} ${toMissing ? inputErrorClassName : ''}`}
              />
              {toMissing ? (
                <p className="mt-1 text-xs text-brand-pink">Add who this is for</p>
              ) : null}
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
                aria-invalid={fromMissing}
                className={`${inputClassName} ${fromMissing ? inputErrorClassName : ''}`}
              />
              {fromMissing ? (
                <p className="mt-1 text-xs text-brand-pink">
                  Add your name so they know who sent this
                </p>
              ) : null}
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-baseline justify-between gap-3">
              <label htmlFor="message" className="text-sm font-medium text-bloom-ink">
                Your message
              </label>
              <span
                data-testid="words-left"
                className="shrink-0 text-xs tabular-nums text-bloom-ink/60"
              >
                {formatWordsLeft(wordsLeft)}
              </span>
            </div>
            <RichMessageEditor
              ref={editorRef}
              message={message}
              messageFormat={messageFormat}
              maxWords={maxWords}
              onMessageChange={onMessageChange}
              onMessageFormatChange={onMessageFormatChange}
              invalid={messageTooShort || wordsLeft < 0}
              describedBy="message-length-guidance"
            />
            <p
              id="message-length-guidance"
              className={`mt-1 text-xs ${messageTooShort ? 'text-brand-pink' : 'text-bloom-ink/70'}`}
            >
              {messageTooShort
                ? `Write at least ${MIN_MESSAGE_WORDS} words to continue. "Love you" is enough.`
                : `${MIN_MESSAGE_WORDS}-${maxWords} words. A little can mean a lot.`}
            </p>
            {wordsLeft < 0 ? (
              <p role="alert" className="mt-1 text-xs text-brand-pink">
                Your full message is kept. Remove {-wordsLeft} {wordsLeft === -1 ? 'word' : 'words'}{' '}
                to continue.
              </p>
            ) : null}
          </div>

          <div className="rounded-2xl border border-bloom-rose/25 bg-surface p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-bloom-ink">Need inspiration?</p>
                <p className="mt-0.5 text-xs text-bloom-ink/75">
                  Try a personal detail or a mood starter, then make it sound like you.
                </p>
              </div>
              <button
                type="button"
                data-testid="inspiration-toggle"
                aria-expanded={showInspiration}
                aria-controls="inspiration-prompts"
                onClick={() => setShowInspiration((value) => !value)}
                className="rounded-full border border-brand-pink/40 bg-surface-muted px-4 py-1.5 text-xs font-semibold text-brand-pink shadow-sm transition hover:border-brand-pink hover:bg-brand-pink/10"
              >
                {showInspiration ? 'Hide prompts' : 'Show prompts'}
              </button>
            </div>

            {showInspiration ? (
              <div id="inspiration-prompts" className="mt-4 grid gap-2 sm:grid-cols-2">
                {INSPIRATION_PROMPTS.map((prompt) => (
                  <button
                    key={prompt.id}
                    type="button"
                    data-testid={`inspiration-${prompt.id}`}
                    aria-label={`${prompt.label}: ${prompt.starter}${prompt.appendToNote ? ' (adds to your note)' : ''}`}
                    onClick={() => applyInspiration(prompt.starter, prompt.appendToNote)}
                    className="rounded-xl border border-bloom-rose/30 bg-surface-muted p-3 text-left transition hover:border-brand-pink/50 hover:bg-brand-pink/[0.08] hover:shadow-sm"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wide text-brand-pink">
                      <span aria-hidden>{prompt.emoji} </span>
                      {prompt.label}
                    </span>
                    <p className="mt-1.5 text-sm leading-relaxed text-bloom-ink line-clamp-3">
                      {prompt.starter}
                    </p>
                    {prompt.appendToNote ? (
                      <p className="mt-2 text-xs leading-relaxed text-bloom-ink/75">
                        {prompt.preview} Adds to your note, without replacing your words.
                      </p>
                    ) : null}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-bloom-rose/15 bg-surface-muted p-5 shadow-sm ring-1 ring-bloom-rose/10 md:p-7">
            <div>
              <p className="mb-3 text-sm font-medium text-bloom-ink">Live preview</p>
              <MessageCard
                styleId={cardStyle}
                to={to}
                message={previewMessage}
                from={from}
                messageFormat={messageFormat}
                noteBorder={noteBorder}
              />
            </div>
            <button
              type="button"
              data-testid="change-card-style"
              onClick={() => setCardPickerOpen(true)}
              className="mt-4 block w-full text-center text-sm text-brand-pink underline-offset-2 hover:underline"
            >
              Change card style
            </button>
          </div>

          <div className="rounded-2xl border border-bloom-rose/25 bg-surface-muted p-4 shadow-sm ring-1 ring-bloom-rose/10">
            <button
              type="button"
              data-testid="advanced-toggle"
              aria-expanded={showAdvanced}
              onClick={() => setShowAdvanced((value) => !value)}
              className="flex w-full items-center justify-between text-left text-sm font-medium text-bloom-ink"
            >
              <span>
                Advanced
                <span className="mt-0.5 block text-xs font-normal text-bloom-ink/55">
                  Note border on the card above
                </span>
              </span>
              <span className="shrink-0 text-xs text-bloom-ink/50">
                {showAdvanced ? 'Hide' : 'Show'}
              </span>
            </button>
            {showAdvanced ? (
              <div className="mt-3 border-t border-bloom-rose/10 pt-3">
                <NoteBorderPicker noteBorder={noteBorder} onNoteBorderChange={onNoteBorderChange} />
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <Modal
        open={cardPickerOpen}
        onClose={() => setCardPickerOpen(false)}
        title="Change card style"
      >
        <CardStyleQuickPicker cardStyle={cardStyle} onSelectNoteStyle={handleQuickNoteStyle} />
      </Modal>
    </div>
  )
}
