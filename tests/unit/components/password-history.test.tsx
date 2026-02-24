import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PasswordHistory } from '@/components/password-generator/password-history';
import type { CredentialType } from '@/types/generator';

describe('PasswordHistory Component', () => {
  const mockOnRestore = vi.fn();
  const mockOnClear = vi.fn();

  const defaultProps = {
    type: 'password' as CredentialType,
    items: [
      { value: 'abc123', timestamp: 1234567890 },
      { value: 'def456', timestamp: 1234567891 },
    ],
    onRestore: mockOnRestore,
    onClear: mockOnClear,
  };

  describe('rendering', () => {
    it('renders history items when items are provided', () => {
      render(<PasswordHistory {...defaultProps} />);
      expect(screen.getByText('abc123')).toBeInTheDocument();
      expect(screen.getByText('def456')).toBeInTheDocument();
    });

    it('renders empty state when items array is empty', () => {
      render(<PasswordHistory {...defaultProps} items={[]} />);
      expect(screen.getByTestId('empty-history')).toBeInTheDocument();
      expect(screen.getByText('No history yet')).toBeInTheDocument();
    });

    it('renders correct number of history items', () => {
      const items = [
        { value: 'test1', timestamp: 1234567890 },
        { value: 'test2', timestamp: 1234567891 },
        { value: 'test3', timestamp: 1234567892 },
      ];
      render(<PasswordHistory {...defaultProps} items={items} />);
      expect(screen.getAllByRole('button')).toHaveLength(3);
    });

    it('renders timestamps for each item', () => {
      render(<PasswordHistory {...defaultProps} />);
      const timestamps = screen.getAllByRole('button').map((btn) =>
        btn.querySelector('span:last-child')?.textContent
      );
      expect(timestamps).toHaveLength(2);
    });
  });

  describe('timestamp formatting', () => {
    it('formats timestamp as time string', () => {
      const timestamp = 1234567890;
      const date = new Date(timestamp);
      const expectedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      render(<PasswordHistory {...defaultProps} items={[{ value: 'test', timestamp }]} />);
      expect(screen.getByText(expectedTime)).toBeInTheDocument();
    });

    it('handles different timestamps correctly', () => {
      const items = [
        { value: 'test1', timestamp: 1640995200000 },
        { value: 'test2', timestamp: 1640995260000 },
      ];
      render(<PasswordHistory {...defaultProps} items={items} />);
      const timestamps = screen.getAllByText(/(\d{1,2}:\d{2})/);
      expect(timestamps).toHaveLength(2);
    });
  });

  describe('restore interaction', () => {
    it('calls onRestore with correct value when item is clicked', () => {
      render(<PasswordHistory {...defaultProps} />);
      const itemButton = screen.getByText('abc123');
      fireEvent.click(itemButton);
      expect(mockOnRestore).toHaveBeenCalledWith('abc123');
    });

    it('calls onRestore for different items', () => {
      render(<PasswordHistory {...defaultProps} />);
      fireEvent.click(screen.getByText('abc123'));
      fireEvent.click(screen.getByText('def456'));
      expect(mockOnRestore).toHaveBeenCalledWith('abc123');
      expect(mockOnRestore).toHaveBeenCalledWith('def456');
    });

    it('handles long passwords in history', () => {
      const longPassword = 'a'.repeat(50);
      render(<PasswordHistory {...defaultProps} items={[{ value: longPassword, timestamp: Date.now() }]} />);
      const passwordElement = screen.getByText(longPassword);
      expect(passwordElement).toBeInTheDocument();
      expect(passwordElement).toHaveClass('break-all');
    });

    it('handles passwords with special characters', () => {
      const specialPassword = 'p@$$w0rd!#123';
      render(<PasswordHistory {...defaultProps} items={[{ value: specialPassword, timestamp: Date.now() }]} />);
      expect(screen.getByText(specialPassword)).toBeInTheDocument();
    });

    it('handles passwords with unicode', () => {
      const unicodePassword = 'пароль123';
      render(<PasswordHistory {...defaultProps} items={[{ value: unicodePassword, timestamp: Date.now() }]} />);
      expect(screen.getByText(unicodePassword)).toBeInTheDocument();
    });
  });

  describe('clear interaction', () => {
    it('renders clear history button', () => {
      render(<PasswordHistory {...defaultProps} />);
      expect(screen.getByTestId('clear-history-button')).toBeInTheDocument();
    });

    it('calls onClear when clear button is clicked', () => {
      render(<PasswordHistory {...defaultProps} />);
      const clearButton = screen.getByTestId('clear-history-button');
      fireEvent.click(clearButton);
      expect(mockOnClear).toHaveBeenCalledTimes(1);
    });

    it('has correct button text', () => {
      render(<PasswordHistory {...defaultProps} />);
      expect(screen.getByText('Clear History')).toBeInTheDocument();
    });
  });

  describe('props validation', () => {
    it('handles password type', () => {
      render(<PasswordHistory {...defaultProps} type="password" />);
      expect(screen.getByTestId('password-history')).toBeInTheDocument();
    });

    it('handles pin type', () => {
      render(<PasswordHistory {...defaultProps} type="pin" />);
      expect(screen.getByTestId('password-history')).toBeInTheDocument();
    });

    it('handles passphrase type', () => {
      render(<PasswordHistory {...defaultProps} type="passphrase" />);
      expect(screen.getByTestId('password-history')).toBeInTheDocument();
    });

    it('handles single item', () => {
      render(<PasswordHistory {...defaultProps} items={[{ value: 'single', timestamp: Date.now() }]} />);
      expect(screen.getByText('single')).toBeInTheDocument();
      expect(screen.getAllByRole('button')).toHaveLength(2);
    });

    it('handles multiple items', () => {
      const items = Array.from({ length: 10 }, (_, i) => ({
        value: `password${i}`,
        timestamp: Date.now() + i * 1000,
      }));
      render(<PasswordHistory {...defaultProps} items={items} />);
      expect(screen.getAllByRole('button')).toHaveLength(11);
    });
  });

  describe('styling', () => {
    it('has correct test id for history container', () => {
      render(<PasswordHistory {...defaultProps} />);
      expect(screen.getByTestId('password-history')).toBeInTheDocument();
    });

    it('has correct test id for empty state', () => {
      render(<PasswordHistory {...defaultProps} items={[]} />);
      expect(screen.getByTestId('empty-history')).toBeInTheDocument();
    });

    it('has correct test id for clear button', () => {
      render(<PasswordHistory {...defaultProps} />);
      expect(screen.getByTestId('clear-history-button')).toBeInTheDocument();
    });

    it('has monospace font for password values', () => {
      render(<PasswordHistory {...defaultProps} />);
      const passwordText = screen.getByText('abc123');
      expect(passwordText).toHaveClass('font-mono');
    });

    it('has correct spacing for history items', () => {
      render(<PasswordHistory {...defaultProps} />);
      const container = screen.getByTestId('password-history');
      expect(container).toHaveClass('space-y-3');
    });
  });

  describe('item buttons', () => {
    it('renders items as clickable buttons', () => {
      render(<PasswordHistory {...defaultProps} />);
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
      expect(buttons[0]).toHaveTextContent('abc123');
    });

    it('has correct data-testid for history items', () => {
      render(<PasswordHistory {...defaultProps} />);
      expect(screen.getByTestId('history-item-0')).toBeInTheDocument();
      expect(screen.getByTestId('history-item-1')).toBeInTheDocument();
    });

    it('has correct button styling', () => {
      render(<PasswordHistory {...defaultProps} />);
      const itemButton = screen.getByText('abc123').closest('button');
      expect(itemButton).toHaveClass('bg-zinc-50', 'dark:bg-zinc-800/50', 'rounded-lg', 'hover:bg-zinc-100', 'dark:hover:bg-zinc-800');
    });
  });

  describe('timestamp styling', () => {
    it('has small font size for timestamps', () => {
      render(<PasswordHistory {...defaultProps} />);
      const timestamps = screen.getAllByText(/(\d{1,2}:\d{2})/);
      timestamps.forEach((timestamp) => {
        expect(timestamp).toHaveClass('text-xs');
      });
    });

    it('has correct color for timestamps', () => {
      render(<PasswordHistory {...defaultProps} />);
      const timestamps = screen.getAllByText(/(\d{1,2}:\d{2})/);
      timestamps.forEach((timestamp) => {
        expect(timestamp).toHaveClass('text-zinc-500', 'dark:text-zinc-400');
      });
    });

    it('has whitespace-nowrap class for timestamps', () => {
      render(<PasswordHistory {...defaultProps} />);
      const timestamps = screen.getAllByText(/(\d{1,2}:\d{2})/);
      timestamps.forEach((timestamp) => {
        expect(timestamp).toHaveClass('whitespace-nowrap', 'flex-shrink-0');
      });
    });
  });

  describe('clear button styling', () => {
    it('has outline variant', () => {
      render(<PasswordHistory {...defaultProps} />);
      const clearButton = screen.getByTestId('clear-history-button');
      expect(clearButton).toHaveClass('outline');
    });

    it('has small size', () => {
      render(<PasswordHistory {...defaultProps} />);
      const clearButton = screen.getByTestId('clear-history-button');
      expect(clearButton).toHaveClass('sm');
    });

    it('has full width', () => {
      render(<PasswordHistory {...defaultProps} />);
      const clearButton = screen.getByTestId('clear-history-button');
      expect(clearButton).toHaveClass('w-full');
    });
  });

  describe('callback chains', () => {
    it('chains multiple restore calls correctly', () => {
      render(<PasswordHistory {...defaultProps} />);
      fireEvent.click(screen.getByText('abc123'));
      fireEvent.click(screen.getByText('def456'));
      fireEvent.click(screen.getByText('abc123'));
      expect(mockOnRestore).toHaveBeenCalledTimes(3);
    });

    it('chains multiple clear calls correctly', () => {
      render(<PasswordHistory {...defaultProps} />);
      const clearButton = screen.getByTestId('clear-history-button');
      fireEvent.click(clearButton);
      fireEvent.click(clearButton);
      expect(mockOnClear).toHaveBeenCalledTimes(2);
    });
  });

  describe('empty state styling', () => {
    it('has correct text alignment for empty state', () => {
      render(<PasswordHistory {...defaultProps} items={[]} />);
      const emptyState = screen.getByTestId('empty-history');
      expect(emptyState).toHaveClass('text-center', 'py-12');
    });

    it('has correct color for empty state text', () => {
      render(<PasswordHistory {...defaultProps} items={[]} />);
      const emptyStateText = screen.getByText('No history yet');
      expect(emptyStateText).toHaveClass('text-zinc-500', 'dark:text-zinc-400');
    });
  });

  describe('long passwords', () => {
    it('handles maximum length passwords', () => {
      const maxLengthPassword = 'a'.repeat(50);
      render(<PasswordHistory {...defaultProps} items={[{ value: maxLengthPassword, timestamp: Date.now() }]} />);
      expect(screen.getByText(maxLengthPassword)).toBeInTheDocument();
    });

    it('handles passwords with mixed characters', () => {
      const mixedPassword = 'aA1@bB2#cC3$dD4%';
      render(<PasswordHistory {...defaultProps} items={[{ value: mixedPassword, timestamp: Date.now() }]} />);
      expect(screen.getByText(mixedPassword)).toBeInTheDocument();
    });
  });
});
