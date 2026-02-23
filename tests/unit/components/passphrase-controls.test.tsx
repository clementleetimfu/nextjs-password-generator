import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PassphraseControls } from '@/components/password-generator/passphrase-controls';
import { PASSPHRASE_CONSTRAINTS } from '@/lib/crypto';
import type { Separator } from '@/types/generator';

describe('PassphraseControls Component', () => {
  const defaultProps = {
    wordCount: 4,
    separator: 'hyphen' as Separator,
    onWordCountChange: vi.fn(),
    onSeparatorChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render controls container', () => {
      render(<PassphraseControls {...defaultProps} />);
      const controls = screen.getByTestId('controls');
      expect(controls).toBeInTheDocument();
    });

    it('should render word count slider', () => {
      render(<PassphraseControls {...defaultProps} />);
      const slider = screen.getByTestId('word-count-slider');
      expect(slider).toBeInTheDocument();
    });

    it('should display current word count value', () => {
      render(<PassphraseControls {...defaultProps} wordCount={6} />);
      const wordCountValue = screen.getByTestId('word-count-value');
      expect(wordCountValue).toHaveTextContent('6');
    });

    it('should display min and max word count labels', () => {
      render(<PassphraseControls {...defaultProps} />);
      expect(screen.getByText(PASSPHRASE_CONSTRAINTS.MIN_WORDS.toString())).toBeInTheDocument();
      expect(screen.getByText(PASSPHRASE_CONSTRAINTS.MAX_WORDS.toString())).toBeInTheDocument();
    });

    it('should render separator tabs', () => {
      render(<PassphraseControls {...defaultProps} />);
      expect(screen.getByRole('tab', { name: 'Space' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Hyphen' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Underscore' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Period' })).toBeInTheDocument();
    });

    it('should display separator section heading', () => {
      render(<PassphraseControls {...defaultProps} />);
      expect(screen.getByText('Separator')).toBeInTheDocument();
    });

    it('should display passphrase description text', () => {
      render(<PassphraseControls {...defaultProps} />);
      expect(screen.getByText(/Passphrases use the EFF Long Wordlist/)).toBeInTheDocument();
    });
  });

  describe('Word Count Slider', () => {
    it('should call onWordCountChange when slider value changes', () => {
      render(<PassphraseControls {...defaultProps} />);
      const slider = screen.getByTestId('word-count-slider');
      
      // Simulate slider change
      fireEvent.change(slider, { target: { value: '6' } });
      
      expect(defaultProps.onWordCountChange).toHaveBeenCalled();
    });

    it('should display correct initial word count', () => {
      render(<PassphraseControls {...defaultProps} wordCount={8} />);
      const wordCountValue = screen.getByTestId('word-count-value');
      expect(wordCountValue).toHaveTextContent('8');
    });

    it('should handle minimum word count', () => {
      render(<PassphraseControls {...defaultProps} wordCount={PASSPHRASE_CONSTRAINTS.MIN_WORDS} />);
      const wordCountValue = screen.getByTestId('word-count-value');
      expect(wordCountValue).toHaveTextContent(PASSPHRASE_CONSTRAINTS.MIN_WORDS.toString());
    });

    it('should handle maximum word count', () => {
      render(<PassphraseControls {...defaultProps} wordCount={PASSPHRASE_CONSTRAINTS.MAX_WORDS} />);
      const wordCountValue = screen.getByTestId('word-count-value');
      expect(wordCountValue).toHaveTextContent(PASSPHRASE_CONSTRAINTS.MAX_WORDS.toString());
    });
  });

  describe('Separator Tabs', () => {
    it('should call onSeparatorChange when separator is changed', () => {
      render(<PassphraseControls {...defaultProps} separator="hyphen" />);
      const spaceTab = screen.getByRole('tab', { name: 'Space' });
      
      fireEvent.click(spaceTab);
      
      expect(defaultProps.onSeparatorChange).toHaveBeenCalledWith('space');
    });

    it('should highlight active separator tab', () => {
      render(<PassphraseControls {...defaultProps} separator="hyphen" />);
      const hyphenTab = screen.getByRole('tab', { name: 'Hyphen' });
      
      expect(hyphenTab).toHaveAttribute('data-state', 'selected');
    });

    it('should not highlight inactive separator tabs', () => {
      render(<PassphraseControls {...defaultProps} separator="hyphen" />);
      const spaceTab = screen.getByRole('tab', { name: 'Space' });
      
      expect(spaceTab).not.toHaveAttribute('data-state', 'selected');
    });

    it('should handle all separator types', () => {
      const separators: Separator[] = ['space', 'hyphen', 'underscore', 'period'];
      
      separators.forEach(separator => {
        const { unmount } = render(
          <PassphraseControls {...defaultProps} separator={separator} />
        );
        
        const tabName = separator.charAt(0).toUpperCase() + separator.slice(1);
        const tab = screen.getByRole('tab', { name: tabName });
        expect(tab).toHaveAttribute('data-state', 'selected');
        
        unmount();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle boundary word count values', () => {
      const { rerender } = render(<PassphraseControls {...defaultProps} wordCount={4} />);
      
      rerender(<PassphraseControls {...defaultProps} wordCount={PASSPHRASE_CONSTRAINTS.MIN_WORDS} />);
      expect(screen.getByTestId('word-count-value')).toHaveTextContent(PASSPHRASE_CONSTRAINTS.MIN_WORDS.toString());
      
      rerender(<PassphraseControls {...defaultProps} wordCount={PASSPHRASE_CONSTRAINTS.MAX_WORDS} />);
      expect(screen.getByTestId('word-count-value')).toHaveTextContent(PASSPHRASE_CONSTRAINTS.MAX_WORDS.toString());
    });

    it('should handle all valid word counts', () => {
      const validCounts = [4, 5, 6, 7, 8, 9, 10];
      
      validCounts.forEach(count => {
        const { unmount } = render(<PassphraseControls {...defaultProps} wordCount={count} />);
        expect(screen.getByTestId('word-count-value')).toHaveTextContent(count.toString());
        unmount();
      });
    });

    it('should handle rapid separator changes', () => {
      render(<PassphraseControls {...defaultProps} separator="hyphen" />);
      
      fireEvent.click(screen.getByRole('tab', { name: 'Space' }));
      fireEvent.click(screen.getByRole('tab', { name: 'Underscore' }));
      fireEvent.click(screen.getByRole('tab', { name: 'Period' }));
      
      expect(defaultProps.onSeparatorChange).toHaveBeenCalledTimes(3);
    });

    it('should handle rapid slider changes', () => {
      render(<PassphraseControls {...defaultProps} />);
      const slider = screen.getByTestId('word-count-slider');
      
      fireEvent.change(slider, { target: { value: '5' } });
      fireEvent.change(slider, { target: { value: '6' } });
      fireEvent.change(slider, { target: { value: '7' } });
      
      expect(defaultProps.onWordCountChange).toHaveBeenCalledTimes(3);
    });
  });

  describe('Accessibility', () => {
    it('should have accessible label for word count control', () => {
      render(<PassphraseControls {...defaultProps} />);
      expect(screen.getByLabelText(/Word Count:/)).toBeInTheDocument();
    });

    it('should have proper ARIA attributes on separator tabs', () => {
      render(<PassphraseControls {...defaultProps} />);
      const tabs = screen.getAllByRole('tab');
      
      tabs.forEach(tab => {
        expect(tab).toHaveAttribute('role', 'tab');
      });
    });

    it('should have accessible separator labels', () => {
      render(<PassphraseControls {...defaultProps} />);
      
      expect(screen.getByRole('tab', { name: 'Space' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Hyphen' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Underscore' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Period' })).toBeInTheDocument();
    });
  });

  describe('Description Text', () => {
    it('should explain passphrase purpose', () => {
      render(<PassphraseControls {...defaultProps} />);
      expect(screen.getByText('Passphrases use the EFF Long Wordlist (7776 common words) for memorable security.')).toBeInTheDocument();
    });

    it('should have appropriate styling', () => {
      render(<PassphraseControls {...defaultProps} />);
      const description = screen.getByText(/Passphrases use the EFF Long Wordlist/);
      expect(description).toHaveClass('text-zinc-600', 'dark:text-zinc-400');
    });
  });

  describe('Integration', () => {
    it('should work with all separator types and word counts', () => {
      const { rerender } = render(<PassphraseControls {...defaultProps} />);
      
      // Test different combinations
      rerender(<PassphraseControls {...defaultProps} wordCount={5} separator="space" />);
      expect(screen.getByTestId('word-count-value')).toHaveTextContent('5');
      expect(screen.getByRole('tab', { name: 'Space' })).toHaveAttribute('data-state', 'selected');
      
      rerender(<PassphraseControls {...defaultProps} wordCount={8} separator="underscore" />);
      expect(screen.getByTestId('word-count-value')).toHaveTextContent('8');
      expect(screen.getByRole('tab', { name: 'Underscore' })).toHaveAttribute('data-state', 'selected');
    });
  });
});
