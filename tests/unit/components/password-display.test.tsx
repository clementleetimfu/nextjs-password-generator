import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PasswordDisplay } from '@/components/password-generator/password-display';
import type { CredentialType, StrengthLevel, BreachCheckStatus } from '@/types/generator';

describe('PasswordDisplay Component', () => {
  const defaultProps = {
    value: 'testPassword123',
    type: 'password' as CredentialType,
    strength: 'STRONG' as StrengthLevel,
    breachCheck: 'idle' as BreachCheckStatus,
    onRefresh: vi.fn(),
    onCopy: vi.fn(),
    onBreachCheck: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock navigator.clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  describe('Rendering', () => {
    it('should render password display container', () => {
      render(<PasswordDisplay {...defaultProps} />);
      const display = screen.getByTestId('password-display');
      expect(display).toBeInTheDocument();
    });

    it('should display the password value', () => {
      render(<PasswordDisplay {...defaultProps} />);
      const passwordText = screen.getByText('testPassword123');
      expect(passwordText).toBeInTheDocument();
    });

    it('should render strength indicator', () => {
      render(<PasswordDisplay {...defaultProps} />);
      const strengthIndicator = screen.getByTestId('strength-indicator');
      expect(strengthIndicator).toBeInTheDocument();
    });

    it('should display strength level text', () => {
      render(<PasswordDisplay {...defaultProps} />);
      const strengthLevel = screen.getByTestId('strength-level');
      expect(strengthLevel).toHaveTextContent('STRONG');
    });

    it('should render all action buttons', () => {
      render(<PasswordDisplay {...defaultProps} />);
      expect(screen.getByTestId('refresh-button')).toBeInTheDocument();
      expect(screen.getByTestId('copy-button')).toBeInTheDocument();
      expect(screen.getByTestId('breach-check-button')).toBeInTheDocument();
    });

    it('should not render breach result when status is idle', () => {
      render(<PasswordDisplay {...defaultProps} breachCheck="idle" />);
      expect(screen.queryByTestId('breach-result')).not.toBeInTheDocument();
    });
  });

  describe('Strength Indicator', () => {
    it('should show VERY_WEAK strength with correct color', () => {
      render(<PasswordDisplay {...defaultProps} strength="VERY_WEAK" />);
      const strengthLevel = screen.getByTestId('strength-level');
      expect(strengthLevel).toHaveTextContent('VERY WEAK');
    });

    it('should show WEAK strength with correct color', () => {
      render(<PasswordDisplay {...defaultProps} strength="WEAK" />);
      const strengthLevel = screen.getByTestId('strength-level');
      expect(strengthLevel).toHaveTextContent('WEAK');
    });

    it('should show MODERATE strength with correct color', () => {
      render(<PasswordDisplay {...defaultProps} strength="MODERATE" />);
      const strengthLevel = screen.getByTestId('strength-level');
      expect(strengthLevel).toHaveTextContent('MODERATE');
    });

    it('should show STRONG strength with correct color', () => {
      render(<PasswordDisplay {...defaultProps} strength="STRONG" />);
      const strengthLevel = screen.getByTestId('strength-level');
      expect(strengthLevel).toHaveTextContent('STRONG');
    });

    it('should show VERY_STRONG strength with correct color', () => {
      render(<PasswordDisplay {...defaultProps} strength="VERY_STRONG" />);
      const strengthLevel = screen.getByTestId('strength-level');
      expect(strengthLevel).toHaveTextContent('VERY STRONG');
    });
  });

  describe('Refresh Button', () => {
    it('should call onRefresh when refresh button is clicked', () => {
      render(<PasswordDisplay {...defaultProps} />);
      const refreshButton = screen.getByTestId('refresh-button');
      fireEvent.click(refreshButton);
      expect(defaultProps.onRefresh).toHaveBeenCalledTimes(1);
    });

    it('should be enabled regardless of password value', () => {
      render(<PasswordDisplay {...defaultProps} />);
      const refreshButton = screen.getByTestId('refresh-button');
      expect(refreshButton).toBeEnabled();
    });
  });

  describe('Copy Button', () => {
    it('should call onCopy after successful clipboard write', async () => {
      render(<PasswordDisplay {...defaultProps} />);
      const copyButton = screen.getByTestId('copy-button');
      
      await fireEvent.click(copyButton);
      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('testPassword123');
        expect(defaultProps.onCopy).toHaveBeenCalledTimes(1);
      });
    });

    it('should be disabled when password value is empty', () => {
      render(<PasswordDisplay {...defaultProps} value="" />);
      const copyButton = screen.getByTestId('copy-button');
      expect(copyButton).toBeDisabled();
    });

    it('should be enabled when password value is present', () => {
      render(<PasswordDisplay {...defaultProps} value="password" />);
      const copyButton = screen.getByTestId('copy-button');
      expect(copyButton).toBeEnabled();
    });

    it('should handle clipboard write error gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      (navigator.clipboard.writeText as any).mockRejectedValue(new Error('Clipboard error'));
      
      render(<PasswordDisplay {...defaultProps} />);
      const copyButton = screen.getByTestId('copy-button');
      
      await fireEvent.click(copyButton);
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Failed to copy to clipboard:', expect.any(Error));
      });
      
      consoleSpy.mockRestore();
    });
  });

  describe('Breach Check Button', () => {
    it('should call onBreachCheck when clicked', () => {
      render(<PasswordDisplay {...defaultProps} />);
      const breachCheckButton = screen.getByTestId('breach-check-button');
      fireEvent.click(breachCheckButton);
      expect(defaultProps.onBreachCheck).toHaveBeenCalledTimes(1);
    });

    it('should be disabled when password value is empty', () => {
      render(<PasswordDisplay {...defaultProps} value="" />);
      const breachCheckButton = screen.getByTestId('breach-check-button');
      expect(breachCheckButton).toBeDisabled();
    });

    it('should be disabled when breach check is in progress', () => {
      render(<PasswordDisplay {...defaultProps} breachCheck="checking" />);
      const breachCheckButton = screen.getByTestId('breach-check-button');
      expect(breachCheckButton).toBeDisabled();
    });

    it('should be enabled when password is present and not checking', () => {
      render(<PasswordDisplay {...defaultProps} value="password" breachCheck="idle" />);
      const breachCheckButton = screen.getByTestId('breach-check-button');
      expect(breachCheckButton).toBeEnabled();
    });
  });

  describe('Breach Result Display', () => {
    it('should display checking status when breachCheck is checking', () => {
      render(<PasswordDisplay {...defaultProps} breachCheck="checking" />);
      const breachResult = screen.getByTestId('breach-result');
      expect(breachResult).toHaveTextContent('Checking...');
    });

    it('should display safe status when breachCheck is safe', () => {
      render(<PasswordDisplay {...defaultProps} breachCheck="safe" />);
      const breachResult = screen.getByTestId('breach-result');
      expect(breachResult).toHaveTextContent('✓ Safe');
    });

    it('should display breached status with count when breachCheck is breached', () => {
      render(<PasswordDisplay {...defaultProps} breachCheck="breached" breachCount={42} />);
      const breachResult = screen.getByTestId('breach-result');
      expect(breachResult).toHaveTextContent('⚠️ Found in 42 breaches');
    });

    it('should display error status when breachCheck is error', () => {
      render(<PasswordDisplay {...defaultProps} breachCheck="error" />);
      const breachResult = screen.getByTestId('breach-result');
      expect(breachResult).toHaveTextContent('✗ Error checking');
    });

    it('should apply correct color classes for safe status', () => {
      render(<PasswordDisplay {...defaultProps} breachCheck="safe" />);
      const breachResult = screen.getByTestId('breach-result');
      expect(breachResult).toHaveClass('text-green-600', 'dark:text-green-400');
    });

    it('should apply correct color classes for breached status', () => {
      render(<PasswordDisplay {...defaultProps} breachCheck="breached" />);
      const breachResult = screen.getByTestId('breach-result');
      expect(breachResult).toHaveClass('text-red-600', 'dark:text-red-400');
    });

    it('should apply correct color classes for error status', () => {
      render(<PasswordDisplay {...defaultProps} breachCheck="error" />);
      const breachResult = screen.getByTestId('breach-result');
      expect(breachResult).toHaveClass('text-red-600', 'dark:text-red-400');
    });
  });

  describe('Different Credential Types', () => {
    it('should render correctly for password type', () => {
      render(<PasswordDisplay {...defaultProps} type="password" />);
      expect(screen.getByTestId('password-display')).toBeInTheDocument();
    });

    it('should render correctly for PIN type', () => {
      render(<PasswordDisplay {...defaultProps} type="pin" />);
      expect(screen.getByTestId('password-display')).toBeInTheDocument();
    });

    it('should render correctly for passphrase type', () => {
      render(<PasswordDisplay {...defaultProps} type="passphrase" />);
      expect(screen.getByTestId('password-display')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long passwords', () => {
      const longPassword = 'a'.repeat(100);
      render(<PasswordDisplay {...defaultProps} value={longPassword} />);
      expect(screen.getByText(longPassword)).toBeInTheDocument();
    });

    it('should handle passwords with special characters', () => {
      const specialPassword = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      render(<PasswordDisplay {...defaultProps} value={specialPassword} />);
      expect(screen.getByText(specialPassword)).toBeInTheDocument();
    });

    it('should handle passwords with unicode characters', () => {
      const unicodePassword = 'pàsswörd123ñ';
      render(<PasswordDisplay {...defaultProps} value={unicodePassword} />);
      expect(screen.getByText(unicodePassword)).toBeInTheDocument();
    });

    it('should handle zero breach count', () => {
      render(<PasswordDisplay {...defaultProps} breachCheck="safe" breachCount={0} />);
      const breachResult = screen.getByTestId('breach-result');
      expect(breachResult).toHaveTextContent('✓ Safe');
    });

    it('should handle very large breach count', () => {
      render(<PasswordDisplay {...defaultProps} breachCheck="breached" breachCount={999999999} />);
      const breachResult = screen.getByTestId('breach-result');
      expect(breachResult).toHaveTextContent('⚠️ Found in 999999999 breaches');
    });
  });
});
