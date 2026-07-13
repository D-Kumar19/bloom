import { act, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { StepIndicator } from '@/components/builder/StepIndicator'

describe('StepIndicator', () => {
  it('shows a progress burst when moving forward', async () => {
    const { rerender } = render(<StepIndicator currentStep="pick" />)

    await act(async () => {
      rerender(<StepIndicator currentStep="greenery" />)
      await Promise.resolve()
    })

    expect(screen.getByTestId('progress-burst')).toBeInTheDocument()
  })

  it('shows foliage step label', () => {
    render(<StepIndicator currentStep="greenery" />)

    expect(screen.getByText('Foliage')).toBeInTheDocument()
  })

  it('shows step note on foliage step', () => {
    render(<StepIndicator currentStep="greenery" />)

    expect(screen.getByText('Every bouquet needs a frame — this is yours')).toBeInTheDocument()
  })

  it('shows note step label and journey line', () => {
    render(<StepIndicator currentStep="card" />)

    expect(screen.getByText('Note')).toBeInTheDocument()
    expect(screen.getByText('Every bouquet deserves a love note')).toBeInTheDocument()
  })

  it('shows journey note on flowers step', () => {
    render(<StepIndicator currentStep="pick" />)

    expect(screen.getByText('Your bouquet journey starts here')).toBeInTheDocument()
  })

  it('shows a progress burst when moving backward', async () => {
    const { rerender } = render(<StepIndicator currentStep="card" />)

    await act(async () => {
      rerender(<StepIndicator currentStep="greenery" />)
      await Promise.resolve()
    })

    expect(screen.getByTestId('progress-burst')).toBeInTheDocument()
  })
})
