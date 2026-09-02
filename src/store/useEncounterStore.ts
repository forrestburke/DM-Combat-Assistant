import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Encounter, MonsterCombatState, PartyMember } from '../types/encounter';
import { sampleEncounter } from '../data/sampleEncounter';

interface EncounterStore {
  encounter: Encounter;
  setEncounter: (encounter: Encounter) => void;
  loadSample: () => void;

  // Monster actions
  updateMonsterHp: (monsterId: string, delta: number) => void;
  setMonsterPosture: (monsterId: string, posture: 'A' | 'B' | 'C') => void;
  toggleMonsterDefeated: (monsterId: string) => void;
  updateMonster: (monsterId: string, patch: Partial<MonsterCombatState>) => void;

  // Party actions
  updatePartyHp: (memberId: string, delta: number) => void;
  updateParty: (memberId: string, patch: Partial<PartyMember>) => void;

  // Round control
  nextTurn: () => void;
  nextRound: () => void;
  resetRound: () => void;
}

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
    { name: 'dm-combat-engine-storage' }
  )
);
