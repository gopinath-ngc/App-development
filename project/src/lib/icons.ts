import {
  Droplets,
  Dumbbell,
  BookOpen,
  Sparkles,
  PenLine,
  Moon,
  Leaf,
  Coffee,
  Heart,
  Sun,
  Star,
  Smile,
  type LucideIcon,
} from 'lucide-react';

export const iconMap: Record<string, LucideIcon> = {
  Droplets,
  Dumbbell,
  BookOpen,
  Sparkles,
  PenLine,
  Moon,
  Leaf,
  Coffee,
  Heart,
  Sun,
  Star,
  Smile,
};

export function getIcon(key: string): LucideIcon {
  return iconMap[key] ?? Sparkles;
}
