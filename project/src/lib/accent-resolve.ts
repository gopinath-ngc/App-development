import { accents } from './theme';
import type { Accent } from './types';
import { useTheme } from './theme-context';

export interface ResolvedAccent {
  base: string;
  soft: string;
  text: string;
  textOnBase: string;
  ring: string;
}

export function resolveAccent(accent: Accent, mode: 'light' | 'dark'): ResolvedAccent {
  const a = accents[accent];
  return {
    base: a.base,
    soft: mode === 'dark' ? a.softDark : a.soft,
    text: mode === 'dark' ? a.textDark : a.text,
    textOnBase: mode === 'dark' ? '#1d2125' : '#FFFFFF',
    ring: a.ring,
  };
}

export function useResolvedAccent(accent: Accent): ResolvedAccent {
  const { mode } = useTheme();
  return resolveAccent(accent, mode);
}
