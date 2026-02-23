import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from '@/components/password-generator/theme-toggle';
import type { ThemeMode } from '@/types/generator';

describe('ThemeToggle Component', () => {
  const defaultProps = {
    mode: 'light' as ThemeMode,
    onToggle: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render theme toggle button', () => {
      render(<ThemeToggle {...defaultProps} />);
      const button = screen.getByTestId('theme-toggle');
      expect(button).toBeInTheDocument();
    });

    it('should have correct positioning classes', () => {
      render(<ThemeToggle {...defaultProps} />);
      const button = screen.getByTestId('theme-toggle');
      expect(button).toHaveClass('fixed', 'top-4', 'right-4', 'z-50');
    });

    it('should have button variant and icon size', () => {
      render(<ThemeToggle {...defaultProps} />);
      const button = screen.getByTestId('theme-toggle');
      expect(button).toHaveClass('variant-outline', 'size-icon');
    });
  });

  describe('Light Mode Display', () => {
    it('should display moon icon when in light mode', () => {
      render(<ThemeToggle {...defaultProps} mode="light" />);
      const button = screen.getByTestId('theme-toggle');
      
      const moonPath = button.querySelector('path[d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"]');
      expect(moonPath).toBeInTheDocument();
    });

    it('should have correct aria-label for light mode', () => {
      render(<ThemeToggle {...defaultProps} mode="light" />);
      const button = screen.getByTestId('theme-toggle');
      expect(button).toHaveAttribute('aria-label', 'Toggle dark mode');
    });
  });

  describe('Dark Mode Display', () => {
    it('should display sun icon when in dark mode', () => {
      render(<ThemeToggle {...defaultProps} mode="dark" />);
      const button = screen.getByTestId('theme-toggle');
      
      const sunCircle = button.querySelector('circle');
      const sunPaths = button.querySelectorAll('path');
      
      expect(sunCircle).toBeInTheDocument();
      expect(sunPaths.length).toBeGreaterThan(0);
    });

    it('should have correct aria-label for dark mode', () => {
      render(<ThemeToggle {...defaultProps} mode="dark" />);
      const button = screen.getByTestId('theme-toggle');
      expect(button).toHaveAttribute('aria-label', 'Toggle light mode');
    });
  });

  describe('Interactions', () => {
    it('should call onToggle when button is clicked in light mode', () => {
      render(<ThemeToggle {...defaultProps} mode="light" />);
      const button = screen.getByTestId('theme-toggle');
      
      fireEvent.click(button);
      
      expect(defaultProps.onToggle).toHaveBeenCalledTimes(1);
    });

    it('should call onToggle when button is clicked in dark mode', () => {
      render(<ThemeToggle {...defaultProps} mode="dark" />);
      const button = screen.getByTestId('theme-toggle');
      
      fireEvent.click(button);
      
      expect(defaultProps.onToggle).toHaveBeenCalledTimes(1);
    });

    it('should handle rapid clicks', () => {
      render(<ThemeToggle {...defaultProps} mode="light" />);
      const button = screen.getByTestId('theme-toggle');
      
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);
      
      expect(defaultProps.onToggle).toHaveBeenCalledTimes(3);
    });
  });

  describe('Mode Transitions', () => {
    it('should update icon when mode changes from light to dark', () => {
      const { rerender } = render(<ThemeToggle {...defaultProps} mode="light" />);
      
      const button = screen.getByTestId('theme-toggle');
      const moonPath = button.querySelector('path[d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"]');
      expect(moonPath).toBeInTheDocument();
      
      rerender(<ThemeToggle {...defaultProps} mode="dark" />);
      
      const sunCircle = button.querySelector('circle');
      expect(sunCircle).toBeInTheDocument();
    });

    it('should update icon when mode changes from dark to light', () => {
      const { rerender } = render(<ThemeToggle {...defaultProps} mode="dark" />);
      
      const button = screen.getByTestId('theme-toggle');
      const sunCircle = button.querySelector('circle');
      expect(sunCircle).toBeInTheDocument();
      
      rerender(<ThemeToggle {...defaultProps} mode="light" />);
      
      const moonPath = button.querySelector('path[d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"]');
      expect(moonPath).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible aria-label', () => {
      render(<ThemeToggle {...defaultProps} mode="light" />);
      const button = screen.getByTestId('theme-toggle');
      expect(button).toHaveAttribute('aria-label');
    });

    it('should update aria-label when mode changes', () => {
      const { rerender } = render(<ThemeToggle {...defaultProps} mode="light" />);
      
      const button = screen.getByTestId('theme-toggle');
      expect(button).toHaveAttribute('aria-label', 'Toggle dark mode');
      
      rerender(<ThemeToggle {...defaultProps} mode="dark" />);
      expect(button).toHaveAttribute('aria-label', 'Toggle light mode');
    });

    it('should be keyboard accessible', () => {
      render(<ThemeToggle {...defaultProps} mode="light" />);
      const button = screen.getByTestId('theme-toggle');
      
      // Simulate Enter key press
      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
      expect(defaultProps.onToggle).toHaveBeenCalledTimes(1);
    });

    it('should handle Space key for activation', () => {
      render(<ThemeToggle {...defaultProps} mode="light" />);
      const button = screen.getByTestId('theme-toggle');
      
      // Simulate Space key press
      fireEvent.keyDown(button, { key: ' ', code: 'Space' });
      expect(defaultProps.onToggle).toHaveBeenCalledTimes(1);
    });
  });

  describe('Icon Structure', () => {
    it('should render SVG element with correct attributes', () => {
      render(<ThemeToggle {...defaultProps} mode="light" />);
      const button = screen.getByTestId('theme-toggle');
      const svg = button.querySelector('svg');
      
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');
      expect(svg).toHaveAttribute('width', '20');
      expect(svg).toHaveAttribute('height', '20');
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
      expect(svg).toHaveAttribute('fill', 'none');
      expect(svg).toHaveAttribute('stroke', 'currentColor');
      expect(svg).toHaveAttribute('strokeWidth', '2');
      expect(svg).toHaveAttribute('strokeLinecap', 'round');
      expect(svg).toHaveAttribute('strokeLinejoin', 'round');
    });

    it('should have correct moon icon structure in light mode', () => {
      render(<ThemeToggle {...defaultProps} mode="light" />);
      const button = screen.getByTestId('theme-toggle');
      const svg = button.querySelector('svg');
      const paths = svg?.querySelectorAll('path');
      
      expect(paths?.length).toBe(1);
    });

    it('should have correct sun icon structure in dark mode', () => {
      render(<ThemeToggle {...defaultProps} mode="dark" />);
      const button = screen.getByTestId('theme-toggle');
      const svg = button.querySelector('svg');
      const circle = svg?.querySelector('circle');
      const paths = svg?.querySelectorAll('path');
      
      expect(circle).toBeInTheDocument();
      expect(paths?.length).toBe(8); // 8 rays around the sun
    });
  });

  describe('Edge Cases', () => {
    it('should handle null mode gracefully', () => {
      // This test ensures the component handles edge cases
      const { container } = render(
        <ThemeToggle {...defaultProps} mode={null as any} />
      );
      expect(container).toBeInTheDocument();
    });

    it('should handle undefined onToggle gracefully', () => {
      const { container } = render(
        <ThemeToggle mode="light" onToggle={undefined as any} />
      );
      expect(container).toBeInTheDocument();
    });
  });
});
