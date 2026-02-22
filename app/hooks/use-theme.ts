import { useState, useEffect, useCallback } from 'react';
import type { ThemeMode } from '@/types/generator';
import { STORAGE_KEYS } from '@/lib/theme';

export function useTheme() {
  const [mode, setModeState] = useState<ThemeMode>('light');

  // Load theme from localStorage on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) as ThemeMode | null;
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        setModeState(savedTheme);
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
      }
    } catch (error) {
      console.error('Failed to load theme from localStorage:', error);
    }
  }, []);

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, newMode);
      document.documentElement.classList.toggle('dark', newMode === 'dark');
    } catch (error) {
      console.error('Failed to save theme to localStorage:', error);
    }
  }, []);

  const toggle = useCallback(() => {
    setMode(mode === 'light' ? 'dark' : 'light');
  }, [mode, setMode]);

  return {
    mode,
    setMode,
    toggle,
  };
}
