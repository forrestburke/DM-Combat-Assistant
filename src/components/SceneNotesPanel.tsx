import { useMemo } from 'react';
import { Map, ScrollText, Sparkles } from 'lucide-react';
import { useEncounterStore } from '../store/useEncounterStore';
import { suggestMapElements, generateEncounterRoster } from '../lib/sceneSuggestions';
import { suggestAxes } from '../lib/axesSuggester';

const FIELDS: { key: 'environment' | 'terrain' | 'combatSituation' | 'timeOfDay'; label: string; placeholder: string }[] = [
  { key: 'environment', label: 'Environment', placeholder: 'e.g. flooded cellar, mountain pass, city rooftops' },
  { key: 'terrain', label: 'Terrain', placeholder: 'e.g. difficult terrain, chokepoints, cover' },
  { key: 'combatSituation', label: 'Combat Situation', placeholder: 'e.g. ambush, escort, defend the door' },
  { key: 'timeOfDay', label: 'Time of Day', placeholder: 'e.g. dusk, midnight, high noon' },
];

export function SceneNotesPanel() {
  const scene = useEncounterStore((s) => s.encounter.scene);
  const setScene = useEncounterStore((s) => s.setScene);
  const addMonster = useEncounterStore((s) => s.addMonster);
  const setAxes = useEncounterStore((s) => s.setAxes);
  const monsters = useEncounterStore((s) => s.encounter.round.monsters);

  const elements = useMemo(() => suggestMapElements(scene), [scene]);

  function handleGenerate() {
    const roster = generateEncounterRoster(scene);
    roster.forEach(addMonster);
    setAxes(suggestAxes([...monsters, ...roster], scene));
  }

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/60">
      <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
        <ScrollText size={16} className="text-amber-400" />
        <h2 className="text-sm font-semibold text-zinc-200 tracking-wide">SCENE NOTES</h2>
      </div>
      <div className="p-4 space-y-3">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-1">
              {f.label}
            </label>
            <input
              type="text"
              value={scene[f.key]}
              onChange={(e) => setScene({ [f.key]: e.target.value })}
              placeholder={f.placeholder}
              className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-cyan-700"
            />
          </div>
        ))}

        <button
          onClick={handleGenerate}
          className="w-full flex items-center justify-center gap-1.5 rounded-md border border-red-800 bg-red-950 py-1.5 text-xs text-red-300 hover:bg-red-900 transition-colors"
        >
          <Sparkles size={12} />
          Generate Encounter
        </button>
        <p className="text-[10px] text-zinc-500 -mt-1">
          Adds a thematically-matched monster roster from the local SRD compendium and drafts the Encounter Axes
          below from it — review and edit both.
        </p>

        <div className="rounded-md border border-zinc-800 bg-zinc-950/40 p-2.5">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Map size={12} className="text-cyan-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
              Recommended Map Elements
            </span>
          </div>
          <ul className="space-y-1">
            {elements.map((el) => (
              <li key={el} className="text-[11px] text-zinc-400 leading-snug flex gap-1.5">
                <span className="text-zinc-600">–</span>
                <span>{el}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
