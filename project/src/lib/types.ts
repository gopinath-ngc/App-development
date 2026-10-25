export type Accent = 'sage' | 'coral' | 'lavender' | 'peach' | 'sky' | 'mint';

export interface AccentTokens {
  base: string;
  soft: string;
  softDark: string;
  ring: string;
  text: string;
  textDark: string;
}

export interface Habit {
  id: string;
  name: string;
  sublabel: string | null;
  icon_key: string;
  accent: Accent;
  sort_order: number;
}

export interface Completion {
  id: string;
  habit_id: string;
  date: string; // 'YYYY-MM-DD'
}

export type TabKey = 'today' | 'stats' | 'profile';
