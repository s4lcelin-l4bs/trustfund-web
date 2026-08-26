import { apiClient } from './client'
import { AccountingJournalEntry, AccountingBalance } from '@/types'

export async function getJournalEntries(
  params: { startDate?: string; endDate?: string } = {}
): Promise<AccountingJournalEntry[]> {
  const { data } = await apiClient.get<{ success: boolean; data: AccountingJournalEntry[] }>(
    '/accounting/journal',
    { params }
  )
  return data.data
}

export async function getBalanceSheet(
  params: { startDate?: string; endDate?: string } = {}
): Promise<AccountingBalance[]> {
  const { data } = await apiClient.get<{ success: boolean; data: AccountingBalance[] }>(
    '/accounting/balance',
    { params }
  )
  return data.data
}
