import type { Metadata } from 'next'
import {
  Caveat,
  Courier_Prime,
  EB_Garamond,
  Fraunces,
  Inter,
  Lora,
  Nunito,
  Playfair_Display,
  Raleway,
  Sacramento,
} from 'next/font/google'

import { AppearanceProvider } from '@/components/ui/AppearanceProvider'
import { Footer } from '@/components/ui/Footer'
import { FooterGate } from '@/components/layout/FooterGate'
import { SiteChrome } from '@/components/layout/SiteChrome'
import { ToastProvider } from '@/components/ui/Toast'
import { APPEARANCE_STORAGE_KEY, DEFAULT_APPEARANCE } from '@/lib/appearance'
import { SITE_TITLE } from '@/lib/site'
import { getSiteMetadataBase } from '@/lib/siteUrl'

import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
})

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
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
  fraunces.variable,
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
  metadataBase: getSiteMetadataBase(),
  title: {
    default: SITE_TITLE,
    template: '%s | Bloom',
  },
  description:
    'Bloom turns a feeling into a link. Pick a bouquet, write a note, share a private link.',
  openGraph: {
    title: SITE_TITLE,
    description:
      'Bloom turns a feeling into a link. Pick a bouquet, write a note, share a private link.',
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
      <head>
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var key=${JSON.stringify(APPEARANCE_STORAGE_KEY)};var fallback=${JSON.stringify(DEFAULT_APPEARANCE)};var mode=localStorage.getItem(key)||fallback;var dark=mode==='dark'||(mode==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',dark);document.documentElement.dataset.appearance=mode;}catch(e){}})();`,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${fontVariables} flex min-h-full flex-col bg-background font-sans text-foreground antialiased`}
      >
        <AppearanceProvider>
          <ToastProvider>
            <SiteChrome>
              <div className="flex flex-1 flex-col">{children}</div>
              <FooterGate>
                <Footer />
              </FooterGate>
            </SiteChrome>
          </ToastProvider>
        </AppearanceProvider>
      </body>
    </html>
  )
}
