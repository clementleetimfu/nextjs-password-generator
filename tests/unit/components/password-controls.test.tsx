import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PasswordControls } from '@/components/password-generator/password-controls';
import { PASSWORD_CONSTRAINTS } from '@/lib/crypto';

describe('PasswordControls Component', () => {
  const defaultProps = {
    length: 12,
    includeDigits: false,
    includeSymbols: false,
    includeUppercase: false,
    onLengthChange: vi.fn(),
    onToggleDigits: vi.fn(),
    onToggleSymbols: vi.fn(),
    onToggleUppercase: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders control sections', () => {
      render(<PasswordControls {...defaultProps} />);
      expect(screen.getByTestId('controls')).toBeInTheDocument();
      expect(screen.getByTestId('length-slider')).toBeInTheDocument();
    });

    it('shows current length', () => {
      render(<PasswordControls {...defaultProps} length={20} />);
      expect(screen.getByTestId('length-value')).toHaveTextContent('20');
    });

    it('displays min and max length bounds', () => {
      render(<PasswordControls {...defaultProps} />);
      expect(screen.getByText(PASSWORD_CONSTRAINTS.MIN_LENGTH.toString())).toBeInTheDocument();
      expect(screen.getByText(PASSWORD_CONSTRAINTS.MAX_LENGTH.toString())).toBeInTheDocument();
    });

    it('renders all toggle switches', () => {
      render(<PasswordControls {...defaultProps} />);
      expect(screen.getByTestId('toggle-digits')).toBeInTheDocument();
      expect(screen.getByTestId('toggle-symbols')).toBeInTheDocument();
      expect(screen.getByTestId('toggle-uppercase')).toBeInTheDocument();
    });

    it('displays toggle labels', () => {
      render(<PasswordControls {...defaultProps} />);
      expect(screen.getByText('Include Digits')).toBeInTheDocument();
      expect(screen.getByText('Include Symbols')).toBeInTheDocument();
      expect(screen.getByText('Include Uppercase')).toBeInTheDocument();
    });
  });

  describe('Toggle States', () => {
    it('reflects checked states from props', () => {
      render(
        <PasswordControls
          {...defaultProps}
          includeDigits={true}
          includeSymbols={true}
          includeUppercase={true}
        />
      );
      expect(screen.getByTestId('toggle-digits')).toHaveAttribute('aria-checked', 'true');
      expect(screen.getByTestId('toggle-symbols')).toHaveAttribute('aria-checked', 'true');
      expect(screen.getByTestId('toggle-uppercase')).toHaveAttribute('aria-checked', 'true');
    });

    it('shows toggles as unchecked by default', () => {
      render(<PasswordControls {...defaultProps} />);
      expect(screen.getByTestId('toggle-digits')).toHaveAttribute('aria-checked', 'false');
      expect(screen.getByTestId('toggle-symbols')).toHaveAttribute('aria-checked', 'false');
      expect(screen.getByTestId('toggle-uppercase')).toHaveAttribute('aria-checked', 'false');
    });

    it('handles partial toggle states', () => {
      render(<PasswordControls {...defaultProps} includeDigits={true} />);
      expect(screen.getByTestId('toggle-digits')).toHaveAttribute('aria-checked', 'true');
      expect(screen.getByTestId('toggle-symbols')).toHaveAttribute('aria-checked', 'false');
      expect(screen.getByTestId('toggle-uppercase')).toHaveAttribute('aria-checked', 'false');
    });
  });

  describe('User Interactions', () => {
    it('wires toggle callbacks', () => {
      render(<PasswordControls {...defaultProps} />);
      fireEvent.click(screen.getByTestId('toggle-digits'));
      fireEvent.click(screen.getByTestId('toggle-symbols'));
      fireEvent.click(screen.getByTestId('toggle-uppercase'));
      expect(defaultProps.onToggleDigits).toHaveBeenCalledTimes(1);
      expect(defaultProps.onToggleSymbols).toHaveBeenCalledTimes(1);
      expect(defaultProps.onToggleUppercase).toHaveBeenCalledTimes(1);
    });

    it('handles multiple toggle clicks', () => {
      render(<PasswordControls {...defaultProps} />);
      fireEvent.click(screen.getByTestId('toggle-digits'));
      fireEvent.click(screen.getByTestId('toggle-digits'));
      expect(defaultProps.onToggleDigits).toHaveBeenCalledTimes(2);
    });
  });

  describe('Edge Cases', () => {
    it('handles minimum length value', () => {
      render(<PasswordControls {...defaultProps} length={PASSWORD_CONSTRAINTS.MIN_LENGTH} />);
      expect(screen.getByTestId('length-value')).toHaveTextContent(
        PASSWORD_CONSTRAINTS.MIN_LENGTH.toString()
      );
    });

    it('handles maximum length value', () => {
      render(<PasswordControls {...defaultProps} length={PASSWORD_CONSTRAINTS.MAX_LENGTH} />);
      expect(screen.getByTestId('length-value')).toHaveTextContent(
        PASSWORD_CONSTRAINTS.MAX_LENGTH.toString()
      );
    });

    it('handles all toggles enabled simultaneously', () => {
      render(
        <PasswordControls
          {...defaultProps}
          includeDigits={true}
          includeSymbols={true}
          includeUppercase={true}
        />
      );
      expect(screen.getByTestId('toggle-digits')).toHaveAttribute('aria-checked', 'true');
      expect(screen.getByTestId('toggle-symbols')).toHaveAttribute('aria-checked', 'true');
      expect(screen.getByTestId('toggle-uppercase')).toHaveAttribute('aria-checked', 'true');
    });
  });
});
