import { Zap } from 'lucide-react';
import { useEncounterStore } from '../store/useEncounterStore';

export function TraitTriggerPanel() {
  const traitTriggers = useEncounterStore((s) => s.encounter.traitTriggers);

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/60">
      <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
        <Zap size={16} className="text-cyan-400" />
        <h2 className="text-sm font-semibold text-zinc-200 tracking-wide">TRAIT TRIGGERS</h2>
      </div>
      <div className="divide-y divide-zinc-800">
        {traitTriggers.map((t) => (
          <div key={t.id} className="px-4 py-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-zinc-100">{t.name}</p>
              <span className="text-[10px] text-zinc-500 shrink-0">{t.creatureName}</span>
            </div>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              <span className="text-zinc-500">When: </span>
              {t.triggerCondition}
            </p>
            <p className="text-xs text-cyan-300/80 mt-1 leading-relaxed">
              <span className="text-zinc-500">Effect: </span>
              {t.mechanicalEffect}
            </p>
            <p className="text-[11px] font-mono text-amber-300/80 mt-1">{t.formulaOrDC}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
