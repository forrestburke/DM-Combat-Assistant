import type { AbilityScores, AttackProfile, MonsterCombatState, MonsterStyle, TacticalPosture } from '../types/encounter';

export type { MonsterStyle };

/**
 * A local compendium of common SRD 5.2 (CC-BY-4.0) monster baselines.
 * We can't live-fetch from 5etools.com: the artifact/browser sandbox blocks
 * cross-origin fetches, and most of 5etools' bestiary content is drawn from
 * full published books rather than the freely-licensed SRD, so mirroring it
 * programmatically isn't something we can do legally or technically here.
 * This list covers the common SRD monsters instead — enough to autofill
 * on the fly, with every field editable/overridable so you can enter exact
 * numbers from 5etools, your own books, or homebrew by hand.
 */
export interface SrdMonsterTemplate {
  name: string;
  baseType: string;
  ac: number;
  hpMax: number;
  speed: number;
  abilityScores: AbilityScores;
  passives: string[];
  attacks: AttackProfile[];
  style: MonsterStyle;
  environments: string[];
}

const A = (str: number, dex: number, con: number, int: number, wis: number, cha: number): AbilityScores => ({
  str,
  dex,
  con,
  int,
  wis,
  cha,
});

export const srdMonsters: SrdMonsterTemplate[] = [
  {
    name: 'Goblin', baseType: 'Small Humanoid (Goblinoid)', ac: 15, hpMax: 7, speed: 30,
    abilityScores: A(8, 14, 10, 10, 8, 8), passives: ['Nimble Escape'],
    attacks: [
      { name: 'Scimitar', type: 'Melee', formula: '1d20+4 vs AC', reachOrRange: '5 ft', damage: '1d6+2 [slashing]' },
      { name: 'Shortbow', type: 'Ranged', formula: '1d20+4 vs AC', reachOrRange: '80/320 ft', damage: '1d6+2 [piercing]' },
    ], style: 'skirmisher', environments: ['forest', 'hills', 'ruins', 'road'],
  },
  {
    name: 'Hobgoblin', baseType: 'Medium Humanoid (Goblinoid)', ac: 18, hpMax: 11, speed: 30,
    abilityScores: A(13, 12, 12, 10, 10, 9), passives: ['Martial Advantage'],
    attacks: [
      { name: 'Longsword', type: 'Melee', formula: '1d20+3 vs AC', reachOrRange: '5 ft', damage: '1d8+1 [slashing]' },
      { name: 'Longbow', type: 'Ranged', formula: '1d20+3 vs AC', reachOrRange: '150/600 ft', damage: '1d8+1 [piercing]' },
    ], style: 'leader', environments: ['ruins', 'dungeon', 'road', 'hills'],
  },
  {
    name: 'Bugbear', baseType: 'Medium Humanoid (Goblinoid)', ac: 16, hpMax: 27, speed: 30,
    abilityScores: A(15, 14, 13, 8, 11, 9), passives: ['Surprise Attack'],
    attacks: [
      { name: 'Morningstar', type: 'Melee', formula: '1d20+4 vs AC', reachOrRange: '5 ft (10 ft w/ reach)', damage: '2d8+2 [piercing]' },
      { name: 'Javelin', type: 'Ranged', formula: '1d20+4 vs AC', reachOrRange: '30/120 ft', damage: '1d6+2 [piercing]' },
    ], style: 'brute', environments: ['forest', 'cave', 'ruins'],
  },
  {
    name: 'Kobold', baseType: 'Small Dragon-kin', ac: 12, hpMax: 5, speed: 30,
    abilityScores: A(7, 15, 9, 8, 7, 8), passives: ['Pack Tactics', 'Sunlight Sensitivity'],
    attacks: [
      { name: 'Dagger', type: 'Melee', formula: '1d20+4 vs AC', reachOrRange: '5 ft', damage: '1d4+2 [piercing]' },
      { name: 'Sling', type: 'Ranged', formula: '1d20+4 vs AC', reachOrRange: '30/120 ft', damage: '1d4+2 [bludgeoning]' },
    ], style: 'pack', environments: ['cave', 'dungeon'],
  },
  {
    name: 'Orc', baseType: 'Medium Humanoid', ac: 13, hpMax: 15, speed: 30,
    abilityScores: A(16, 12, 16, 7, 11, 10), passives: ['Aggressive'],
    attacks: [
      { name: 'Greataxe', type: 'Melee', formula: '1d20+5 vs AC', reachOrRange: '5 ft', damage: '1d12+3 [slashing]' },
      { name: 'Javelin', type: 'Ranged', formula: '1d20+5 vs AC', reachOrRange: '30/120 ft', damage: '1d6+3 [piercing]' },
    ], style: 'brute', environments: ['hills', 'mountain', 'forest', 'ruins'],
  },
  {
    name: 'Bandit', baseType: 'Medium Humanoid', ac: 12, hpMax: 11, speed: 30,
    abilityScores: A(11, 12, 12, 10, 10, 10), passives: [],
    attacks: [
      { name: 'Scimitar', type: 'Melee', formula: '1d20+3 vs AC', reachOrRange: '5 ft', damage: '1d6+1 [slashing]' },
      { name: 'Light Crossbow', type: 'Ranged', formula: '1d20+3 vs AC', reachOrRange: '80/320 ft', damage: '1d8+1 [piercing]' },
    ], style: 'skirmisher', environments: ['road', 'urban', 'forest', 'hills'],
  },
  {
    name: 'Bandit Captain', baseType: 'Medium Humanoid', ac: 15, hpMax: 65, speed: 30,
    abilityScores: A(15, 16, 14, 14, 11, 14), passives: [],
    attacks: [
      { name: 'Scimitar (x2)', type: 'Melee', formula: '1d20+5 vs AC', reachOrRange: '5 ft', damage: '1d6+3 [slashing]' },
      { name: 'Dagger', type: 'Ranged', formula: '1d20+5 vs AC', reachOrRange: '20/60 ft', damage: '1d4+3 [piercing]' },
    ], style: 'leader', environments: ['road', 'urban', 'forest', 'hills'],
  },
  {
    name: 'Skeleton', baseType: 'Medium Undead', ac: 13, hpMax: 13, speed: 30,
    abilityScores: A(10, 14, 15, 6, 8, 5), passives: ['Vulnerable to bludgeoning'],
    attacks: [
      { name: 'Shortsword', type: 'Melee', formula: '1d20+4 vs AC', reachOrRange: '5 ft', damage: '1d6+2 [piercing]' },
      { name: 'Shortbow', type: 'Ranged', formula: '1d20+4 vs AC', reachOrRange: '80/320 ft', damage: '1d6+2 [piercing]' },
    ], style: 'mindless', environments: ['dungeon', 'crypt', 'ruins', 'undead'],
  },
  {
    name: 'Zombie', baseType: 'Medium Undead', ac: 8, hpMax: 22, speed: 20,
    abilityScores: A(13, 6, 16, 3, 6, 5), passives: ['Undead Fortitude'],
    attacks: [{ name: 'Slam', type: 'Melee', formula: '1d20+3 vs AC', reachOrRange: '5 ft', damage: '1d6+1 [bludgeoning]' }], style: 'mindless', environments: ['dungeon', 'crypt', 'ruins', 'undead', 'swamp'],
  },
  {
    name: 'Ghoul', baseType: 'Medium Undead', ac: 12, hpMax: 22, speed: 30,
    abilityScores: A(13, 15, 16, 7, 10, 6), passives: [],
    attacks: [
      { name: 'Bite', type: 'Melee', formula: '1d20+2 vs AC', reachOrRange: '5 ft', damage: '2d6 [piercing]' },
      { name: 'Claws', type: 'Melee', formula: '1d20+4 vs AC', reachOrRange: '5 ft', damage: '2d4+2 [slashing] (paralysis, DC 10 Con)' },
    ], style: 'brute', environments: ['crypt', 'dungeon', 'undead', 'ruins'],
  },
  {
    name: 'Ghast', baseType: 'Medium Undead', ac: 13, hpMax: 36, speed: 30,
    abilityScores: A(16, 17, 10, 11, 10, 8), passives: ['Stench', 'Turning Defiance'],
    attacks: [
      { name: 'Bite', type: 'Melee', formula: '1d20+5 vs AC', reachOrRange: '5 ft', damage: '2d6+3 [piercing]' },
      { name: 'Claws', type: 'Melee', formula: '1d20+5 vs AC', reachOrRange: '5 ft', damage: '2d4+3 [slashing] (paralysis, DC 10 Con)' },
    ], style: 'brute', environments: ['crypt', 'dungeon', 'undead'],
  },
  {
    name: 'Wolf', baseType: 'Medium Beast', ac: 13, hpMax: 11, speed: 40,
    abilityScores: A(12, 15, 12, 3, 12, 6), passives: ['Pack Tactics', 'Keen Hearing and Smell'],
    attacks: [{ name: 'Bite', type: 'Melee', formula: '1d20+4 vs AC', reachOrRange: '5 ft', damage: '2d4+2 [piercing] (knockdown, DC 11 Str)' }], style: 'pack', environments: ['forest', 'tundra', 'hills', 'mountain'],
  },
  {
    name: 'Dire Wolf', baseType: 'Large Beast', ac: 14, hpMax: 22, speed: 50,
    abilityScores: A(17, 15, 15, 3, 12, 7), passives: ['Pack Tactics', 'Keen Hearing and Smell'],
    attacks: [{ name: 'Bite', type: 'Melee', formula: '1d20+5 vs AC', reachOrRange: '5 ft', damage: '2d6+3 [piercing] (knockdown, DC 13 Str)' }], style: 'pack', environments: ['forest', 'tundra', 'mountain'],
  },
  {
    name: 'Giant Rat', baseType: 'Small Beast', ac: 12, hpMax: 7, speed: 30,
    abilityScores: A(7, 15, 11, 2, 10, 4), passives: ['Pack Tactics', 'Keen Smell'],
    attacks: [{ name: 'Bite', type: 'Melee', formula: '1d20+4 vs AC', reachOrRange: '5 ft', damage: '1d4+2 [piercing]' }], style: 'pack', environments: ['urban', 'sewer', 'dungeon'],
  },
  {
    name: 'Giant Spider', baseType: 'Large Beast', ac: 14, hpMax: 26, speed: 30,
    abilityScores: A(14, 16, 12, 2, 11, 4), passives: ['Spider Climb', 'Web Sense', 'Web Walker'],
    attacks: [
      { name: 'Bite', type: 'Melee', formula: '1d20+5 vs AC', reachOrRange: '5 ft', damage: '1d8+3 [piercing] + 2d8 [poison] (DC 11 Con half)' },
      { name: 'Web (recharge 5-6)', type: 'Ranged', formula: '1d20+5 vs AC', reachOrRange: '30/60 ft', damage: 'Restrained until DC 12 Str/escape' },
    ], style: 'ambusher', environments: ['forest', 'cave', 'dungeon'],
  },
  {
    name: 'Giant Scorpion', baseType: 'Large Beast', ac: 15, hpMax: 52, speed: 40,
    abilityScores: A(15, 13, 15, 1, 9, 3), passives: [],
    attacks: [
      { name: 'Claw (x2)', type: 'Melee', formula: '1d20+4 vs AC', reachOrRange: '5 ft', damage: '1d8+2 [bludgeoning] (grapple)' },
      { name: 'Sting', type: 'Melee', formula: '1d20+4 vs AC', reachOrRange: '5 ft', damage: '1d10+2 [piercing] + 4d10 [poison] (DC 12 Con half)' },
    ], style: 'brute', environments: ['desert', 'cave'],
  },
  {
    name: 'Ogre', baseType: 'Large Giant', ac: 11, hpMax: 59, speed: 40,
    abilityScores: A(19, 8, 16, 5, 7, 7), passives: [],
    attacks: [{ name: 'Greatclub', type: 'Melee', formula: '1d20+6 vs AC', reachOrRange: '5 ft', damage: '2d8+4 [bludgeoning]' }], style: 'brute', environments: ['hills', 'mountain', 'cave', 'forest'],
  },
  {
    name: 'Owlbear', baseType: 'Large Monstrosity', ac: 13, hpMax: 59, speed: 40,
    abilityScores: A(20, 12, 17, 3, 12, 7), passives: ['Keen Sight and Smell'],
    attacks: [
      { name: 'Claws', type: 'Melee', formula: '1d20+7 vs AC', reachOrRange: '5 ft', damage: '2d8+5 [slashing]' },
      { name: 'Beak', type: 'Melee', formula: '1d20+7 vs AC', reachOrRange: '5 ft', damage: '1d10+5 [piercing]' },
    ], style: 'brute', environments: ['forest', 'mountain'],
  },
  {
    name: 'Gelatinous Cube', baseType: 'Large Ooze', ac: 6, hpMax: 84, speed: 15,
    abilityScores: A(14, 3, 20, 1, 6, 1), passives: ['Ooze Cube (transparent)', 'Engulf'],
    attacks: [{ name: 'Pseudopod', type: 'Melee', formula: '1d20+4 vs AC', reachOrRange: '5 ft', damage: '3d6 [acid]' }], style: 'mindless', environments: ['dungeon', 'cave'],
  },
  {
    name: 'Mimic', baseType: 'Medium Monstrosity (Shapechanger)', ac: 12, hpMax: 58, speed: 15,
    abilityScores: A(17, 12, 15, 5, 13, 8), passives: ['Shapechanger', 'False Appearance', 'Grappler'],
    attacks: [
      { name: 'Pseudopod', type: 'Melee', formula: '1d20+5 vs AC', reachOrRange: '5 ft', damage: '1d8+3 [bludgeoning] + adhesive' },
      { name: 'Bite', type: 'Melee', formula: '1d20+5 vs AC', reachOrRange: '5 ft', damage: '1d8+3 [piercing] + 1d8 [acid]' },
    ], style: 'ambusher', environments: ['dungeon', 'cave', 'ruins'],
  },
  {
    name: 'Ettin', baseType: 'Large Giant', ac: 12, hpMax: 85, speed: 40,
    abilityScores: A(21, 8, 17, 6, 10, 8), passives: ['Two Heads', 'Wakeful'],
    attacks: [
      { name: 'Battleaxe (x2)', type: 'Melee', formula: '1d20+7 vs AC', reachOrRange: '5 ft', damage: '2d8+5 [slashing]' },
    ], style: 'brute', environments: ['hills', 'mountain', 'cave'],
  },
  {
    name: 'Troll', baseType: 'Large Giant', ac: 15, hpMax: 84, speed: 30,
    abilityScores: A(18, 13, 20, 7, 9, 7), passives: ['Regeneration', 'Keen Smell'],
    attacks: [
      { name: 'Claw (x2)', type: 'Melee', formula: '1d20+7 vs AC', reachOrRange: '5 ft', damage: '2d6+4 [slashing]' },
      { name: 'Bite', type: 'Melee', formula: '1d20+7 vs AC', reachOrRange: '5 ft', damage: '2d6+4 [piercing]' },
    ], style: 'brute', environments: ['swamp', 'forest', 'mountain', 'cave'],
  },
  {
    name: 'Hobgoblin Captain', baseType: 'Medium Humanoid (Goblinoid)', ac: 17, hpMax: 45, speed: 30,
    abilityScores: A(15, 14, 14, 12, 10, 13), passives: ['Martial Advantage'],
    attacks: [
      { name: 'Glaive (x2)', type: 'Melee', formula: '1d20+4 vs AC', reachOrRange: '10 ft', damage: '1d10+2 [slashing]' },
    ], style: 'leader', environments: ['ruins', 'dungeon', 'road', 'hills'],
  },
];

