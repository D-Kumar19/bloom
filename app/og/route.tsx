import { ImageResponse } from 'next/og'

import { OgCard } from '@/lib/og/OgCard'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    <OgCard
      title="Send a digital bouquet"
      subtitle="Pick flowers, write a note, share a private link."
    />,
    { width: 1200, height: 630 },
  )
}
