import { buildShareUrl } from './encode'
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

/** A short personal note around the link; link-only emails are more likely to land in spam. */
export function buildEmailBody(state: BouquetState): string {
  const to = state.to.trim()
  const from = state.from.trim()
  const greeting = to ? `Hi ${to},` : 'Hi,'
  const signOff = from ? `With love,\n${from}` : 'With love'
  return [
    greeting,
    '',
    'I made you a little digital bouquet with a note inside. Open it when you have a quiet moment:',
    '',
    buildShareUrl(state),
    '',
    signOff,
  ].join('\n')
}

export function buildEmailSubject(from: string): string {
  const sender = from.trim()
  return sender ? `A bouquet from ${sender}` : 'A bouquet for you'
}

/** Compose links with subject and body filled in; the recipient address is left for the sender. */
export function buildEmailShareLinks(state: BouquetState): EmailShareLinks {
  const subject = buildEmailSubject(state.from)
  const body = buildEmailBody(state)
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
