import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Slider } from '@/components/ui/slider'

describe('Slider Component', () => {
  it('renders a slider thumb with role', () => {
    render(<Slider value={[50]} />)
    expect(screen.getByRole('slider')).toBeInTheDocument()
  })

  it('exposes current value aria attributes', () => {
    render(<Slider min={0} max={100} value={[75]} />)
    const slider = screen.getByRole('slider')
    expect(slider).toHaveAttribute('aria-valuenow', '75')
    expect(slider).toHaveAttribute('aria-valuemin', '0')
    expect(slider).toHaveAttribute('aria-valuemax', '100')
  })

  it('supports disabled mode', () => {
    render(<Slider disabled value={[10]} data-testid="slider-root" />)
    expect(screen.getByTestId('slider-root')).toHaveAttribute('data-disabled')
  })

  it('applies custom classes to root', () => {
    render(<Slider className="custom-class" value={[10]} data-testid="slider-root" />)
    expect(screen.getByTestId('slider-root')).toHaveClass('custom-class')
  })

  it('forwards test id and optional label', () => {
    render(<Slider aria-label="Length" value={[12]} data-testid="length-slider" />)
    expect(screen.getByTestId('length-slider')).toHaveAttribute('aria-label', 'Length')
  })

  it('has expected display name', () => {
    expect(Slider.displayName).toBe('Slider')
  })
})
