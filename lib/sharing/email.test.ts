import { describe, expect, it } from 'vitest'

import { buildEmailBody, buildEmailShareLinks, buildEmailSubject, buildShareUrl } from '@/lib/sharing'
import type { BouquetState } from '@/lib/types'

const sampleState: BouquetState = {
  bouquetId: 'red-rose-classic',
  cardStyle: 'classic-cream',
  to: 'Sam',
  message: 'Thinking of you & smiling.',
  from: 'Alex',
  theme: 'warm',
}

describe('email sharing', () => {
  it('names the sender in the subject, or stays anonymous', () => {
    expect(buildEmailSubject('  Alex ')).toBe('A bouquet from Alex')
    expect(buildEmailSubject('   ')).toBe('A bouquet for you')
  })

  it('builds mailto, Gmail, and Outlook compose links without a recipient', () => {
    const links = buildEmailShareLinks(sampleState)
    const body = buildEmailBody(sampleState)

    expect(links.mailto.startsWith('mailto:?subject=')).toBe(true)
    expect(new URLSearchParams(links.mailto.slice('mailto:?'.length)).get('body')).toBe(body)

    const gmail = new URL(links.gmail)
    expect(gmail.hostname).toBe('mail.google.com')
    expect(gmail.searchParams.get('view')).toBe('cm')
    expect(gmail.searchParams.get('su')).toBe('A bouquet from Alex')
    expect(gmail.searchParams.get('body')).toBe(body)
    expect(gmail.searchParams.has('to')).toBe(false)

    const outlook = new URL(links.outlook)
    expect(outlook.hostname).toBe('outlook.live.com')
    expect(outlook.searchParams.get('subject')).toBe('A bouquet from Alex')
    expect(outlook.searchParams.get('body')).toBe(body)
  })

  it('writes a short personal note around the gift link', () => {
    const body = buildEmailBody(sampleState)
    expect(body.startsWith('Hi Sam,')).toBe(true)
    expect(body).toContain(`\n${buildShareUrl(sampleState)}\n`)
    expect(body.endsWith('With love,\nAlex')).toBe(true)

    const anonymous = buildEmailBody({ ...sampleState, from: '  ' })
    expect(anonymous.endsWith('With love')).toBe(true)
  })

  it('keeps the encoded gift link intact inside the compose link', () => {
    const links = buildEmailShareLinks(sampleState)
    expect(links.body).toMatch(/\/bouquet\?b=/)
    expect(decodeURIComponent(links.mailto)).toContain(buildShareUrl(sampleState))
  })

  it('flags long compose links so the UI can suggest copying instead', () => {
    expect(buildEmailShareLinks(sampleState).isLong).toBe(false)
    const varied = Array.from({ length: 200 }, (_, i) => `${(i * 7919).toString(36)}q${i}`).join(' ')
    const long = { ...sampleState, message: varied }
    expect(buildEmailShareLinks(long).isLong).toBe(true)
  })
})
