import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PassphraseControls } from '@/components/password-generator/passphrase-controls';
import type { Separator } from '@/types/generator';

describe('PassphraseControls Component', () => {
  const props = {
    wordCount: 4,
    separator: 'hyphen' as Separator,
    onWordCountChange: vi.fn(),
    onSeparatorChange: vi.fn(),
  };

  beforeEach(() => vi.clearAllMocks());

  it('renders controls, slider, and tabs', () => {
    render(<PassphraseControls {...props} />);
    expect(screen.getByTestId('controls')).toBeInTheDocument();
    expect(screen.getByTestId('word-count-slider')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Space' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Hyphen' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Underscore' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Period' })).toBeInTheDocument();
  });

  it('shows current word count', () => {
    render(<PassphraseControls {...props} wordCount={8} />);
    expect(screen.getByTestId('word-count-value')).toHaveTextContent('8');
  });

  it('marks active separator from props', () => {
    render(<PassphraseControls {...props} separator="underscore" />);
    expect(screen.getByRole('tab', { name: 'Underscore' })).toHaveAttribute('data-state', 'active');
  });
});
