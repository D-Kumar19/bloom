import { act, fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { StepIndicator } from '@/components/builder/StepIndicator'

describe('StepIndicator', () => {
  it('shows a progress burst when moving forward', async () => {
    const { rerender } = render(<StepIndicator currentStep="bouquet" />)

    await act(async () => {
      rerender(<StepIndicator currentStep="card" />)
      await Promise.resolve()
    })

    expect(screen.getByTestId('progress-burst')).toBeInTheDocument()
  })

  it('shows bouquet step label', () => {
    render(<StepIndicator currentStep="bouquet" />)

    expect(screen.getByText('Bouquet')).toBeInTheDocument()
  })

  it('shows step note on bouquet step', () => {
    render(<StepIndicator currentStep="bouquet" />)

    expect(screen.getByText('Pick the bouquet that fits the moment')).toBeInTheDocument()
  })

  it('shows note step label and journey line', () => {
    render(<StepIndicator currentStep="card" />)

    expect(screen.getByText('Note')).toBeInTheDocument()
    expect(screen.getByText('Every bouquet deserves a love note')).toBeInTheDocument()
  })

  it('shows a progress burst when moving backward', async () => {
    const { rerender } = render(<StepIndicator currentStep="card" />)

    await act(async () => {
      rerender(<StepIndicator currentStep="bouquet" />)
      await Promise.resolve()
    })

    expect(screen.getByTestId('progress-burst')).toBeInTheDocument()
  })

  it('shows share step label', () => {
    render(<StepIndicator currentStep="share" />)

    expect(screen.getByText('Share')).toBeInTheDocument()
    expect(screen.getByText('Your bouquet is ready to send')).toBeInTheDocument()
  })

  it('lets you click completed steps to go back', () => {
    const onStepClick = vi.fn()
    render(<StepIndicator currentStep="message" onStepClick={onStepClick} />)

    fireEvent.click(screen.getByTestId('step-nav-bouquet'))
    fireEvent.click(screen.getByTestId('step-nav-card'))

    expect(onStepClick).toHaveBeenCalledTimes(2)
    expect(onStepClick).toHaveBeenNthCalledWith(1, 'bouquet')
    expect(onStepClick).toHaveBeenNthCalledWith(2, 'card')
  })

  it('does not make the current or future steps clickable', () => {
    render(<StepIndicator currentStep="message" onStepClick={vi.fn()} />)

    expect(screen.queryByTestId('step-nav-message')).not.toBeInTheDocument()
    expect(screen.queryByTestId('step-nav-theme')).not.toBeInTheDocument()
    expect(screen.queryByTestId('step-nav-share')).not.toBeInTheDocument()
  })
})
