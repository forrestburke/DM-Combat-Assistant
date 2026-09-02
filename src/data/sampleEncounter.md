# Encounter: Ambush at Blackroot Hollow

## Scene
- Environment: Old-growth forest, dusk light barely reaching the ground
- Terrain: Broken canopy, root snarls, a shallow creek bisecting the clearing
- Combat Situation: Ambush — goblins spring from cover as the party enters the hollow
- Time of Day: Dusk

## Party

### Sable
- Role: Rogue
- AC: 15
- HP: 27/27
- Tactical Priority: Soft target — low AC, no armor proficiency
- Conditions:

### Ithren
- Role: Druid
- AC: 14
- HP: 24/24
- Tactical Priority: Disrupt Concentration — Conjure Animals caster
- Conditions:

### Bram
- Role: Paladin
- AC: 18
- HP: 38/38
- Tactical Priority: Hard target — ignore unless isolated
- Conditions:

### Voss
- Role: Cleric
- AC: 16
- HP: 30/30
- Tactical Priority: Priority — removes conditions & heals
- Conditions:

## Encounter Axes

### Win Condition: Break the Warband, Not the Room
- Description: Goblins fight to protect the Hollow long enough for the shaman to finish the ritual. They are not suicidal raiders — they scout, harass, and flee.
- Morale Thresholds: At 50% of the band defeated, remaining goblins attempt to disengage on their next turn. At 75%, any goblin below half HP flees immediately.

### Battlefield Optimizer: Broken Canopy & Root Snarls
- Description: Dense undergrowth and low branches favor Small, agile creatures. Difficult terrain bands snake through the clearing.
- Mechanical Benefit: Goblins ignore difficult terrain from root snarls (Nimble Escape-adjacent trait). PCs moving through snarls spend 2ft per 1ft.

### Hazard/Clock: Ritual Completion Clock
- Initiative Count: 20
- Trigger Effect: At initiative count 20 (losing ties), the shaman advances the ritual by 1 stage. At Stage 3, a Blackroot Treant animates and joins on the goblins' side.

## Trait Triggers

### Nimble Escape (Goblin Skulker)
- Trigger Condition: End of goblin turn, if it took the Attack or Disengage action
- Mechanical Effect: May take the Disengage or Hide action as a bonus action.
- Formula/DC: No roll — automatic bonus action

### Sunlight Sensitivity (n/a — overcast) (Goblin Skulker)
- Trigger Condition: N/A this encounter (overcast canopy, dim light)
- Mechanical Effect: No penalty applies under current lighting.
- Formula/DC: —

### Ritual Surge (Blackroot Shaman)
- Trigger Condition: Shaman takes damage while concentrating on the ritual
- Mechanical Effect: Shaman must succeed on a Constitution save or lose concentration and the ritual clock resets to Stage 0.
- Formula/DC: DC 10 + damage taken (standard concentration save)

## Monsters

### Skarn (Goblin Skulker)
- AC: 15
- HP: 7/7
- Speed: 30
- Ability Scores: STR 8, DEX 14, CON 10, INT 10, WIS 8, CHA 8
- Style: skirmisher
- Passives: Nimble Escape, Pack Tactics (as ally variant)
- Reaction Cue: No reaction — spends bonus action on Nimble Escape instead.

#### Attacks
- Scimitar | Melee | 1d20+4 vs AC | 5 ft | 1d6+2 [slashing]
- Shortbow | Ranged | 1d20+4 vs AC | 80/320 ft | 1d6+2 [piercing]

#### Posture A: Offensive
- Trigger: Target is isolated or below half HP
- Movement: Move to flank the softest visible target, using cover from root snarls.
- Action: Attack with Scimitar if adjacent, otherwise Shortbow.
- Bonus Action: None — commit to the attack.
- Tags: Focus: Soft target, Advantage: Flanking (if used)

#### Posture B: Defensive
- Trigger: Below 30% HP or two allies already defeated
- Movement: Disengage and retreat 30ft toward the tree line, using terrain to break line of sight.
- Action: Shortbow attack only if a clean shot is available without provoking opportunity attacks.
- Bonus Action: Nimble Escape (Hide) after moving.
- Tags: Disengage, Hide

#### Posture C: Axis Interaction
- Trigger: Ritual clock at Stage 2+
- Movement: Reposition to block the party's path to the shaman.
- Action: Attack the nearest PC attempting to close on the shaman.
- Bonus Action: Nimble Escape if forced to retreat after.
- Tags: Zone control, Protect shaman

### Nix (Goblin Skulker)
- AC: 15
- HP: 7/7
- Speed: 30
- Ability Scores: STR 8, DEX 14, CON 10, INT 10, WIS 8, CHA 8
- Style: skirmisher
- Passives: Nimble Escape
- Reaction Cue: No reaction — spends bonus action on Nimble Escape instead.

#### Attacks
- Scimitar | Melee | 1d20+4 vs AC | 5 ft | 1d6+2 [slashing]
- Shortbow | Ranged | 1d20+4 vs AC | 80/320 ft | 1d6+2 [piercing]

#### Posture A: Offensive
- Trigger: Target is isolated or below half HP
- Movement: Move to flank the softest visible target, using cover from root snarls.
- Action: Attack with Scimitar if adjacent, otherwise Shortbow.
- Bonus Action: None — commit to the attack.
- Tags: Focus: Soft target

#### Posture B: Defensive
- Trigger: Below 30% HP or two allies already defeated
- Movement: Disengage and retreat 30ft toward the tree line.
- Action: Shortbow attack only if a clean shot is available.
- Bonus Action: Nimble Escape (Hide) after moving.
- Tags: Disengage, Hide

#### Posture C: Axis Interaction
- Trigger: Ritual clock at Stage 2+
- Movement: Reposition to block the party's path to the shaman.
- Action: Attack the nearest PC attempting to close on the shaman.
- Bonus Action: Nimble Escape if forced to retreat after.
- Tags: Zone control, Protect shaman

### Grutha the Blackroot Shaman (Goblin Boss (Ritual Caster))
- AC: 17
- HP: 21/21
- Speed: 30
- Ability Scores: STR 10, DEX 14, CON 12, INT 12, WIS 11, CHA 14
- Style: leader
- Passives: Ritual Surge, Pack Tactics
- Reaction Cue: Shield-adjacent trait: none. Reaction reserved for Ritual Surge concentration save context only.

#### Attacks
- Blighted Bolt | Save | DC 13 Dexterity save | 60 ft | 2d8 [necrotic] (half on save)
- Scimitar | Melee | 1d20+4 vs AC | 5 ft | 1d6+2 [slashing]

#### Posture A: Offensive
- Trigger: Ritual not yet interrupted, shaman unengaged
- Movement: Hold position near the ritual circle, staying behind the two skulkers.
- Action: Cast Blighted Bolt at the most threatening PC closing distance.
- Bonus Action: Advance the ritual clock (free action at count 20).
- Tags: Concentration, Protected by skulkers

#### Posture B: Defensive
- Trigger: Engaged in melee or below 50% HP
- Movement: Retreat behind the Blackroot Treant (if animated) or into root snarls.
- Action: Scimitar if cornered, otherwise Blighted Bolt at range.
- Bonus Action: None.
- Tags: Retreat, Protect concentration

#### Posture C: Axis Interaction
- Trigger: A PC is within 10ft of the ritual circle
- Movement: None — stand ground to keep concentration.
- Action: Blighted Bolt on the closest intruder to the circle.
- Bonus Action: Advance ritual clock if still count 20.
- Tags: Hold the circle, Concentration priority
