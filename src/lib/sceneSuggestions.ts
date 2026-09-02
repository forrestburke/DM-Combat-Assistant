import type { MonsterCombatState, SceneContext } from '../types/encounter';
import { buildMonsterFromName, srdMonsters } from '../data/srdMonsters';

const TAG_KEYWORDS: Record<string, string[]> = {
  forest: ['forest', 'wood', 'woods', 'tree', 'jungle', 'grove', 'hollow'],
  cave: ['cave', 'cavern', 'underground', 'tunnel', 'grotto'],
  dungeon: ['dungeon', 'corridor', 'vault', 'chamber', 'keep', 'fortress'],
  crypt: ['crypt', 'tomb', 'grave', 'mausoleum', 'catacomb'],
  ruins: ['ruin', 'ruins', 'temple', 'abandoned', 'derelict'],
  urban: ['city', 'town', 'street', 'alley', 'rooftop', 'tavern', 'urban', 'market'],
  sewer: ['sewer', 'drain', 'gutter'],
  road: ['road', 'path', 'trail', 'crossroads', 'highway'],
  hills: ['hill', 'hills'],
  mountain: ['mountain', 'peak', 'cliff', 'pass', 'summit'],
  desert: ['desert', 'dune', 'sand', 'wasteland'],
  swamp: ['swamp', 'marsh', 'bog', 'mire'],
  tundra: ['tundra', 'snow', 'ice', 'glacier', 'frozen'],
  water: ['water', 'river', 'lake', 'sea', 'ocean', 'flood', 'flooded', 'cellar', 'lagoon'],
};

const MAP_ELEMENTS: Record<string, string[]> = {
  forest: ['Broken canopy for partial cover/concealment', 'Root snarls or undergrowth as difficult terrain', 'A fallen tree or streambed as a natural chokepoint'],
  cave: ['Stalagmites/stalactites for cover and difficult terrain', 'Narrow tunnels as chokepoints', 'Uneven footing — consider a Dex save hazard for rushing in'],
  dungeon: ['Doorways and corridors as chokepoints', 'Rubble or collapsed sections as difficult terrain', 'A trap or pressure plate tied to the hazard/clock'],
  crypt: ['Sarcophagi or alcoves for cover and ambush spots', 'Narrow burial corridors as chokepoints', 'A ritual circle or altar as a possible hazard focus'],
  ruins: ['Broken walls and rubble for cover', 'A partially collapsed floor as dangerous terrain', 'Elevation changes from crumbled stairs'],
  urban: ['Rooftops and alleys for verticality and flanking routes', 'Crowds or stalls the party may need to avoid harming', 'Windows and doorways as entry/escape routes'],
  sewer: ['Narrow walkways over water as difficult terrain', 'Grates and tunnels as chokepoints', 'Poor visibility — consider dim light or darkness'],
  road: ['Wagons, carts, or roadside rocks for cover', 'Open ground favoring ranged combatants', 'A ditch or treeline flanking the road for ambushers'],
  hills: ['Elevation for a high-ground advantage', 'Loose scree as difficult terrain', 'Long sightlines favoring ranged attackers'],
  mountain: ['Narrow ledges and drop-offs — consider a fall hazard', 'Elevation and high-ground advantage', 'Wind or weather as an environmental factor'],
  desert: ['Dunes for concealment and difficult terrain', 'Heat/exhaustion as a slow-building hazard', 'Long sightlines favoring ranged attackers'],
  swamp: ['Difficult terrain from mud and standing water', 'Poor visibility from fog or reeds', 'A submerged hazard (quicksand, leeches)'],
  tundra: ['Difficult terrain from snow and ice', 'Cold as an environmental hazard', 'Poor visibility in whiteout conditions'],
  water: ['Difficult terrain / swimming rules in deep water', 'A current or rising tide as an escalating hazard', 'Limited footing for anyone who can\'t swim'],
};

const TIME_NOTES: Record<string, string> = {
  dusk: 'Dim light — consider granting the monsters (if they see in the dark) an edge over PCs without darkvision.',
  night: 'Darkness — torches/light sources become a tactical resource, and stealth approaches get easier for both sides.',
  midnight: 'Darkness — torches/light sources become a tactical resource, and stealth approaches get easier for both sides.',
  dawn: 'Low light and long shadows — a good excuse for an ambush the party almost walks past.',
  morning: 'Full visibility — no lighting penalty to plan around.',
  noon: 'Full visibility, and bright light if that matters to any creature\'s traits (e.g. Sunlight Sensitivity).',
  afternoon: 'Full visibility — no lighting penalty to plan around.',
};

function detectTags(scene: SceneContext): string[] {
  const text = `${scene.environment} ${scene.terrain} ${scene.combatSituation}`.toLowerCase();
  const tags: string[] = [];
  for (const [tag, keywords] of Object.entries(TAG_KEYWORDS)) {
    if (keywords.some((k) => text.includes(k))) tags.push(tag);
  }
  return tags;
}

export function suggestMapElements(scene: SceneContext): string[] {
  const tags = detectTags(scene);
  const elements: string[] = [];
  if (tags.length === 0) {
    elements.push('Add a few words to Environment or Terrain above for tailored suggestions.');
    elements.push('Generic default: aim for at least one chokepoint and one piece of cover per 2 PCs.');
  } else {
    tags.forEach((tag) => elements.push(...(MAP_ELEMENTS[tag] ?? [])));
  }
  const timeKey = scene.timeOfDay.trim().toLowerCase();
  const timeNote = Object.entries(TIME_NOTES).find(([k]) => timeKey.includes(k))?.[1];
  if (timeNote) elements.push(timeNote);
  return [...new Set(elements)];
}

export function generateEncounterRoster(scene: SceneContext): MonsterCombatState[] {
  const tags = detectTags(scene);
  const fallbackTags = ['forest', 'ruins', 'road'];
  const pool = tags.length > 0 ? srdMonsters.filter((m) => m.environments.some((e) => tags.includes(e))) : [];
  const candidates = pool.length > 0 ? pool : srdMonsters.filter((m) => m.environments.some((e) => fallbackTags.includes(e)));

  const anchors = candidates.filter((m) => m.style === 'brute' || m.style === 'leader').sort((a, b) => b.hpMax - a.hpMax);
  const swarms = candidates.filter((m) => m.style === 'skirmisher' || m.style === 'pack' || m.style === 'mindless' || m.style === 'ambusher');

  const suffix = Date.now();
  const roster: MonsterCombatState[] = [];

  const anchor = anchors[0];
  if (anchor) {
    roster.push(buildMonsterFromName(anchor.name, `${suffix}-anchor`));
  }

  const swarmPick = swarms.length > 0 ? swarms[Math.floor(Math.random() * swarms.length)] : candidates[0];
  if (swarmPick) {
    const count = anchor ? 2 : 3;
    for (let i = 0; i < count; i++) {
      roster.push(buildMonsterFromName(`${swarmPick.name} ${i + 1}`, `${suffix}-swarm-${i}`));
    }
  }

  if (roster.length === 0) {
    // Absolute fallback if the compendium filter produced nothing.
    roster.push(buildMonsterFromName('Goblin 1', `${suffix}-fb-0`));
    roster.push(buildMonsterFromName('Goblin 2', `${suffix}-fb-1`));
  }

  return roster;
}
