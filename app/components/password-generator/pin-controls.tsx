import { Slider } from '@/components/ui/slider';
import { PIN_CONSTRAINTS } from '@/lib/crypto';

interface PinControlsProps {
  length: number;
  onLengthChange: (length: number) => void;
}

export function PinControls({ length, onLengthChange }: PinControlsProps) {
  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl" data-testid="controls">
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
    </div>
  );
}
