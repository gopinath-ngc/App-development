import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { startOfWeek, todayISO } from '@/lib/theme';
import type { Completion, Habit } from '@/lib/types';

export type UseHabitsResult = ReturnType<typeof useHabits>;

function iso(d: Date): string {
  return todayISO(d);
}

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<Completion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [habitsRes, completionsRes] = await Promise.all([
        supabase.from('habits').select('*').order('sort_order', { ascending: true }),
        supabase.from('completions').select('*'),
      ]);
      if (habitsRes.error) throw habitsRes.error;
      if (completionsRes.error) throw completionsRes.error;
      setHabits((habitsRes.data as Habit[]) ?? []);
      setCompletions((completionsRes.data as Completion[]) ?? []);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to load habits';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const completedDates = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const c of completions) {
      let set = map.get(c.habit_id);
      if (!set) {
        set = new Set();
        map.set(c.habit_id, set);
      }
      set.add(c.date);
    }
    return map;
  }, [completions]);

  const isDone = useCallback(
    (habitId: string, date: string) => completedDates.get(habitId)?.has(date) ?? false,
    [completedDates],
  );

  const streakFor = useCallback(
    (habitId: string): number => {
      let streak = 0;
      const today = new Date();
      // If today's habit not done, count from yesterday backward (so streak shows last completed run)
      let cursor = new Date(today);
      if (!completedDates.get(habitId)?.has(iso(cursor))) {
        cursor.setDate(cursor.getDate() - 1);
      }
      while (completedDates.get(habitId)?.has(iso(cursor))) {
        streak += 1;
        cursor.setDate(cursor.getDate() - 1);
      }
      return streak;
    },
    [completedDates],
  );

  const toggle = useCallback(
    async (habitId: string, date: string) => {
      const done = completedDates.get(habitId)?.has(date) ?? false;
      // Optimistic update
      setCompletions((prev) => {
        if (done) {
          return prev.filter((c) => !(c.habit_id === habitId && c.date === date));
        }
        return [...prev, { id: 'temp-' + Date.now(), habit_id: habitId, date }];
      });

      try {
        if (done) {
          const { error } = await supabase
            .from('completions')
            .delete()
            .eq('habit_id', habitId)
            .eq('date', date);
          if (error) throw error;
        } else {
          const { data, error } = await supabase
            .from('completions')
            .insert({ habit_id: habitId, date })
            .select()
            .single();
          if (error) throw error;
          // Replace temp id with real one
          setCompletions((prev) =>
            prev.map((c) =>
              c.habit_id === habitId && c.date === date && c.id.startsWith('temp-')
                ? (data as Completion)
                : c,
            ),
          );
        }
      } catch (e) {
        // Revert on failure
        const msg = e instanceof Error ? e.message : 'Failed to update';
        setError(msg);
        void load();
      }
    },
    [completedDates, load],
  );

  // Build weekly strip data
  const week = useMemo(() => {
    const start = startOfWeek();
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const label = ['M', 'T', 'W', 'T', 'F', 'S', 'S'][i];
      const isoDay = iso(d);
      let count = 0;
      for (const h of habits) {
        if (completedDates.get(h.id)?.has(isoDay)) count += 1;
      }
      return { date: d, label, count, total: habits.length };
    });
    return days;
  }, [habits, completedDates]);

  const today = todayISO();
  const doneToday = habits.filter((h) => isDone(h.id, today)).length;
  const progress = habits.length === 0 ? 0 : doneToday / habits.length;

  return {
    habits,
    completions,
    loading,
    error,
    isDone,
    streakFor,
    toggle,
    week,
    doneToday,
    progress,
    reload: load,
  };
}
