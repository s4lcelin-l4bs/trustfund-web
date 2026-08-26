import { apiClient } from './client'
import {
  OrganizationCycle,
  CreateOrganizationCycleInput,
  UpdateOrganizationCycleInput,
  OrganizationCycleListParams,
  PaginatedResult,
} from '@/types'

export async function getOrganizationCycles(
  organizationId: string,
  params: OrganizationCycleListParams = {}
): Promise<PaginatedResult<OrganizationCycle>> {
  const { data } = await apiClient.get<{ success: boolean; data: PaginatedResult<OrganizationCycle> }>(
    `/organizations/${organizationId}/cycles`,
    { params }
  )
  return data.data
}

export async function getOrganizationCycle(
  organizationId: string,
  cycleId: string
): Promise<OrganizationCycle> {
  const { data } = await apiClient.get<{ success: boolean; data: OrganizationCycle }>(
    `/organizations/${organizationId}/cycles/${cycleId}`
  )
  return data.data
}

export async function createOrganizationCycle(
  organizationId: string,
  payload: CreateOrganizationCycleInput
): Promise<OrganizationCycle> {
  const { data } = await apiClient.post<{ success: boolean; data: OrganizationCycle }>(
    `/organizations/${organizationId}/cycles`,
    payload
  )
  return data.data
}

export async function updateOrganizationCycle(
  organizationId: string,
  cycleId: string,
  payload: UpdateOrganizationCycleInput
): Promise<OrganizationCycle> {
  const { data } = await apiClient.patch<{ success: boolean; data: OrganizationCycle }>(
    `/organizations/${organizationId}/cycles/${cycleId}`,
    payload
  )
  return data.data
}

export async function updateTurnOrder(
  organizationId: string,
  cycleId: string,
  order: string[]
): Promise<{ message: string, nextTurnOrder: string[] }> {
  const { data } = await apiClient.post<{ success: boolean; data: { message: string, nextTurnOrder: string[] } }>(
    `/organizations/${organizationId}/cycles/${cycleId}/turn-order`,
    { order }
  )
  return data.data
}

export async function closeOrganizationCycle(
  organizationId: string,
  cycleId: string
): Promise<OrganizationCycle> {
  const { data } = await apiClient.patch<{ success: boolean; data: OrganizationCycle }>(
    `/organizations/${organizationId}/cycles/${cycleId}/close`
  )
  return data.data
}

export async function archiveOrganizationCycle(
  organizationId: string,
  cycleId: string
): Promise<OrganizationCycle> {
  const { data } = await apiClient.patch<{ success: boolean; data: OrganizationCycle }>(
    `/organizations/${organizationId}/cycles/${cycleId}/archive`
  )
  return data.data
}
