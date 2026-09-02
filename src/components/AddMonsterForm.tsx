import { useEffect, useState } from 'react';
import { AlertTriangle, ClipboardPaste, Swords } from 'lucide-react';
import { useEncounterStore } from '../store/useEncounterStore';
import { buildMonsterFromName, findSrdMonster, srdMonsters } from '../data/srdMonsters';
import { MarkdownParseError, parseSingleMonsterMarkdown } from '../lib/parser';

function PasteStatBlockForm({ onDone }: { onDone: () => void }) {
  const addMonster = useEncounterStore((s) => s.addMonster);
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleParse() {
    try {
      addMonster(parseSingleMonsterMarkdown(text));
      onDone();
    } catch (e) {
      setError(e instanceof MarkdownParseError ? e.message : 'Unexpected error while parsing the stat block.');
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[10px] text-zinc-500">
        Paste a stat block in this format — ask Claude to transcribe one from a screenshot (5etools, D&D Beyond,
        your books) into this shape first:
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={
          '### Zombie Plague Spreader (Medium Undead)\n- AC: 10\n- HP: 78/78\n- Speed: 30\n- Ability Scores: STR 16, DEX 10, CON 15, INT 3, WIS 5, CHA 5\n- Passives: Undead Fortitude, Resistant to Necrotic\n- Reaction Cue: ...\n\n#### Attacks\n- Slam | Melee | 1d20+5 vs AC | 5 ft | 1d6+3 [bludgeoning] + 2d8 [necrotic]\n\n#### Posture A: Offensive\n- Trigger: ...\n- Movement: ...\n- Action: ...\n\n#### Posture B: Defensive\n...\n\n#### Posture C: Axis Interaction\n...'
        }
        rows={6}
        className="w-full resize-none rounded-md border border-zinc-800 bg-zinc-950 px-2.5 py-2 text-[11px] font-mono text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-cyan-700"
      />
      {error && (
        <div className="flex items-start gap-2 rounded-md border border-red-800 bg-red-950/60 px-2.5 py-2">
          <AlertTriangle size={12} className="text-red-400 mt-0.5 shrink-0" />
          <p className="text-[10px] text-red-300 leading-relaxed">{error}</p>
        </div>
      )}
      <div className="flex justify-end gap-2">
        <button onClick={onDone} className="rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-700 transition-colors">
          Cancel
        </button>
        <button
          onClick={handleParse}
          disabled={!text.trim()}
          className="rounded-md border border-cyan-800 bg-cyan-950 px-3 py-1.5 text-xs text-cyan-300 hover:bg-cyan-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Parse &amp; Add
        </button>
      </div>
    </div>
  );
}

export function AddMonsterForm() {
  const addMonster = useEncounterStore((s) => s.addMonster);
  const [name, setName] = useState('');
  const [count, setCount] = useState('1');
  const [ac, setAc] = useState('');
  const [hp, setHp] = useState('');
  const [speed, setSpeed] = useState('');
  const [pasteMode, setPasteMode] = useState(false);

  const match = findSrdMonster(name);

  useEffect(() => {
    if (match) {
      setAc(String(match.ac));
      setHp(String(match.hpMax));
      setSpeed(String(match.speed));
    }
  }, [match?.name]);

  function handleAdd() {
    if (!name.trim()) return;
    const qty = Math.max(1, Math.min(12, Number(count) || 1));
    const suffix = Date.now();
    const overrides = {
      ac: ac.trim() ? Number(ac) : undefined,
      hpMax: hp.trim() ? Number(hp) : undefined,
      speed: speed.trim() ? Number(speed) : undefined,
    };
    for (let i = 0; i < qty; i++) {
      const label = qty > 1 ? `${name.trim()} ${i + 1}` : name.trim();
      addMonster(buildMonsterFromName(label, `${suffix}-${i}`, overrides));
    }
    setName('');
    setCount('1');
    setAc('');
    setHp('');
    setSpeed('');
  }

  if (pasteMode) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-700 bg-zinc-900/40 p-3">
        <PasteStatBlockForm onDone={() => setPasteMode(false)} />
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-dashed border-zinc-700 bg-zinc-900/40 p-3 flex flex-col gap-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="flex-1 min-w-0">
          <input
            list="srd-monster-names"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Monster name (autofills from local SRD compendium)…"
            className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-cyan-700"
          />
          <datalist id="srd-monster-names">
            {srdMonsters.map((m) => (
              <option key={m.name} value={m.name} />
            ))}
          </datalist>
          <p className="mt-1 text-[10px] text-zinc-500">
            {name.trim() === ''
              ? 'Type a name — matches autofill AC/HP/Speed/attacks/posture from the SRD.'
              : match
                ? `Matched: ${match.name} (${match.baseType}) — AC/HP/Speed below are editable.`
                : 'No SRD match — enter AC/HP/Speed below (e.g. from a 5etools screenshot pasted into chat), or paste a full stat block via Import Markdown.'}
          </p>
        </div>
        <input
          value={count}
          onChange={(e) => setCount(e.target.value)}
          inputMode="numeric"
          aria-label="Quantity"
          className="w-14 rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1.5 text-xs text-zinc-200 text-center focus:outline-none focus:border-cyan-700"
        />
        <button
          onClick={handleAdd}
          disabled={!name.trim()}
          className="flex items-center justify-center gap-1.5 rounded-md border border-red-800 bg-red-950 px-3 py-1.5 text-xs text-red-300 hover:bg-red-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
        >
          <Swords size={12} />
          Add to Combat
        </button>
      </div>
      <div className="flex gap-2">
        <input
          value={ac}
          onChange={(e) => setAc(e.target.value)}
          placeholder="AC"
          inputMode="numeric"
          className="w-16 rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-cyan-700"
        />
        <input
          value={hp}
          onChange={(e) => setHp(e.target.value)}
          placeholder="HP"
          inputMode="numeric"
          className="w-16 rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-cyan-700"
        />
        <input
          value={speed}
          onChange={(e) => setSpeed(e.target.value)}
          placeholder="Speed"
          inputMode="numeric"
          className="w-20 rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-cyan-700"
        />
        <button
          onClick={() => setPasteMode(true)}
          className="flex items-center gap-1.5 text-[10px] text-zinc-500 hover:text-cyan-400 transition-colors ml-auto"
        >
          <ClipboardPaste size={11} />
          Paste full stat block instead
        </button>
      </div>
    </div>
  );
}
