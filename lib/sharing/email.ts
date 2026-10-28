import { buildShareMessage } from './share'
import type { BouquetState } from '../types'

/** Some mail apps truncate very long compose links; above this we show a gentle hint. */
export const EMAIL_LINK_SOFT_LIMIT = 1800

export interface EmailShareLinks {
  subject: string
  body: string
  mailto: string
  gmail: string
  outlook: string
  isLong: boolean
}

export function buildEmailSubject(from: string): string {
  const sender = from.trim()
  return sender ? `A bouquet from ${sender}` : 'A bouquet for you'
}

/** Compose links with subject and body filled in; the recipient address is left for the sender. */
export function buildEmailShareLinks(state: BouquetState): EmailShareLinks {
  const subject = buildEmailSubject(state.from)
  const body = buildShareMessage(state)
  const s = encodeURIComponent(subject)
  const b = encodeURIComponent(body)
  const mailto = `mailto:?subject=${s}&body=${b}`
  return {
    subject,
    body,
    mailto,
    gmail: `https://mail.google.com/mail/?view=cm&fs=1&su=${s}&body=${b}`,
    outlook: `https://outlook.live.com/mail/0/deeplink/compose?subject=${s}&body=${b}`,
    isLong: mailto.length > EMAIL_LINK_SOFT_LIMIT,
  }
}
