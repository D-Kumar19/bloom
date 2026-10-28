import type { Metadata } from 'next'
import localFont from 'next/font/local'

import { AppearanceProvider } from '@/components/ui/AppearanceProvider'
import { Footer } from '@/components/ui/Footer'
import { FooterGate } from '@/components/layout/FooterGate'
import { SiteChrome } from '@/components/layout/SiteChrome'
import { ToastProvider } from '@/components/ui/Toast'
import { APPEARANCE_STORAGE_KEY, DEFAULT_APPEARANCE } from '@/lib/appearance'
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE } from '@/lib/site'
import { SITE_OG_IMAGE } from '@/lib/pageMetadata'
import { getSiteMetadataBase } from '@/lib/siteUrl'

import './globals.css'

const inter = localFont({
  src: './fonts/inter/latin-100-900.woff2',
  weight: '100 900',
  display: 'swap',
  variable: '--font-inter',
})

const playfair = localFont({
  src: './fonts/playfairdisplay/latin-400-900.woff2',
  weight: '400 900',
  display: 'swap',
  variable: '--font-playfair',
})

const fraunces = localFont({
  src: './fonts/fraunces/latin-400.woff2',
  weight: '400 600',
  display: 'swap',
  variable: '--font-fraunces',
})

// Note-only fonts load when a note uses them instead of on every page.
const lora = localFont({
  src: './fonts/lora/latin-400.woff2',
  weight: '400 500',
  display: 'swap',
  variable: '--font-lora',
  preload: false,
})

const ebGaramond = localFont({
  src: './fonts/ebgaramond/latin-400.woff2',
  weight: '400 500',
  display: 'swap',
  variable: '--font-eb-garamond',
  preload: false,
})

const nunito = localFont({
  src: './fonts/nunito/latin-400.woff2',
  weight: '400 600',
  display: 'swap',
  variable: '--font-nunito',
  preload: false,
})

const raleway = localFont({
  src: './fonts/raleway/latin-400.woff2',
  weight: '400 500',
  display: 'swap',
  variable: '--font-raleway',
  preload: false,
})

const caveat = localFont({
  src: './fonts/caveat/latin-400.woff2',
  weight: '400 600',
  display: 'swap',
  variable: '--font-caveat',
  preload: false,
})

const sacramento = localFont({
  src: './fonts/sacramento/latin-400.woff2',
  weight: '400',
  display: 'swap',
  variable: '--font-sacramento',
  preload: false,
})

const courierPrime = localFont({
  src: [
    { path: './fonts/courierprime/latin-400.woff2', weight: '400' },
    { path: './fonts/courierprime/latin-700.woff2', weight: '700' },
  ],
  display: 'swap',
  variable: '--font-courier-prime',
  preload: false,
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
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    images: [SITE_OG_IMAGE],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [SITE_OG_IMAGE.url],
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
