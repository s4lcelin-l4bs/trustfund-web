import { apiClient } from './client'
import {
  Organization,
  CreateOrganizationInput,
  UpdateOrganizationInput,
  OrganizationListParams,
  PaginatedResult,
} from '@/types'

export async function getOrganizations(
  params: OrganizationListParams = {}
): Promise<PaginatedResult<Organization>> {
  const { data } = await apiClient.get<{ success: boolean; data: PaginatedResult<Organization> }>(
    '/organizations',
    { params }
  )
  return data.data
}

export async function getOrganization(organizationId: string): Promise<Organization> {
  const { data } = await apiClient.get<{ success: boolean; data: Organization }>(
    `/organizations/${organizationId}`
  )
  return data.data
}

export async function createOrganization(payload: CreateOrganizationInput): Promise<Organization> {
  const { data } = await apiClient.post<{ success: boolean; data: Organization }>(
    '/organizations',
    payload
  )
  return data.data
}

export async function updateOrganization(
  organizationId: string,
  payload: UpdateOrganizationInput
): Promise<Organization> {
  const { data } = await apiClient.patch<{ success: boolean; data: Organization }>(
    `/organizations/${organizationId}`,
    payload
  )
  return data.data
}

export async function deleteOrganization(organizationId: string): Promise<void> {
  await apiClient.delete(`/organizations/${organizationId}`)
}

export async function archiveOrganization(organizationId: string): Promise<Organization> {
  const { data } = await apiClient.patch<{ success: boolean; data: Organization }>(
    `/organizations/${organizationId}/archive`
  )
  return data.data
}

export async function restoreOrganization(organizationId: string): Promise<Organization> {
  const { data } = await apiClient.patch<{ success: boolean; data: Organization }>(
    `/organizations/${organizationId}/restore`
  )
  return data.data
}

export async function uploadOrganizationLogo(
  organizationId: string,
  file: File
): Promise<{ logoUrl: string }> {
  const formData = new FormData()
  formData.append('logo', file)
  const { data } = await apiClient.post<{ success: boolean; data: { logoUrl: string } }>(
    `/organizations/${organizationId}/logo`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  )
  return data.data
}
