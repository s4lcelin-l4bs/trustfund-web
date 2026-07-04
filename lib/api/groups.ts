export interface GroupSummary {
  id: string
  name: string
  contributionAmount: number
  frequency: 'weekly' | 'monthly'
  memberCount: number
  maxMembers: number
  myPaymentStatus: 'confirmed' | 'pending' | 'failed'
  nextTurnBeneficiaryName: string
  nextTurnDate: string
  isMyTurnNext: boolean
  totalCollected: number
  totalExpected: number
}

const mockGroups: GroupSummary[] = [
  {
    id: 'group-1',
    name: 'Tontine bureau IUT',
    contributionAmount: 50000,
    frequency: 'monthly',
    memberCount: 12,
    maxMembers: 15,
    myPaymentStatus: 'confirmed',
    nextTurnBeneficiaryName: 'Marie T.',
    nextTurnDate: '2026-07-14',
    isMyTurnNext: false,
    totalCollected: 525000,
    totalExpected: 750000,
  },
  {
    id: 'group-2',
    name: 'Epargne famille',
    contributionAmount: 20000,
    frequency: 'weekly',
    memberCount: 6,
    maxMembers: 6,
    myPaymentStatus: 'pending',
    nextTurnBeneficiaryName: 'Vous',
    nextTurnDate: '2026-07-07',
    isMyTurnNext: true,
    totalCollected: 100000,
    totalExpected: 120000,
  },
  {
    id: 'group-3',
    name: 'Tontine amis campus',
    contributionAmount: 10000,
    frequency: 'monthly',
    memberCount: 8,
    maxMembers: 10,
    myPaymentStatus: 'pending',
    nextTurnBeneficiaryName: 'Paul M.',
    nextTurnDate: '2026-07-20',
    isMyTurnNext: false,
    totalCollected: 40000,
    totalExpected: 100000,
  },
]

export async function getMyGroupsApi(): Promise<GroupSummary[]> {
  await new Promise((resolve) => setTimeout(resolve, 1200))
  return mockGroups
}
