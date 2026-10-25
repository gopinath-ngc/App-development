import { useEffect, useRef, useState } from 'react';

interface ProgressRingProps {
  progress: number; // 0..1
  size?: number;
  stroke?: number;
  color?: string;
  label?: string;
  sublabel?: string;
}

export default function ProgressRing({
  progress,
  size = 72,
  stroke = 7,
  color = '#7BA67F',
  label,
  sublabel,
}: ProgressRingProps) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const [offset, setOffset] = useState(c);
  const mounted = useRef(false);

  useEffect(() => {
    const p = Math.max(0, Math.min(1, progress));
    if (!mounted.current) {
      setOffset(c * (1 - p));
      mounted.current = true;
      return;
    }
    const id = requestAnimationFrame(() => setOffset(c * (1 - p)));
    return () => cancelAnimationFrame(id);
  }, [progress, c]);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--ring-track)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.9s cubic-bezier(0.22, 1, 0.36, 1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {label && (
          <span className="text-[15px] font-semibold leading-none" style={{ color: 'var(--ink)' }}>
            {label}
          </span>
        )}
        {sublabel && (
          <span className="text-[10px] font-medium mt-0.5" style={{ color: 'var(--subtext)' }}>
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}
