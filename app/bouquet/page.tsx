import type { Metadata } from 'next'

import { BouquetViewer } from '@/app/bouquet/BouquetViewer'

// Personal gift data is decoded only by the viewer, never for crawler metadata.
export const metadata: Metadata = {
  title: 'A bouquet is waiting for you',
  description: 'Open a digital bouquet and a personal note on Bloom.',
  robots: { index: false, follow: false, nocache: true },
  referrer: 'no-referrer',
  openGraph: {
    title: 'A bouquet is waiting for you',
    description: 'A small moment, made for someone. Open it on Bloom.',
    images: [{ url: '/bouquet/og', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'A bouquet is waiting for you',
    description: 'A small moment, made for someone. Open it on Bloom.',
    images: ['/bouquet/og'],
  },
}

export default function BouquetPage() {
  return <BouquetViewer />
}
