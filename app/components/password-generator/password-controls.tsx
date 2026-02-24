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
    <div className="flex flex-col gap-8 w-full max-w-2xl" data-testid="controls">
      {/* Length Slider */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Length
          </label>
          <span className="text-sm font-mono text-zinc-900 dark:text-zinc-100" data-testid="length-value">
            {length}
          </span>
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
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <label className="text-sm text-zinc-700 dark:text-zinc-300">
              Include Digits
            </label>
            <Switch
              checked={includeDigits}
              onCheckedChange={onToggleDigits}
              data-testid="toggle-digits"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm text-zinc-700 dark:text-zinc-300">
              Include Symbols
            </label>
            <Switch
              checked={includeSymbols}
              onCheckedChange={onToggleSymbols}
              data-testid="toggle-symbols"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm text-zinc-700 dark:text-zinc-300">
              Include Uppercase
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
