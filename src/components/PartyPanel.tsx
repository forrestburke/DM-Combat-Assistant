import { useState } from 'react';
import { ExternalLink, Minus, Plus, Shield, Trash2, UserPlus, Users } from 'lucide-react';
import { useEncounterStore } from '../store/useEncounterStore';
import { HpBar } from './HpBar';
import type { PartyMember } from '../types/encounter';

const ROLES: PartyMember['role'][] = ['Druid', 'Rogue', 'Paladin', 'Cleric', 'Warlock', 'Custom'];

function AddPartyMemberForm() {
  const addPartyMember = useEncounterStore((s) => s.addPartyMember);
  const [name, setName] = useState('');
  const [role, setRole] = useState<PartyMember['role']>('Custom');
  const [ac, setAc] = useState('15');
  const [hp, setHp] = useState('20');
  const [species, setSpecies] = useState('');
  const [priority, setPriority] = useState('');
  const [link, setLink] = useState('');

  function handleAdd() {
    if (!name.trim()) return;
    const hpMax = Math.max(1, Number(hp) || 1);
    addPartyMember({
      id: `pc-${Date.now()}`,
      name: name.trim(),
      role,
      species: species.trim() || undefined,
      ac: Number(ac) || 10,
      hpCurrent: hpMax,
      hpMax,
      tacticalPriority: priority.trim() || 'No tactical note yet',
      conditions: [],
      referenceLink: link.trim() || undefined,
    });
    setName('');
    setSpecies('');
    setPriority('');
    setLink('');
  }

  return (
    <div className="px-4 py-3 space-y-1.5">
      <div className="grid grid-cols-2 gap-1.5">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="PC name"
          className="col-span-2 rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-cyan-700"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as PartyMember['role'])}
          className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1 text-xs text-zinc-200 focus:outline-none focus:border-cyan-700"
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <div className="flex gap-1.5">
          <input
            value={ac}
            onChange={(e) => setAc(e.target.value)}
            placeholder="AC"
            inputMode="numeric"
            className="w-1/2 rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-cyan-700"
          />
          <input
            value={hp}
            onChange={(e) => setHp(e.target.value)}
            placeholder="HP"
            inputMode="numeric"
            className="w-1/2 rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-cyan-700"
          />
        </div>
      </div>
      <input
        value={species}
        onChange={(e) => setSpecies(e.target.value)}
        placeholder="Species (e.g. Elf, Tiefling) — optional"
        className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-cyan-700"
      />
      <input
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        placeholder="Tactical priority (e.g. soft target, disrupt concentration)"
        className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-cyan-700"
      />
      <input
        value={link}
        onChange={(e) => setLink(e.target.value)}
        placeholder="D&D Beyond link (optional)"
        className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-cyan-700"
      />
      <button
        onClick={handleAdd}
        disabled={!name.trim()}
        className="w-full flex items-center justify-center gap-1.5 rounded-md border border-cyan-800 bg-cyan-950 py-1.5 text-xs text-cyan-300 hover:bg-cyan-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <UserPlus size={12} />
        Add PC
      </button>
    </div>
  );
}

export function PartyPanel() {
  const party = useEncounterStore((s) => s.encounter.party);
  const updatePartyHp = useEncounterStore((s) => s.updatePartyHp);
  const removePartyMember = useEncounterStore((s) => s.removePartyMember);

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
                <span className="text-xs text-zinc-500 shrink-0">
                  {p.species ? `${p.species} ${p.role}` : p.role}
                </span>
                {p.referenceLink && (
                  <a
                    href={p.referenceLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-500 hover:text-cyan-400 transition-colors shrink-0"
                    aria-label={`Open ${p.name}'s D&D Beyond sheet`}
                    title="D&D Beyond sheet"
                  >
                    <ExternalLink size={11} />
                  </a>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-1 text-xs text-zinc-400">
                  <Shield size={12} />
                  {p.ac}
                </div>
                <button
                  onClick={() => removePartyMember(p.id)}
                  className="text-zinc-600 hover:text-red-400 transition-colors"
                  aria-label={`Remove ${p.name}`}
                >
                  <Trash2 size={11} />
                </button>
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
      <div className="border-t border-zinc-800">
        <AddPartyMemberForm />
      </div>
    </div>
  );
}
