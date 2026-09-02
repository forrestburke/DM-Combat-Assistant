import type { EncounterAxes, MonsterCombatState, MonsterStyle, SceneContext } from '../types/encounter';

/**
 * Drafts Encounter Axes (Win Condition, Battlefield Optimizer, Hazard/Clock)
 * from whatever monsters are actually in the fight plus the free-text scene
 * notes. It's a starting point built from each monster's tactical archetype
 * ("Monsters Know What They're Doing"-style reasoning) — edit the result,
 * don't treat it as final.
 */
const PRESETS: Record<MonsterStyle, { win: string; winDesc: string; morale: string; optimizer: string; optDesc: string; benefit: string; hazard: string; trigger: string }> = {
  brute: {
    win: 'Grind Them Down',
    winDesc: 'These are frontline bruisers with no fear response — they close distance and swing until something dies.',
    morale: 'No morale check. They fight until reduced to 0 HP; expect the party to need attrition tools (healing, disengage) rather than a clean retreat to bank on.',
    optimizer: 'Choke the Approach',
    optDesc: 'Their advantage is raw damage in melee — the party wants to avoid getting surrounded and use terrain to fight them one at a time.',
    benefit: 'A doorway, hallway, or narrow ledge lets one PC hold the line while the brutes queue up instead of piling on.',
    hazard: 'Second Wave',
    trigger: 'If the fight runs past round 4-5, consider a reinforcement or environmental hazard (falling debris, a collapsing floor) so the fight doesn\'t become pure attrition math.',
  },
  skirmisher: {
    win: 'Bleed Them Out, Don\'t Corner Them',
    winDesc: 'These skirmishers hit soft targets and retreat rather than committing to a stand-up fight.',
    morale: 'Once half the group is down, survivors disengage and try to break contact rather than fight to the last.',
    optimizer: 'Deny Them Cover',
    optDesc: 'Their tactic depends on cover and mobility to hit-and-run. Open ground or good PC positioning to cut off retreat lanes neutralizes them fast.',
    benefit: 'Terrain with sightlines (no cover, no easy hiding spots) forces them into a straight fight, which favors the party.',
    hazard: 'They Call For Help',
    trigger: 'If a skirmisher escapes early, treat that as a countdown — it may return with reinforcements after a few rounds.',
  },
  pack: {
    win: 'Break Up the Flank',
    winDesc: 'This group wins through numbers advantage (Pack Tactics) — isolate one PC and gang up.',
    morale: 'Once roughly half the pack is down, survivors fall back toward each other rather than fighting alone.',
    optimizer: 'Don\'t Get Surrounded',
    optDesc: 'Open ground lets the pack circle a target for advantage. A wall at your back or a narrow space denies them the flank.',
    benefit: 'Any terrain that limits how many of them can reach one PC simultaneously removes their main edge.',
    hazard: 'The Pack Regroups',
    trigger: 'If the party splits up, the pack will redirect toward whichever PC is most isolated on its next move.',
  },
  mindless: {
    win: 'This Is Not a Fair Fight to Win by Attrition',
    winDesc: 'No tactics, no morale, no self-preservation — these keep coming until destroyed. The real threat is being ground down by numbers or a clock, not any one creature.',
    morale: 'None. They never retreat, never negotiate, and never stop.',
    optimizer: 'Control the Chokepoint, Not the Room',
    optDesc: 'Since they have no tactics of their own, the terrain question is really about how many can reach the party at once.',
    benefit: 'A corridor or doorway lets the party fight them one or two at a time indefinitely, turning an "endless" threat into a manageable one.',
    hazard: 'The Real Clock Is Elsewhere',
    trigger: 'Consider pairing this with a hazard/clock unrelated to the monsters themselves (a ritual, a collapsing structure, a rising tide) — that\'s usually the actual pressure in a fight against mindless foes.',
  },
  ambusher: {
    win: 'Win the Ambush, Not the Slugfest',
    winDesc: 'The threat is entirely front-loaded: surprise and the first strike. Once discovered, it looks for an exit rather than fighting fair.',
    morale: 'Withdraws into terrain/disguise once it loses the element of surprise or drops below ~30% HP, rather than committing to a stand-up fight.',
    optimizer: 'Deny It a Second Ambush',
    optDesc: 'Its danger resets if it can hide and re-approach. Terrain that removes hiding spots (light, open ground, high ground for the party) keeps it from resetting.',
    benefit: 'Once spotted, keeping line of sight on it denies its main trick entirely.',
    hazard: 'It Baits a Second Target',
    trigger: 'If it survives its opening ambush, expect it to try to lure a separated party member rather than re-engage the whole group.',
  },
  leader: {
    win: 'Cut Off the Head',
    winDesc: 'This group fights in a coordinated way as long as its leader is alive and visible — removing or isolating the leader collapses their tactics.',
    morale: 'If the leader drops or is cut off, remaining allies lose direction and may break and run rather than keep fighting.',
    optimizer: 'Isolate the Leader',
    optDesc: 'The leader stays protected behind allies by default. Terrain or tactics that let the party single it out (a flanking route, a ranged angle) short-circuits the whole group\'s coordination.',
    benefit: 'Any position that gives the party a clean shot at the leader without going through its allies first is worth taking.',
    hazard: 'Rally Point',
    trigger: 'If the leader is threatened, expect it to issue a retreat/rally order rather than accept the loss — that\'s the moment the fight either breaks open or stalls.',
  },
};

export function suggestAxes(monsters: MonsterCombatState[], scene: SceneContext): EncounterAxes {
  const living = monsters.filter((m) => !m.isDefeated);
  const tally = new Map<MonsterStyle, number>();
  living.forEach((m) => {
    if (m.style) tally.set(m.style, (tally.get(m.style) ?? 0) + 1);
  });
  const dominant = [...tally.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'skirmisher';
  const preset = PRESETS[dominant];

  const names = living.map((m) => m.name).join(', ') || 'the monsters';
  const terrain = scene.terrain.trim();
  const situation = scene.combatSituation.trim();

  return {
    winCondition: {
      title: preset.win,
      description: `${preset.winDesc}${situation ? ` Context: ${situation}.` : ''} (Roster: ${names})`,
      moraleThresholds: preset.morale,
    },
    battlefieldOptimizer: {
      title: preset.optimizer,
      description: `${preset.optDesc}${terrain ? ` Terrain on hand: ${terrain}.` : ' No terrain notes yet — add some in Scene Notes for a sharper suggestion.'}`,
      mechanicalBenefit: preset.benefit,
    },
    hazardOrClock: {
      title: preset.hazard,
      initiativeCount: 20,
      triggerEffect: preset.trigger,
    },
  };
}
