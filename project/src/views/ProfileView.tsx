import { useState } from 'react';
import { Plus, Trash2, X, Check, Sparkles } from 'lucide-react';
import { accents } from '@/lib/theme';
import { getIcon } from '@/lib/icons';
import { resolveAccent } from '@/lib/accent-resolve';
import { useTheme } from '@/lib/theme-context';
import { supabase } from '@/lib/supabase';
import type { Accent, Habit } from '@/lib/types';
import type { UseHabitsResult } from '@/lib/useHabits';
import ScreenHeader from '@/components/ScreenHeader';

interface ProfileViewProps {
  data: UseHabitsResult;
  onBack?: () => void;
}

const accentOptions: { key: Accent; label: string }[] = [
  { key: 'sage', label: 'Sage' },
  { key: 'coral', label: 'Coral' },
  { key: 'lavender', label: 'Lavender' },
  { key: 'peach', label: 'Peach' },
  { key: 'sky', label: 'Sky' },
  { key: 'mint', label: 'Mint' },
];

const iconChoices = ['Droplets', 'Dumbbell', 'BookOpen', 'Sparkles', 'PenLine', 'Moon', 'Leaf', 'Coffee', 'Heart', 'Sun', 'Star', 'Smile'];

export default function ProfileView({ data, onBack }: ProfileViewProps) {
  const { habits, reload } = data;
  const { mode } = useTheme();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [sublabel, setSublabel] = useState('');
  const [accent, setAccent] = useState<Accent>('sage');
  const [iconKey, setIconKey] = useState('Sparkles');
  const [saving, setSaving] = useState(false);

  const resetForm = () => {
    setName('');
    setSublabel('');
    setAccent('sage');
    setIconKey('Sparkles');
  };

  const handleAdd = async () => {
    if (!name.trim() || saving) return;
    setSaving(true);
    try {
      const nextOrder = (habits.reduce((m, h) => Math.max(m, h.sort_order), 0) || 0) + 1;
      const { error } = await supabase
        .from('habits')
        .insert({
          name: name.trim(),
          sublabel: sublabel.trim() || null,
          icon_key: iconKey,
          accent,
          sort_order: nextOrder,
        });
      if (error) throw error;
      resetForm();
      setAdding(false);
      await reload();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to add habit';
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (habit: Habit) => {
    if (!confirm(`Delete "${habit.name}"? This removes its history too.`)) return;
    try {
      const { error } = await supabase.from('habits').delete().eq('id', habit.id);
      if (error) throw error;
      await reload();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to delete habit';
      alert(msg);
    }
  };

  const sageA = resolveAccent('sage', mode);

  return (
    <div className="px-5 pb-36">
      <ScreenHeader eyebrow="Profile" title="Gopinath N" subtitle={`Building ${habits.length} habits`} onBack={onBack} />

      {/* Summary card */}
      <div
        className="anim-fade-in-up rounded-2xl p-4 mb-5"
        style={{
          backgroundColor: resolveAccent('lavender', mode).soft,
          border: `1px solid ${accents.lavender.base}40`,
          animationDelay: '50ms',
        }}
      >
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0" style={{ backgroundColor: accents.lavender.base }}>
            <Sparkles size={17} color="#FFFFFF" />
          </div>
          <div>
            <p className="text-[13px] font-semibold" style={{ color: resolveAccent('lavender', mode).text }}>
              Consistency beats intensity
            </p>
            <p className="text-[12px] mt-0.5 leading-relaxed" style={{ color: resolveAccent('lavender', mode).text }}>
              Show up for your gym schedule and diet plan every day. One check at a time compounds into real change.
            </p>
          </div>
        </div>
      </div>

      {/* Manage habits */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-[13px] font-semibold" style={{ color: 'var(--ink)' }}>
          Your habits
        </p>
        <button
          type="button"
          onClick={() => setAdding((v) => !v)}
          className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-semibold transition-colors"
          style={{
            backgroundColor: adding ? 'var(--chip-bg)' : sageA.soft,
            color: adding ? 'var(--subtext)' : sageA.text,
          }}
        >
          {adding ? <X size={13} /> : <Plus size={13} />}
          {adding ? 'Close' : 'New'}
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <div
          className="anim-fade-in-up rounded-2xl p-4 mb-4"
          style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Habit name (e.g. Morning run)"
            className="w-full rounded-xl px-3 py-2.5 text-[14px] font-medium outline-none transition-colors"
            style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--ink)' }}
            autoFocus
          />
          <input
            value={sublabel}
            onChange={(e) => setSublabel(e.target.value)}
            placeholder="Sublabel (optional, e.g. 5km)"
            className="w-full rounded-xl px-3 py-2.5 text-[13px] font-medium outline-none transition-colors mt-2"
            style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--ink)' }}
          />

          <p className="text-[11px] font-semibold uppercase tracking-wider mt-3 mb-2" style={{ color: 'var(--muted)' }}>
            Color
          </p>
          <div className="flex flex-wrap gap-2">
            {accentOptions.map((opt) => {
              const a = resolveAccent(opt.key, mode);
              const selected = accent === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setAccent(opt.key)}
                  className="flex items-center gap-1.5 rounded-full py-1.5 px-2.5 transition-all"
                  style={{
                    backgroundColor: selected ? a.base : a.soft,
                    border: selected ? `1.5px solid ${a.base}` : '1.5px solid transparent',
                    transform: selected ? 'scale(1.04)' : 'scale(1)',
                  }}
                >
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: selected ? '#FFFFFF' : a.base }} />
                  <span className="text-[11px] font-semibold" style={{ color: selected ? '#FFFFFF' : a.text }}>
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="text-[11px] font-semibold uppercase tracking-wider mt-3 mb-2" style={{ color: 'var(--muted)' }}>
            Icon
          </p>
          <div className="grid grid-cols-6 gap-2">
            {iconChoices.map((key) => {
              const a = resolveAccent(accent, mode);
              const Icon = getIcon(key);
              const selected = iconKey === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setIconKey(key)}
                  className="flex h-10 items-center justify-center rounded-xl transition-all"
                  style={{
                    backgroundColor: selected ? a.base : 'var(--chip-bg)',
                    border: selected ? `1.5px solid ${a.base}` : '1.5px solid transparent',
                  }}
                >
                  <Icon size={17} color={selected ? '#FFFFFF' : 'var(--muted)'} />
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={!name.trim() || saving}
            className="mt-4 w-full rounded-xl py-2.5 text-[14px] font-semibold flex items-center justify-center gap-1.5 transition-all disabled:opacity-40"
            style={{ backgroundColor: accents.sage.base, color: '#FFFFFF' }}
          >
            <Check size={15} />
            {saving ? 'Saving…' : 'Add habit'}
          </button>
        </div>
      )}

      {/* Habit list */}
      <div className="flex flex-col gap-2">
        {habits.length === 0 && !adding && (
          <p className="text-[13px] text-center py-8" style={{ color: 'var(--muted)' }}>
            No habits. Tap "New" to add one.
          </p>
        )}
        {habits.map((h, i) => {
          const a = resolveAccent(h.accent, mode);
          const Icon = getIcon(h.icon_key);
          return (
            <div
              key={h.id}
              className="anim-fade-in-up flex items-center gap-3 rounded-2xl px-3.5 py-3"
              style={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                animationDelay: `${i * 35}ms`,
              }}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: a.soft }}>
                <Icon size={16} color={a.text} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold truncate" style={{ color: 'var(--ink)' }}>
                  {h.name}
                </p>
                {h.sublabel && (
                  <p className="text-[11px] mt-0.5" style={{ color: 'var(--muted)' }}>
                    {h.sublabel}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => void handleDelete(h)}
                className="flex h-8 w-8 items-center justify-center rounded-full transition-colors"
                aria-label={`Delete ${h.name}`}
              >
                <Trash2 size={15} color="var(--muted)" />
              </button>
            </div>
          );
        })}
      </div>

      <p className="text-center text-[11px] mt-6" style={{ color: 'var(--muted)' }}>
        Habits sync to your private database automatically.
      </p>
    </div>
  );
}
