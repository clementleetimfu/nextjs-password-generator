import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PasswordControls } from '@/components/password-generator/password-controls';

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

  it('renders control sections', () => {
    render(<PasswordControls {...defaultProps} />);
    expect(screen.getByTestId('controls')).toBeInTheDocument();
    expect(screen.getByTestId('length-slider')).toBeInTheDocument();
  });

  it('shows current length', () => {
    render(<PasswordControls {...defaultProps} length={20} />);
    expect(screen.getByTestId('length-value')).toHaveTextContent('20');
  });

  it('wires toggle callbacks', () => {
    render(<PasswordControls {...defaultProps} />);

    fireEvent.click(screen.getByTestId('toggle-digits'));
    fireEvent.click(screen.getByTestId('toggle-symbols'));
    fireEvent.click(screen.getByTestId('toggle-uppercase'));

    expect(defaultProps.onToggleDigits).toHaveBeenCalledTimes(1);
    expect(defaultProps.onToggleSymbols).toHaveBeenCalledTimes(1);
    expect(defaultProps.onToggleUppercase).toHaveBeenCalledTimes(1);
  });

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
});
