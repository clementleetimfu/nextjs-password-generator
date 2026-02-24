import { PasswordHistory } from './password-history';
import type { CredentialType } from '@/types/generator';

interface HistoryItem {
  value: string;
  timestamp: number;
}

interface HistorySliderProps {
  isOpen: boolean;
  onClose: () => void;
  type: CredentialType;
  items: HistoryItem[];
  onRestore: (value: string) => void;
  onClear: () => void;
}

export function HistorySlider({
  isOpen,
  onClose,
  type,
  items,
  onRestore,
  onClear,
}: HistorySliderProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-fade-in"
        onClick={onClose}
        data-testid="history-backdrop"
      />
      <div className="fixed left-0 top-0 h-full w-full sm:w-[400px] max-w-full bg-card z-50 shadow-2xl animate-slide-in-left overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-700">
          <h2 className="text-lg font-semibold text-foreground">
            {type === 'password' ? 'Password' : type === 'pin' ? 'PIN' : 'Passphrase'} History
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            data-testid="close-history-button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-foreground"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <PasswordHistory
            type={type}
            items={items}
            onRestore={onRestore}
            onClear={onClear}
          />
        </div>
      </div>
    </>
  );
}
