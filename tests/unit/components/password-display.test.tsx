import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PasswordDisplay } from '@/components/password-generator/password-display';

describe('PasswordDisplay Component', () => {
  const props = {
    value: 'testPassword123',
    type: 'password' as const,
    strength: 'STRONG' as const,
    breachCheck: 'idle' as const,
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

  it('renders value and action buttons', () => {
    render(<PasswordDisplay {...props} />);
    expect(screen.getByText('testPassword123')).toBeInTheDocument();
    expect(screen.getByTestId('refresh-button')).toBeInTheDocument();
    expect(screen.getByTestId('copy-button')).toBeInTheDocument();
    expect(screen.getByTestId('breach-check-button')).toBeInTheDocument();
  });

  it('calls refresh and breach callbacks', () => {
    render(<PasswordDisplay {...props} />);
    fireEvent.click(screen.getByTestId('refresh-button'));
    fireEvent.click(screen.getByTestId('breach-check-button'));
    expect(props.onRefresh).toHaveBeenCalledTimes(1);
    expect(props.onBreachCheck).toHaveBeenCalledTimes(1);
  });

  it('copies to clipboard then calls onCopy', async () => {
    render(<PasswordDisplay {...props} />);
    fireEvent.click(screen.getByTestId('copy-button'));

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('testPassword123');
      expect(props.onCopy).toHaveBeenCalledTimes(1);
    });
  });

  it('shows breach status text for safe and breached', () => {
    const { rerender } = render(<PasswordDisplay {...props} breachCheck="safe" />);
    expect(screen.getByTestId('breach-result')).toHaveTextContent('Safe');

    rerender(<PasswordDisplay {...props} breachCheck="breached" breachCount={42} />);
    expect(screen.getByTestId('breach-result')).toHaveTextContent('Found in 42 breaches');
  });
});
