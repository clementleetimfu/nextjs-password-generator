import { PasswordHistory } from './password-history';
import type { CredentialType } from '@/types/generator';
import { Icons } from '@/components/ui/icons';

interface HistorySliderProps {
  isOpen: boolean;
  onClose: () => void;
  type: CredentialType;
  items: Array<Pick<import('@/types/generator').HistoryItem, 'value' | 'timestamp'>>;
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
      <div className="fixed left-0 top-0 h-full w-full sm:w-[400px] max-w-full bg-card z-50 shadow-2xl animate-slide-in-left overflow-hidden flex flex-col relative">
        <button
          onClick={onClose}
          className="hidden sm:block absolute top-4 right-4 p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors z-10"
          data-testid="close-history-button"
        >
          <Icons.Close />
        </button>

        <div className="flex items-center gap-2 p-6 border-b border-zinc-200 dark:border-zinc-700">
          <h2 className="text-lg font-semibold text-foreground">
            {type === 'password' ? 'Password' : type === 'pin' ? 'PIN' : 'Passphrase'} History
          </h2>
          <button
            onClick={onClose}
            className="sm:hidden p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors self-center ml-auto"
            data-testid="mobile-close-history-button"
          >
            <Icons.Close />
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
