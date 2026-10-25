import { ChevronLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import ThemeToggle from './ThemeToggle';

interface ScreenHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: ReactNode;
}

export default function ScreenHeader({ eyebrow, title, subtitle, onBack, right }: ScreenHeaderProps) {
  return (
    <div className="anim-fade-in flex items-start justify-between gap-3 pt-5 pb-5">
      <div className="flex items-start gap-2 min-w-0">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors active:scale-95"
            style={{ backgroundColor: 'var(--chip-bg)', border: '1px solid var(--border)' }}
          >
            <ChevronLeft size={18} strokeWidth={2.4} color="var(--ink)" />
          </button>
        )}
        <div className="min-w-0">
          {eyebrow && (
            <p
              className="text-[12px] font-semibold uppercase tracking-wider"
              style={{ color: 'var(--subtext)' }}
            >
              {eyebrow}
            </p>
          )}
          <h1 className="mt-0.5 text-[24px] font-bold leading-tight truncate" style={{ color: 'var(--ink)' }}>
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-[13px] font-medium" style={{ color: 'var(--subtext)' }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {right}
        <ThemeToggle />
      </div>
    </div>
  );
}
