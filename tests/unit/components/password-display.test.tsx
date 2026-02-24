import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PasswordDisplay } from '@/components/password-generator/password-display';
import type { StrengthLevel, BreachCheckStatus } from '@/types/generator';

describe('PasswordDisplay Component', () => {
  const defaultProps = {
    value: 'testPassword123',
    strength: 'STRONG' as StrengthLevel,
    breachCheck: 'idle' as BreachCheckStatus,
    onRefresh: vi.fn(),
    onCopy: vi.fn(),
    onBreachCheck: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
  });

  describe('Rendering', () => {
    it('renders value and action buttons', () => {
      render(<PasswordDisplay {...defaultProps} />);
      expect(screen.getByText('testPassword123')).toBeInTheDocument();
      expect(screen.getByTestId('refresh-button')).toBeInTheDocument();
      expect(screen.getByTestId('copy-button')).toBeInTheDocument();
      expect(screen.getByTestId('breach-check-button')).toBeInTheDocument();
    });

    it('renders password display container', () => {
      render(<PasswordDisplay {...defaultProps} />);
      expect(screen.getByTestId('password-display')).toBeInTheDocument();
    });

    it('renders strength indicator', () => {
      render(<PasswordDisplay {...defaultProps} />);
      expect(screen.getByTestId('strength-indicator')).toBeInTheDocument();
    });

    it('does not render breach result when status is idle', () => {
      render(<PasswordDisplay {...defaultProps} breachCheck="idle" />);
      expect(screen.queryByTestId('breach-result')).not.toBeInTheDocument();
    });
  });

  describe('Strength Display', () => {
    it('displays VERY_WEAK strength level', () => {
      render(<PasswordDisplay {...defaultProps} strength="VERY_WEAK" />);
      expect(screen.getByTestId('strength-level')).toHaveTextContent('VERY WEAK');
    });

    it('displays WEAK strength level', () => {
      render(<PasswordDisplay {...defaultProps} strength="WEAK" />);
      expect(screen.getByTestId('strength-level')).toHaveTextContent('WEAK');
    });

    it('displays MODERATE strength level', () => {
      render(<PasswordDisplay {...defaultProps} strength="MODERATE" />);
      expect(screen.getByTestId('strength-level')).toHaveTextContent('MODERATE');
    });

    it('displays STRONG strength level', () => {
      render(<PasswordDisplay {...defaultProps} strength="STRONG" />);
      expect(screen.getByTestId('strength-level')).toHaveTextContent('STRONG');
    });

    it('displays VERY_STRONG strength level', () => {
      render(<PasswordDisplay {...defaultProps} strength="VERY_STRONG" />);
      expect(screen.getByTestId('strength-level')).toHaveTextContent('VERY STRONG');
    });
  });

  describe('User Interactions', () => {
    it('calls refresh and breach callbacks', () => {
      render(<PasswordDisplay {...defaultProps} />);
      fireEvent.click(screen.getByTestId('refresh-button'));
      fireEvent.click(screen.getByTestId('breach-check-button'));
      expect(defaultProps.onRefresh).toHaveBeenCalledTimes(1);
      expect(defaultProps.onBreachCheck).toHaveBeenCalledTimes(1);
    });

    it('copies to clipboard then calls onCopy', async () => {
      render(<PasswordDisplay {...defaultProps} />);
      fireEvent.click(screen.getByTestId('copy-button'));

      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('testPassword123');
        expect(defaultProps.onCopy).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Breach Check Status', () => {
    it('shows breach status text for safe', () => {
      render(<PasswordDisplay {...defaultProps} breachCheck="safe" />);
      expect(screen.getByTestId('breach-result')).toHaveTextContent('Safe');
    });

    it('shows breach status text for breached with count', () => {
      render(<PasswordDisplay {...defaultProps} breachCheck="breached" breachCount={42} />);
      expect(screen.getByTestId('breach-result')).toHaveTextContent('Found in 42 breaches');
    });

    it('shows checking status', () => {
      render(<PasswordDisplay {...defaultProps} breachCheck="checking" />);
      expect(screen.getByTestId('breach-result')).toHaveTextContent('Checking...');
    });

    it('shows error status', () => {
      render(<PasswordDisplay {...defaultProps} breachCheck="error" />);
      expect(screen.getByTestId('breach-result')).toHaveTextContent('Error checking');
    });
  });

  describe('Button States', () => {
    it('disables copy button when value is empty', () => {
      render(<PasswordDisplay {...defaultProps} value="" />);
      expect(screen.getByTestId('copy-button')).toBeDisabled();
    });

    it('disables breach check button when value is empty', () => {
      render(<PasswordDisplay {...defaultProps} value="" />);
      expect(screen.getByTestId('breach-check-button')).toBeDisabled();
    });

    it('disables breach check button when checking', () => {
      render(<PasswordDisplay {...defaultProps} breachCheck="checking" />);
      expect(screen.getByTestId('breach-check-button')).toBeDisabled();
    });

    it('enables buttons when value is present', () => {
      render(<PasswordDisplay {...defaultProps} value="password" />);
      expect(screen.getByTestId('copy-button')).not.toBeDisabled();
      expect(screen.getByTestId('breach-check-button')).not.toBeDisabled();
    });
  });

  describe('Edge Cases', () => {
    it('handles very long passwords', () => {
      const longPassword = 'a'.repeat(100);
      render(<PasswordDisplay {...defaultProps} value={longPassword} />);
      expect(screen.getByText(longPassword)).toBeInTheDocument();
    });

    it('handles special characters in password', () => {
      const specialPassword = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      render(<PasswordDisplay {...defaultProps} value={specialPassword} />);
      expect(screen.getByText(specialPassword)).toBeInTheDocument();
    });
  });
});
