import type { Accent, AccentTokens } from './types';

export const accents: Record<Accent, AccentTokens> = {
  sage: {
    base: '#7BA67F',
    soft: '#E3EEDF',
    softDark: 'rgba(123, 166, 127, 0.20)',
    ring: '#7BA67F',
    text: '#3D5240',
    textDark: '#A6C9AB',
  },
  coral: {
    base: '#E88A7D',
    soft: '#FBE3DE',
    softDark: 'rgba(232, 138, 125, 0.20)',
    ring: '#E88A7D',
    text: '#7A3B33',
    textDark: '#F0B3A8',
  },
  lavender: {
    base: '#9B8FC4',
    soft: '#EBE7F4',
    softDark: 'rgba(155, 143, 196, 0.22)',
    ring: '#9B8FC4',
    text: '#4D4567',
    textDark: '#C2B8DE',
  },
  peach: {
    base: '#E9A772',
    soft: '#FBE8D4',
    softDark: 'rgba(233, 167, 114, 0.20)',
    ring: '#E9A772',
    text: '#7A4E26',
    textDark: '#F2C499',
  },
  sky: {
    base: '#7FB0D9',
    soft: '#E0ECF5',
    softDark: 'rgba(127, 176, 217, 0.20)',
    ring: '#7FB0D9',
    text: '#3D5C78',
    textDark: '#A8C8E5',
  },
  mint: {
    base: '#86C7B3',
    soft: '#DFF1EA',
    softDark: 'rgba(134, 199, 179, 0.20)',
    ring: '#86C7B3',
    text: '#3D6B5B',
    textDark: '#A9DCCD',
  },
};

export const palette = {
  cream: '#FAF7F2',
  ink: '#2E2A26',
  subtext: '#8A8278',
  card: '#FFFFFF',
  border: '#EEE7DD',
  shadow: 'rgba(60, 50, 40, 0.06)',
  shadowSoft: 'rgba(60, 50, 40, 0.04)',
};

export function todayISO(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function startOfWeek(d = new Date()): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = (day + 6) % 7;
  date.setDate(date.getDate() - diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function isoFromDate(d: Date): string {
  return todayISO(d);
}

export function dayLabel(d: Date): string {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()].charAt(0);
}

/** CSS var references resolved at runtime */
export const tokens = {
  bg: 'var(--bg)',
  card: 'var(--card)',
  ink: 'var(--ink)',
  subtext: 'var(--subtext)',
  muted: 'var(--muted)',
  border: 'var(--border)',
  borderStrong: 'var(--border-strong)',
  shadow: 'var(--shadow)',
  shadowSoft: 'var(--shadow-soft)',
  navBg: 'var(--nav-bg)',
  navBorder: 'var(--nav-border)',
  chipBg: 'var(--chip-bg)',
  chipInk: 'var(--chip-ink)',
  ringTrack: 'var(--ring-track)',
  barEmpty: 'var(--bar-empty)',
};
