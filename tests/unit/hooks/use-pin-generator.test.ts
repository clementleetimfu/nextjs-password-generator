import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePinGenerator } from '@/hooks/use-pin-generator';
import { generatePin } from '@/lib/crypto';
import { calculatePinStrength } from '@/lib/strength';

vi.mock('@/lib/crypto', async () => {
  const actual = await vi.importActual<typeof import('@/lib/crypto')>('@/lib/crypto');
  return { ...actual, generatePin: vi.fn() };
});

vi.mock('@/lib/strength', async () => {
  const actual = await vi.importActual<typeof import('@/lib/strength')>('@/lib/strength');
  return { ...actual, calculatePinStrength: vi.fn() };
});

describe('usePinGenerator hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(generatePin).mockReturnValue('1234');
    vi.mocked(calculatePinStrength).mockReturnValue({ level: 'WEAK', score: 20, entropy: 13.2 });
  });

  it('initializes and generates a pin', () => {
    const { result } = renderHook(() => usePinGenerator());
    expect(result.current.state.type).toBe('pin');
    expect(result.current.state.value).toBeTruthy();
  });

  it('updates length', () => {
    const { result } = renderHook(() => usePinGenerator());
    act(() => result.current.setLength(8));
    expect(result.current.state.length).toBe(8);
  });

  it('sets breach status', () => {
    const { result } = renderHook(() => usePinGenerator());
    act(() => result.current.setBreachCheck('safe'));
    expect(result.current.state.breachCheck).toBe('safe');
  });
});
