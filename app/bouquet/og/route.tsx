import { ImageResponse } from 'next/og'

import { getBouquetById } from '@/lib/bouquets'
import { decodeBouquet } from '@/lib/sharing'

export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const encoded = searchParams.get('b')
  const bouquet = encoded ? decodeBouquet(encoded) : null

  const to = bouquet?.to?.trim() || 'Someone special'
  const from = bouquet?.from?.trim() || 'Someone'
  const bouquetMeta = bouquet ? getBouquetById(bouquet.bouquetId) : null

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(145deg, #fdf8f5 0%, #f5e6e8 50%, #e8d4e0 100%)',
          fontFamily: 'Georgia, serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '48px',
            borderRadius: '24px',
            background: 'rgba(255,255,255,0.85)',
            border: '2px solid #e8a5a5',
            maxWidth: '900px',
          }}
        >
          <p style={{ fontSize: 28, color: '#e91e8c', margin: 0, letterSpacing: '0.15em' }}>
            BLOOM
          </p>
          <p style={{ fontSize: 52, color: '#3d2f2f', margin: '24px 0 12px', textAlign: 'center' }}>
            A bouquet for {to}
          </p>
          <p style={{ fontSize: 28, color: '#3d2f2f99', margin: 0, textAlign: 'center' }}>
            From {from}
            {bouquetMeta ? ` · ${bouquetMeta.name}` : ''}
          </p>
          {bouquetMeta ? (
            <p
              style={{
                fontSize: 22,
                color: '#3d2f2f80',
                marginTop: 20,
                fontStyle: 'italic',
                textAlign: 'center',
                maxWidth: 700,
              }}
            >
              {bouquetMeta.meaning}
            </p>
          ) : null}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}
