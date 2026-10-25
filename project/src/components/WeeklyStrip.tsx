import { accents } from '@/lib/theme';
import { useTheme } from '@/lib/theme-context';
import type { Accent } from '@/lib/types';

interface WeeklyStripProps {
  days: { date: Date; label: string; count: number; total: number }[];
  todayISO: string;
}

export default function WeeklyStrip({ days, todayISO }: WeeklyStripProps) {
  const { mode } = useTheme();
  const emptyColor = mode === 'dark' ? '#2a2f33' : '#E2DBCF';

  return (
    <div className="flex items-center justify-between gap-1.5 px-1">
      {days.map((d) => {
        const iso = `${d.date.getFullYear()}-${String(d.date.getMonth() + 1).padStart(2, '0')}-${String(
          d.date.getDate(),
        ).padStart(2, '0')}`;
        const isToday = iso === todayISO;
        const ratio = d.total === 0 ? 0 : d.count / d.total;
        const full = ratio >= 1 && d.total > 0;
        const partial = ratio > 0 && ratio < 1;
        const color: Accent = full ? 'sage' : partial ? 'sky' : 'sage';
        const a = accents[color];
        const dotColor = ratio > 0 ? a.base : emptyColor;
        const todayRing = mode === 'dark' ? '#1d2125' : '#FAF7F2';

        return (
          <div key={iso} className="flex flex-1 flex-col items-center gap-1.5">
            <span className="text-[11px] font-semibold" style={{ color: isToday ? 'var(--ink)' : 'var(--muted)' }}>
              {d.label}
            </span>
            <div className="relative flex h-8 w-8 items-center justify-center">
              {isToday && (
                <div
                  className="absolute inset-0 rounded-full"
                  style={{ border: `2px solid ${todayRing}`, boxShadow: `0 0 0 2px ${accents.sage.base}` }}
                />
              )}
              <div
                className="h-6 w-6 rounded-full transition-all duration-500"
                style={{
                  backgroundColor: dotColor,
                  transform: isToday ? 'scale(1.08)' : 'scale(1)',
                  boxShadow: ratio > 0 ? `0 1px 4px ${a.base}55` : 'none',
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
