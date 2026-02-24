import { Button } from '@/components/ui/button';
import type { ThemeMode } from '@/types/generator';
import { Icons } from '@/components/ui/icons';

interface ThemeToggleProps {
  mode: ThemeMode;
  onToggle: () => void;
}

export function ThemeToggle({ mode, onToggle }: ThemeToggleProps) {
  return (
    <div className="fixed top-4 right-4 z-50">
      <Button
        onClick={onToggle}
        variant="outline"
        size="icon"
        className="bg-muted hover:bg-muted/80 hover:scale-105 transition-all duration-200 relative group"
        aria-label={`Toggle ${mode === 'light' ? 'dark' : 'light'} mode`}
        data-testid="theme-toggle"
      >
        {mode === 'light' ? <Icons.Moon /> : <Icons.Sun />}
      </Button>
    </div>
  );
}
