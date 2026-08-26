import { apiClient } from './client'
import {
  Penalty,
  CreatePenaltyInput,
  UpdatePenaltyInput,
  PenaltyListParams,
  PaginatedResult,
} from '@/types'

export async function getPenalties(
  params: PenaltyListParams = {}
): Promise<PaginatedResult<Penalty>> {
  const { data } = await apiClient.get<{ success: boolean; data: PaginatedResult<Penalty> }>(
    '/penalties',
    { params }
  )
  return data.data
}

export async function getPenalty(penaltyId: string): Promise<Penalty> {
  const { data } = await apiClient.get<{ success: boolean; data: Penalty }>(
    `/penalties/${penaltyId}`
  )
  return data.data
}

export async function createPenalty(payload: CreatePenaltyInput): Promise<Penalty> {
  const { data } = await apiClient.post<{ success: boolean; data: Penalty }>(
    '/penalties',
    payload
  )
  return data.data
}

export async function updatePenalty(
  penaltyId: string,
  payload: UpdatePenaltyInput
): Promise<Penalty> {
  const { data } = await apiClient.patch<{ success: boolean; data: Penalty }>(
    `/penalties/${penaltyId}`,
    payload
  )
  return data.data
}

export async function cancelPenalty(penaltyId: string): Promise<Penalty> {
  const { data } = await apiClient.patch<{ success: boolean; data: Penalty }>(
    `/penalties/${penaltyId}/cancel`,
    {}
  )
  return data.data
}

export async function deletePenalty(penaltyId: string): Promise<void> {
  await apiClient.delete(`/penalties/${penaltyId}`)
}
