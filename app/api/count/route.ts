import { NextResponse } from 'next/server'

import { getBouquetCount, incrementBouquetCount } from '@/lib/counter'

export async function GET() {
  const count = await getBouquetCount()
  return NextResponse.json({ count })
}

export async function POST() {
  const count = await incrementBouquetCount()
  return NextResponse.json({ count })
}
