import { ChevronRight, RotateCcw, SkipForward } from 'lucide-react';
import { useEncounterStore } from '../store/useEncounterStore';

export function RoundTracker() {
  const round = useEncounterStore((s) => s.encounter.round);
  const nextTurn = useEncounterStore((s) => s.nextTurn);
  const nextRound = useEncounterStore((s) => s.nextRound);
  const resetRound = useEncounterStore((s) => s.resetRound);

  const living = round.monsters.filter((m) => !m.isDefeated);
  const active = living[round.activeTurnIndex % Math.max(living.length, 1)];

  return (
    <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-3">
      <div className="flex items-center gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-zinc-500">Round</p>
          <p className="text-2xl font-bold text-zinc-100 tabular-nums leading-none">{round.roundNumber}</p>
        </div>
        <div className="h-8 w-px bg-zinc-800" />
        <div>
          <p className="text-[10px] uppercase tracking-wider text-zinc-500">Active</p>
          <p className="text-sm font-semibold text-crimson leading-none text-red-400">
            {active ? active.name : '—'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={resetRound}
          className="flex items-center gap-1.5 rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-700 transition-colors"
        >
          <RotateCcw size={12} />
          Reset
        </button>
        <button
          onClick={nextTurn}
          className="flex items-center gap-1.5 rounded-md border border-cyan-800 bg-cyan-950 px-3 py-1.5 text-xs text-cyan-300 hover:bg-cyan-900 transition-colors"
        >
          <ChevronRight size={12} />
          Next Turn
        </button>
        <button
          onClick={nextRound}
          className="flex items-center gap-1.5 rounded-md border border-red-800 bg-red-950 px-3 py-1.5 text-xs text-red-300 hover:bg-red-900 transition-colors"
        >
          <SkipForward size={12} />
          Next Round
        </button>
      </div>
    </div>
  );
}
