import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    localPatterns: [
      { pathname: '/flowers/**' },
      { pathname: '/greenery/**' },
    ],
  },
}

export default nextConfig
