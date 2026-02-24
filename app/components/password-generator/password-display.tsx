import { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import type { StrengthLevel, BreachCheckStatus } from '@/types/generator';

interface PasswordDisplayProps {
  value: string;
  strength: StrengthLevel;
  breachCheck: BreachCheckStatus;
  breachCount?: number;
  onRefresh: () => void;
  onCopy: () => void;
  onBreachCheck: () => void;
}

const strengthGradient = {
  VERY_WEAK: 'from-red-500 to-red-400',
  WEAK: 'from-orange-500 to-orange-400',
  MODERATE: 'from-yellow-500 to-yellow-400',
  STRONG: 'from-blue-500 to-blue-400',
  VERY_STRONG: 'from-green-500 to-green-400',
};

const getStrengthPercentage = (strength: StrengthLevel): string => {
  switch (strength) {
    case 'VERY_WEAK': return '20%';
    case 'WEAK': return '40%';
    case 'MODERATE': return '60%';
    case 'STRONG': return '80%';
    case 'VERY_STRONG': return '100%';
    default: return '0%';
  }
};

const getBreachStatusText = (breachCheck: BreachCheckStatus, breachCount?: number): string => {
  if (breachCheck === 'idle') return '';
  if (breachCheck === 'checking') return 'Checking...';
  if (breachCheck === 'safe') return 'Safe';
  if (breachCheck === 'breached') return `Found in ${breachCount} breaches`;
  if (breachCheck === 'error') return 'Error checking';
  return '';
};

const getBreachStatusColor = (breachCheck: BreachCheckStatus): string => {
  if (breachCheck === 'safe') return 'text-green-600 dark:text-green-400';
  if (breachCheck === 'breached') return 'text-red-600 dark:text-red-400';
  if (breachCheck === 'error') return 'text-red-600 dark:text-red-400';
  return 'text-zinc-600 dark:text-zinc-400';
};

export function PasswordDisplay({
  value,
  strength,
  breachCheck,
  breachCount,
  onRefresh,
  onCopy,
  onBreachCheck,
}: PasswordDisplayProps) {
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      onCopy();
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  }, [value, onCopy]);

  const breachStatusText = getBreachStatusText(breachCheck, breachCount);
  const strengthPercentage = getStrengthPercentage(strength);
  const breachStatusColor = getBreachStatusColor(breachCheck);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl" data-testid="password-display">
      <div className="relative w-full group">
        <div className="bg-card rounded-2xl p-8 text-center shadow-sm transition-all duration-300">
          <p className="text-xl md:text-3xl font-mono break-all leading-relaxed text-foreground font-medium tracking-tight">
            {value}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 w-full" data-testid="strength-indicator">
        <div className="flex-1 h-2.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${strengthGradient[strength]} transition-all duration-500 ease-out rounded-full`}
            style={{ width: strengthPercentage }}
          />
        </div>
        <span
          className="text-sm font-medium text-zinc-600 dark:text-zinc-400 min-w-[90px] text-right"
          data-testid="strength-level"
        >
          {strength.replace('_', ' ')}
        </span>
      </div>

      <div className="flex flex-wrap gap-3 w-full lg:flex-nowrap">
        <Button onClick={onRefresh} className="flex-1 lg:flex-1" variant="outline" data-testid="refresh-button">
          Refresh
        </Button>
        <Button
          onClick={handleCopy}
          className="flex-1 lg:flex-1"
          variant="outline"
          disabled={!value}
          data-testid="copy-button"
        >
          Copy
        </Button>
        <Button
          onClick={onBreachCheck}
          className="flex-1 lg:flex-1"
          variant="outline"
          disabled={!value || breachCheck === 'checking'}
          data-testid="breach-check-button"
        >
          Check Breach
        </Button>
      </div>

      {breachCheck !== 'idle' && (
        <div
          className={`text-sm font-medium animate-fade-in ${breachStatusColor}`}
          data-testid="breach-result"
        >
          {breachStatusText}
        </div>
      )}
    </div>
  );
}
