import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { parseEncounterMarkdown } from '../src/lib/parser';
import { sampleEncounter } from '../src/data/sampleEncounter';

const dir = path.dirname(fileURLToPath(import.meta.url));
const md = readFileSync(path.join(dir, '../src/data/sampleEncounter.md'), 'utf-8');

const parsed = parseEncounterMarkdown(md);

// Sample data hand-assigns ids like "pc-1"/"mon-1"; the parser slugifies names instead.
// Both are valid id schemes, so strip ids before comparing structural content.
function stripIds(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stripIds);
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      if (k === 'id') continue;
      out[k] = stripIds(v);
    }
    return out;
  }
  return value;
}

function assertDeepEqual(a: unknown, b: unknown, label: string) {
  const sa = JSON.stringify(a, null, 2);
  const sb = JSON.stringify(b, null, 2);
  if (sa !== sb) {
    console.error(`MISMATCH: ${label}`);
    console.error('--- parsed ---');
    console.error(sa);
    console.error('--- expected ---');
    console.error(sb);
    process.exitCode = 1;
  } else {
    console.log(`OK: ${label}`);
  }
}

assertDeepEqual(stripIds(parsed), stripIds(sampleEncounter), 'full encounter round-trip (ignoring id scheme)');

if (process.exitCode !== 1) {
  console.log('\nParser round-trip verified successfully.');
}
