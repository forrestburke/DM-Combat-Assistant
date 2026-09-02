import type {
  AbilityScores,
  AttackProfile,
  Encounter,
  EncounterAxes,
  MonsterCombatState,
  MonsterStyle,
  PartyMember,
  RoundState,
  SceneContext,
  TacticalPosture,
  TraitDetail,
  TraitTrigger,
} from '../types/encounter';

export class MarkdownParseError extends Error {}

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'item'
  );
}

/** Splits markdown into top-level lines, stripping blank trailing whitespace. */
function toLines(md: string): string[] {
  return md.replace(/\r\n/g, '\n').split('\n');
}

interface Block {
  heading: string;
  level: number;
  lines: string[];
}

/** Groups lines under a given heading level into blocks, based on the next heading of that level or shallower. */
function splitByHeading(lines: string[], level: number): Block[] {
  const marker = '#'.repeat(level) + ' ';
  const blocks: Block[] = [];
  let current: Block | null = null;

  for (const line of lines) {
    const isThisLevel = line.startsWith(marker);
    const isShallower = /^#{1,6} /.test(line) && line.match(/^#+/)![0].length < level;

    if (isThisLevel) {
      if (current) blocks.push(current);
      current = { heading: line.slice(marker.length).trim(), level, lines: [] };
    } else if (isShallower) {
      if (current) blocks.push(current);
      current = null;
    } else if (current) {
      current.lines.push(line);
    }
  }
  if (current) blocks.push(current);
  return blocks;
}

/** Parses "- Key: Value" bullet lines into a map keyed by lowercase, space-stripped key. */
function parseBullets(lines: string[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const line of lines) {
    const match = line.match(/^-\s*([A-Za-z][A-Za-z0-9 /_-]*)\s*:\s*(.*)$/);
    if (!match) continue;
    const key = match[1].trim().toLowerCase().replace(/[\s_-]+/g, '');
    map.set(key, match[2].trim());
  }
  return map;
}

/** Splits "Name (Inner, possibly (nested)) " on the outermost trailing parenthetical. */
function splitTrailingParen(heading: string): { name: string; inner: string } | null {
  const trimmed = heading.trim();
  if (!trimmed.endsWith(')')) return null;
  let depth = 0;
  for (let i = trimmed.length - 1; i >= 0; i--) {
    const ch = trimmed[i];
    if (ch === ')') depth++;
    else if (ch === '(') {
      depth--;
      if (depth === 0) {
        return { name: trimmed.slice(0, i).trim(), inner: trimmed.slice(i + 1, -1).trim() };
      }
    }
  }
  return null;
}

function requireField(map: Map<string, string>, key: string, context: string): string {
  const value = map.get(key);
  if (value === undefined) {
    throw new MarkdownParseError(`Missing required field "${key}" in ${context}.`);
  }
  return value;
}

function parseHp(raw: string, context: string): { current: number; max: number } {
  const match = raw.match(/^\s*(\d+)\s*\/\s*(\d+)\s*$/);
  if (!match) {
    throw new MarkdownParseError(`Invalid HP format "${raw}" in ${context}. Expected "current/max".`);
  }
  return { current: Number(match[1]), max: Number(match[2]) };
}

function parseInt10(raw: string, field: string, context: string): number {
  const n = Number(raw);
  if (!Number.isFinite(n)) {
    throw new MarkdownParseError(`Invalid number "${raw}" for "${field}" in ${context}.`);
  }
  return n;
}

