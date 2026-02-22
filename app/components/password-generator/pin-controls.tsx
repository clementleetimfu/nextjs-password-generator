import { Slider } from '@/components/ui/slider';
import { PIN_CONSTRAINTS } from '@/lib/crypto';

interface PinControlsProps {
  length: number;
  onLengthChange: (length: number) => void;
}

export function PinControls({ length, onLengthChange }: PinControlsProps) {
  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl" data-testid="controls">
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
          min={PIN_CONSTRAINTS.MIN_LENGTH}
          max={PIN_CONSTRAINTS.MAX_LENGTH}
          step={1}
          className="w-full"
          data-testid="length-slider"
        />
        <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <span>{PIN_CONSTRAINTS.MIN_LENGTH}</span>
          <span>{PIN_CONSTRAINTS.MAX_LENGTH}</span>
        </div>
      </div>

      <div className="text-sm text-zinc-600 dark:text-zinc-400">
        <p>PINs are numeric-only codes (0-9) commonly used for device access.</p>
      </div>
    </div>
  );
}
