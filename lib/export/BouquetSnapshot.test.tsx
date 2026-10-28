import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BouquetSnapshot } from '@/lib/export/BouquetSnapshot'
import { INSPIRATION_PROMPTS } from '@/lib/message'

describe('saved gift layout', () => {
  it('exports a personalized reason as ordinary note text, not a separate gift field', () => {
    const prompt = INSPIRATION_PROMPTS.find((entry) => entry.id === 'why-these')!
    const message = `<b>Love you.</b><br><br>${prompt.starter}yellow reminds me of our first walk.`
    render(<BouquetSnapshot bouquet={{
      bouquetId: 'sunflower-burst', theme: 'warm', cardStyle: 'classic-cream',
      to: 'Sam', from: 'Alex', message,
    }} />)
    expect(screen.getByTestId('formatted-message-body').innerHTML).toBe(message)
  })
  it('omits the card when there is no note, as the recipient does', () => {
    render(<BouquetSnapshot bouquet={{
      bouquetId: 'red-rose-classic', theme: 'warm', cardStyle: 'classic-cream',
      to: '', from: '', message: '',
    }} />)
    expect(screen.queryByTestId('message-card')).not.toBeInTheDocument()
    expect(screen.getByAltText('Red Rose Classic')).toBeInTheDocument()
  })

  it('uses the recipient components with rich text, dark theme, and a real double border', () => {
    render(<BouquetSnapshot bouquet={{
      bouquetId: 'red-rose-classic', theme: 'midnight', cardStyle: 'midnight',
      to: 'Long'.repeat(80), from: 'Name'.repeat(80),
      message: '<b>Hello</b><br><i>friend</i><span style="color: #c45c5c">!</span>',
      noteBorder: { style: 'double', color: '#ffffff' },
    }} />)
    expect(screen.getByTestId('backdrop-layer-midnight')).toHaveClass('export-static')
    expect(screen.getByTestId('message-card')).toHaveStyle({ borderStyle: 'double', borderWidth: '3px' })
    expect(screen.getByTestId('formatted-message-body').innerHTML).toContain('<b>Hello</b><br><i>friend</i>')
    expect(screen.getByTestId('formatted-message-body')).toHaveStyle({ color: '#ffffff' })
  })
})
