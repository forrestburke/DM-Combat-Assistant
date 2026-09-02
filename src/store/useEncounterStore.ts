import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Encounter, EncounterAxes, MonsterCombatState, PartyMember, SceneContext } from '../types/encounter';
import { sampleEncounter } from '../data/sampleEncounter';

interface EncounterStore {
  encounter: Encounter;
  setEncounter: (encounter: Encounter) => void;
  loadSample: () => void;

  // Scene notes (free-text, on-the-fly context)
  setScene: (patch: Partial<SceneContext>) => void;
  setAxes: (axes: EncounterAxes) => void;

  // Monster actions
  updateMonsterHp: (monsterId: string, delta: number) => void;
  setMonsterPosture: (monsterId: string, posture: 'A' | 'B' | 'C') => void;
  toggleMonsterDefeated: (monsterId: string) => void;
  updateMonster: (monsterId: string, patch: Partial<MonsterCombatState>) => void;
  addMonster: (monster: MonsterCombatState) => void;
  removeMonster: (monsterId: string) => void;

  // Party actions
  updatePartyHp: (memberId: string, delta: number) => void;
  updateParty: (memberId: string, patch: Partial<PartyMember>) => void;
  addPartyMember: (member: PartyMember) => void;
  removePartyMember: (memberId: string) => void;

  // Round control
  nextTurn: () => void;
  nextRound: () => void;
  resetRound: () => void;
}

const emptyScene: SceneContext = { environment: '', terrain: '', combatSituation: '', timeOfDay: '' };

function computeAutoPosture(m: MonsterCombatState): 'A' | 'B' | 'C' {
  if (m.hpMax <= 0) return m.activePosture;
  const pct = m.hpCurrent / m.hpMax;
  if (pct <= 0.3) return 'B';
  return m.activePosture === 'B' ? 'A' : m.activePosture;
}

export const useEncounterStore = create<EncounterStore>()(
  persist(
    (set) => ({
      encounter: sampleEncounter,

      setEncounter: (encounter) => set({ encounter }),
      loadSample: () => set({ encounter: sampleEncounter }),

      setScene: (patch) =>
        set((state) => ({
          encounter: { ...state.encounter, scene: { ...state.encounter.scene, ...patch } },
        })),

      setAxes: (axes) => set((state) => ({ encounter: { ...state.encounter, axes } })),

      updateMonsterHp: (monsterId, delta) =>
        set((state) => ({
          encounter: {
            ...state.encounter,
            round: {
              ...state.encounter.round,
              monsters: state.encounter.round.monsters.map((m) => {
                if (m.id !== monsterId) return m;
                const hpCurrent = Math.max(0, Math.min(m.hpMax, m.hpCurrent + delta));
                const isDefeated = hpCurrent <= 0;
                const next = { ...m, hpCurrent, isDefeated };
                return { ...next, activePosture: computeAutoPosture(next) };
              }),
            },
          },
        })),

      setMonsterPosture: (monsterId, posture) =>
        set((state) => ({
          encounter: {
            ...state.encounter,
            round: {
              ...state.encounter.round,
              monsters: state.encounter.round.monsters.map((m) =>
                m.id === monsterId ? { ...m, activePosture: posture } : m
              ),
            },
          },
        })),

      toggleMonsterDefeated: (monsterId) =>
        set((state) => ({
          encounter: {
            ...state.encounter,
            round: {
              ...state.encounter.round,
              monsters: state.encounter.round.monsters.map((m) =>
                m.id === monsterId ? { ...m, isDefeated: !m.isDefeated } : m
              ),
            },
          },
        })),

      updateMonster: (monsterId, patch) =>
        set((state) => ({
          encounter: {
            ...state.encounter,
            round: {
              ...state.encounter.round,
              monsters: state.encounter.round.monsters.map((m) =>
                m.id === monsterId ? { ...m, ...patch } : m
              ),
            },
          },
        })),

      addMonster: (monster) =>
        set((state) => ({
          encounter: {
            ...state.encounter,
            round: { ...state.encounter.round, monsters: [...state.encounter.round.monsters, monster] },
          },
        })),

      removeMonster: (monsterId) =>
        set((state) => {
          const monsters = state.encounter.round.monsters.filter((m) => m.id !== monsterId);
          const count = Math.max(monsters.filter((m) => !m.isDefeated).length, 1);
          return {
            encounter: {
              ...state.encounter,
              round: {
                ...state.encounter.round,
                monsters,
                activeTurnIndex: state.encounter.round.activeTurnIndex % count,
              },
            },
          };
        }),

      updatePartyHp: (memberId, delta) =>
        set((state) => ({
          encounter: {
            ...state.encounter,
            party: state.encounter.party.map((p) =>
              p.id === memberId
                ? { ...p, hpCurrent: Math.max(0, Math.min(p.hpMax, p.hpCurrent + delta)) }
                : p
            ),
          },
        })),

      updateParty: (memberId, patch) =>
        set((state) => ({
          encounter: {
            ...state.encounter,
            party: state.encounter.party.map((p) => (p.id === memberId ? { ...p, ...patch } : p)),
          },
        })),

      addPartyMember: (member) =>
        set((state) => ({ encounter: { ...state.encounter, party: [...state.encounter.party, member] } })),

      removePartyMember: (memberId) =>
        set((state) => ({
          encounter: { ...state.encounter, party: state.encounter.party.filter((p) => p.id !== memberId) },
        })),

      nextTurn: () =>
        set((state) => {
          const living = state.encounter.round.monsters.filter((m) => !m.isDefeated);
          const count = Math.max(living.length, 1);
          const nextIndex = (state.encounter.round.activeTurnIndex + 1) % count;
          return {
            encounter: {
              ...state.encounter,
              round: { ...state.encounter.round, activeTurnIndex: nextIndex },
            },
          };
        }),

      nextRound: () =>
        set((state) => ({
          encounter: {
            ...state.encounter,
            round: {
              ...state.encounter.round,
              roundNumber: state.encounter.round.roundNumber + 1,
              activeTurnIndex: 0,
            },
          },
        })),

      resetRound: () =>
        set((state) => ({
          encounter: {
            ...state.encounter,
            round: { ...state.encounter.round, roundNumber: 1, activeTurnIndex: 0 },
          },
        })),
    }),
    {
      name: 'dm-combat-engine-storage',
      version: 2,
      migrate: (persisted) => {
        const state = persisted as { encounter?: Encounter } | undefined;
        if (state?.encounter && !state.encounter.scene) {
          state.encounter.scene = { ...emptyScene };
        }
        if (state?.encounter?.round?.monsters) {
          state.encounter.round.monsters = state.encounter.round.monsters.map((m) =>
            m.abilityScores ? m : { ...m, abilityScores: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 } }
          );
        }
        return state as EncounterStore;
      },
    }
  )
);
