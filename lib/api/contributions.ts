import { apiClient } from './client'
import {
  Contribution,
  CreateContributionInput,
  UpdateContributionInput,
  ContributionListParams,
  PaginatedResult,
} from '@/types'

export async function getContributions(
  params: ContributionListParams = {}
): Promise<PaginatedResult<Contribution>> {
  const { data } = await apiClient.get<{ success: boolean; data: PaginatedResult<Contribution> }>(
    '/contributions',
    { params }
  )
  return data.data
}

export async function getContribution(contributionId: string): Promise<Contribution> {
  const { data } = await apiClient.get<{ success: boolean; data: Contribution }>(
    `/contributions/${contributionId}`
  )
  return data.data
}

export async function createContribution(payload: CreateContributionInput): Promise<Contribution> {
  const { data } = await apiClient.post<{ success: boolean; data: Contribution }>(
    '/contributions',
    payload
  )
  return data.data
}

export async function updateContribution(
  contributionId: string,
  payload: UpdateContributionInput
): Promise<Contribution> {
  const { data } = await apiClient.patch<{ success: boolean; data: Contribution }>(
    `/contributions/${contributionId}`,
    payload
  )
  return data.data
}

export async function deleteContribution(contributionId: string): Promise<void> {
  await apiClient.delete(`/contributions/${contributionId}`)
}
