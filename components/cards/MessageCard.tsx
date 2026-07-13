import type { CardStyle, MessageFormat, NoteBorder } from '@/lib/types'

import { PHOTO_CARD_ID } from '@/lib/cards'
import { getNoteBorderStyle } from '@/lib/noteBorder'
import { getNoteSurfaceClass } from '@/lib/noteSurfaces'
import { PhotoCard } from '@/components/cards/PhotoCard'
import { FormattedMessageBody } from '@/components/cards/FormattedMessageBody'

type MessageCardProps = {
  styleId: string
  to: string
  message: string
  from: string
  messageFormat?: MessageFormat
  noteBorder?: NoteBorder
  photoImage?: string
  photoNoteStyleId?: string
  compact?: boolean
  folded?: boolean
  photoFlipped?: boolean
  photoStackedPreview?: boolean
  onPhotoFlip?: () => void
  onPhotoUploadClick?: () => void
  showPhotoFlipHint?: boolean
  onClick?: () => void
  className?: string
}

function headingClass(hasValue: boolean, onDark = false): string {
  if (onDark) {
    return hasValue ? 'text-white' : 'text-white/70'
  }

  return hasValue ? 'text-black' : 'text-black/70'
}

export function MessageCard({
  styleId,
  to,
  message,
  from,
  messageFormat,
  noteBorder,
  photoImage,
  photoNoteStyleId,
  compact = false,
  folded = false,
  photoFlipped = false,
  photoStackedPreview = false,
  onPhotoFlip,
  onPhotoUploadClick,
  showPhotoFlipHint = false,
  onClick,
  className = '',
}: MessageCardProps) {
  if (styleId === PHOTO_CARD_ID) {
    return (
      <PhotoCard
        photoImage={photoImage}
        to={to}
        message={message}
        from={from}
        messageFormat={messageFormat}
        noteBorder={noteBorder}
        noteStyleId={photoNoteStyleId}
        compact={compact}
        flipped={photoFlipped}
        stackedPreview={photoStackedPreview}
        onFlip={onPhotoFlip}
        onUploadClick={onPhotoUploadClick}
        showFlipHint={showPhotoFlipHint}
        className={className}
      />
    )
  }

  const surface = getNoteSurfaceClass(styleId)
  const onDark = styleId === 'midnight'

  if (folded) {
    return (
      <div
        data-testid="message-card-folded"
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            onClick?.()
          }
        }}
        className={`note-card flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-bloom-rose/30 bg-white/90 p-6 shadow-md transition hover:scale-[1.02] ${className}`}
      >
        <p className="text-lg font-semibold text-bloom-ink">Tap card to read</p>
        <p className="mt-1 text-xs text-bloom-ink/50">A message is waiting inside</p>
      </div>
    )
  }

  return (
    <div
      data-testid="message-card"
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                onClick()
              }
            }
          : undefined
      }
      className={`note-card rounded-3xl p-6 shadow-md transition ${surface} ${onClick ? 'cursor-pointer hover:scale-[1.02]' : ''} ${compact ? 'p-4 text-sm' : ''} ${className}`}
      style={getNoteBorderStyle(noteBorder)}
    >
      {to ? (
        <p className={`mb-2 text-lg font-semibold ${headingClass(true, onDark)}`}>To: {to}</p>
      ) : (
        <p className={`mb-2 text-lg font-semibold ${headingClass(false, onDark)}`}>To: You</p>
      )}
      <FormattedMessageBody
        message={message}
        messageFormat={messageFormat}
        compact={compact}
        onDark={onDark}
      />
      {from ? (
        <p className={`relative z-[1] mt-4 text-right font-semibold ${headingClass(true, onDark)}`}>
          With love, {from}
        </p>
      ) : (
        <p className={`relative z-[1] mt-4 text-right font-semibold ${headingClass(false, onDark)}`}>
          With love
        </p>
      )}
    </div>
  )
}

export function getCardStyleName(styleId: string, styles: CardStyle[]): string {
  return styles.find((s) => s.id === styleId)?.name ?? 'Classic Cream'
}
