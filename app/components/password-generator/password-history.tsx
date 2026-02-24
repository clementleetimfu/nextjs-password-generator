import { useState } from 'react';
import type { CredentialType } from '@/types/generator';
import { Button } from '@/components/ui/button';

interface HistoryItem {
  value: string;
  timestamp: number;
}

interface PasswordHistoryProps {
  type: CredentialType;
  items: HistoryItem[];
  onRestore: (value: string) => void;
  onClear: () => void;
}

export function PasswordHistory({
  type,
  items,
  onRestore,
  onClear,
}: PasswordHistoryProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getTypeLabel = () => {
    switch (type) {
      case 'password': return 'Password';
      case 'pin': return 'PIN';
      case 'passphrase': return 'Passphrase';
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl" data-testid="password-history">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-foreground transition-colors"
      >
        <span>{getTypeLabel()} History</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 9 21" />
        </svg>
      </button>

      {isExpanded && (
        <div className="animate-fade-in mt-2 space-y-2" data-testid="history-list">
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => onRestore(item.value)}
              className="w-full flex items-center justify-between gap-4 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left"
            >
              <div className="flex-1 min-w-0">
                <p className="font-mono text-sm md:text-base text-foreground truncate">
                  {item.value}
                </p>
              </div>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                {formatTimestamp(item.timestamp)}
              </span>
            </button>
          ))}
          
          <div className="flex gap-2 mt-2">
            <Button
              onClick={onClear}
              variant="outline"
              size="sm"
              className="flex-1"
              data-testid="clear-history-button"
            >
              Clear History
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
