import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from '@/components/password-generator/theme-toggle';
import type { ThemeMode } from '@/types/generator';

describe('ThemeToggle Component', () => {
  const defaultProps = {
    mode: 'light' as ThemeMode,
    onToggle: vi.fn(),
  };

  beforeEach(() => vi.clearAllMocks());

  describe('Rendering', () => {
    it('renders the button', () => {
      render(<ThemeToggle {...defaultProps} />);
      expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
    });

    it('renders as a button element', () => {
      render(<ThemeToggle {...defaultProps} />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('Aria Labels', () => {
    it('uses expected aria-label in light mode', () => {
      render(<ThemeToggle {...defaultProps} mode="light" />);
      expect(screen.getByTestId('theme-toggle')).toHaveAttribute('aria-label', 'Toggle dark mode');
    });

    it('uses expected aria-label in dark mode', () => {
      render(<ThemeToggle {...defaultProps} mode="dark" />);
      expect(screen.getByTestId('theme-toggle')).toHaveAttribute('aria-label', 'Toggle light mode');
    });
  });

  describe('User Interactions', () => {
    it('calls onToggle when clicked', () => {
      render(<ThemeToggle {...defaultProps} />);
      fireEvent.click(screen.getByTestId('theme-toggle'));
      expect(defaultProps.onToggle).toHaveBeenCalledTimes(1);
    });

    it('handles multiple toggle clicks', () => {
      render(<ThemeToggle {...defaultProps} />);
      fireEvent.click(screen.getByTestId('theme-toggle'));
      fireEvent.click(screen.getByTestId('theme-toggle'));
      expect(defaultProps.onToggle).toHaveBeenCalledTimes(2);
    });
  });

  describe('Icon Display', () => {
    it('displays an icon in light mode', () => {
      render(<ThemeToggle {...defaultProps} mode="light" />);
      const button = screen.getByTestId('theme-toggle');
      expect(button.querySelector('svg')).toBeInTheDocument();
    });

    it('displays an icon in dark mode', () => {
      render(<ThemeToggle {...defaultProps} mode="dark" />);
      const button = screen.getByTestId('theme-toggle');
      expect(button.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has accessible name from aria-label', () => {
      render(<ThemeToggle {...defaultProps} mode="light" />);
      expect(screen.getByRole('button', { name: /toggle dark mode/i })).toBeInTheDocument();
    });
  });
});
