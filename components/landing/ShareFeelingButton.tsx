'use client'

import { useState } from 'react'

import { useToast } from '@/components/ui/Toast'
import { buildSiteShareMessage } from '@/lib/sharing'
import { Button } from '@/components/ui/Button'

export function ShareFeelingButton() {
  const { showToast } = useToast()
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const message = buildSiteShareMessage(window.location.origin)

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Bloom',
          text: message,
        })
        return
      }

      await navigator.clipboard.writeText(message)
      setCopied(true)
      showToast('Copied! Send it to someone who deserves flowers today.', 'success')
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // User cancelled share sheet or clipboard unavailable
    }
  }

  return (
    <Button variant="secondary" onClick={handleShare}>
      {copied ? 'Copied!' : 'Send this to someone who deserves flowers today'}
    </Button>
  )
}
