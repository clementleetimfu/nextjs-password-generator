import { Button } from '@/components/ui/button';
import type { CredentialType, StrengthLevel, BreachCheckStatus } from '@/types/generator';

interface PasswordDisplayProps {
  value: string;
  type: CredentialType;
  strength: StrengthLevel;
  breachCheck: BreachCheckStatus;
  breachCount?: number;
  onRefresh: () => void;
  onCopy: () => void;
  onBreachCheck: () => void;
}

const strengthColors: Record<StrengthLevel, string> = {
  VERY_WEAK: 'bg-red-500',
  WEAK: 'bg-orange-500',
  MODERATE: 'bg-yellow-500',
  STRONG: 'bg-blue-500',
  VERY_STRONG: 'bg-green-500',
};

export function PasswordDisplay({
  value,
  type,
  strength,
  breachCheck,
  breachCount,
  onRefresh,
  onCopy,
  onBreachCheck,
}: PasswordDisplayProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      onCopy();
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const getBreachStatusText = () => {
    if (breachCheck === 'idle') return '';
    if (breachCheck === 'checking') return 'Checking...';
    if (breachCheck === 'safe') return 'Safe';
    if (breachCheck === 'breached') return `Found in ${breachCount} breaches`;
    if (breachCheck === 'error') return 'Error checking';
    return '';
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-2xl" data-testid="password-display">
      <div className="relative w-full">
        <div className="bg-card border border-zinc-200 dark:border-zinc-700 rounded-xl p-6 text-center shadow-md dark:shadow-zinc-900/30 hover:shadow-lg transition-shadow duration-200">
          <p className="text-3xl md:text-4xl font-mono break-all leading-relaxed text-foreground">
            {value}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full" data-testid="strength-indicator">
        <div className="flex-1 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${strengthColors[strength]}`}
            style={{
              width:
                strength === 'VERY_WEAK'
                  ? '20%'
                  : strength === 'WEAK'
                    ? '40%'
                    : strength === 'MODERATE'
                      ? '60%'
                      : strength === 'STRONG'
                        ? '80%'
                        : '100%',
            }}
          />
        </div>
        <span
          className="text-sm font-medium text-zinc-600 dark:text-zinc-400 min-w-[80px]"
          data-testid="strength-level"
        >
          {strength.replace('_', ' ')}
        </span>
      </div>

      <div className="flex gap-3 w-full">
        <Button onClick={onRefresh} className="flex-1" variant="outline" data-testid="refresh-button">
          Refresh
        </Button>
        <Button
          onClick={handleCopy}
          className="flex-1"
          variant="outline"
          disabled={!value}
          data-testid="copy-button"
        >
          Copy
        </Button>
        <Button
          onClick={onBreachCheck}
          className="flex-1"
          variant="outline"
          disabled={!value || breachCheck === 'checking'}
          data-testid="breach-check-button"
        >
          Check Breach
        </Button>
      </div>

      {breachCheck !== 'idle' && (
        <div
          className={`text-sm font-medium ${
            breachCheck === 'safe'
              ? 'text-green-600 dark:text-green-400'
              : breachCheck === 'breached'
                ? 'text-red-600 dark:text-red-400'
                : breachCheck === 'error'
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-zinc-600 dark:text-zinc-400'
          }`}
          data-testid="breach-result"
        >
          {getBreachStatusText()}
        </div>
      )}
    </div>
  );
}
