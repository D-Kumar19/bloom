import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  images: {
    localPatterns: [
      { pathname: '/flowers/**' },
      { pathname: '/bouquets/**' },
    ],
  },
}

export default nextConfig
