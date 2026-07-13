import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Someone sent you a bouquet',
  description: 'Open to see your digital flowers and message',
  openGraph: {
    title: 'Someone sent you a bouquet',
    description: 'Open to see your digital flowers and message',
    images: ['/og-image.png'],
  },
}

export default function BouquetLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
