import { ImageResponse } from 'next/og'

import { OgCard } from '@/lib/og/OgCard'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    <OgCard
      title="A bouquet is waiting for you"
      subtitle="A small moment, made for someone."
    />,
    { width: 1200, height: 630 },
  )
}
