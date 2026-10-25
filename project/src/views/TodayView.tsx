import { Flame, Loader2 } from 'lucide-react';
import HabitCard from '@/components/HabitCard';
import ProgressRing from '@/components/ProgressRing';
import ScreenHeader from '@/components/ScreenHeader';
import WeeklyStrip from '@/components/WeeklyStrip';
import { accents, todayISO } from '@/lib/theme';
import type { UseHabitsResult } from '@/lib/useHabits';

interface TodayViewProps {
  data: UseHabitsResult;
  onBack?: () => void;
}

function greeting(d = new Date()): string {
  const h = d.getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function formatDateHeader(d = new Date()): string {
  const opts: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
  return d.toLocaleDateString('en-US', opts);
}

export default function TodayView({ data, onBack }: TodayViewProps) {
  const { habits, loading, error, isDone, streakFor, toggle, week, doneToday, progress } = data;
  const today = todayISO();
  const pct = Math.round(progress * 100);
  const accent = accents.sage;
  const left = habits.length - doneToday;
  const subtitle =
    doneToday === 0
      ? "Let's build some momentum"
      : left === 0
        ? 'All done. Beautiful work.'
        : `${left} left for today`;

  return (
    <div className="px-5 pb-36">
      <ScreenHeader
        eyebrow={formatDateHeader()}
        title={greeting() + ', Gopinath'}
        subtitle={subtitle}
        onBack={onBack}
        right={
          <div className="flex flex-col items-center">
            <ProgressRing
              progress={progress}
              size={72}
              stroke={7}
              color={accent.base}
              label={`${doneToday}/${habits.length}`}
              sublabel={`${pct}%`}
            />
          </div>
        }
      />

      {/* Weekly strip */}
      <div
        className="anim-fade-in-up rounded-2xl px-4 py-3.5 mb-5"
        style={{
          backgroundColor: 'var(--card)',
          border: '1px solid var(--border)',
          boxShadow: '0 1px 3px var(--shadow-soft)',
          animationDelay: '60ms',
        }}
      >
        <WeeklyStrip days={week} todayISO={today} />
      </div>

      {/* Error banner */}
      {error && (
        <div
          className="mb-4 rounded-xl px-3.5 py-2.5 text-[12px] font-medium anim-fade-in"
          style={{ backgroundColor: 'rgba(232, 138, 125, 0.18)', color: accents.coral.text, border: `1px solid ${accents.coral.base}55` }}
        >
          {error}
        </div>
      )}

      {/* Habit list */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16" style={{ color: 'var(--muted)' }}>
          <Loader2 size={22} className="animate-spin" />
          <p className="mt-3 text-[13px] font-medium">Loading your habits…</p>
        </div>
      ) : habits.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Flame size={32} color="var(--muted)" />
          <p className="mt-3 text-[14px] font-semibold" style={{ color: 'var(--ink)' }}>
            No habits yet
          </p>
          <p className="mt-1 text-[12px]" style={{ color: 'var(--subtext)' }}>
            Add your first habit in the Profile tab.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {habits.map((habit, i) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              done={isDone(habit.id, today)}
              streak={streakFor(habit.id)}
              onToggle={() => void toggle(habit.id, today)}
              index={i}
            />
          ))}
        </div>
      )}
    </div>
  );
}
