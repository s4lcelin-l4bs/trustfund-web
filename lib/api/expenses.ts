import { apiClient } from './client'
import {
  Expense,
  CreateExpenseInput,
  UpdateExpenseInput,
  ExpenseListParams,
  PaginatedResult,
} from '@/types'

export async function getExpenses(
  params: ExpenseListParams = {}
): Promise<PaginatedResult<Expense>> {
  const { data } = await apiClient.get<{ success: boolean; data: PaginatedResult<Expense> }>(
    '/expenses',
    { params }
  )
  return data.data
}

export async function getExpense(expenseId: string): Promise<Expense> {
  const { data } = await apiClient.get<{ success: boolean; data: Expense }>(
    `/expenses/${expenseId}`
  )
  return data.data
}

export async function createExpense(payload: CreateExpenseInput): Promise<Expense> {
  const { data } = await apiClient.post<{ success: boolean; data: Expense }>(
    '/expenses',
    payload
  )
  return data.data
}

export async function updateExpense(
  expenseId: string,
  payload: UpdateExpenseInput
): Promise<Expense> {
  const { data } = await apiClient.patch<{ success: boolean; data: Expense }>(
    `/expenses/${expenseId}`,
    payload
  )
  return data.data
}

export async function deleteExpense(expenseId: string): Promise<void> {
  await apiClient.delete(`/expenses/${expenseId}`)
}

export async function uploadExpenseReceipt(
  expenseId: string,
  file: File
): Promise<{ receiptUrl: string }> {
  const formData = new FormData()
  formData.append('receipt', file)
  const { data } = await apiClient.post<{ success: boolean; data: { receiptUrl: string } }>(
    `/expenses/${expenseId}/receipt`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  )
  return data.data
}
