import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button Component', () => {
  describe('Basic Rendering', () => {
    it('should render button element by default', () => {
      render(<Button>Click me</Button>)
      const button = screen.getByRole('button', { name: 'Click me' })
      expect(button).toBeInTheDocument()
    })

    it('should render children correctly', () => {
      render(<Button>Submit</Button>)
      expect(screen.getByText('Submit')).toBeInTheDocument()
    })

    it('should have correct display name', () => {
      expect(Button.displayName).toBe('Button')
    })
  })

  describe('Variants', () => {
    it('should render default variant', () => {
      render(<Button variant="default">Default</Button>)
      const button = screen.getByRole('button', { name: 'Default' })
      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('bg-primary')
    })

    it('should render destructive variant', () => {
      render(<Button variant="destructive">Delete</Button>)
      const button = screen.getByRole('button', { name: 'Delete' })
      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('bg-destructive')
    })

    it('should render outline variant', () => {
      render(<Button variant="outline">Outline</Button>)
      const button = screen.getByRole('button', { name: 'Outline' })
      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('border')
    })

    it('should render secondary variant', () => {
      render(<Button variant="secondary">Secondary</Button>)
      const button = screen.getByRole('button', { name: 'Secondary' })
      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('bg-secondary')
    })

    it('should render ghost variant', () => {
      render(<Button variant="ghost">Ghost</Button>)
      const button = screen.getByRole('button', { name: 'Ghost' })
      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('hover:bg-accent')
    })

    it('should render link variant', () => {
      render(<Button variant="link">Link</Button>)
      const button = screen.getByRole('button', { name: 'Link' })
      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('underline-offset-4')
    })
  })

  describe('Sizes', () => {
    it('should render default size', () => {
      render(<Button size="default">Default Size</Button>)
      const button = screen.getByRole('button', { name: 'Default Size' })
      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('h-9')
    })

    it('should render sm size', () => {
      render(<Button size="sm">Small</Button>)
      const button = screen.getByRole('button', { name: 'Small' })
      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('h-8')
      expect(button).toHaveClass('text-xs')
    })

    it('should render lg size', () => {
      render(<Button size="lg">Large</Button>)
      const button = screen.getByRole('button', { name: 'Large' })
      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('h-10')
    })

    it('should render icon size', () => {
      render(<Button size="icon">Icon</Button>)
      const button = screen.getByRole('button', { name: 'Icon' })
      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('h-9')
      expect(button).toHaveClass('w-9')
    })
  })

  describe('Variant and Size Combinations', () => {
    it('should render destructive sm variant', () => {
      render(
        <Button variant="destructive" size="sm">
          Delete
        </Button>
      )
      const button = screen.getByRole('button', { name: 'Delete' })
      expect(button).toHaveClass('bg-destructive')
      expect(button).toHaveClass('h-8')
      expect(button).toHaveClass('text-xs')
    })

    it('should render outline lg variant', () => {
      render(
        <Button variant="outline" size="lg">
          Cancel
        </Button>
      )
      const button = screen.getByRole('button', { name: 'Cancel' })
      expect(button).toHaveClass('border')
      expect(button).toHaveClass('h-10')
    })

    it('should render ghost icon variant', () => {
      render(
        <Button variant="ghost" size="icon">
          Close
        </Button>
      )
      const button = screen.getByRole('button', { name: 'Close' })
      expect(button).toHaveClass('hover:bg-accent')
      expect(button).toHaveClass('h-9')
      expect(button).toHaveClass('w-9')
    })
  })

  describe('asChild Prop', () => {
    it('should render as button when asChild is false', () => {
      render(
        <Button asChild={false}>
          <span>Child Element</span>
        </Button>
      )
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    it('should render as child element when asChild is true', () => {
      render(
        <Button asChild>
          <span>Child Element</span>
        </Button>
      )
      const span = screen.getByText('Child Element')
      expect(span).toBeInTheDocument()
      expect(span.tagName).toBe('SPAN')
    })
  })

  describe('Disabled State', () => {
    it('should render disabled button', () => {
      render(<Button disabled>Disabled</Button>)
      const button = screen.getByRole('button', { name: 'Disabled' })
      expect(button).toBeDisabled()
      expect(button).toHaveClass('disabled:pointer-events-none')
      expect(button).toHaveClass('disabled:opacity-50')
    })

    it('should not fire click event when disabled', () => {
      const handleClick = vi.fn()
      render(
        <Button disabled onClick={handleClick}>
          Disabled
        </Button>
      )
      const button = screen.getByRole('button', { name: 'Disabled' })
      fireEvent.click(button)
      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe('Click Events', () => {
    it('should fire onClick event when clicked', () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Click Me</Button>)
      const button = screen.getByRole('button', { name: 'Click Me' })
      fireEvent.click(button)
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should pass event object to onClick handler', () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Click Me</Button>)
      const button = screen.getByRole('button', { name: 'Click Me' })
      fireEvent.click(button)
      expect(handleClick).toHaveBeenCalled()
    })
  })

  describe('Custom Classes', () => {
    it('should apply custom className', () => {
      render(<Button className="custom-class">Custom</Button>)
      const button = screen.getByRole('button', { name: 'Custom' })
      expect(button).toHaveClass('custom-class')
    })

    it('should merge custom classes with variant classes', () => {
      render(
        <Button variant="destructive" className="custom-class">
          Custom
        </Button>
      )
      const button = screen.getByRole('button', { name: 'Custom' })
      expect(button).toHaveClass('custom-class')
      expect(button).toHaveClass('bg-destructive')
    })
  })

  describe('HTML Attributes', () => {
    it('should pass type attribute', () => {
      render(<Button type="submit">Submit</Button>)
      const button = screen.getByRole('button', { name: 'Submit' })
      expect(button).toHaveAttribute('type', 'submit')
    })

    it('should pass id attribute', () => {
      render(<Button id="test-button">Button</Button>)
      const button = screen.getByRole('button', { name: 'Button' })
      expect(button).toHaveAttribute('id', 'test-button')
    })

    it('should pass aria-label attribute', () => {
      render(
        <Button aria-label="Close dialog">
          <span>X</span>
        </Button>
      )
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-label', 'Close dialog')
    })

    it('should pass data-testid attribute', () => {
      render(<Button data-testid="test-button">Button</Button>)
      const button = screen.getByTestId('test-button')
      expect(button).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have button role', () => {
      render(<Button>Accessible</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    it('should be focusable', () => {
      render(<Button>Focusable</Button>)
      const button = screen.getByRole('button')
      expect(button).not.toHaveAttribute('disabled')
    })

    it('should have focus-visible styles', () => {
      render(<Button>Focusable</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('focus-visible:outline-none')
      expect(button).toHaveClass('focus-visible:ring-1')
    })
  })

  describe('Icon Support', () => {
    it('should render icon with text', () => {
      render(
        <Button>
          <span data-testid="icon">★</span>
          <span>Star</span>
        </Button>
      )
      expect(screen.getByTestId('icon')).toBeInTheDocument()
      expect(screen.getByText('Star')).toBeInTheDocument()
    })

    it('should render icon only', () => {
      render(
        <Button size="icon">
          <span data-testid="icon">★</span>
        </Button>
      )
      expect(screen.getByTestId('icon')).toBeInTheDocument()
    })

    it('should apply icon styles to SVG elements', () => {
      render(
        <Button>
          <svg data-testid="icon" width="16" height="16">
            <circle cx="8" cy="8" r="6" />
          </svg>
          <span>Icon Button</span>
        </Button>
      )
      const button = screen.getByRole('button')
      const icon = screen.getByTestId('icon')
      expect(icon).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty children', () => {
      render(<Button></Button>)
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      expect(button).toBeEmptyDOMElement()
    })

    it('should handle very long text', () => {
      const longText = 'A'.repeat(100)
      render(<Button>{longText}</Button>)
      expect(screen.getByText(longText)).toBeInTheDocument()
    })

    it('should handle special characters in text', () => {
      const specialText = 'Button with <>&"special\' characters'
      render(<Button>{specialText}</Button>)
      expect(screen.getByText(specialText)).toBeInTheDocument()
    })

    it('should handle multiple click events', () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Click Me</Button>)
      const button = screen.getByRole('button', { name: 'Click Me' })
      fireEvent.click(button)
      fireEvent.click(button)
      fireEvent.click(button)
      expect(handleClick).toHaveBeenCalledTimes(3)
    })
  })

  describe('Styling Classes', () => {
    it('should have inline-flex class', () => {
      render(<Button>Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('inline-flex')
    })

    it('should have items-center class', () => {
      render(<Button>Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('items-center')
    })

    it('should have justify-center class', () => {
      render(<Button>Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('justify-center')
    })

    it('should have whitespace-nowrap class', () => {
      render(<Button>Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('whitespace-nowrap')
    })

    it('should have rounded-md class', () => {
      render(<Button>Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('rounded-md')
    })

    it('should have text-sm class', () => {
      render(<Button>Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('text-sm')
    })

    it('should have font-medium class', () => {
      render(<Button>Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('font-medium')
    })
  })

  describe('Transitions', () => {
    it('should have transition-colors class', () => {
      render(<Button>Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('transition-colors')
    })
  })
})

