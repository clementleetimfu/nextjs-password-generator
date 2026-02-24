import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PassphraseControls } from '@/components/password-generator/passphrase-controls';
import { PASSPHRASE_CONSTRAINTS } from '@/lib/crypto';
import type { Separator } from '@/types/generator';

describe('PassphraseControls Component', () => {
  const props = {
    wordCount: 4,
    separator: 'hyphen' as Separator,
    onWordCountChange: vi.fn(),
    onSeparatorChange: vi.fn(),
  };

  beforeEach(() => vi.clearAllMocks());

  describe('Rendering', () => {
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

    it('displays min and max word count bounds', () => {
      render(<PassphraseControls {...props} wordCount={6} />);
      const bounds = screen.getByTestId('controls').querySelectorAll('.text-xs.text-zinc-500 span');
      expect(bounds[0]).toHaveTextContent(PASSPHRASE_CONSTRAINTS.MIN_WORDS.toString());
      expect(bounds[1]).toHaveTextContent(PASSPHRASE_CONSTRAINTS.MAX_WORDS.toString());
    });

    it('displays separator label', () => {
      render(<PassphraseControls {...props} />);
      expect(screen.getByText('Separator')).toBeInTheDocument();
    });

    it('displays word count label', () => {
      render(<PassphraseControls {...props} />);
      expect(screen.getByText('Word Count')).toBeInTheDocument();
    });
  });

  describe('Separator Selection', () => {
    it('marks active separator from props', () => {
      render(<PassphraseControls {...props} separator="underscore" />);
      expect(screen.getByRole('tab', { name: 'Underscore' })).toHaveAttribute('data-state', 'active');
    });

    it('marks hyphen separator as active by default', () => {
      render(<PassphraseControls {...props} separator="hyphen" />);
      expect(screen.getByRole('tab', { name: 'Hyphen' })).toHaveAttribute('data-state', 'active');
    });

    it('marks space separator when selected', () => {
      render(<PassphraseControls {...props} separator="space" />);
      expect(screen.getByRole('tab', { name: 'Space' })).toHaveAttribute('data-state', 'active');
    });

    it('marks period separator when selected', () => {
      render(<PassphraseControls {...props} separator="period" />);
      expect(screen.getByRole('tab', { name: 'Period' })).toHaveAttribute('data-state', 'active');
    });
  });

  describe('Edge Cases', () => {
    it('handles minimum word count', () => {
      render(<PassphraseControls {...props} wordCount={PASSPHRASE_CONSTRAINTS.MIN_WORDS} />);
      expect(screen.getByTestId('word-count-value')).toHaveTextContent(
        PASSPHRASE_CONSTRAINTS.MIN_WORDS.toString()
      );
    });

    it('handles maximum word count', () => {
      render(<PassphraseControls {...props} wordCount={PASSPHRASE_CONSTRAINTS.MAX_WORDS} />);
      expect(screen.getByTestId('word-count-value')).toHaveTextContent(
        PASSPHRASE_CONSTRAINTS.MAX_WORDS.toString()
      );
    });
  });
});
