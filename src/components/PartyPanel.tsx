import { Minus, Plus, Shield, Users } from 'lucide-react';
import { useEncounterStore } from '../store/useEncounterStore';
import { HpBar } from './HpBar';

export function PartyPanel() {
  const party = useEncounterStore((s) => s.encounter.party);
  const updatePartyHp = useEncounterStore((s) => s.updatePartyHp);

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/60">
      <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
        <Users size={16} className="text-cyan-400" />
        <h2 className="text-sm font-semibold text-zinc-200 tracking-wide">PARTY</h2>
      </div>
      <div className="divide-y divide-zinc-800">
        {party.map((p) => (
          <div key={p.id} className="px-4 py-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-medium text-zinc-100 truncate">{p.name}</span>
                <span className="text-xs text-zinc-500 shrink-0">{p.role}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-zinc-400 shrink-0">
                <Shield size={12} />
                {p.ac}
              </div>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <button
                onClick={() => updatePartyHp(p.id, -1)}
                className="rounded bg-zinc-800 hover:bg-red-900/60 text-zinc-300 p-1 transition-colors"
                aria-label={`Damage ${p.name}`}
              >
                <Minus size={12} />
              </button>
              <HpBar current={p.hpCurrent} max={p.hpMax} size="sm" />
              <button
                onClick={() => updatePartyHp(p.id, 1)}
                className="rounded bg-zinc-800 hover:bg-emerald-900/60 text-zinc-300 p-1 transition-colors"
                aria-label={`Heal ${p.name}`}
              >
                <Plus size={12} />
              </button>
              <span className="text-xs text-zinc-400 tabular-nums w-14 text-right shrink-0">
                {p.hpCurrent}/{p.hpMax}
              </span>
            </div>

            <p className="mt-2 text-xs text-amber-400/90 leading-snug">{p.tacticalPriority}</p>

            {p.conditions.length > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-1">
                {p.conditions.map((c) => (
                  <span
                    key={c}
                    className="rounded-full bg-red-950 border border-red-800 text-red-300 text-[10px] px-2 py-0.5"
                  >
                    {c}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
