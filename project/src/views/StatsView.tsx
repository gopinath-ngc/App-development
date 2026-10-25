import { useMemo } from 'react';
import { Flame, TrendingUp, Trophy, Target } from 'lucide-react';
import { accents, todayISO } from '@/lib/theme';
import { getIcon } from '@/lib/icons';
import { resolveAccent } from '@/lib/accent-resolve';
import { useTheme } from '@/lib/theme-context';
import type { Accent } from '@/lib/types';
import type { UseHabitsResult } from '@/lib/useHabits';
import ScreenHeader from '@/components/ScreenHeader';

interface StatsViewProps {
  data: UseHabitsResult;
  onBack?: () => void;
}

export default function StatsView({ data, onBack }: StatsViewProps) {
  const { habits, completions, streakFor, isDone, week } = data;
  const { mode } = useTheme();
  const today = todayISO();

  const last14 = useMemo(() => {
    const days: { date: Date; iso: string; count: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const isoD = todayISO(d);
      let count = 0;
      for (const h of habits) {
        if (completions.some((c) => c.habit_id === h.id && c.date === isoD)) count += 1;
      }
      days.push({ date: d, iso: isoD, count });
    }
    return days;
  }, [habits, completions]);

  const maxCount = habits.length || 1;
  const totalCompletions = completions.length;
  const totalToday = habits.filter((h) => isDone(h.id, today)).length;
  const bestStreak = habits.reduce((m, h) => Math.max(m, streakFor(h.id)), 0);
  const weekAvg = week.length && habits.length ? week.reduce((s, d) => s + d.count, 0) / (week.length * habits.length) : 0;

  const statMeta: { label: string; value: string; unit: string; icon: typeof Flame; accent: Accent }[] = [
    { label: 'Current streak', value: `${bestStreak}`, unit: 'days', icon: Flame, accent: 'coral' },
    { label: 'This week', value: `${Math.round(weekAvg * 100)}`, unit: '%', icon: TrendingUp, accent: 'sage' },
    { label: 'Done today', value: `${totalToday}/${habits.length}`, unit: '', icon: Target, accent: 'lavender' },
    { label: 'Total checks', value: `${totalCompletions}`, unit: '', icon: Trophy, accent: 'peach' },
  ];

  return (
    <div className="px-5 pb-36">
      <ScreenHeader eyebrow="Your progress" title="Stats" onBack={onBack} />

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {statMeta.map((s, i) => {
          const a = resolveAccent(s.accent, mode);
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="anim-fade-in-up rounded-2xl p-3.5"
              style={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                boxShadow: '0 1px 3px var(--shadow-soft)',
                animationDelay: `${i * 55}ms`,
              }}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl mb-2.5" style={{ backgroundColor: a.soft }}>
                <Icon size={17} strokeWidth={2.2} color={a.text} />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-[22px] font-bold leading-none" style={{ color: 'var(--ink)' }}>
                  {s.value}
                </span>
                {s.unit && (
                  <span className="text-[12px] font-medium" style={{ color: 'var(--subtext)' }}>
                    {s.unit}
                  </span>
                )}
              </div>
              <p className="mt-1 text-[11px] font-medium" style={{ color: 'var(--muted)' }}>
                {s.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* 14-day chart */}
      <div
        className="anim-fade-in-up rounded-2xl p-4 mb-5"
        style={{
          backgroundColor: 'var(--card)',
          border: '1px solid var(--border)',
          boxShadow: '0 1px 3px var(--shadow-soft)',
          animationDelay: '120ms',
        }}
      >
        <p className="text-[13px] font-semibold mb-3" style={{ color: 'var(--ink)' }}>
          Last 14 days
        </p>
        <div className="flex items-end justify-between gap-1.5 h-24">
          {last14.map((d, i) => {
            const ratio = d.count / maxCount;
            const isToday = d.iso === today;
            const barColor = isToday
              ? accents.sage.base
              : ratio >= 0.99
                ? accents.sage.base
                : d.count > 0
                  ? `${accents.sage.base}B0`
                  : 'var(--bar-empty)';
            return (
              <div key={d.iso} className="flex flex-1 flex-col items-center justify-end h-full gap-1">
                <div
                  className="w-full rounded-md transition-all duration-700"
                  style={{
                    height: `${Math.max(ratio * 100, d.count > 0 ? 12 : 6)}%`,
                    backgroundColor: barColor,
                    transform: isToday ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: isToday ? `0 0 0 2px ${accents.sage.soft}` : 'none',
                    animation: `fadeInUp 0.5s ${i * 25}ms both`,
                  }}
                />
                <span className="text-[8px] font-medium" style={{ color: isToday ? accents.sage.base : 'var(--muted)' }}>
                  {d.date.toLocaleDateString('en-US', { weekday: 'narrow' })}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Streak list */}
      <div
        className="anim-fade-in-up rounded-2xl p-4"
        style={{
          backgroundColor: 'var(--card)',
          border: '1px solid var(--border)',
          boxShadow: '0 1px 3px var(--shadow-soft)',
          animationDelay: '180ms',
        }}
      >
        <p className="text-[13px] font-semibold mb-3" style={{ color: 'var(--ink)' }}>
          Streaks
        </p>
        <div className="flex flex-col gap-3">
          {habits.map((h) => {
            const a = resolveAccent(h.accent, mode);
            const Icon = getIcon(h.icon_key);
            const streak = streakFor(h.id);
            return (
              <div key={h.id} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: a.soft }}>
                  <Icon size={15} color={a.text} />
                </div>
                <span className="flex-1 text-[13px] font-medium truncate" style={{ color: 'var(--ink)' }}>
                  {h.name}
                </span>
                <div className="flex items-center gap-1" style={{ color: streak > 0 ? a.base : 'var(--muted)' }}>
                  <Flame size={13} fill={streak > 0 ? 'currentColor' : 'none'} />
                  <span className="text-[12px] font-bold">{streak}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
