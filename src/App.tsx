import { useState } from 'react';
import { Swords, Upload } from 'lucide-react';
import { useEncounterStore } from './store/useEncounterStore';
import { RoundTracker } from './components/RoundTracker';
import { PartyPanel } from './components/PartyPanel';
import { EncounterAxesPanel } from './components/EncounterAxesPanel';
import { TraitTriggerPanel } from './components/TraitTriggerPanel';
import { MonsterCard } from './components/MonsterCard';
import { ImportModal } from './components/ImportModal';

function App() {
  const encounter = useEncounterStore((s) => s.encounter);
  const [importOpen, setImportOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Swords size={20} className="text-red-500" />
            <div>
              <h1 className="text-base font-bold tracking-tight text-zinc-100">DM Combat Assistant</h1>
              <p className="text-xs text-zinc-500">{encounter.name}</p>
            </div>
          </div>
          <button
            onClick={() => setImportOpen(true)}
            className="flex items-center gap-1.5 rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-700 transition-colors"
          >
            <Upload size={12} />
            Import Markdown
          </button>
        </div>
      </header>

      {importOpen && <ImportModal onClose={() => setImportOpen(false)} />}

      <main className="mx-auto max-w-7xl px-4 py-4 space-y-4">
        <RoundTracker />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-1 space-y-4">
            <PartyPanel />
            <EncounterAxesPanel />
            <TraitTriggerPanel />
          </div>

          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {encounter.round.monsters.map((m) => (
                <MonsterCard key={m.id} monster={m} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
