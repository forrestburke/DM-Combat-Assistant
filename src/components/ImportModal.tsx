import { useState } from 'react';
import { AlertTriangle, Upload, X } from 'lucide-react';
import { useEncounterStore } from '../store/useEncounterStore';
import { MarkdownParseError, parseEncounterMarkdown } from '../lib/parser';

export function ImportModal({ onClose }: { onClose: () => void }) {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const setEncounter = useEncounterStore((s) => s.setEncounter);

  function handleImport() {
    try {
      const encounter = parseEncounterMarkdown(text);
      setEncounter(encounter);
      setError(null);
      onClose();
    } catch (e) {
      setError(e instanceof MarkdownParseError ? e.message : 'Unexpected error while parsing markdown.');
    }
  }

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-2xl rounded-lg border border-zinc-800 bg-zinc-900 shadow-xl">
        <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
          <h2 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
            <Upload size={16} className="text-cyan-400" />
            Import Encounter Markdown
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-200 transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-4 py-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste the encounter markdown here (see src/data/sampleEncounter.md for the expected format)…"
            className="w-full h-72 resize-none rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-mono text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-cyan-700"
          />

          {error && (
            <div className="mt-3 flex items-start gap-2 rounded-md border border-red-800 bg-red-950/60 px-3 py-2">
              <AlertTriangle size={14} className="text-red-400 mt-0.5 shrink-0" />
              <p className="text-xs text-red-300 leading-relaxed">{error}</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-zinc-800 px-4 py-3">
          <button
            onClick={onClose}
            className="rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={!text.trim()}
            className="rounded-md border border-cyan-800 bg-cyan-950 px-3 py-1.5 text-xs text-cyan-300 hover:bg-cyan-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Parse & Load
          </button>
        </div>
      </div>
    </div>
  );
}
