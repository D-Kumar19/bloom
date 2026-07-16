import { stripMessageHtml } from './messageRichText'

export function hasMessageContent(message: string): boolean {
  return stripMessageHtml(message).trim().length > 0
}

export function shouldShowNoteCard(message: string): boolean {
  return hasMessageContent(message)
}

/** Message step requires recipient, sender name, and note text. */
export function canProceedMessageStep(to: string, from: string, message: string): boolean {
  return (
    to.trim().length > 0 &&
    from.trim().length > 0 &&
    hasMessageContent(message)
  )
}
