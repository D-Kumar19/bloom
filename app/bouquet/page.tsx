import type { Metadata } from 'next'

import { BouquetViewer } from '@/app/bouquet/BouquetViewer'
import { getBouquetDocumentTitle } from '@/lib/bouquet/recipientCopy'
import { decodeBouquet } from '@/lib/sharing'

type BouquetPageProps = {
  searchParams: Promise<{ b?: string }>
}

export async function generateMetadata({ searchParams }: BouquetPageProps): Promise<Metadata> {
  const params = await searchParams
  const encoded = params.b

  if (!encoded) {
    return {
      title: 'Your bouquet',
      description: 'Open to see your digital bouquet and message',
    }
  }

  const bouquet = decodeBouquet(encoded)
  if (!bouquet) {
    return {
      title: 'Your bouquet',
      description: 'Open to see your digital bouquet and message',
    }
  }

  const title = getBouquetDocumentTitle(bouquet.from)

  return {
    title,
    description: `${bouquet.from.trim() || 'Someone'} sent you a digital bouquet on Bloom.`,
    openGraph: {
      title,
      description: 'Open to see your digital bouquet and message',
    },
  }
}

export default function BouquetPage() {
  return <BouquetViewer />
}
