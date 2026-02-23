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
    it('should render controls container', () => {
      render(<PasswordControls {...defaultProps} />);
      const controls = screen.getByTestId('controls');
      expect(controls).toBeInTheDocument();
    });

    it('should render length slider', () => {
      render(<PasswordControls {...defaultProps} />);
      const slider = screen.getByTestId('length-slider');
      expect(slider).toBeInTheDocument();
    });

    it('should display current length value', () => {
      render(<PasswordControls {...defaultProps} length={16} />);
      const lengthValue = screen.getByTestId('length-value');
      expect(lengthValue).toHaveTextContent('16');
    });

    it('should render character type toggles', () => {
      render(<PasswordControls {...defaultProps} />);
      expect(screen.getByTestId('toggle-digits')).toBeInTheDocument();
      expect(screen.getByTestId('toggle-symbols')).toBeInTheDocument();
      expect(screen.getByTestId('toggle-uppercase')).toBeInTheDocument();
    });

    it('should display min and max length labels', () => {
      render(<PasswordControls {...defaultProps} />);
      expect(screen.getByText(PASSWORD_CONSTRAINTS.MIN_LENGTH.toString())).toBeInTheDocument();
      expect(screen.getByText(PASSWORD_CONSTRAINTS.MAX_LENGTH.toString())).toBeInTheDocument();
    });
  });

  describe('Length Slider', () => {
    it('should call onLengthChange when slider value changes', () => {
      render(<PasswordControls {...defaultProps} />);
      const slider = screen.getByTestId('length-slider');
      
      // Simulate slider change
      fireEvent.change(slider, { target: { value: '16' } });
      
      // Note: The actual implementation uses onValueChange from Radix UI
      // which might need different event handling in tests
      expect(defaultProps.onLengthChange).toHaveBeenCalled();
    });

    it('should display correct initial length', () => {
      render(<PasswordControls {...defaultProps} length={20} />);
      const lengthValue = screen.getByTestId('length-value');
      expect(lengthValue).toHaveTextContent('20');
    });

    it('should handle minimum length', () => {
      render(<PasswordControls {...defaultProps} length={PASSWORD_CONSTRAINTS.MIN_LENGTH} />);
      const lengthValue = screen.getByTestId('length-value');
      expect(lengthValue).toHaveTextContent(PASSWORD_CONSTRAINTS.MIN_LENGTH.toString());
    });

    it('should handle maximum length', () => {
      render(<PasswordControls {...defaultProps} length={PASSWORD_CONSTRAINTS.MAX_LENGTH} />);
      const lengthValue = screen.getByTestId('length-value');
      expect(lengthValue).toHaveTextContent(PASSWORD_CONSTRAINTS.MAX_LENGTH.toString());
    });
  });

  describe('Digits Toggle', () => {
    it('should render digits toggle with correct initial state', () => {
      render(<PasswordControls {...defaultProps} includeDigits={false} />);
      const toggle = screen.getByTestId('toggle-digits');
      expect(toggle).toHaveAttribute('aria-checked', 'false');
    });

    it('should render digits toggle as checked when enabled', () => {
      render(<PasswordControls {...defaultProps} includeDigits={true} />);
      const toggle = screen.getByTestId('toggle-digits');
      expect(toggle).toHaveAttribute('aria-checked', 'true');
    });

    it('should call onToggleDigits when clicked', () => {
      render(<PasswordControls {...defaultProps} />);
      const toggle = screen.getByTestId('toggle-digits');
      fireEvent.click(toggle);
      expect(defaultProps.onToggleDigits).toHaveBeenCalledTimes(1);
    });

    it('should display correct label', () => {
      render(<PasswordControls {...defaultProps} />);
      expect(screen.getByText(/Include Digits/)).toBeInTheDocument();
      expect(screen.getByText(/\(0-9\)/)).toBeInTheDocument();
    });
  });

  describe('Symbols Toggle', () => {
    it('should render symbols toggle with correct initial state', () => {
      render(<PasswordControls {...defaultProps} includeSymbols={false} />);
      const toggle = screen.getByTestId('toggle-symbols');
      expect(toggle).toHaveAttribute('aria-checked', 'false');
    });

    it('should render symbols toggle as checked when enabled', () => {
      render(<PasswordControls {...defaultProps} includeSymbols={true} />);
      const toggle = screen.getByTestId('toggle-symbols');
      expect(toggle).toHaveAttribute('aria-checked', 'true');
    });

    it('should call onToggleSymbols when clicked', () => {
      render(<PasswordControls {...defaultProps} />);
      const toggle = screen.getByTestId('toggle-symbols');
      fireEvent.click(toggle);
      expect(defaultProps.onToggleSymbols).toHaveBeenCalledTimes(1);
    });

    it('should display correct label', () => {
      render(<PasswordControls {...defaultProps} />);
      expect(screen.getByText(/Include Symbols/)).toBeInTheDocument();
      expect(screen.getByText(/\(!@#\$%\^&\*\)/)).toBeInTheDocument();
    });
  });

  describe('Uppercase Toggle', () => {
    it('should render uppercase toggle with correct initial state', () => {
      render(<PasswordControls {...defaultProps} includeUppercase={false} />);
      const toggle = screen.getByTestId('toggle-uppercase');
      expect(toggle).toHaveAttribute('aria-checked', 'false');
    });

    it('should render uppercase toggle as checked when enabled', () => {
      render(<PasswordControls {...defaultProps} includeUppercase={true} />);
      const toggle = screen.getByTestId('toggle-uppercase');
      expect(toggle).toHaveAttribute('aria-checked', 'true');
    });

    it('should call onToggleUppercase when clicked', () => {
      render(<PasswordControls {...defaultProps} />);
      const toggle = screen.getByTestId('toggle-uppercase');
      fireEvent.click(toggle);
      expect(defaultProps.onToggleUppercase).toHaveBeenCalledTimes(1);
    });

    it('should display correct label', () => {
      render(<PasswordControls {...defaultProps} />);
      expect(screen.getByText(/Include Uppercase/)).toBeInTheDocument();
      expect(screen.getByText(/\(A-Z\)/)).toBeInTheDocument();
    });
  });

  describe('Character Types Section', () => {
    it('should display section heading', () => {
      render(<PasswordControls {...defaultProps} />);
      expect(screen.getByText('Character Types')).toBeInTheDocument();
    });

    it('should display all toggle labels', () => {
      render(<PasswordControls {...defaultProps} />);
      expect(screen.getByText('Include Digits (0-9)')).toBeInTheDocument();
      expect(screen.getByText('Include Symbols (!@#$%^&*)')).toBeInTheDocument();
      expect(screen.getByText('Include Uppercase (A-Z)')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle all toggles enabled simultaneously', () => {
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

    it('should handle all toggles disabled simultaneously', () => {
      render(
        <PasswordControls
          {...defaultProps}
          includeDigits={false}
          includeSymbols={false}
          includeUppercase={false}
        />
      );
      
      expect(screen.getByTestId('toggle-digits')).toHaveAttribute('aria-checked', 'false');
      expect(screen.getByTestId('toggle-symbols')).toHaveAttribute('aria-checked', 'false');
      expect(screen.getByTestId('toggle-uppercase')).toHaveAttribute('aria-checked', 'false');
    });

    it('should handle boundary length values', () => {
      const { rerender } = render(<PasswordControls {...defaultProps} length={8} />);
      
      rerender(<PasswordControls {...defaultProps} length={PASSWORD_CONSTRAINTS.MIN_LENGTH} />);
      expect(screen.getByTestId('length-value')).toHaveTextContent(PASSWORD_CONSTRAINTS.MIN_LENGTH.toString());
      
      rerender(<PasswordControls {...defaultProps} length={PASSWORD_CONSTRAINTS.MAX_LENGTH} />);
      expect(screen.getByTestId('length-value')).toHaveTextContent(PASSWORD_CONSTRAINTS.MAX_LENGTH.toString());
    });

    it('should handle rapid toggle clicks', () => {
      render(<PasswordControls {...defaultProps} />);
      const toggle = screen.getByTestId('toggle-digits');
      
      fireEvent.click(toggle);
      fireEvent.click(toggle);
      fireEvent.click(toggle);
      
      expect(defaultProps.onToggleDigits).toHaveBeenCalledTimes(3);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes on toggles', () => {
      render(<PasswordControls {...defaultProps} />);
      
      const digitToggle = screen.getByTestId('toggle-digits');
      const symbolToggle = screen.getByTestId('toggle-symbols');
      const uppercaseToggle = screen.getByTestId('toggle-uppercase');
      
      expect(digitToggle).toHaveAttribute('role', 'switch');
      expect(symbolToggle).toHaveAttribute('role', 'switch');
      expect(uppercaseToggle).toHaveAttribute('role', 'switch');
    });

    it('should have accessible labels for all controls', () => {
      render(<PasswordControls {...defaultProps} />);
      
      // Length label
      expect(screen.getByLabelText(/Length:/)).toBeInTheDocument();
      
      // Toggle labels
      expect(screen.getByText('Include Digits (0-9)')).toBeInTheDocument();
      expect(screen.getByText('Include Symbols (!@#$%^&*)')).toBeInTheDocument();
      expect(screen.getByText('Include Uppercase (A-Z)')).toBeInTheDocument();
    });
  });
});
