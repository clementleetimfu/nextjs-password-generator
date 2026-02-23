import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Switch } from '@/components/ui/switch'

describe('Switch Component', () => {
  describe('Basic Rendering', () => {
    it('should render switch element', () => {
      render(<Switch />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toBeInTheDocument()
    })

    it('should have correct display name', () => {
      expect(Switch.displayName).toBe('Switch')
    })

    it('should render with default unchecked state', () => {
      render(<Switch />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveAttribute('aria-checked', 'false')
    })

    it('should render with checked state', () => {
      render(<Switch checked />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveAttribute('aria-checked', 'true')
    })

    it('should render with defaultChecked state', () => {
      render(<Switch defaultChecked />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveAttribute('aria-checked', 'true')
    })
  })

  describe('Controlled Component', () => {
    it('should render controlled switch', () => {
      const handleChange = vi.fn()
      render(<Switch checked={false} onCheckedChange={handleChange} />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toBeInTheDocument()
      expect(switchElement).toHaveAttribute('aria-checked', 'false')
    })

    it('should update checked state when prop changes', () => {
      const { rerender } = render(<Switch checked={false} />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveAttribute('aria-checked', 'false')

      rerender(<Switch checked={true} />)
      expect(switchElement).toHaveAttribute('aria-checked', 'true')
    })
  })

  describe('Event Handling', () => {
    it('should call onCheckedChange when clicked', () => {
      const handleChange = vi.fn()
      render(<Switch onCheckedChange={handleChange} />)
      const switchElement = screen.getByRole('switch')
      fireEvent.click(switchElement)
      expect(handleChange).toHaveBeenCalledTimes(1)
      expect(handleChange).toHaveBeenCalledWith(true)
    })

    it('should toggle checked state on click', () => {
      const handleChange = vi.fn()
      render(<Switch onCheckedChange={handleChange} />)
      const switchElement = screen.getByRole('switch')

      fireEvent.click(switchElement)
      expect(handleChange).toHaveBeenCalledWith(true)

      fireEvent.click(switchElement)
      expect(handleChange).toHaveBeenCalledWith(false)
    })

    it('should call onCheckedChange with correct value when unchecked', () => {
      const handleChange = vi.fn()
      render(<Switch checked={true} onCheckedChange={handleChange} />)
      const switchElement = screen.getByRole('switch')
      fireEvent.click(switchElement)
      expect(handleChange).toHaveBeenCalledWith(false)
    })

    it('should call onCheckedChange with correct value when checked', () => {
      const handleChange = vi.fn()
      render(<Switch checked={false} onCheckedChange={handleChange} />)
      const switchElement = screen.getByRole('switch')
      fireEvent.click(switchElement)
      expect(handleChange).toHaveBeenCalledWith(true)
    })
  })

  describe('Disabled State', () => {
    it('should render disabled switch', () => {
      render(<Switch disabled />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toBeDisabled()
      expect(switchElement).toHaveClass('disabled:cursor-not-allowed')
      expect(switchElement).toHaveClass('disabled:opacity-50')
    })

    it('should not fire onCheckedChange when disabled', () => {
      const handleChange = vi.fn()
      render(<Switch disabled onCheckedChange={handleChange} />)
      const switchElement = screen.getByRole('switch')
      fireEvent.click(switchElement)
      expect(handleChange).not.toHaveBeenCalled()
    })

    it('should have aria-disabled attribute when disabled', () => {
      render(<Switch disabled />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveAttribute('aria-disabled', 'true')
    })
  })

  describe('Required State', () => {
    it('should render required switch', () => {
      render(<Switch required />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveAttribute('aria-required', 'true')
    })

    it('should have required attribute', () => {
      render(<Switch required />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveAttribute('required', '')
    })
  })

  describe('Custom Classes', () => {
    it('should apply custom className', () => {
      render(<Switch className="custom-class" />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveClass('custom-class')
    })

    it('should merge custom classes with default classes', () => {
      render(<Switch className="custom-class" />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveClass('custom-class')
      expect(switchElement).toHaveClass('inline-flex')
      expect(switchElement).toHaveClass('h-5')
    })
  })

  describe('HTML Attributes', () => {
    it('should pass id attribute', () => {
      render(<Switch id="test-switch" />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveAttribute('id', 'test-switch')
    })

    it('should pass name attribute', () => {
      render(<Switch name="switch-name" />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveAttribute('name', 'switch-name')
    })

    it('should pass value attribute', () => {
      render(<Switch value="switch-value" />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveAttribute('value', 'switch-value')
    })

    it('should pass aria-label attribute', () => {
      render(<Switch aria-label="Enable notifications" />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveAttribute('aria-label', 'Enable notifications')
    })

    it('should pass aria-labelledby attribute', () => {
      render(<Switch aria-labelledby="label-id" />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveAttribute('aria-labelledby', 'label-id')
    })

    it('should pass data-testid attribute', () => {
      render(<Switch data-testid="test-switch" />)
      const switchElement = screen.getByTestId('test-switch')
      expect(switchElement).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have switch role', () => {
      render(<Switch />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toBeInTheDocument()
    })

    it('should have aria-checked attribute', () => {
      render(<Switch />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveAttribute('aria-checked')
    })

    it('should have correct aria-checked value when unchecked', () => {
      render(<Switch checked={false} />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveAttribute('aria-checked', 'false')
    })

    it('should have correct aria-checked value when checked', () => {
      render(<Switch checked={true} />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveAttribute('aria-checked', 'true')
    })

    it('should be focusable', () => {
      render(<Switch />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveAttribute('tabIndex', '0')
    })
  })

  describe('Styling Classes', () => {
    it('should have inline-flex class', () => {
      render(<Switch />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveClass('inline-flex')
    })

    it('should have h-5 class', () => {
      render(<Switch />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveClass('h-5')
    })

    it('should have w-9 class', () => {
      render(<Switch />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveClass('w-9')
    })

    it('should have shrink-0 class', () => {
      render(<Switch />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveClass('shrink-0')
    })

    it('should have cursor-pointer class', () => {
      render(<Switch />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveClass('cursor-pointer')
    })

    it('should have items-center class', () => {
      render(<Switch />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveClass('items-center')
    })

    it('should have rounded-full class', () => {
      render(<Switch />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveClass('rounded-full')
    })

    it('should have border-2 class', () => {
      render(<Switch />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveClass('border-2')
    })

    it('should have shadow-sm class', () => {
      render(<Switch />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveClass('shadow-sm')
    })
  })

  describe('Thumb Element', () => {
    it('should render thumb element', () => {
      render(<Switch />)
      const switchElement = screen.getByRole('switch')
      // Thumb is a child element
      expect(switchElement.children.length).toBeGreaterThan(0)
    })

    it('should have thumb with correct classes when unchecked', () => {
      render(<Switch checked={false} />)
      const switchElement = screen.getByRole('switch')
      const thumb = switchElement.querySelector('[data-radix-switch-thumb]')
      expect(thumb).toHaveClass('translate-x-0')
    })

    it('should have thumb with correct classes when checked', () => {
      render(<Switch checked={true} />)
      const switchElement = screen.getByRole('switch')
      const thumb = switchElement.querySelector('[data-radix-switch-thumb]')
      expect(thumb).toHaveClass('translate-x-4')
    })
  })

  describe('State-based Styling', () => {
    it('should have bg-primary class when checked', () => {
      render(<Switch checked={true} />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveClass('data-[state=checked]:bg-primary')
    })

    it('should have bg-input class when unchecked', () => {
      render(<Switch checked={false} />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveClass('data-[state=unchecked]:bg-input')
    })
  })

  describe('Transitions', () => {
    it('should have transition-colors class', () => {
      render(<Switch />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveClass('transition-colors')
    })

    it('should have transition-transform class on thumb', () => {
      render(<Switch />)
      const switchElement = screen.getByRole('switch')
      const thumb = switchElement.querySelector('[data-radix-switch-thumb]')
      expect(thumb).toHaveClass('transition-transform')
    })
  })

  describe('Focus Styles', () => {
    it('should have focus-visible:outline-none class', () => {
      render(<Switch />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveClass('focus-visible:outline-none')
    })

    it('should have focus-visible:ring-2 class', () => {
      render(<Switch />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveClass('focus-visible:ring-2')
    })

    it('should have focus-visible:ring-ring class', () => {
      render(<Switch />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveClass('focus-visible:ring-ring')
    })

    it('should have focus-visible:ring-offset-2 class', () => {
      render(<Switch />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveClass('focus-visible:ring-offset-2')
    })

    it('should have focus-visible:ring-offset-background class', () => {
      render(<Switch />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveClass('focus-visible:ring-offset-background')
    })
  })

  describe('Edge Cases', () => {
    it('should handle multiple click events', () => {
      const handleChange = vi.fn()
      render(<Switch onCheckedChange={handleChange} />)
      const switchElement = screen.getByRole('switch')

      fireEvent.click(switchElement)
      fireEvent.click(switchElement)
      fireEvent.click(switchElement)

      expect(handleChange).toHaveBeenCalledTimes(3)
    })

    it('should handle rapid state changes', () => {
      const { rerender } = render(<Switch checked={false} />)
      const switchElement = screen.getByRole('switch')

      rerender(<Switch checked={true} />)
      rerender(<Switch checked={false} />)
      rerender(<Switch checked={true} />)

      expect(switchElement).toHaveAttribute('aria-checked', 'true')
    })

    it('should handle disabled with checked state', () => {
      render(<Switch disabled checked={true} />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toBeDisabled()
      expect(switchElement).toHaveAttribute('aria-checked', 'true')
    })
  })
})
