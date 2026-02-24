import { Slider } from '@/components/ui/slider';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PASSPHRASE_CONSTRAINTS } from '@/lib/crypto';
import type { Separator } from '@/types/generator';

interface PassphraseControlsProps {
  wordCount: number;
  separator: Separator;
  onWordCountChange: (wordCount: number) => void;
  onSeparatorChange: (separator: Separator) => void;
}

export function PassphraseControls({
  wordCount,
  separator,
  onWordCountChange,
  onSeparatorChange,
}: PassphraseControlsProps) {
  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl" data-testid="controls">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Word Count
          </label>
          <span className="text-sm font-mono text-zinc-900 dark:text-zinc-100" data-testid="word-count-value">
            {wordCount}
          </span>
        </div>
        <Slider
          value={[wordCount]}
          onValueChange={([value]) => onWordCountChange(value)}
          min={PASSPHRASE_CONSTRAINTS.MIN_WORDS}
          max={PASSPHRASE_CONSTRAINTS.MAX_WORDS}
          step={1}
          className="w-full"
          data-testid="word-count-slider"
        />
        <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <span>{PASSPHRASE_CONSTRAINTS.MIN_WORDS}</span>
          <span>{PASSPHRASE_CONSTRAINTS.MAX_WORDS}</span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Separator
        </div>
        <Tabs
          value={separator}
          onValueChange={(value) => onSeparatorChange(value as Separator)}
          className="w-full"
          data-testid="separator-selector"
        >
          <TabsList className="flex w-full">
            <TabsTrigger value="space" className="flex-1 text-xs">Space</TabsTrigger>
            <TabsTrigger value="hyphen" className="flex-1 text-xs">Hyphen</TabsTrigger>
            <TabsTrigger value="underscore" className="flex-1 text-xs">Underscore</TabsTrigger>
            <TabsTrigger value="period" className="flex-1 text-xs">Period</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="text-sm text-zinc-600 dark:text-zinc-400">
        <p>Passphrases use the EFF Long Wordlist (7776 common words) for memorable security.</p>
      </div>
    </div>
  );
}
