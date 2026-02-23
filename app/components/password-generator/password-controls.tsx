import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { PASSWORD_CONSTRAINTS } from '@/lib/crypto';

interface PasswordControlsProps {
  length: number;
  includeDigits: boolean;
  includeSymbols: boolean;
  includeUppercase: boolean;
  onLengthChange: (length: number) => void;
  onToggleDigits: () => void;
  onToggleSymbols: () => void;
  onToggleUppercase: () => void;
}

export function PasswordControls({
  length,
  includeDigits,
  includeSymbols,
  includeUppercase,
  onLengthChange,
  onToggleDigits,
  onToggleSymbols,
  onToggleUppercase,
}: PasswordControlsProps) {
  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl bg-card rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm p-6" data-testid="controls">
      {/* Length Slider */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Length: <span data-testid="length-value">{length}</span>
          </label>
        </div>
        <Slider
          value={[length]}
          onValueChange={([value]) => onLengthChange(value)}
          min={PASSWORD_CONSTRAINTS.MIN_LENGTH}
          max={PASSWORD_CONSTRAINTS.MAX_LENGTH}
          step={1}
          className="w-full"
          data-testid="length-slider"
        />
        <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <span>{PASSWORD_CONSTRAINTS.MIN_LENGTH}</span>
          <span>{PASSWORD_CONSTRAINTS.MAX_LENGTH}</span>
        </div>
      </div>

      {/* Character Type Toggles */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Character Types
        </h3>
        
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-sm text-zinc-600 dark:text-zinc-400">
              Include Digits (0-9)
            </label>
            <Switch
              checked={includeDigits}
              onCheckedChange={onToggleDigits}
              data-testid="toggle-digits"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm text-zinc-600 dark:text-zinc-400">
              Include Symbols (!@#$%^&*)
            </label>
            <Switch
              checked={includeSymbols}
              onCheckedChange={onToggleSymbols}
              data-testid="toggle-symbols"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm text-zinc-600 dark:text-zinc-400">
              Include Uppercase (A-Z)
            </label>
            <Switch
              checked={includeUppercase}
              onCheckedChange={onToggleUppercase}
              data-testid="toggle-uppercase"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
