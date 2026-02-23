import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Switch } from '@/components/ui/switch'

describe('Switch Component', () => {
  it('renders with switch role', () => {
    render(<Switch />)
    expect(screen.getByRole('switch')).toBeInTheDocument()
  })

  it('supports checked/unchecked states', () => {
    const { rerender } = render(<Switch checked={false} />)
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false')

    rerender(<Switch checked={true} />)
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
  })

  it('calls onCheckedChange on click', () => {
    const onCheckedChange = vi.fn()
    render(<Switch onCheckedChange={onCheckedChange} />)

    fireEvent.click(screen.getByRole('switch'))
    expect(onCheckedChange).toHaveBeenCalledTimes(1)
  })

  it('respects disabled state', () => {
    const onCheckedChange = vi.fn()
    render(<Switch disabled onCheckedChange={onCheckedChange} />)

    const el = screen.getByRole('switch')
    expect(el).toBeDisabled()
    fireEvent.click(el)
    expect(onCheckedChange).not.toHaveBeenCalled()
  })

  it('applies custom className', () => {
    render(<Switch className="custom-class" />)
    expect(screen.getByRole('switch')).toHaveClass('custom-class')
  })

  it('forwards aria attributes', () => {
    render(<Switch aria-label="Enable feature" />)
    expect(screen.getByRole('switch')).toHaveAttribute('aria-label', 'Enable feature')
  })
})