function generatePostures(style: MonsterStyle): { postureA: TacticalPosture; postureB: TacticalPosture; postureC: TacticalPosture } {
  switch (style) {
    case 'brute':
      return {
        postureA: {
          trigger: 'Combat starts or a target is within reach',
          movement: 'Close distance directly to the nearest or most threatening target.',
          action: 'Attack with its heaviest weapon.',
          bonusAction: 'None.',
          tags: ['Focus: Nearest threat'],
        },
        postureB: {
          trigger: 'Below 25% HP',
          movement: 'Holds ground — brutes rarely retreat.',
          action: 'Keeps attacking the target that hurt it most, even at disadvantage.',
          bonusAction: 'None.',
          tags: ['No morale', 'Fights to the end'],
        },
        postureC: {
          trigger: 'A choke point or doorway is available',
          movement: 'Plants itself in the choke point to block the party.',
          action: 'Attacks whoever tries to push past.',
          bonusAction: 'None.',
          tags: ['Zone control'],
        },
      };
    case 'skirmisher':
      return {
        postureA: {
          trigger: 'Target is isolated or below half HP',
          movement: 'Moves to flank or gain cover on the softest visible target.',
          action: 'Attacks with melee if adjacent, otherwise uses its ranged option.',
          bonusAction: 'None — commits to the attack.',
          tags: ['Focus: Soft target'],
        },
        postureB: {
          trigger: 'Below 30% HP or half the group already down',
          movement: 'Disengages and retreats toward cover or allies.',
          action: 'Ranged attack only if a clean shot is available without provoking.',
          bonusAction: 'Hide or Disengage if available.',
          tags: ['Disengage', 'Hide'],
        },
        postureC: {
          trigger: 'An objective or ally needs protecting',
          movement: 'Repositions to block the path to whatever it is guarding.',
          action: 'Attacks whoever is closing on the objective.',
          bonusAction: 'None.',
          tags: ['Zone control', 'Protect objective'],
        },
      };
    case 'pack':
      return {
        postureA: {
          trigger: 'Two or more pack members can reach the same target',
          movement: 'Circles to flank alongside packmates for advantage.',
          action: 'Attacks the target the pack has surrounded.',
          bonusAction: 'None.',
          tags: ['Pack Tactics', 'Flanking'],
        },
        postureB: {
          trigger: 'Half the pack is down or it is alone',
          movement: 'Falls back toward remaining packmates rather than fighting solo.',
          action: 'Only attacks if cornered.',
          bonusAction: 'None.',
          tags: ['Regroup'],
        },
        postureC: {
          trigger: 'Prey is fleeing',
          movement: 'Drives the target toward the rest of the pack.',
          action: 'Harassing attacks to slow escape rather than finish the kill alone.',
          bonusAction: 'None.',
          tags: ['Herd', 'Cut off retreat'],
        },
      };
    case 'mindless':
      return {
        postureA: {
          trigger: 'A living creature is within range',
          movement: 'Shambles directly toward the nearest living creature, ignoring danger.',
          action: 'Attacks whatever is closest.',
          bonusAction: 'None.',
          tags: ['No tactics', 'No morale'],
        },
        postureB: {
          trigger: 'Reduced to 0 HP',
          movement: 'N/A — has no self-preservation instinct and never willingly retreats.',
          action: 'Continues attacking until destroyed.',
          bonusAction: 'None.',
          tags: ['Fights to destruction'],
        },
        postureC: {
          trigger: 'Multiple living creatures are present',
          movement: 'Moves toward whichever is nearest, regardless of threat level.',
          action: 'Attacks without prioritizing softer or harder targets.',
          bonusAction: 'None.',
          tags: ['No target priority'],
        },
      };
    case 'ambusher':
      return {
        postureA: {
          trigger: 'Undetected and a target passes within range',
          movement: 'Waits hidden until the trigger, then strikes the most isolated target.',
          action: 'Opens with its strongest attack while it has surprise.',
          bonusAction: 'None.',
          tags: ['Ambush', 'Surprise'],
        },
        postureB: {
          trigger: 'Discovered early or below 30% HP',
          movement: 'Withdraws into terrain, water, webbing, or its disguised form.',
          action: 'Only attacks opportunistically while retreating.',
          bonusAction: 'Uses any escape/mobility trait available.',
          tags: ['Disengage', 'Reset ambush'],
        },
        postureC: {
          trigger: 'A second target wanders near',
          movement: 'Uses terrain or disguise to bait the new target closer.',
          action: 'Switches targets to whichever creature is most isolated.',
          bonusAction: 'None.',
          tags: ['Bait', 'Re-target'],
        },
      };
    case 'leader':
      return {
        postureA: {
          trigger: 'Allies are still standing',
          movement: 'Stays with the group, positioning to support rather than lead the charge.',
          action: 'Attacks alongside allies, focusing fire on whatever they have targeted.',
          bonusAction: "Directs an ally's attack or movement if it has the trait for it.",
          tags: ['Focus fire', 'Command'],
        },
        postureB: {
          trigger: 'Isolated or below 40% HP',
          movement: 'Falls back behind remaining allies.',
          action: 'Fights defensively, avoiding being cut off.',
          bonusAction: 'None.',
          tags: ['Protect self', 'Retreat behind allies'],
        },
        postureC: {
          trigger: 'Allies are routing or half the group is down',
          movement: 'Moves to rally fleeing allies or covers their retreat.',
          action: 'Attacks whoever is pursuing its allies.',
          bonusAction: 'Issues a rally/retreat order if it has one.',
          tags: ['Rally', 'Cover retreat'],
        },
      };
  }
}

