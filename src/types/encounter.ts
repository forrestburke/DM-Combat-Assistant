export interface PartyMember {
  id: string;
  name: string;
  role: 'Druid' | 'Rogue' | 'Paladin' | 'Cleric' | 'Warlock' | 'Custom';
  ac: number;
  hpCurrent: number;
  hpMax: number;
  tacticalPriority: string; // e.g., "Disrupt Concentration", "Soft target"
  conditions: string[];
}

export interface EncounterAxes {
  winCondition: {
    title: string;
    description: string;
    moraleThresholds: string;
  };
  battlefieldOptimizer: {
    title: string;
    description: string;
    mechanicalBenefit: string;
  };
  hazardOrClock: {
    title: string;
    initiativeCount: number | 'Round End';
    triggerEffect: string;
  };
}

export interface TraitTrigger {
  id: string;
  name: string;
  creatureName: string;
  triggerCondition: string;
  mechanicalEffect: string;
  formulaOrDC: string;
}

export interface AttackProfile {
  name: string;
  type: 'Melee' | 'Ranged' | 'Save';
  formula: string; // e.g., "1d20+6 vs AC"
  reachOrRange: string;
  damage: string; // e.g., "2d4+3 [slashing]"
  notes?: string;
}

export interface TacticalPosture {
  trigger: string;
  movement: string;
  action: string;
  bonusAction?: string;
  tags?: string[]; // e.g., ["Advantage: Pack Tactics", "Disengage"]
}

export interface MonsterCombatState {
  id: string;
  name: string;
  baseType: string;
  ac: number;
  hpCurrent: number;
  hpMax: number;
  speed: number;
  passives: string[];
  attacks: AttackProfile[];
  reactionCue: string;
  postureA: TacticalPosture; // Offensive / Pressing Advantage
  postureB: TacticalPosture; // Defensive / Under Pressure
  postureC: TacticalPosture; // Axis Interaction / Hazard Control
  activePosture: 'A' | 'B' | 'C';
  isDefeated: boolean;
}

export interface RoundState {
  roundNumber: number;
  initiativeCount: number;
  activeTurnIndex: number;
  monsters: MonsterCombatState[];
}

export interface Encounter {
  id: string;
  name: string;
  party: PartyMember[];
  axes: EncounterAxes;
  traitTriggers: TraitTrigger[];
  round: RoundState;
}
