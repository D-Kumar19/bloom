import { stripMessageHtml } from './messageRichText'
import { countMessageWords } from './messageWords'
import { MAX_MESSAGE_WORDS } from '../types'

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
    hasMessageContent(message) &&
    countMessageWords(message) <= MAX_MESSAGE_WORDS
  )
}
