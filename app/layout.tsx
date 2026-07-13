import type { Metadata } from 'next'
import {
  Caveat,
  Courier_Prime,
  EB_Garamond,
  Inter,
  Lora,
  Nunito,
  Playfair_Display,
  Raleway,
  Sacramento,
} from 'next/font/google'

import { Footer } from '@/components/ui/Footer'
import { ToastProvider } from '@/components/ui/Toast'

import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
})

const lora = Lora({
  variable: '--font-lora',
  subsets: ['latin'],
  weight: ['400', '500'],
})

const ebGaramond = EB_Garamond({
  variable: '--font-eb-garamond',
  subsets: ['latin'],
  weight: ['400', '500'],
})

const nunito = Nunito({
  variable: '--font-nunito',
  subsets: ['latin'],
  weight: ['400', '600'],
})

const raleway = Raleway({
  variable: '--font-raleway',
  subsets: ['latin'],
  weight: ['400', '500'],
})

const caveat = Caveat({
  variable: '--font-caveat',
  subsets: ['latin'],
  weight: ['400', '600'],
})

const sacramento = Sacramento({
  variable: '--font-sacramento',
  subsets: ['latin'],
  weight: '400',
})

const courierPrime = Courier_Prime({
  variable: '--font-courier-prime',
  subsets: ['latin'],
  weight: ['400', '700'],
})

const fontVariables = [
  inter.variable,
  playfair.variable,
  lora.variable,
  ebGaramond.variable,
  nunito.variable,
  raleway.variable,
  caveat.variable,
  sacramento.variable,
  courierPrime.variable,
].join(' ')

export const metadata: Metadata = {
  metadataBase: new URL('https://bloom.app'),
  title: {
    default: 'Bloom - Send a Digital Bouquet',
    template: '%s | Bloom',
  },
  description:
    'Build a beautiful digital bouquet with a personal card. Free, instant, and private.',
  openGraph: {
    title: 'Bloom - Send a Digital Bouquet',
    description:
      'Build a beautiful digital bouquet with a personal card. Free, instant, and private.',
    images: ['/og-image.png'],
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body
        className={`${fontVariables} flex min-h-full flex-col bg-bloom-cream font-sans text-bloom-ink antialiased`}
      >
        <ToastProvider>
          <div className="flex flex-1 flex-col">{children}</div>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  )
}
