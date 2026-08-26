import { apiClient } from './client'
import {
  SavingsAccount,
  SavingsTransaction,
  CreateSavingsTransactionInput,
  SavingsTransactionListParams,
  PaginatedResult,
} from '@/types'

export async function getSavingsAccounts(
  params: { memberId?: string; organizationId?: string } = {}
): Promise<SavingsAccount[]> {
  const { data } = await apiClient.get<{ success: boolean; data: SavingsAccount[] }>(
    '/savings/accounts',
    { params }
  )
  return data.data
}

export async function getSavingsTransactions(
  params: SavingsTransactionListParams = {}
): Promise<PaginatedResult<SavingsTransaction>> {
  const { data } = await apiClient.get<{ success: boolean; data: PaginatedResult<SavingsTransaction> }>(
    '/savings/transactions',
    { params }
  )
  return data.data
}

export async function createSavingsTransaction(
  payload: CreateSavingsTransactionInput
): Promise<SavingsTransaction> {
  const { data } = await apiClient.post<{ success: boolean; data: SavingsTransaction }>(
    '/savings/transactions',
    payload
  )
  return data.data
}