export { generatePostures };

export function findSrdMonster(query: string): SrdMonsterTemplate | undefined {
  const q = query.trim().toLowerCase();
  if (!q) return undefined;
  return (
    srdMonsters.find((m) => m.name.toLowerCase() === q) ??
    srdMonsters.find((m) => m.name.toLowerCase().startsWith(q))
  );
}

export interface MonsterOverrides {
  ac?: number;
  hpMax?: number;
  speed?: number;
  abilityScores?: Partial<AbilityScores>;
}

let customMonsterCounter = 0;
const defaultAbilities: AbilityScores = { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 };

export function buildMonsterFromName(rawName: string, idSuffix: string, overrides?: MonsterOverrides): MonsterCombatState {
  // Strip a trailing " 1", " 2", etc. so numbered instances (e.g. "Zombie 2") still match "Zombie".
  const lookupName = rawName.trim().replace(/\s+\d+$/, '');
  const template = findSrdMonster(lookupName);
  const name = rawName.trim() || 'Unnamed Creature';

  const base = template
    ? {
        baseType: template.baseType,
        ac: template.ac,
        hpMax: template.hpMax,
        speed: template.speed,
        abilityScores: template.abilityScores,
        passives: template.passives,
        attacks: template.attacks,
        style: template.style as MonsterStyle,
      }
    : {
        baseType: 'Custom entry — no SRD match',
        ac: 10,
        hpMax: 10,
        speed: 30,
        abilityScores: defaultAbilities,
        passives: [] as string[],
        attacks: [] as AttackProfile[],
        style: 'skirmisher' as MonsterStyle,
      };

  const ac = overrides?.ac ?? base.ac;
  const hpMax = overrides?.hpMax ?? base.hpMax;
  const speed = overrides?.speed ?? base.speed;
  const abilityScores = { ...base.abilityScores, ...overrides?.abilityScores };

  if (!template) customMonsterCounter += 1;

  return {
    id: template ? `${template.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${idSuffix}` : `custom-${idSuffix}-${customMonsterCounter}`,
    name,
    baseType: base.baseType,
    ac,
    hpCurrent: hpMax,
    hpMax,
    speed,
    abilityScores,
    passives: base.passives,
    attacks: base.attacks,
    reactionCue: template
      ? 'Autofilled from the local SRD compendium — review before running.'
      : 'No stat block found in the local SRD compendium — stats entered manually.',
    style: base.style,
    ...generatePostures(base.style),
    activePosture: 'A',
    isDefeated: false,
  };
}
