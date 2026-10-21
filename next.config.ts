import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  async headers() {
    return [{
      source: '/bouquet/:path*',
      headers: [
        { key: 'Referrer-Policy', value: 'no-referrer' },
        { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' },
      ],
    }]
  },
  images: {
    localPatterns: [
      { pathname: '/flowers/**' },
      { pathname: '/bouquets/**' },
    ],
  },
}

export default nextConfig
