import { apiClient } from './client'
import {
  Loan,
  CreateLoanInput,
  UpdateLoanInput,
  LoanListParams,
  PaginatedResult,
} from '@/types'

export async function getLoans(
  params: LoanListParams = {}
): Promise<PaginatedResult<Loan>> {
  const { data } = await apiClient.get<{ success: boolean; data: PaginatedResult<Loan> }>(
    '/loans',
    { params }
  )
  return data.data
}

export async function getLoan(loanId: string): Promise<Loan> {
  const { data } = await apiClient.get<{ success: boolean; data: Loan }>(
    `/loans/${loanId}`
  )
  return data.data
}

export async function createLoan(payload: CreateLoanInput): Promise<Loan> {
  const { data } = await apiClient.post<{ success: boolean; data: Loan }>(
    '/loans',
    payload
  )
  return data.data
}

export async function updateLoan(
  loanId: string,
  payload: UpdateLoanInput
): Promise<Loan> {
  const { data } = await apiClient.patch<{ success: boolean; data: Loan }>(
    `/loans/${loanId}`,
    payload
  )
  return data.data
}

export async function approveLoan(loanId: string, amountApproved: number): Promise<Loan> {
  return updateLoan(loanId, { status: 'approved', amountApproved, validationDate: new Date().toISOString() })
}

export async function disburseLoan(loanId: string): Promise<Loan> {
  const { data } = await apiClient.patch<{ success: boolean; data: Loan }>(
    `/loans/${loanId}/disburse`,
    {}
  )
  return data.data
}

export async function deleteLoan(loanId: string): Promise<void> {
  await apiClient.delete(`/loans/${loanId}`)
}
