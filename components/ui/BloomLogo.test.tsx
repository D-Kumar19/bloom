import { readFileSync } from 'node:fs'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { BloomLogo } from '@/components/ui/BloomLogo'

describe('Bloom brand assets', () => {
  it('uses the same decorative rosebud asset in the logo and browser icon', () => {
    render(<BloomLogo />)
    expect(screen.getByRole('link', { name: 'Bloom home' })).toHaveAttribute('href', '/')
    const icon = screen.getByTestId('site-logo').querySelector('img')
    expect(icon).toHaveAttribute('src', '/icon.svg')
    expect(icon).toHaveAttribute('alt', '')
    expect(icon).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByText('Bloom')).toBeInTheDocument()
  })

  it('provides local SVG, multi-size ICO, and 180px touch assets', () => {
    const svg = readFileSync('app/icon.svg', 'utf8')
    expect(svg).toContain('viewBox="0 0 64 64"')
    expect(svg).toContain('#b85c63')
    expect(svg).not.toMatch(/<script|https?:\/\/(?!www\.w3\.org)/)
    const ico = readFileSync('app/favicon.ico')
    expect(ico.readUInt16LE(0)).toBe(0)
    expect(ico.readUInt16LE(2)).toBe(1)
    expect(ico.readUInt16LE(4)).toBe(4)
    expect([0, 1, 2, 3].map((i) => ico[6 + i * 16])).toEqual([16, 32, 48, 64])
    const touch = readFileSync('app/apple-icon.png')
    expect(touch.subarray(1, 4).toString()).toBe('PNG')
    expect(touch.readUInt32BE(16)).toBe(180)
    expect(touch.readUInt32BE(20)).toBe(180)
  })
})
