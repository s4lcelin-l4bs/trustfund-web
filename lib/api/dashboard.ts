import { apiClient } from './client'

export interface DashboardStats {
  cashBalance: number
  totalMembers: number
  activeMembersCount: number
  totalContributions: number
  totalExpenses: number
  activeLoans: number
  pendingPenalties: { count: number; total: number }
  activeCycle: { id: string; name: string; nextTurnOrder: any[] } | null
  recentActivities: {
    id: string
    type: string
    amount: number
    status: string
    date: string
    reference?: string
    member?: { firstName: string; lastName: string } | null
  }[]
  monthlyStats: { date: string; amount: number }[]
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const { data } = await apiClient.get<{ success: boolean; data: DashboardStats }>(
    '/dashboard/stats'
  )
  return data.data
}