function parseList(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function parsePartyMember(block: Block): PartyMember {
  const context = `party member "${block.heading}"`;
  const fields = parseBullets(block.lines);
  const role = requireField(fields, 'role', context);
  const validRoles = ['Druid', 'Rogue', 'Paladin', 'Cleric', 'Warlock', 'Custom'];
  const { current: hpCurrent, max: hpMax } = parseHp(requireField(fields, 'hp', context), context);

  return {
    id: slugify(block.heading),
    name: block.heading,
    role: (validRoles.includes(role) ? role : 'Custom') as PartyMember['role'],
    ac: parseInt10(requireField(fields, 'ac', context), 'AC', context),
    hpCurrent,
    hpMax,
    tacticalPriority: requireField(fields, 'tacticalpriority', context),
    conditions: parseList(fields.get('conditions')),
    referenceLink: fields.get('referencelink') || fields.get('dndbeyond') || undefined,
  };
}

function parseScene(block: Block | undefined): SceneContext {
  if (!block) return { environment: '', terrain: '', combatSituation: '', timeOfDay: '' };
  const fields = parseBullets(block.lines);
  return {
    environment: fields.get('environment') ?? '',
    terrain: fields.get('terrain') ?? '',
    combatSituation: fields.get('combatsituation') ?? '',
    timeOfDay: fields.get('timeofday') ?? '',
  };
}

function parseAxes(sections: Block[]): EncounterAxes {
  const winBlock = sections.find((b) => /^win condition:/i.test(b.heading));
  const optimizerBlock = sections.find((b) => /^battlefield optimizer:/i.test(b.heading));
  const hazardBlock = sections.find((b) => /^hazard\s*\/?\s*clock:/i.test(b.heading));

  if (!winBlock) throw new MarkdownParseError('Missing "Win Condition:" section under Encounter Axes.');
  if (!optimizerBlock)
    throw new MarkdownParseError('Missing "Battlefield Optimizer:" section under Encounter Axes.');
  if (!hazardBlock) throw new MarkdownParseError('Missing "Hazard/Clock:" section under Encounter Axes.');

  const winFields = parseBullets(winBlock.lines);
  const optFields = parseBullets(optimizerBlock.lines);
  const hazardFields = parseBullets(hazardBlock.lines);

  const initiativeRaw = requireField(hazardFields, 'initiativecount', 'Hazard/Clock section');
  const initiativeCount: number | 'Round End' =
    initiativeRaw.trim().toLowerCase() === 'round end' ? 'Round End' : parseInt10(initiativeRaw, 'Initiative Count', 'Hazard/Clock section');

  return {
    winCondition: {
      title: winBlock.heading.replace(/^win condition:\s*/i, '').trim(),
      description: requireField(winFields, 'description', 'Win Condition section'),
      moraleThresholds: requireField(winFields, 'moralethresholds', 'Win Condition section'),
    },
    battlefieldOptimizer: {
      title: optimizerBlock.heading.replace(/^battlefield optimizer:\s*/i, '').trim(),
      description: requireField(optFields, 'description', 'Battlefield Optimizer section'),
      mechanicalBenefit: requireField(optFields, 'mechanicalbenefit', 'Battlefield Optimizer section'),
    },
    hazardOrClock: {
      title: hazardBlock.heading.replace(/^hazard\s*\/?\s*clock:\s*/i, '').trim(),
      initiativeCount,
      triggerEffect: requireField(hazardFields, 'triggereffect', 'Hazard/Clock section'),
    },
  };
}

function parseTraitTrigger(block: Block): TraitTrigger {
  const context = `trait trigger "${block.heading}"`;
  const split = splitTrailingParen(block.heading);
  if (!split) {
    throw new MarkdownParseError(
      `Trait trigger heading "${block.heading}" must be in the form "Name (Creature)".`
    );
  }
  const fields = parseBullets(block.lines);

  return {
    id: slugify(block.heading),
    name: split.name,
    creatureName: split.inner,
    triggerCondition: requireField(fields, 'triggercondition', context),
    mechanicalEffect: requireField(fields, 'mechanicaleffect', context),
    formulaOrDC: requireField(fields, 'formula/dc', context),
  };
}

function parseAttacks(lines: string[], context: string): AttackProfile[] {
  const validTypes = ['Melee', 'Ranged', 'Save'];
  return lines
    .map((l) => l.trim())
    .filter((l) => l.startsWith('-'))
    .map((line) => {
      const parts = line
        .slice(1)
        .split('|')
        .map((p) => p.trim());
      if (parts.length < 5) {
        throw new MarkdownParseError(
          `Attack line "${line}" in ${context} must have format: Name | Type | Formula | Range | Damage [| Notes]`
        );
      }
      const [name, type, formula, reachOrRange, damage, notes] = parts;
      if (!validTypes.includes(type)) {
        throw new MarkdownParseError(
          `Attack "${name}" in ${context} has invalid type "${type}". Expected Melee, Ranged, or Save.`
        );
      }
      return {
        name,
        type: type as AttackProfile['type'],
        formula,
        reachOrRange,
        damage,
        notes: notes || undefined,
      };
    });
}

function parseTraitDetails(lines: string[]): TraitDetail[] {
  return lines
    .map((l) => l.trim())
    .filter((l) => l.startsWith('-'))
    .map((line) => {
      const m = line.slice(1).trim().match(/^([^:]+):\s*(.*)$/);
      if (!m) throw new MarkdownParseError(`Trait line "${line}" must have format: Name: full description text`);
      return { name: m[1].trim(), description: m[2].trim() };
    });
}

function parsePosture(block: Block, context: string): TacticalPosture {
  const fields = parseBullets(block.lines);
  return {
    trigger: requireField(fields, 'trigger', context),
    movement: requireField(fields, 'movement', context),
    action: requireField(fields, 'action', context),
    bonusAction: fields.get('bonusaction'),
    tags: parseList(fields.get('tags')),
  };
}

const defaultAbilityScores: AbilityScores = { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 };
const validStyles: MonsterStyle[] = ['brute', 'skirmisher', 'pack', 'mindless', 'ambusher', 'leader'];

function parseAbilityScores(raw: string | undefined, context: string): AbilityScores {
  if (!raw) return { ...defaultAbilityScores };
  const scores = { ...defaultAbilityScores };
  for (const part of raw.split(',')) {
    const m = part.trim().match(/^(STR|DEX|CON|INT|WIS|CHA)\s+(\d+)/i);
    if (!m) throw new MarkdownParseError(`Invalid ability score entry "${part.trim()}" in ${context}. Expected "STR 16, DEX 10, ...".`);
    const key = m[1].toLowerCase() as keyof AbilityScores;
    scores[key] = Number(m[2]);
  }
  return scores;
}

function parseMonster(block: Block): MonsterCombatState {
  const context = `monster "${block.heading}"`;
  const split = splitTrailingParen(block.heading);
  if (!split) {
    throw new MarkdownParseError(`Monster heading "${block.heading}" must be in the form "Name (Base Type)".`);
  }
  const name = split.name;
  const baseType = split.inner;

  const fields = parseBullets(block.lines);
  const { current: hpCurrent, max: hpMax } = parseHp(requireField(fields, 'hp', context), context);

  const subBlocks = splitByHeading(block.lines, 4);
  const traitsBlock = subBlocks.find((b) => /^traits$/i.test(b.heading));
  const attacksBlock = subBlocks.find((b) => /^attacks$/i.test(b.heading));
  const postureABlock = subBlocks.find((b) => /^posture a:/i.test(b.heading));
  const postureBBlock = subBlocks.find((b) => /^posture b:/i.test(b.heading));
  const postureCBlock = subBlocks.find((b) => /^posture c:/i.test(b.heading));

  if (!attacksBlock) throw new MarkdownParseError(`Missing "#### Attacks" section in ${context}.`);
  if (!postureABlock) throw new MarkdownParseError(`Missing "#### Posture A:" section in ${context}.`);
  if (!postureBBlock) throw new MarkdownParseError(`Missing "#### Posture B:" section in ${context}.`);
  if (!postureCBlock) throw new MarkdownParseError(`Missing "#### Posture C:" section in ${context}.`);

  return {
    id: slugify(name),
    name,
    baseType,
    ac: parseInt10(requireField(fields, 'ac', context), 'AC', context),
    hpCurrent,
    hpMax,
    speed: parseInt10(requireField(fields, 'speed', context), 'Speed', context),
    abilityScores: parseAbilityScores(fields.get('abilityscores'), context),
    savingThrows: fields.get('savingthrows') || undefined,
    style: (() => {
      const raw = fields.get('style')?.toLowerCase();
      return raw && validStyles.includes(raw as MonsterStyle) ? (raw as MonsterStyle) : undefined;
    })(),
    passives: parseList(fields.get('passives')),
    traitDetails: traitsBlock ? parseTraitDetails(traitsBlock.lines) : undefined,
    attacks: parseAttacks(attacksBlock.lines, context),
    reactionCue: requireField(fields, 'reactioncue', context),
    postureA: parsePosture(postureABlock, `${context} Posture A`),
    postureB: parsePosture(postureBBlock, `${context} Posture B`),
    postureC: parsePosture(postureCBlock, `${context} Posture C`),
    activePosture: 'A',
    isDefeated: false,
  };
}

/**
 * Parses a single "### Name (Base Type)" monster block (the same format
 * used under "## Monsters") without needing a full encounter document.
 * Used by the "paste a stat block" flow.
 */
export function parseSingleMonsterMarkdown(monsterMarkdown: string): MonsterCombatState {
  const blocks = splitByHeading(toLines(monsterMarkdown), 3);
  if (blocks.length === 0) {
    throw new MarkdownParseError('No "### Name (Base Type)" heading found. Start the block with e.g. "### Zombie Plague Spreader (Medium Undead)".');
  }
  return parseMonster(blocks[0]);
}

/**
 * Parses the DM Combat Assistant markdown format into an Encounter.
 * Expected structure:
 *   # Encounter: <name>
 *   ## Party
 *   ### <Member Name>  (bullets: Role, AC, HP, Tactical Priority, Conditions)
 *   ## Encounter Axes
 *   ### Win Condition: <title>  (bullets: Description, Morale Thresholds)
 *   ### Battlefield Optimizer: <title>  (bullets: Description, Mechanical Benefit)
 *   ### Hazard/Clock: <title>  (bullets: Initiative Count, Trigger Effect)
 *   ## Trait Triggers
 *   ### <Name> (<Creature>)  (bullets: Trigger Condition, Mechanical Effect, Formula/DC)
 *   ## Monsters
 *   ### <Name> (<Base Type>)  (bullets: AC, HP, Speed, Passives, Reaction Cue)
 *   #### Attacks  ("- Name | Type | Formula | Range | Damage" lines)
 *   #### Posture A: Offensive  (bullets: Trigger, Movement, Action, Bonus Action, Tags)
 *   #### Posture B: Defensive  (same bullets)
 *   #### Posture C: Axis Interaction  (same bullets)
 */
export function parseEncounterMarkdown(markdown: string): Encounter {
  const lines = toLines(markdown);

  const titleLine = lines.find((l) => l.startsWith('# '));
  if (!titleLine) {
    throw new MarkdownParseError('Missing top-level heading, e.g. "# Encounter: <name>".');
  }
  const name = titleLine.replace(/^#\s*(Encounter:)?\s*/i, '').trim();
  if (!name) {
    throw new MarkdownParseError('Encounter name is empty. Use "# Encounter: <name>".');
  }

  const topSections = splitByHeading(lines, 2);
  const sceneSection = topSections.find((b) => /^scene$/i.test(b.heading));
  const partySection = topSections.find((b) => /^party$/i.test(b.heading));
  const axesSection = topSections.find((b) => /^encounter axes$/i.test(b.heading));
  const traitsSection = topSections.find((b) => /^trait triggers$/i.test(b.heading));
  const monstersSection = topSections.find((b) => /^monsters$/i.test(b.heading));

  if (!partySection) throw new MarkdownParseError('Missing "## Party" section.');
  if (!axesSection) throw new MarkdownParseError('Missing "## Encounter Axes" section.');
  if (!monstersSection) throw new MarkdownParseError('Missing "## Monsters" section.');

  const party = splitByHeading(partySection.lines, 3).map(parsePartyMember);
  if (party.length === 0) throw new MarkdownParseError('Party section has no members (expected "### <Name>" entries).');

  const axes = parseAxes(splitByHeading(axesSection.lines, 3));

  const traitTriggers = traitsSection ? splitByHeading(traitsSection.lines, 3).map(parseTraitTrigger) : [];

  const monsterBlocks = splitByHeading(monstersSection.lines, 3);
  if (monsterBlocks.length === 0) {
    throw new MarkdownParseError('Monsters section has no entries (expected "### <Name> (<Base Type>)" entries).');
  }
  const monsters = monsterBlocks.map(parseMonster);

  const round: RoundState = {
    roundNumber: 1,
    initiativeCount: typeof axes.hazardOrClock.initiativeCount === 'number' ? axes.hazardOrClock.initiativeCount : 20,
    activeTurnIndex: 0,
    monsters,
  };

  return {
    id: slugify(name),
    name,
    scene: parseScene(sceneSection),
    party,
    axes,
    traitTriggers,
    round,
  };
}
