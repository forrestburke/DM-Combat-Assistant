import { Crosshair, Minus, Plus, Skull, Sword, Zap } from 'lucide-react';
import type { MonsterCombatState, TacticalPosture } from '../types/encounter';
import { useEncounterStore } from '../store/useEncounterStore';
import { HpBar } from './HpBar';

const POSTURE_META: Record<'A' | 'B' | 'C', { label: string; color: string; border: string; bg: string }> = {
  A: { label: 'Offensive', color: 'text-red-300', border: 'border-red-800', bg: 'bg-red-950/60' },
  B: { label: 'Defensive', color: 'text-cyan-300', border: 'border-cyan-800', bg: 'bg-cyan-950/60' },
  C: { label: 'Axis / Hazard', color: 'text-amber-300', border: 'border-amber-800', bg: 'bg-amber-950/60' },
};

function PostureDetail({ posture }: { posture: TacticalPosture }) {
  return (
    <div className="mt-3 space-y-1.5">
      <p className="text-xs text-zinc-500">
        <span className="font-semibold text-zinc-400">Trigger: </span>
        {posture.trigger}
      </p>
      <p className="text-xs text-zinc-300">
        <span className="font-semibold text-zinc-400">Move: </span>
        {posture.movement}
      </p>
      <p className="text-xs text-zinc-300">
        <span className="font-semibold text-zinc-400">Action: </span>
        {posture.action}
      </p>
      {posture.bonusAction && (
        <p className="text-xs text-zinc-300">
          <span className="font-semibold text-zinc-400">Bonus: </span>
          {posture.bonusAction}
        </p>
      )}
      {posture.tags && posture.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-1">
          {posture.tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 text-[10px] px-2 py-0.5"
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function MonsterCard({ monster }: { monster: MonsterCombatState }) {
  const updateMonsterHp = useEncounterStore((s) => s.updateMonsterHp);
  const setMonsterPosture = useEncounterStore((s) => s.setMonsterPosture);
  const toggleMonsterDefeated = useEncounterStore((s) => s.toggleMonsterDefeated);

  const postures: Record<'A' | 'B' | 'C', TacticalPosture> = {
    A: monster.postureA,
    B: monster.postureB,
    C: monster.postureC,
  };
  const meta = POSTURE_META[monster.activePosture];

  return (
    <div
      className={`rounded-lg border bg-zinc-900/60 transition-opacity ${
        monster.isDefeated ? 'border-zinc-800 opacity-45' : 'border-zinc-800'
      }`}
    >
      <div className="flex items-center justify-between gap-2 border-b border-zinc-800 px-4 py-3">
        <div className="min-w-0">
          <p className="font-semibold text-zinc-100 truncate">{monster.name}</p>
          <p className="text-[11px] text-zinc-500 truncate">{monster.baseType}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-zinc-400 flex items-center gap-1">AC {monster.ac}</span>
          <button
            onClick={() => toggleMonsterDefeated(monster.id)}
            className={`rounded p-1.5 border transition-colors ${
              monster.isDefeated
                ? 'border-zinc-600 bg-zinc-700 text-zinc-200'
                : 'border-zinc-700 bg-zinc-800 text-zinc-400 hover:text-red-400 hover:border-red-800'
            }`}
            aria-label="Toggle defeated"
          >
            <Skull size={13} />
          </button>
        </div>
      </div>

      <div className="px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => updateMonsterHp(monster.id, -1)}
            className="rounded bg-zinc-800 hover:bg-red-900/60 text-zinc-300 p-1 transition-colors"
            aria-label={`Damage ${monster.name}`}
          >
            <Minus size={12} />
          </button>
          <HpBar current={monster.hpCurrent} max={monster.hpMax} />
          <button
            onClick={() => updateMonsterHp(monster.id, 1)}
            className="rounded bg-zinc-800 hover:bg-emerald-900/60 text-zinc-300 p-1 transition-colors"
            aria-label={`Heal ${monster.name}`}
          >
            <Plus size={12} />
          </button>
          <span className="text-xs text-zinc-400 tabular-nums w-16 text-right shrink-0">
            {monster.hpCurrent}/{monster.hpMax}
          </span>
        </div>

        {/* Posture selector */}
        <div className="mt-3 grid grid-cols-3 gap-1.5">
          {(['A', 'B', 'C'] as const).map((key) => {
            const isActive = monster.activePosture === key;
            const m = POSTURE_META[key];
            return (
              <button
                key={key}
                onClick={() => setMonsterPosture(monster.id, key)}
                className={`rounded-md border px-2 py-1.5 text-[11px] font-semibold transition-colors ${
                  isActive
                    ? `${m.border} ${m.bg} ${m.color}`
                    : 'border-zinc-800 bg-zinc-800/50 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {key} · {m.label}
              </button>
            );
          })}
        </div>

        <div className={`mt-1 rounded-md border ${meta.border} ${meta.bg} px-3 py-2`}>
          <PostureDetail posture={postures[monster.activePosture]} />
        </div>

        {/* Attacks */}
        <div className="mt-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Sword size={12} className="text-zinc-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Attacks</span>
          </div>
          <div className="space-y-1">
            {monster.attacks.map((a) => (
              <div key={a.name} className="flex items-center justify-between text-xs">
                <span className="text-zinc-300 font-medium">{a.name}</span>
                <span className="text-zinc-500 font-mono text-[11px]">
                  {a.formula} · {a.damage}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Reaction cue */}
        <div className="mt-3 flex items-start gap-1.5">
          <Zap size={12} className="text-amber-500 mt-0.5 shrink-0" />
          <p className="text-[11px] text-amber-300/80 leading-snug">{monster.reactionCue}</p>
        </div>

        {monster.passives.length > 0 && (
          <div className="mt-2 flex items-start gap-1.5">
            <Crosshair size={12} className="text-zinc-500 mt-0.5 shrink-0" />
            <p className="text-[11px] text-zinc-500 leading-snug">{monster.passives.join(' · ')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
