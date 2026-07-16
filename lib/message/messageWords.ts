import { plainTextToMessageHtml, sanitizeMessageHtml, stripMessageHtml } from './messageRichText'

export function countWords(text: string): number {
  const trimmed = text.trim()
  if (!trimmed) {
    return 0
  }

  return trimmed.split(/\s+/).length
}

export function countMessageWords(html: string): number {
  return countWords(stripMessageHtml(html))
}

export function truncateMessageHtml(html: string, maxWords: number): string {
  const plain = stripMessageHtml(html)
  const words = plain.trim().split(/\s+/).filter(Boolean)

  if (words.length <= maxWords) {
    return sanitizeMessageHtml(html)
  }

  return plainTextToMessageHtml(words.slice(0, maxWords).join(' '))
}
