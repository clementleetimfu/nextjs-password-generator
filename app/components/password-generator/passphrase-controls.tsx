import { Slider } from '@/components/ui/slider';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PASSPHRASE_CONSTRAINTS, SEPARATORS } from '@/lib/crypto';
import type { Separator } from '@/types/generator';

interface PassphraseControlsProps {
  wordCount: number;
  separator: Separator;
  onWordCountChange: (wordCount: number) => void;
  onSeparatorChange: (separator: Separator) => void;
}

const separatorLabels: Record<Separator, string> = {
  space: 'Space',
  hyphen: 'Hyphen (-)',
  underscore: 'Underscore (_)',
  period: 'Period (.)',
};

export function PassphraseControls({
  wordCount,
  separator,
  onWordCountChange,
  onSeparatorChange,
}: PassphraseControlsProps) {
  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl">
      {/* Word Count Slider */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Word Count: {wordCount}
          </label>
        </div>
        <Slider
          value={[wordCount]}
          onValueChange={([value]) => onWordCountChange(value)}
          min={PASSPHRASE_CONSTRAINTS.MIN_WORDS}
          max={PASSPHRASE_CONSTRAINTS.MAX_WORDS}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <span>{PASSPHRASE_CONSTRAINTS.MIN_WORDS}</span>
          <span>{PASSPHRASE_CONSTRAINTS.MAX_WORDS}</span>
        </div>
      </div>

      {/* Separator Selector */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Separator
        </h3>
        <Tabs
          value={separator}
          onValueChange={(value) => onSeparatorChange(value as Separator)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="space">Space</TabsTrigger>
            <TabsTrigger value="hyphen">Hyphen</TabsTrigger>
            <TabsTrigger value="underscore">Underscore</TabsTrigger>
            <TabsTrigger value="period">Period</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="text-sm text-zinc-600 dark:text-zinc-400">
        <p>Passphrases use the EFF Long Wordlist (7776 common words) for memorable security.</p>
      </div>
    </div>
  );
}
