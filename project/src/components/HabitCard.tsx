import { Check } from 'lucide-react';
import { getIcon } from '@/lib/icons';
import { useResolvedAccent } from '@/lib/accent-resolve';
import type { Habit } from '@/lib/types';

interface HabitCardProps {
  habit: Habit;
  done: boolean;
  streak: number;
  onToggle: () => void;
  index: number;
}

export default function HabitCard({ habit, done, streak, onToggle, index }: HabitCardProps) {
  const a = useResolvedAccent(habit.accent);
  const Icon = getIcon(habit.icon_key);

  return (
    <button
      type="button"
      onClick={onToggle}
      className="anim-fade-in-up w-full text-left"
      style={{ animationDelay: `${index * 45}ms` }}
    >
      <div
        className="flex items-center gap-3.5 rounded-2xl px-3.5 py-3.5 transition-all duration-300 active:scale-[0.98]"
        style={{
          backgroundColor: done ? a.soft : 'var(--card)',
          borderColor: done ? a.base : 'var(--border)',
          borderWidth: done ? 1.5 : 1,
          borderStyle: 'solid',
          boxShadow: done ? `0 2px 10px ${a.base}26` : '0 1px 3px var(--shadow-soft)',
        }}
      >
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-300"
          style={{
            backgroundColor: done ? a.base : a.soft,
            transform: done ? 'scale(1.03)' : 'scale(1)',
          }}
        >
          <Icon
            size={20}
            strokeWidth={2}
            style={{ color: done ? a.textOnBase : a.text, transition: 'color 0.3s' }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <p
            className="text-[14px] font-semibold leading-tight truncate"
            style={{
              color: done ? a.text : 'var(--ink)',
              textDecoration: done ? 'line-through' : 'none',
              textDecorationColor: done ? `${a.base}88` : 'none',
              textDecorationThickness: done ? 1.5 : 0,
              transition: 'color 0.3s',
            }}
          >
            {habit.name}
          </p>
          <p className="text-[12px] font-medium mt-0.5" style={{ color: 'var(--subtext)' }}>
            {streak > 0 ? `${streak}-day streak` : habit.sublabel ?? 'Start today'}
          </p>
        </div>

        <div className="relative shrink-0">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-full transition-colors duration-300"
            style={{
              backgroundColor: done ? a.base : 'transparent',
              border: done ? 'none' : `2px solid var(--border-strong)`,
            }}
          >
            {done && (
              <span className="anim-pop">
                <Check size={15} strokeWidth={3.5} color={a.textOnBase} />
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
