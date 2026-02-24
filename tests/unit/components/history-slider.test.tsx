import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HistorySlider } from '@/components/password-generator/history-slider';
import type { CredentialType } from '@/types/generator';

describe('HistorySlider Component', () => {
  const mockOnClose = vi.fn();
  const mockOnRestore = vi.fn();
  const mockOnClear = vi.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    type: 'password' as CredentialType,
    items: [
      { value: 'abc123', timestamp: 1234567890 },
      { value: 'def456', timestamp: 1234567891 },
    ],
    onRestore: mockOnRestore,
    onClear: mockOnClear,
  };

  describe('rendering', () => {
    it('renders when isOpen is true', () => {
      render(<HistorySlider {...defaultProps} />);
      expect(screen.getByTestId('history-backdrop')).toBeInTheDocument();
    });

    it('does not render when isOpen is false', () => {
      render(<HistorySlider {...defaultProps} isOpen={false} />);
      expect(screen.queryByTestId('history-backdrop')).not.toBeInTheDocument();
    });

    it('renders correct title for password type', () => {
      render(<HistorySlider {...defaultProps} type="password" />);
      expect(screen.getByText('Password History')).toBeInTheDocument();
    });

    it('renders correct title for pin type', () => {
      render(<HistorySlider {...defaultProps} type="pin" />);
      expect(screen.getByText('PIN History')).toBeInTheDocument();
    });

    it('renders correct title for passphrase type', () => {
      render(<HistorySlider {...defaultProps} type="passphrase" />);
      expect(screen.getByText('Passphrase History')).toBeInTheDocument();
    });

    it('renders close button', () => {
      render(<HistorySlider {...defaultProps} />);
      expect(screen.getByTestId('close-history-button')).toBeInTheDocument();
    });
  });

  describe('backdrop interaction', () => {
    it('calls onClose when backdrop is clicked', () => {
      render(<HistorySlider {...defaultProps} />);
      const backdrop = screen.getByTestId('history-backdrop');
      fireEvent.click(backdrop);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('close button interaction', () => {
    it('calls onClose when close button is clicked', () => {
      render(<HistorySlider {...defaultProps} />);
      const closeButton = screen.getByTestId('close-history-button');
      fireEvent.click(closeButton);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('password history component', () => {
    it('renders PasswordHistory component with correct props', () => {
      render(<HistorySlider {...defaultProps} />);
      expect(screen.getByTestId('password-history')).toBeInTheDocument();
    });

    it('passes type to PasswordHistory', () => {
      const { rerender } = render(<HistorySlider {...defaultProps} type="pin" />);
      expect(screen.getByText('PIN History')).toBeInTheDocument();

      rerender(<HistorySlider {...defaultProps} type="password" />);
      expect(screen.getByText('Password History')).toBeInTheDocument();
    });

    it('passes items to PasswordHistory', () => {
      const items = [
        { value: 'test1', timestamp: 1234567890 },
        { value: 'test2', timestamp: 1234567891 },
      ];
      render(<HistorySlider {...defaultProps} items={items} />);
      expect(screen.getByText('test1')).toBeInTheDocument();
      expect(screen.getByText('test2')).toBeInTheDocument();
    });

    it('passes onRestore to PasswordHistory', () => {
      render(<HistorySlider {...defaultProps} />);
      const historyItem = screen.getByText('abc123').closest('button');
      if (historyItem) {
        fireEvent.click(historyItem);
        expect(mockOnRestore).toHaveBeenCalledWith('abc123');
      }
    });

    it('passes onClear to PasswordHistory', () => {
      render(<HistorySlider {...defaultProps} />);
      const clearButton = screen.getByTestId('clear-history-button');
      fireEvent.click(clearButton);
      expect(mockOnClear).toHaveBeenCalledTimes(1);
    });
  });

  describe('empty history', () => {
    it('handles empty items array', () => {
      render(<HistorySlider {...defaultProps} items={[]} />);
      expect(screen.getByTestId('empty-history')).toBeInTheDocument();
      expect(screen.getByText('No history yet')).toBeInTheDocument();
    });
  });

  describe('styling and structure', () => {
    it('has correct z-index for backdrop', () => {
      render(<HistorySlider {...defaultProps} />);
      const backdrop = screen.getByTestId('history-backdrop');
      expect(backdrop).toHaveClass('z-50');
    });

    it('has correct z-index for slider', () => {
      render(<HistorySlider {...defaultProps} />);
      const slider = screen.getByText('Password History').closest('.fixed');
      expect(slider).toHaveClass('z-[51]');
    });

    it('has backdrop with fade-in animation', () => {
      render(<HistorySlider {...defaultProps} />);
      const backdrop = screen.getByTestId('history-backdrop');
      expect(backdrop).toHaveClass('animate-fade-in');
    });

    it('has slider with slide-in animation', () => {
      render(<HistorySlider {...defaultProps} />);
      const slider = screen.getByText('Password History').closest('.fixed');
      expect(slider).toHaveClass('animate-slide-in-left');
    });

    it('has correct width classes for mobile', () => {
      render(<HistorySlider {...defaultProps} />);
      const slider = screen.getByTestId('history-slider');
      expect(slider).toHaveClass('w-full', 'sm:w-[400px]', 'z-[51]');
    });
  });

  describe('props validation', () => {
    it('handles password type', () => {
      render(<HistorySlider {...defaultProps} type="password" />);
      expect(screen.getByText('Password History')).toBeInTheDocument();
    });

    it('handles pin type', () => {
      render(<HistorySlider {...defaultProps} type="pin" />);
      expect(screen.getByText('PIN History')).toBeInTheDocument();
    });

    it('handles passphrase type', () => {
      render(<HistorySlider {...defaultProps} type="passphrase" />);
      expect(screen.getByText('Passphrase History')).toBeInTheDocument();
    });

    it('handles long history items', () => {
      const items = Array.from({ length: 50 }, (_, i) => ({
        value: `password${i}`,
        timestamp: 1234567890 + i * 1000,
      }));
      render(<HistorySlider {...defaultProps} items={items} />);
      for (let i = 0; i < 20; i++) {
        expect(screen.getByText(`password${i}`)).toBeInTheDocument();
      }
    });
  });

  describe('callback chains', () => {
    it('chains onRestore from PasswordHistory correctly', () => {
      render(<HistorySlider {...defaultProps} />);
      const historyItem1 = screen.getByText('abc123').closest('button');
      const historyItem2 = screen.getByText('def456').closest('button');

      if (historyItem1) fireEvent.click(historyItem1);
      if (historyItem2) fireEvent.click(historyItem2);

      expect(mockOnRestore).toHaveBeenCalledWith('abc123');
      expect(mockOnRestore).toHaveBeenCalledWith('def456');
      expect(mockOnRestore).toHaveBeenCalledTimes(2);
    });

    it('chains onClear from PasswordHistory correctly', () => {
      render(<HistorySlider {...defaultProps} />);
      const clearButton = screen.getByTestId('clear-history-button');

      fireEvent.click(clearButton);
      fireEvent.click(clearButton);

      expect(mockOnClear).toHaveBeenCalledTimes(2);
    });
  });
});
