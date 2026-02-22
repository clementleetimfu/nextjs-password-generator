import { Button } from '@/components/ui/button';
import type { ThemeMode } from '@/types/generator';

interface ThemeToggleProps {
  mode: ThemeMode;
  onToggle: () => void;
}

export function ThemeToggle({ mode, onToggle }: ThemeToggleProps) {
  return (
    <Button
      onClick={onToggle}
      variant="outline"
      size="icon"
      className="fixed top-4 right-4 z-50"
      aria-label={`Toggle ${mode === 'light' ? 'dark' : 'light'} mode`}
      data-testid="theme-toggle"
    >
      {mode === 'light' ? (
        // Moon icon for dark mode
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 1 11.21 9 9 0 0 1-18 0 9 9 0 0 1 11.21z" />
          <path d="M12 3a9 9 0 0 0 9 9 9 9 0 0 0-9 9 0 0 0-9 9 0 0 0 9z" />
        </svg>
      ) : (
        // Sun icon for light mode
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42-1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42 1.42" />
        </svg>
      )}
    </Button>
  );
}
