import { apiClient } from './client'
import {
  Fine,
  CreateFineInput,
  UpdateFineInput,
  FineListParams,
  PaginatedResult,
} from '@/types'

export async function getFines(
  params: FineListParams = {}
): Promise<PaginatedResult<Fine>> {
  const { data } = await apiClient.get<{ success: boolean; data: PaginatedResult<Fine> }>(
    '/fines',
    { params }
  )
  return data.data
}

export async function getFine(fineId: string): Promise<Fine> {
  const { data } = await apiClient.get<{ success: boolean; data: Fine }>(
    `/fines/${fineId}`
  )
  return data.data
}

export async function createFine(payload: CreateFineInput): Promise<Fine> {
  const { data } = await apiClient.post<{ success: boolean; data: Fine }>(
    '/fines',
    payload
  )
  return data.data
}

export async function updateFine(
  fineId: string,
  payload: UpdateFineInput
): Promise<Fine> {
  const { data } = await apiClient.patch<{ success: boolean; data: Fine }>(
    `/fines/${fineId}`,
    payload
  )
  return data.data
}

export async function deleteFine(fineId: string): Promise<void> {
  await apiClient.delete(`/fines/${fineId}`)
}
