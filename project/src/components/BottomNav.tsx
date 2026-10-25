import { CalendarDays, BarChart3, User } from 'lucide-react';
import type { TabKey } from '@/lib/types';

interface BottomNavProps {
  active: TabKey;
  onChange: (tab: TabKey) => void;
}

const tabs: { key: TabKey; label: string; icon: typeof CalendarDays }[] = [
  { key: 'today', label: 'Today', icon: CalendarDays },
  { key: 'stats', label: 'Stats', icon: BarChart3 },
  { key: 'profile', label: 'Profile', icon: User },
];

export default function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex justify-center pb-5 px-5">
      <div
        className="pointer-events-auto flex items-center justify-around gap-1 rounded-2xl px-2 py-2 anim-slide-up"
        style={{
          backgroundColor: 'var(--nav-bg)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          border: '1px solid var(--nav-border)',
          boxShadow: '0 8px 24px var(--shadow)',
          width: '100%',
          maxWidth: 280,
        }}
      >
        {tabs.map(({ key, label, icon: Icon }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              className="flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 transition-all duration-300"
              style={{ backgroundColor: isActive ? 'rgba(123, 166, 127, 0.18)' : 'transparent' }}
            >
              <Icon
                size={20}
                strokeWidth={2}
                style={{ color: isActive ? '#7BA67F' : 'var(--muted)', transition: 'color 0.3s' }}
              />
              <span
                className="text-[10px] font-semibold"
                style={{ color: isActive ? '#7BA67F' : 'var(--muted)', transition: 'color 0.3s' }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
