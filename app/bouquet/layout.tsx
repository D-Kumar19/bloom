import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Your bouquet',
    template: '%s | Bloom',
  },
  description: 'Open to see your digital bouquet and message',
  openGraph: {
    title: 'Your bouquet',
    description: 'Open to see your digital bouquet and message',
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
