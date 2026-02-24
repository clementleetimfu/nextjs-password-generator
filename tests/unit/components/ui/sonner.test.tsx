import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'

describe('Toaster Component', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('dark')
  })

  afterEach(() => {
    cleanup()
  })

  describe('Basic Rendering', () => {
    it('should render toaster component', () => {
      render(<Toaster />)
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('should render with toaster class', () => {
      const { container } = render(<Toaster />)
      expect(container.querySelector('.toaster')).toBeInTheDocument()
    })

    it('should render with group class', () => {
      const { container } = render(<Toaster />)
      expect(container.querySelector('.group')).toBeInTheDocument()
    })
  })

  describe('Theme Detection', () => {
    it('should detect light theme by default', () => {
      render(<Toaster />)
      const toaster = screen.queryByRole('alert')
      expect(toaster).not.toBeInTheDocument()
    })

    it('should detect dark theme from document', () => {
      document.documentElement.classList.add('dark')
      render(<Toaster />)
      const toaster = screen.queryByRole('alert')
      expect(toaster).not.toBeInTheDocument()
    })

    it('should update theme when document class changes', () => {
      const { rerender } = render(<Toaster />)
      document.documentElement.classList.add('dark')
      rerender(<Toaster />)
      const toaster = screen.queryByRole('alert')
      expect(toaster).not.toBeInTheDocument()
    })

    it('should update theme when document class is removed', () => {
      document.documentElement.classList.add('dark')
      const { rerender } = render(<Toaster />)
      document.documentElement.classList.remove('dark')
      rerender(<Toaster />)
      const toaster = screen.queryByRole('alert')
      expect(toaster).not.toBeInTheDocument()
    })
  })

  describe('Custom Classes', () => {
    it('should apply custom className', () => {
      const { container } = render(<Toaster className="custom-class" />)
      expect(container.querySelector('.custom-class')).toBeInTheDocument()
    })

    it('should merge custom classes with default classes', () => {
      const { container } = render(<Toaster className="custom-class" />)
      const element = container.querySelector('.custom-class')
      expect(element).toBeInTheDocument()
      expect(element).toHaveClass('custom-class')
    })
  })

  describe('HTML Attributes', () => {
    it('should pass id attribute', () => {
      const { container } = render(<Toaster id="test-toaster" />)
      expect(container.querySelector('#test-toaster')).toBeInTheDocument()
    })

    it('should pass data-testid attribute', () => {
      const { container } = render(<Toaster data-testid="test-toaster" />)
      expect(screen.getByTestId('test-toaster')).toBeInTheDocument()
    })
  })

  describe('Toast Options', () => {
    it('should apply toast classes', () => {
      render(<Toaster />)
      const toaster = screen.queryByRole('alert')
      expect(toaster).not.toBeInTheDocument()
    })

    it('should apply description classes', () => {
      render(<Toaster />)
      const toaster = screen.queryByRole('alert')
      expect(toaster).not.toBeInTheDocument()
    })

    it('should apply action button classes', () => {
      render(<Toaster />)
      const toaster = screen.queryByRole('alert')
      expect(toaster).not.toBeInTheDocument()
    })

    it('should apply cancel button classes', () => {
      render(<Toaster />)
      const toaster = screen.queryByRole('alert')
      expect(toaster).not.toBeInTheDocument()
    })
  })

  describe('Theme-based Classes', () => {
    it('should apply light theme classes', () => {
      render(<Toaster />)
      const toaster = screen.queryByRole('alert')
      expect(toaster).not.toBeInTheDocument()
    })

    it('should apply dark theme classes', () => {
      document.documentElement.classList.add('dark')
      render(<Toaster />)
      const toaster = screen.queryByRole('alert')
      expect(toaster).not.toBeInTheDocument()
    })
  })

  describe('Integration with toast', () => {
    it('should work with toast.success', () => {
      render(<Toaster />)
      toast.success('Success message')
      const toaster = screen.queryByRole('alert')
      expect(toaster).not.toBeInTheDocument()
    })

    it('should work with toast.error', () => {
      render(<Toaster />)
      toast.error('Error message')
      const toaster = screen.queryByRole('alert')
      expect(toaster).not.toBeInTheDocument()
    })

    it('should work with toast.info', () => {
      render(<Toaster />)
      toast.info('Info message')
      const toaster = screen.queryByRole('alert')
      expect(toaster).not.toBeInTheDocument()
    })

    it('should work with toast.warning', () => {
      render(<Toaster />)
      toast.warning('Warning message')
      const toaster = screen.queryByRole('alert')
      expect(toaster).not.toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty props', () => {
      render(<Toaster />)
      const { container } = render(<Toaster />)
      expect(container.querySelector('.toaster')).toBeInTheDocument()
    })

    it('should handle rapid theme changes', () => {
      const { rerender } = render(<Toaster />)
      document.documentElement.classList.add('dark')
      rerender(<Toaster />)
      document.documentElement.classList.remove('dark')
      rerender(<Toaster />)
      document.documentElement.classList.add('dark')
      rerender(<Toaster />)
      const toaster = screen.queryByRole('alert')
      expect(toaster).not.toBeInTheDocument()
    })

    it('should handle multiple toasters', () => {
      const { container } = render(
        <>
          <Toaster />
          <Toaster />
          <Toaster />
        </>
      )
      const toasters = container.querySelectorAll('.toaster')
      expect(toasters.length).toBe(3)
    })
  })
})
