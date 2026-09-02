import { clampPct, hpBarColor } from '../lib/utils';

interface HpBarProps {
  current: number;
  max: number;
  size?: 'sm' | 'md';
}

export function HpBar({ current, max, size = 'md' }: HpBarProps) {
  const pct = clampPct(current, max);
  const height = size === 'sm' ? 'h-1.5' : 'h-2.5';

  return (
    <div className="w-full">
      <div className={`w-full ${height} rounded-full bg-zinc-800 overflow-hidden`}>
        <div
          className={`${height} ${hpBarColor(pct)} transition-all duration-300 rounded-full`}
          style={{ width: `${pct * 100}%` }}
        />
      </div>
    </div>
  );
}
