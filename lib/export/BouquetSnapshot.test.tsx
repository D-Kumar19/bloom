import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BouquetSnapshot } from '@/lib/export/BouquetSnapshot'

describe('saved gift layout', () => {
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
