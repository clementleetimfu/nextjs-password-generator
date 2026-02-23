import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from '@/components/password-generator/theme-toggle';

describe('ThemeToggle Component', () => {
  const onToggle = vi.fn();

  beforeEach(() => vi.clearAllMocks());

  it('renders the button', () => {
    render(<ThemeToggle mode="light" onToggle={onToggle} />);
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
  });

  it('uses expected aria-label in light mode', () => {
    render(<ThemeToggle mode="light" onToggle={onToggle} />);
    expect(screen.getByTestId('theme-toggle')).toHaveAttribute('aria-label', 'Toggle dark mode');
  });

  it('uses expected aria-label in dark mode', () => {
    render(<ThemeToggle mode="dark" onToggle={onToggle} />);
    expect(screen.getByTestId('theme-toggle')).toHaveAttribute('aria-label', 'Toggle light mode');
  });

  it('calls onToggle when clicked', () => {
    render(<ThemeToggle mode="light" onToggle={onToggle} />);
    fireEvent.click(screen.getByTestId('theme-toggle'));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
