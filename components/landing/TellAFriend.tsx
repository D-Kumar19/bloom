'use client'

import { useState } from 'react'

import { useToast } from '@/components/ui/Toast'
import { SITE_SHARE_TEXT, buildSiteShareMessage } from '@/lib/sharing'
import { getSiteOrigin } from '@/lib/siteUrl'

/** Shares Bloom itself (not a gift); never touches the bouquet counter. */
export function TellAFriend() {
  const { showToast } = useToast()
  const [copied, setCopied] = useState(false)

  const copyMessage = async (origin: string) => {
    try {
      await navigator.clipboard.writeText(buildSiteShareMessage(origin))
      setCopied(true)
      showToast('Copied. Paste it to a friend who would like Bloom.', 'success')
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      showToast(`Could not copy. Share this address instead: ${origin}`, 'warning')
    }
  }

  const handleShare = async () => {
    const origin = getSiteOrigin()
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: 'Bloom', text: SITE_SHARE_TEXT, url: origin })
        return
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }
      }
    }
    await copyMessage(origin)
  }

  return (
    <button
      type="button"
      data-testid="tell-a-friend"
      onClick={handleShare}
      className="mt-3 inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 text-sm font-medium text-bloom-ink/75 underline decoration-bloom-rose/40 underline-offset-4 transition hover:text-brand-pink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bloom-ink"
    >
      <span aria-hidden="true">💌</span>
      {copied ? 'Copied!' : 'Tell a friend about Bloom'}
    </button>
  )
}
