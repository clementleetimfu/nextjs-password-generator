import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PinControls } from '@/components/password-generator/pin-controls';

describe('PinControls Component', () => {
  const props = {
    length: 6,
    onLengthChange: vi.fn(),
  };

  beforeEach(() => vi.clearAllMocks());

  it('renders container and slider', () => {
    render(<PinControls {...props} />);
    expect(screen.getByTestId('controls')).toBeInTheDocument();
    expect(screen.getByTestId('length-slider')).toBeInTheDocument();
  });

  it('shows current length', () => {
    render(<PinControls {...props} length={10} />);
    expect(screen.getByTestId('length-value')).toHaveTextContent('10');
  });

});
