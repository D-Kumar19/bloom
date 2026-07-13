'use client'

import Image from 'next/image'

import { FormattedMessageBody } from '@/components/cards/FormattedMessageBody'
import { FEATURED_CARD_ID, PHOTO_CARD_ID } from '@/lib/cards'
import { getNoteBorderStyle } from '@/lib/cards'
import { getNoteSurfaceClass } from '@/lib/cards'
import type { MessageFormat, NoteBorder } from '@/lib/types'

type PhotoCardProps = {
  photoImage?: string
  to: string
  message: string
  from: string
  messageFormat?: MessageFormat
  noteBorder?: NoteBorder
  noteStyleId?: string
  compact?: boolean
  flipped?: boolean
  stackedPreview?: boolean
  onFlip?: () => void
  onUploadClick?: () => void
  showFlipHint?: boolean
  className?: string
}

function NoteBack({
  to,
  message,
  from,
  messageFormat,
  noteBorder,
  noteStyleId = FEATURED_CARD_ID,
  compact,
  className = '',
}: {
  to: string
  message: string
  from: string
  messageFormat?: MessageFormat
  noteBorder?: NoteBorder
  noteStyleId?: string
  compact?: boolean
  className?: string
}) {
  const surface = getNoteSurfaceClass(noteStyleId)
  const onDark = noteStyleId === 'midnight'

  return (
    <div
      className={`note-card flex h-full flex-col rounded-3xl p-6 shadow-md ${surface} ${compact ? 'p-4 text-sm' : ''} ${className}`}
      style={getNoteBorderStyle(noteBorder)}
    >
      {to ? (
        <p className={`mb-2 text-lg font-semibold ${onDark ? 'text-white' : 'text-black'}`}>
          To: {to}
        </p>
      ) : (
        <p
          className={`mb-2 text-lg font-semibold ${onDark ? 'text-white/70' : 'text-black/70'}`}
        >
          To: You
        </p>
      )}
      <FormattedMessageBody
        message={message}
        messageFormat={messageFormat}
        compact={compact}
        onDark={onDark}
      />
      {from ? (
        <p className={`mt-4 text-right font-semibold ${onDark ? 'text-white' : 'text-black'}`}>
          With love, {from}
        </p>
      ) : (
        <p
          className={`mt-4 text-right font-semibold ${onDark ? 'text-white/70' : 'text-black/70'}`}
        >
          With love
        </p>
      )}
    </div>
  )
}

export function PhotoCard({
  photoImage,
  to,
  message,
  from,
  messageFormat,
  noteBorder,
  noteStyleId = FEATURED_CARD_ID,
  compact = false,
  flipped = false,
  stackedPreview = false,
  onFlip,
  onUploadClick,
  showFlipHint = false,
  className = '',
}: PhotoCardProps) {
  const minHeight = compact ? 'min-h-[160px]' : 'min-h-[220px]'

  if (stackedPreview && photoImage) {
    return (
      <div data-testid="photo-card-stacked" className={`w-full ${className}`}>
        <div className="overflow-hidden rounded-t-3xl shadow-md">
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={photoImage}
              alt="Your photo card"
              fill
              unoptimized
              className="object-cover"
            />
          </div>
        </div>
        <NoteBack
          to={to}
          message={message}
          from={from}
          messageFormat={messageFormat}
          noteBorder={noteBorder}
          noteStyleId={noteStyleId}
          compact={compact}
          className="rounded-t-none rounded-b-3xl shadow-md"
        />
        <p className="mt-2 text-center text-xs text-bloom-ink/50">
          Tap to see flip animation when they receive it
        </p>
      </div>
    )
  }

  if (!photoImage && onUploadClick) {
    return (
      <div
        data-testid="photo-card-upload"
        data-upload-area
        role="button"
        tabIndex={0}
        onClick={(event) => {
          event.stopPropagation()
          onUploadClick()
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            event.stopPropagation()
            onUploadClick()
          }
        }}
        className={`note-card flex ${minHeight} w-full flex-col items-center justify-center rounded-3xl bg-white/90 p-6 text-center shadow-md transition hover:bg-brand-pink/[0.03] ${className}`}
        style={getNoteBorderStyle()}
      >
        <span className="text-3xl" aria-hidden>
          📷
        </span>
        <p className="mt-2 text-base font-semibold text-bloom-ink">Upload your photo</p>
        <p className="mt-1 text-xs text-bloom-ink/55">Front of the card — your note goes on the back</p>
      </div>
    )
  }

  const canFlip = Boolean(onFlip && photoImage)

  return (
    <div
      data-testid="photo-card"
      className={`perspective-card w-full ${className}`}
      style={{ minHeight: compact ? '10rem' : '14rem' }}
    >
      <div
        role={canFlip ? 'button' : undefined}
        tabIndex={canFlip ? 0 : undefined}
        onClick={canFlip ? onFlip : undefined}
        onKeyDown={
          canFlip
            ? (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onFlip?.()
                }
              }
            : undefined
        }
        className={`photo-card-flip preserve-3d relative h-full w-full ${canFlip ? 'cursor-pointer' : 'cursor-default'} ${flipped ? 'is-flipped' : ''} ${minHeight}`}
      >
        <div className="photo-card-face backface-hidden absolute inset-0 overflow-hidden rounded-3xl shadow-md">
          {photoImage ? (
            <div className="relative h-full w-full">
              <Image
                src={photoImage}
                alt="Your photo card"
                fill
                unoptimized
                className="object-cover"
              />
              {showFlipHint && !flipped ? (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent px-4 py-3 text-center">
                  <p className="text-sm font-medium text-white">Tap to flip</p>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center bg-bloom-cream text-sm text-bloom-ink/50">
              Photo preview
            </div>
          )}
        </div>

        <div className="photo-card-face photo-card-back backface-hidden absolute inset-0">
          <NoteBack
            to={to}
            message={message}
            from={from}
            messageFormat={messageFormat}
            noteBorder={noteBorder}
            noteStyleId={noteStyleId}
            compact={compact}
          />
        </div>
      </div>
    </div>
  )
}

export function isPhotoCardStyle(styleId: string): boolean {
  return styleId === PHOTO_CARD_ID
}
