import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PinControls } from '@/components/password-generator/pin-controls';
import { PIN_CONSTRAINTS } from '@/lib/crypto';

describe('PinControls Component', () => {
  const props = {
    length: 6,
    onLengthChange: vi.fn(),
  };

  beforeEach(() => vi.clearAllMocks());

  describe('Rendering', () => {
    it('renders container and slider', () => {
      render(<PinControls {...props} />);
      expect(screen.getByTestId('controls')).toBeInTheDocument();
      expect(screen.getByTestId('length-slider')).toBeInTheDocument();
    });

    it('shows current length', () => {
      render(<PinControls {...props} length={10} />);
      expect(screen.getByTestId('length-value')).toHaveTextContent('10');
    });

    it('displays min and max length bounds', () => {
      render(<PinControls {...props} />);
      expect(screen.getByText(PIN_CONSTRAINTS.MIN_LENGTH.toString())).toBeInTheDocument();
      expect(screen.getByText(PIN_CONSTRAINTS.MAX_LENGTH.toString())).toBeInTheDocument();
    });

    it('displays length label', () => {
      render(<PinControls {...props} />);
      expect(screen.getByText('Length')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles minimum length value', () => {
      render(<PinControls {...props} length={PIN_CONSTRAINTS.MIN_LENGTH} />);
      expect(screen.getByTestId('length-value')).toHaveTextContent(
        PIN_CONSTRAINTS.MIN_LENGTH.toString()
      );
    });

    it('handles maximum length value', () => {
      render(<PinControls {...props} length={PIN_CONSTRAINTS.MAX_LENGTH} />);
      expect(screen.getByTestId('length-value')).toHaveTextContent(
        PIN_CONSTRAINTS.MAX_LENGTH.toString()
      );
    });

    it('handles odd length values', () => {
      render(<PinControls {...props} length={7} />);
      expect(screen.getByTestId('length-value')).toHaveTextContent('7');
    });
  });

  describe('Component Structure', () => {
    it('has only one control section (length slider)', () => {
      render(<PinControls {...props} />);
      const controls = screen.getByTestId('controls');
      const sliders = controls.querySelectorAll('[data-testid="length-slider"]');
      expect(sliders.length).toBe(1);
    });
  });
});
