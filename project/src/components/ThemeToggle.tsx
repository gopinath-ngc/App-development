import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/lib/theme-context';

export default function ThemeToggle() {
  const { mode, toggle } = useTheme();
  const isDark = mode === 'dark';
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="relative flex h-9 w-9 items-center justify-center rounded-full transition-colors"
      style={{ backgroundColor: isDark ? '#23282c' : '#F5F0E8', border: `1px solid var(--border)` }}
    >
      <span className="anim-pop" key={mode}>
        {isDark ? (
          <Sun size={16} strokeWidth={2.2} color="#E9A772" />
        ) : (
          <Moon size={16} strokeWidth={2.2} color="#9B8FC4" />
        )}
      </span>
    </button>
  );
}
