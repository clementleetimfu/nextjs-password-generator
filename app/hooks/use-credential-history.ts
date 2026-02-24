import { useState, useCallback, useEffect } from 'react';
import type { CredentialType, HistoryItem } from '@/types/generator';
import { HISTORY_STORAGE_KEY, HISTORY } from '@/constants';

interface HistoryState {
  password: HistoryItem[];
  pin: HistoryItem[];
  passphrase: HistoryItem[];
}

export function useCredentialHistory() {
  const [history, setHistory] = useState<HistoryState>({
    password: [],
    pin: [],
    passphrase: [],
  });

  const loadHistoryInternal = useCallback(() => {
    try {
      const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as HistoryState;
        setHistory(parsed);
      }
    } catch (error) {
      console.error('Failed to load history from localStorage:', error);
    }
  }, []);

  const addToHistory = useCallback((value: string, type: CredentialType) => {
    const item: HistoryItem = {
      value,
      type,
      timestamp: Date.now(),
    };

    setHistory((prev) => {
      const typeHistory = [...prev[type]];
      const updated = [item, ...typeHistory].slice(0, HISTORY.MAX_ITEMS);
      const newState = { ...prev, [type]: updated };

      try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(newState));
      } catch (error) {
        console.error('Failed to save history to localStorage:', error);
      }

      return newState;
    });
  }, []);

  const clearHistory = useCallback((type: CredentialType) => {
    setHistory((prev) => {
      const newState = { ...prev, [type]: [] };

      try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(newState));
      } catch (error) {
        console.error('Failed to clear history in localStorage:', error);
      }

      return newState;
    });
  }, []);

  const clearAllHistory = useCallback(() => {
    const newState: HistoryState = {
      password: [],
      pin: [],
      passphrase: [],
    };

    setHistory(newState);

    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(newState));
    } catch (error) {
      console.error('Failed to clear all history in localStorage:', error);
    }
  }, []);

  useEffect(() => {
    loadHistoryInternal();
  }, [loadHistoryInternal]);

  return {
    history,
    addToHistory,
    clearHistory,
    clearAllHistory,
  };
}
