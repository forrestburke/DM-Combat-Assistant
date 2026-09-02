import { Clock, Compass, Mountain } from 'lucide-react';
import { useEncounterStore } from '../store/useEncounterStore';

export function EncounterAxesPanel() {
  const axes = useEncounterStore((s) => s.encounter.axes);

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/60">
      <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
        <Compass size={16} className="text-amber-400" />
        <h2 className="text-sm font-semibold text-zinc-200 tracking-wide">ENCOUNTER AXES</h2>
      </div>

      <div className="divide-y divide-zinc-800">
        <div className="px-4 py-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">Win Condition</span>
          </div>
          <p className="text-sm text-zinc-200 font-medium">{axes.winCondition.title}</p>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{axes.winCondition.description}</p>
          <p className="text-xs text-red-300/80 mt-1.5 leading-relaxed italic">
            {axes.winCondition.moraleThresholds}
          </p>
        </div>

        <div className="px-4 py-3">
          <div className="flex items-center gap-2 mb-1">
            <Mountain size={12} className="text-cyan-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
              Battlefield Optimizer
            </span>
          </div>
          <p className="text-sm text-zinc-200 font-medium">{axes.battlefieldOptimizer.title}</p>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
            {axes.battlefieldOptimizer.description}
          </p>
          <p className="text-xs text-cyan-300/80 mt-1.5 leading-relaxed italic">
            {axes.battlefieldOptimizer.mechanicalBenefit}
          </p>
        </div>

        <div className="px-4 py-3">
          <div className="flex items-center gap-2 mb-1">
            <Clock size={12} className="text-amber-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
              Hazard / Clock
            </span>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-zinc-200 font-medium">{axes.hazardOrClock.title}</p>
            <span className="text-xs rounded bg-amber-950 border border-amber-800 text-amber-300 px-2 py-0.5 shrink-0">
              Count {axes.hazardOrClock.initiativeCount}
            </span>
          </div>
          <p className="text-xs text-amber-300/80 mt-1.5 leading-relaxed italic">
            {axes.hazardOrClock.triggerEffect}
          </p>
        </div>
      </div>
    </div>
  );
}
