import type { MessageFormat } from '@/lib/types'

import {
  getMessageFormatStyles,
  isRichMessage,
  plainTextToMessageHtml,
  resolveNoteTextColor,
  sanitizeMessageHtml,
} from '@/lib/message'

type FormattedMessageBodyProps = {
  message: string
  messageFormat?: MessageFormat
  compact?: boolean
  placeholder?: string
  onDark?: boolean
  className?: string
}

export function FormattedMessageBody({
  message,
  messageFormat,
  compact = false,
  placeholder = 'Your message will appear here...',
  onDark = false,
  className = '',
}: FormattedMessageBodyProps) {
  const formatStyles = getMessageFormatStyles(
    messageFormat ?? { fontFamily: 'inter', fontSize: 'base', color: '#000000' },
  )
  const textColor = resolveNoteTextColor(onDark, messageFormat)

  if (!message) {
    return (
      <p
        className={`relative z-[1] leading-relaxed whitespace-pre-wrap text-black ${compact ? 'text-sm' : 'text-base'} ${className}`}
        style={{ fontFamily: formatStyles.fontFamily, color: textColor }}
      >
        {placeholder}
      </p>
    )
  }

  if (isRichMessage(message)) {
    const displayHtml = message.includes('<')
      ? sanitizeMessageHtml(message)
      : sanitizeMessageHtml(message.replace(/\n/g, '<br>'))

    return (
      <div
        data-testid="formatted-message-body"
        className={`relative z-[1] leading-relaxed whitespace-pre-wrap ${formatStyles.fontSizeClass} ${compact ? 'text-sm' : ''} ${className}`}
        style={{ fontFamily: formatStyles.fontFamily, color: textColor }}
        dangerouslySetInnerHTML={{ __html: displayHtml }}
      />
    )
  }

  return (
    <p
      className={`relative z-[1] leading-relaxed whitespace-pre-wrap ${formatStyles.fontSizeClass} ${compact ? 'text-sm' : 'text-base'} ${className}`}
      style={{ fontFamily: formatStyles.fontFamily, color: textColor }}
    >
      {message}
    </p>
  )
}

export function messageHtmlFromPlainText(text: string): string {
  return plainTextToMessageHtml(text)
}
