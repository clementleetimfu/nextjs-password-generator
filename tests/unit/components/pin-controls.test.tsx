import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PinControls } from '@/components/password-generator/pin-controls';
import { PIN_CONSTRAINTS } from '@/lib/crypto';

describe('PinControls Component', () => {
  const defaultProps = {
    length: 4,
    onLengthChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render controls container', () => {
      render(<PinControls {...defaultProps} />);
      const controls = screen.getByTestId('controls');
      expect(controls).toBeInTheDocument();
    });

    it('should render length slider', () => {
      render(<PinControls {...defaultProps} />);
      const slider = screen.getByTestId('length-slider');
      expect(slider).toBeInTheDocument();
    });

    it('should display current length value', () => {
      render(<PinControls {...defaultProps} length={6} />);
      const lengthValue = screen.getByTestId('length-value');
      expect(lengthValue).toHaveTextContent('6');
    });

    it('should display min and max length labels', () => {
      render(<PinControls {...defaultProps} />);
      expect(screen.getByText(PIN_CONSTRAINTS.MIN_LENGTH.toString())).toBeInTheDocument();
      expect(screen.getByText(PIN_CONSTRAINTS.MAX_LENGTH.toString())).toBeInTheDocument();
    });

    it('should display PIN description text', () => {
      render(<PinControls {...defaultProps} />);
      expect(screen.getByText(/PINs are numeric-only codes/)).toBeInTheDocument();
      expect(screen.getByText(/\(0-9\)/)).toBeInTheDocument();
    });
  });

  describe('Length Slider', () => {
    it('should call onLengthChange when slider value changes', () => {
      render(<PinControls {...defaultProps} />);
      const slider = screen.getByTestId('length-slider');
      
      // Simulate slider change
      fireEvent.change(slider, { target: { value: '6' } });
      
      expect(defaultProps.onLengthChange).toHaveBeenCalled();
    });

    it('should display correct initial length', () => {
      render(<PinControls {...defaultProps} length={8} />);
      const lengthValue = screen.getByTestId('length-value');
      expect(lengthValue).toHaveTextContent('8');
    });

    it('should handle minimum length', () => {
      render(<PinControls {...defaultProps} length={PIN_CONSTRAINTS.MIN_LENGTH} />);
      const lengthValue = screen.getByTestId('length-value');
      expect(lengthValue).toHaveTextContent(PIN_CONSTRAINTS.MIN_LENGTH.toString());
    });

    it('should handle maximum length', () => {
      render(<PinControls {...defaultProps} length={PIN_CONSTRAINTS.MAX_LENGTH} />);
      const lengthValue = screen.getByTestId('length-value');
      expect(lengthValue).toHaveTextContent(PIN_CONSTRAINTS.MAX_LENGTH.toString());
    });
  });

  describe('Edge Cases', () => {
    it('should handle boundary length values', () => {
      const { rerender } = render(<PinControls {...defaultProps} length={3} />);
      
      rerender(<PinControls {...defaultProps} length={PIN_CONSTRAINTS.MIN_LENGTH} />);
      expect(screen.getByTestId('length-value')).toHaveTextContent(PIN_CONSTRAINTS.MIN_LENGTH.toString());
      
      rerender(<PinControls {...defaultProps} length={PIN_CONSTRAINTS.MAX_LENGTH} />);
      expect(screen.getByTestId('length-value')).toHaveTextContent(PIN_CONSTRAINTS.MAX_LENGTH.toString());
    });

    it('should handle all valid PIN lengths', () => {
      const validLengths = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
      
      validLengths.forEach(length => {
        const { unmount } = render(<PinControls {...defaultProps} length={length} />);
        expect(screen.getByTestId('length-value')).toHaveTextContent(length.toString());
        unmount();
      });
    });

    it('should handle rapid slider changes', () => {
      render(<PinControls {...defaultProps} />);
      const slider = screen.getByTestId('length-slider');
      
      fireEvent.change(slider, { target: { value: '4' } });
      fireEvent.change(slider, { target: { value: '5' } });
      fireEvent.change(slider, { target: { value: '6' } });
      
      expect(defaultProps.onLengthChange).toHaveBeenCalledTimes(3);
    });
  });

  describe('Accessibility', () => {
    it('should have accessible label for length control', () => {
      render(<PinControls {...defaultProps} />);
      expect(screen.getByLabelText(/Length:/)).toBeInTheDocument();
    });

    it('should have proper ARIA attributes on slider', () => {
      render(<PinControls {...defaultProps} />);
      const slider = screen.getByTestId('length-slider');
      expect(slider).toBeInTheDocument();
    });
  });

  describe('Description Text', () => {
    it('should explain PIN purpose', () => {
      render(<PinControls {...defaultProps} />);
      expect(screen.getByText('PINs are numeric-only codes (0-9) commonly used for device access.')).toBeInTheDocument();
    });

    it('should have appropriate styling', () => {
      render(<PinControls {...defaultProps} />);
      const description = screen.getByText(/PINs are numeric-only codes/);
      expect(description).toHaveClass('text-zinc-600', 'dark:text-zinc-400');
    });
  });
});
