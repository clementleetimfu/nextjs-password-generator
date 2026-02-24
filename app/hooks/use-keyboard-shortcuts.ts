import { useEffect, useCallback } from 'react';
import type { CredentialType } from '@/types/generator';

interface KeyboardShortcutsOptions {
  onGenerate: () => void;
  onCopy: () => void;
  onBreachCheck: () => void;
  onTabChange: (tab: CredentialType) => void;
  isEnabled?: boolean;
}

export function useKeyboardShortcuts({
  onGenerate,
  onCopy,
  onBreachCheck,
  onTabChange,
  isEnabled = true,
}: KeyboardShortcutsOptions) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isEnabled) return;

      const isInputFocused = document.activeElement instanceof HTMLInputElement ||
                           document.activeElement instanceof HTMLTextAreaElement;
      
      if (isInputFocused) return;

      const key = event.key.toLowerCase();

      switch (key) {
        case 'r':
          event.preventDefault();
          onGenerate();
          break;
        case 'c':
          event.preventDefault();
          onCopy();
          break;
        case 'b':
          event.preventDefault();
          onBreachCheck();
          break;
        case '1':
          event.preventDefault();
          onTabChange('password');
          break;
        case '2':
          event.preventDefault();
          onTabChange('pin');
          break;
        case '3':
          event.preventDefault();
          onTabChange('passphrase');
          break;
      }
    },
    [isEnabled, onGenerate, onCopy, onBreachCheck, onTabChange]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return null;
}
