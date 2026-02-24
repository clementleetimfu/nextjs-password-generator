import type { CredentialType } from '@/types/generator';
import { Button } from '@/components/ui/button';

interface PasswordHistoryProps {
  type: CredentialType;
  items: Array<Pick<import('@/types/generator').HistoryItem, 'value' | 'timestamp'>>;
  onRestore: (value: string) => void;
  onClear: () => void;
}

export function PasswordHistory({
  items,
  onRestore,
  onClear,
}: PasswordHistoryProps) {
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-500 dark:text-zinc-400" data-testid="empty-history">
        <p>No history yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3" data-testid="password-history">
      {items.map((item, index) => (
        <button
          key={index}
          onClick={() => onRestore(item.value)}
          className="w-full flex items-center justify-between gap-3 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left border border-zinc-200 dark:border-zinc-700"
          data-testid={`history-item-${index}`}
        >
          <div className="flex-1 min-w-0">
            <p className="font-mono text-sm text-foreground break-all leading-relaxed">
              {item.value}
            </p>
          </div>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 whitespace-nowrap flex-shrink-0 ml-2">
            {formatTimestamp(item.timestamp)}
          </span>
        </button>
      ))}
      
      <div className="pt-4 mt-4 border-t border-zinc-200 dark:border-zinc-700">
        <Button
          onClick={onClear}
          variant="outline"
          size="sm"
          className="w-full"
          data-testid="clear-history-button"
        >
          Clear History
        </Button>
      </div>
    </div>
  );
}
