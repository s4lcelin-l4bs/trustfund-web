import { create } from 'zustand'
import { Group, GroupMember, Cycle, Transaction, PayoutTurn } from '@/types'

interface GroupState {
  // Données
  groups: Group[]
  activeGroup: Group | null
  activeGroupMembers: GroupMember[]
  activeCycle: Cycle | null
  activeTurn: PayoutTurn | null
  transactions: Transaction[]
  totalCollected: number
  totalExpected: number
  isLoading: boolean
  error: string | null

  // Actions
  setGroups: (groups: Group[]) => void
  setActiveGroup: (group: Group) => void
  setActiveGroupMembers: (members: GroupMember[]) => void
  setActiveCycle: (cycle: Cycle) => void
  setActiveTurn: (turn: PayoutTurn) => void
  setTransactions: (transactions: Transaction[]) => void
  setTotals: (collected: number, expected: number) => void
  addGroup: (group: Group) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

const initialState = {
  groups: [],
  activeGroup: null,
  activeGroupMembers: [],
  activeCycle: null,
  activeTurn: null,
  transactions: [],
  totalCollected: 0,
  totalExpected: 0,
  isLoading: false,
  error: null,
}

export const useGroupStore = create<GroupState>((set) => ({
  ...initialState,

  setGroups: (groups) => set({ groups }),

  setActiveGroup: (group) => set({ activeGroup: group }),

  setActiveGroupMembers: (members) => set({ activeGroupMembers: members }),

  setActiveCycle: (cycle) => set({ activeCycle: cycle }),

  setActiveTurn: (turn) => set({ activeTurn: turn }),

  setTransactions: (transactions) => set({ transactions }),

  setTotals: (collected, expected) => set({
    totalCollected: collected,
    totalExpected: expected,
  }),

  addGroup: (group) => set((state) => ({
    groups: [...state.groups, group],
  })),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  reset: () => set(initialState),
}))