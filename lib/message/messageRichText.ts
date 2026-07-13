import type { MessageFormat } from '../types'
import { getMessageFontFamily, MESSAGE_FONT_OPTIONS } from './messageFonts'

export { MESSAGE_FONT_OPTIONS } from './messageFonts'
export type { MessageFontFamily } from './messageFonts'

export const MESSAGE_SIZE_OPTIONS = [
  { id: 'sm', label: 'Small', className: 'text-sm' },
  { id: 'base', label: 'Normal', className: 'text-base' },
  { id: 'lg', label: 'Large', className: 'text-lg' },
] as const

export const MESSAGE_COLOR_OPTIONS = [
  { id: 'ink', label: 'Ink', value: '#000000' },
  { id: 'rose', label: 'Rose', value: '#c45c5c' },
  { id: 'sage', label: 'Sage', value: '#5a7a52' },
  { id: 'lavender', label: 'Lavender', value: '#6b5b8a' },
  { id: 'gold', label: 'Gold', value: '#9a7340' },
  { id: 'midnight', label: 'Midnight', value: '#1a1a2e' },
] as const

export const DEFAULT_MESSAGE_FORMAT: MessageFormat = {
  fontFamily: 'inter',
  fontSize: 'base',
  color: '#000000',
}

/** Picks readable note text on light vs midnight card surfaces. */
export function resolveNoteTextColor(
  onDark: boolean,
  messageFormat?: MessageFormat,
): string {
  const color = messageFormat?.color ?? DEFAULT_MESSAGE_FORMAT.color
  if (onDark && (color === '#000000' || color === '#3d2f2f')) {
    return '#ffffff'
  }
  return color
}

export function stripMessageHtml(html: string): string {
  if (!html.includes('<') && !html.includes('&')) {
    return html
  }

  if (typeof document !== 'undefined') {
    const container = document.createElement('div')
    container.innerHTML = html
    return container.textContent ?? ''
  }

  return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/gi, ' ')
}

export function plainTextToMessageHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>')
}

function normalizeNbspEntities(html: string): string {
  return html.replace(/&nbsp;/gi, ' ')
}

function unwrapBlockElements(container: HTMLElement): void {
  const blocks = Array.from(container.querySelectorAll('div, p'))

  for (const block of blocks) {
    const parent = block.parentNode
    if (!parent) {
      continue
    }

    const fragment = document.createDocumentFragment()
    while (block.firstChild) {
      fragment.appendChild(block.firstChild)
    }

    parent.insertBefore(fragment, block)

    const lineBreak = document.createElement('br')
    parent.insertBefore(lineBreak, block)
    parent.removeChild(block)
  }
}

export function editorNeedsDomCleanup(html: string): boolean {
  return /<(div|p|script|style)\b/i.test(html)
}

export function sanitizeMessageHtml(html: string): string {
  if (typeof document === 'undefined') {
    return stripMessageHtml(html)
  }

  const allowedTags = new Set(['B', 'STRONG', 'I', 'EM', 'SPAN', 'BR'])
  const container = document.createElement('div')
  container.innerHTML = html

  unwrapBlockElements(container)

  const walk = (node: Node) => {
    const children = Array.from(node.childNodes)
    for (const child of children) {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const element = child as HTMLElement
        if (!allowedTags.has(element.tagName)) {
          const text = document.createTextNode(element.textContent ?? '')
          element.replaceWith(text)
          continue
        }

        const keepStyle = element.tagName === 'SPAN' ? element.getAttribute('style') : null
        Array.from(element.attributes).forEach((attr) => element.removeAttribute(attr.name))
        if (keepStyle) {
          const safeStyle = keepStyle
            .split(';')
            .map((rule) => rule.trim())
            .filter((rule) => {
              const lower = rule.toLowerCase()
              return (
                lower.startsWith('color:') ||
                lower.startsWith('font-size:') ||
                lower.startsWith('font-family:') ||
                lower.startsWith('font-weight:') ||
                lower.startsWith('font-style:')
              )
            })
            .join('; ')
          if (safeStyle) {
            element.setAttribute('style', safeStyle)
          }
        }

        walk(element)
      }
    }
  }

  walk(container)
  return container.innerHTML
}

/** Decodes nbsp entities for card preview without mutating stored editor HTML. */
export function normalizeMessageHtmlForDisplay(html: string): string {
  return normalizeNbspEntities(sanitizeMessageHtml(html))
}

export function truncateMessageHtml(html: string, maxPlainLength: number): string {
  const plain = stripMessageHtml(html)
  if (plain.length <= maxPlainLength) {
    return sanitizeMessageHtml(html)
  }

  return plainTextToMessageHtml(plain.slice(0, maxPlainLength))
}

export function getMessageFormatStyles(format: MessageFormat): {
  fontFamily: string
  fontSizeClass: string
  color: string
} {
  const size =
    MESSAGE_SIZE_OPTIONS.find((option) => option.id === format.fontSize) ??
    MESSAGE_SIZE_OPTIONS[1]

  return {
    fontFamily: getMessageFontFamily(format.fontFamily),
    fontSizeClass: size.className,
    color: format.color,
  }
}

export function isRichMessage(message: string): boolean {
  return (
    /<(?:br|span|b|strong|i|em)\b/i.test(message) || /&(?:nbsp|amp|lt|gt);/i.test(message)
  )
}
