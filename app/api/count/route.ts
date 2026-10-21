import { NextResponse } from 'next/server'

import { getBouquetCount, incrementBouquetCount } from '@/lib/counter'

const headers = { 'Cache-Control': 'no-store' }

function unavailable() {
  return NextResponse.json(
    { error: 'Bouquet count is temporarily unavailable' },
    { status: 503, headers }
  )
}

export async function GET() {
  const count = await getBouquetCount()
  return count === null
    ? unavailable()
    : NextResponse.json({ count }, { headers })
}

export async function POST() {
  try {
    const count = await incrementBouquetCount()
    return NextResponse.json({ count }, { headers })
  } catch {
    console.error(
      'Bouquet counter increment failed. Check Redis availability and configuration.'
    )
    return unavailable()
  }
}
