import { stripMessageHtml } from './messageRichText'
import { countMessageWords } from './messageWords'
import { MIN_MESSAGE_WORDS, MAX_MESSAGE_WORDS } from '../types'

export function hasMessageContent(message: string): boolean {
  return stripMessageHtml(message).trim().length > 0
}

export function shouldShowNoteCard(message: string): boolean {
  return hasMessageContent(message)
}

/** Message step requires names and a note within the word limits. */
export function canProceedMessageStep(to: string, from: string, message: string): boolean {
  const words = countMessageWords(message)
  return (
    to.trim().length > 0 &&
    from.trim().length > 0 &&
    words >= MIN_MESSAGE_WORDS &&
    words <= MAX_MESSAGE_WORDS
  )
}
