import { apiClient } from './client'
import {
  Role,
  CreateRoleInput,
  UpdateRoleInput,
  RoleListParams,
  PaginatedResult,
  PermissionModuleGroup,
} from '@/types'

export async function getRoles(
  organizationId: string,
  params: RoleListParams = {}
): Promise<PaginatedResult<Role>> {
  const { data } = await apiClient.get<{ success: boolean; data: PaginatedResult<Role> }>(
    `/organizations/${organizationId}/roles`,
    { params }
  )
  return data.data
}

export async function getRole(organizationId: string, roleId: string): Promise<Role> {
  const { data } = await apiClient.get<{ success: boolean; data: Role }>(
    `/organizations/${organizationId}/roles/${roleId}`
  )
  return data.data
}

export async function createRole(organizationId: string, payload: CreateRoleInput): Promise<Role> {
  const { data } = await apiClient.post<{ success: boolean; data: Role }>(
    `/organizations/${organizationId}/roles`,
    payload
  )
  return data.data
}

export async function updateRole(
  organizationId: string,
  roleId: string,
  payload: UpdateRoleInput
): Promise<Role> {
  const { data } = await apiClient.patch<{ success: boolean; data: Role }>(
    `/organizations/${organizationId}/roles/${roleId}`,
    payload
  )
  return data.data
}

export async function deleteRole(organizationId: string, roleId: string): Promise<void> {
  await apiClient.delete(`/organizations/${organizationId}/roles/${roleId}`)
}

export async function getPermissionCatalog(organizationId: string): Promise<PermissionModuleGroup[]> {
  const { data } = await apiClient.get<{ success: boolean; data: PermissionModuleGroup[] }>(
    `/organizations/${organizationId}/roles/permissions`
  )
  return data.data
}
