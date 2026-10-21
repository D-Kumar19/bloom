import type { MessageFormat } from '../types'
import { getMessageFontFamily } from './messageFonts'

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

const DARK_INK_COLORS = new Set(['#000000', '#3d2f2f', '#1a1a2e'])

/** True when the chosen color should follow theme ink (light/dark) instead of a fixed hex. */
export function usesThemeInkColor(color: string): boolean {
  return DARK_INK_COLORS.has(color.toLowerCase())
}

/** Picks readable note text on light vs midnight card surfaces. */
export function resolveNoteTextColor(onDark: boolean, messageFormat?: MessageFormat): string {
  const color = messageFormat?.color ?? DEFAULT_MESSAGE_FORMAT.color
  if (onDark && usesThemeInkColor(color)) {
    return '#ffffff'
  }
  return color
}

export function stripMessageHtml(html: string): string {
  // Keep extraction identical during server rendering and browser editing.
  const entities: Record<string, string> = {
    amp: '&',
    lt: '<',
    gt: '>',
    quot: '"',
    apos: "'",
    nbsp: '\u00a0',
    Tab: '\t',
    NewLine: '\n',
    ensp: '\u2002',
    emsp: '\u2003',
    thinsp: '\u2009',
    ndash: '\u2013',
    mdash: '\u2014',
    hellip: '\u2026',
  }
  return stripEditorArtifacts(
    html
      .replace(/<br\b[^>]*>/gi, '\n')
      .replace(/<\/?(?:div|p|li|h[1-6]|blockquote|ul|ol)\b[^>]*>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (entity, name: string) => {
        if (name.startsWith('#')) {
          const code =
            name[1].toLowerCase() === 'x' ? parseInt(name.slice(2), 16) : Number(name.slice(1))
          return code > 0 && code <= 0x10ffff && !(code >= 0xd800 && code <= 0xdfff)
            ? String.fromCodePoint(code)
            : '\ufffd'
        }
        return entities[name] ?? entity
      }),
  )
}

export function plainTextToMessageHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>')
}

const EDITOR_ZERO_WIDTH_SPACE = '\u200B'

function stripEditorArtifacts(text: string): string {
  return text.replaceAll(EDITOR_ZERO_WIDTH_SPACE, '')
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

    if (block.previousSibling && !(block.previousSibling instanceof HTMLBRElement)) {
      parent.insertBefore(document.createElement('br'), block)
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
  return stripEditorArtifacts(container.innerHTML)
}

/** Decodes nbsp entities for card preview without mutating stored editor HTML. */
export function normalizeMessageHtmlForDisplay(html: string): string {
  return normalizeNbspEntities(sanitizeMessageHtml(html))
}

export function getMessageFormatStyles(format: MessageFormat): {
  fontFamily: string
  fontSizeClass: string
  color: string
} {
  const size =
    MESSAGE_SIZE_OPTIONS.find((option) => option.id === format.fontSize) ?? MESSAGE_SIZE_OPTIONS[1]

  return {
    fontFamily: getMessageFontFamily(format.fontFamily),
    fontSizeClass: size.className,
    color: format.color,
  }
}

export function isRichMessage(message: string): boolean {
  return /<(?:br|span|b|strong|i|em)\b/i.test(message) || /&(?:nbsp|amp|lt|gt);/i.test(message)
}
