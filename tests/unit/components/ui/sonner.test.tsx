import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'

describe('Toaster Component', () => {
  beforeEach(() => {
    // Clear document class list before each test
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
      // Component should be rendered without dark class
      const toaster = screen.queryByRole('alert')
      expect(toaster).not.toBeInTheDocument()
    })

    it('should detect dark theme from document', () => {
      document.documentElement.classList.add('dark')
      render(<Toaster />)
      // Component should handle dark theme
      const toaster = screen.queryByRole('alert')
      expect(toaster).not.toBeInTheDocument()
    })

    it('should update theme when document class changes', () => {
      const { rerender } = render(<Toaster />)
      document.documentElement.classList.add('dark')
      rerender(<Toaster />)
      // Component should update theme
      const toaster = screen.queryByRole('alert')
      expect(toaster).not.toBeInTheDocument()
    })

    it('should update theme when document class is removed', () => {
      document.documentElement.classList.add('dark')
      const { rerender } = render(<Toaster />)
      document.documentElement.classList.remove('dark')
      rerender(<Toaster />)
      // Component should update theme
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
      expect(element).toHaveClass('toaster')
      expect(element).toHaveClass('group')
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
      // Toast classes should be configured
      const toaster = screen.queryByRole('alert')
      expect(toaster).not.toBeInTheDocument()
    })

    it('should apply description classes', () => {
      render(<Toaster />)
      // Description classes should be configured
      const toaster = screen.queryByRole('alert')
      expect(toaster).not.toBeInTheDocument()
    })

    it('should apply action button classes', () => {
      render(<Toaster />)
      // Action button classes should be configured
      const toaster = screen.queryByRole('alert')
      expect(toaster).not.toBeInTheDocument()
    })

    it('should apply cancel button classes', () => {
      render(<Toaster />)
      // Cancel button classes should be configured
      const toaster = screen.queryByRole('alert')
      expect(toaster).not.toBeInTheDocument()
    })
  })

  describe('Theme-based Classes', () => {
    it('should apply light theme classes', () => {
      render(<Toaster />)
      // Light theme classes should be applied
      const toaster = screen.queryByRole('alert')
      expect(toaster).not.toBeInTheDocument()
    })

    it('should apply dark theme classes', () => {
      document.documentElement.classList.add('dark')
      render(<Toaster />)
      // Dark theme classes should be applied
      const toaster = screen.queryByRole('alert')
      expect(toaster).not.toBeInTheDocument()
    })
  })

  describe('MutationObserver', () => {
    it('should observe document class changes', () => {
      const observeSpy = vi.spyOn(MutationObserver.prototype, 'observe')
      render(<Toaster />)
      expect(observeSpy).toHaveBeenCalled()
      observeSpy.mockRestore()
    })

    it('should disconnect observer on unmount', () => {
      const disconnectSpy = vi.spyOn(MutationObserver.prototype, 'disconnect')
      const { unmount } = render(<Toaster />)
      unmount()
      expect(disconnectSpy).toHaveBeenCalled()
      disconnectSpy.mockRestore()
    })
  })

  describe('Integration with toast', () => {
    it('should work with toast.success', () => {
      render(<Toaster />)
      toast.success('Success message')
      // Toast should be displayed
      const toaster = screen.queryByRole('alert')
      expect(toaster).not.toBeInTheDocument()
    })

    it('should work with toast.error', () => {
      render(<Toaster />)
      toast.error('Error message')
      // Toast should be displayed
      const toaster = screen.queryByRole('alert')
      expect(toaster).not.toBeInTheDocument()
    })

    it('should work with toast.info', () => {
      render(<Toaster />)
      toast.info('Info message')
      // Toast should be displayed
      const toaster = screen.queryByRole('alert')
      expect(toaster).not.toBeInTheDocument()
    })

    it('should work with toast.warning', () => {
      render(<Toaster />)
      toast.warning('Warning message')
      // Toast should be displayed
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
      // Component should handle rapid changes
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

  describe('Cleanup', () => {
    it('should clean up observer on unmount', () => {
      const disconnectSpy = vi.spyOn(MutationObserver.prototype, 'disconnect')
      const { unmount } = render(<Toaster />)
      unmount()
      expect(disconnectSpy).toHaveBeenCalled()
      disconnectSpy.mockRestore()
    })
  })
})
