import type { CardStyle, MessageFormat, NoteBorder } from '@/lib/types'

import { getNoteBorderStyle } from '@/lib/cards'
import { getNoteSurfaceClass } from '@/lib/cards'
import { FormattedMessageBody } from '@/components/cards/FormattedMessageBody'

type MessageCardProps = {
  styleId: string
  to: string
  message: string
  from: string
  messageFormat?: MessageFormat
  noteBorder?: NoteBorder
  compact?: boolean
  folded?: boolean
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
  compact = false,
  folded = false,
  onClick,
  className = '',
}: MessageCardProps) {
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
            event.preventDefault()
            onClick?.()
          }
        }}
        className={`note-card flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-bloom-rose/40 bg-white p-6 shadow-lg transition hover:scale-[1.02] ${className}`}
      >
        <p className="text-lg font-semibold text-[#2a2420]">Tap card to read</p>
        <p className="mt-1 text-xs text-[#2a2420]/70">A message is waiting inside</p>
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
                event.preventDefault()
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
