export function hpBarColor(pct: number): string {
  if (pct <= 0) return 'bg-zinc-700';
  if (pct <= 0.3) return 'bg-red-600';
  if (pct <= 0.6) return 'bg-amber-500';
  return 'bg-emerald-500';
}

export function clampPct(current: number, max: number): number {
  if (max <= 0) return 0;
  return Math.max(0, Math.min(1, current / max));
}
