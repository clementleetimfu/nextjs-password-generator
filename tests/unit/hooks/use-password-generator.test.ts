import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePasswordGenerator } from '@/hooks/use-password-generator';
import { generatePassword } from '@/lib/crypto';
import { calculatePasswordStrength } from '@/lib/strength';

vi.mock('@/lib/crypto', async () => {
  const actual = await vi.importActual<typeof import('@/lib/crypto')>('@/lib/crypto');
  return { ...actual, generatePassword: vi.fn() };
});

vi.mock('@/lib/strength', async () => {
  const actual = await vi.importActual<typeof import('@/lib/strength')>('@/lib/strength');
  return { ...actual, calculatePasswordStrength: vi.fn() };
});

describe('usePasswordGenerator hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(generatePassword).mockReturnValue('abc123XYZ!');
    vi.mocked(calculatePasswordStrength).mockReturnValue({ level: 'MODERATE', score: 50, entropy: 40 });
  });

  it('initializes and generates a value', () => {
    const { result } = renderHook(() => usePasswordGenerator());
    expect(result.current.state.type).toBe('password');
    expect(result.current.state.value).toBeTruthy();
  });

  it('updates length', () => {
    const { result } = renderHook(() => usePasswordGenerator());
    act(() => result.current.setLength(20));
    expect(result.current.state.length).toBe(20);
  });

  it('toggles option flags', () => {
    const { result } = renderHook(() => usePasswordGenerator());
    act(() => {
      result.current.toggleDigits();
      result.current.toggleSymbols();
      result.current.toggleUppercase();
    });

    expect(result.current.state.includeDigits).toBe(true);
    expect(result.current.state.includeSymbols).toBe(true);
    expect(result.current.state.includeUppercase).toBe(true);
  });

  it('sets breach status', () => {
    const { result } = renderHook(() => usePasswordGenerator());
    act(() => result.current.setBreachCheck('breached', 10));
    expect(result.current.state.breachCheck).toBe('breached');
    expect(result.current.state.breachCount).toBe(10);
  });
});
