import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePassphraseGenerator } from '@/hooks/use-passphrase-generator';
import { generatePassphrase } from '@/lib/crypto';
import { calculatePassphraseStrength } from '@/lib/strength';

vi.mock('@/lib/crypto', async () => {
  const actual = await vi.importActual<typeof import('@/lib/crypto')>('@/lib/crypto');
  return { ...actual, generatePassphrase: vi.fn() };
});

vi.mock('@/lib/strength', async () => {
  const actual = await vi.importActual<typeof import('@/lib/strength')>('@/lib/strength');
  return { ...actual, calculatePassphraseStrength: vi.fn() };
});

describe('usePassphraseGenerator hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(generatePassphrase).mockResolvedValue('correct-horse-battery-staple');
    vi.mocked(calculatePassphraseStrength).mockReturnValue({ level: 'VERY_STRONG', score: 90, entropy: 50 });
  });

  it('initializes and generates a passphrase', async () => {
    const { result } = renderHook(() => usePassphraseGenerator());
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    expect(result.current.state.type).toBe('passphrase');
    expect(result.current.state.value).toBeTruthy();
  });

  it('updates word count', () => {
    const { result } = renderHook(() => usePassphraseGenerator());
    act(() => result.current.setWordCount(8));
    expect(result.current.state.wordCount).toBe(8);
  });

  it('updates separator', () => {
    const { result } = renderHook(() => usePassphraseGenerator());
    act(() => result.current.setSeparator('space'));
    expect(result.current.state.separator).toBe('space');
  });

  it('sets breach status', () => {
    const { result } = renderHook(() => usePassphraseGenerator());
    act(() => result.current.setBreachCheck('breached', 3));
    expect(result.current.state.breachCheck).toBe('breached');
    expect(result.current.state.breachCount).toBe(3);
  });
});
