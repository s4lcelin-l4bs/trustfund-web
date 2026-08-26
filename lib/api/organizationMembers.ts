import { apiClient } from './client'
import {
  OrganizationMember,
  CreateOrganizationMemberInput,
  UpdateOrganizationMemberInput,
  OrganizationMemberListParams,
  PaginatedResult,
  MemberInviteInput,
  MemberInviteResult,
  MemberImportResult,
} from '@/types'

export async function getOrganizationMembers(
  organizationId: string,
  params: OrganizationMemberListParams = {}
): Promise<PaginatedResult<OrganizationMember>> {
  const { data } = await apiClient.get<{ success: boolean; data: PaginatedResult<OrganizationMember> }>(
    `/organizations/${organizationId}/members`,
    { params }
  )
  return data.data
}

export async function getOrganizationMember(
  organizationId: string,
  memberId: string
): Promise<OrganizationMember> {
  const { data } = await apiClient.get<{ success: boolean; data: OrganizationMember }>(
    `/organizations/${organizationId}/members/${memberId}`
  )
  return data.data
}

export async function createOrganizationMember(
  organizationId: string,
  payload: CreateOrganizationMemberInput
): Promise<OrganizationMember> {
  const { data } = await apiClient.post<{ success: boolean; data: OrganizationMember }>(
    `/organizations/${organizationId}/members`,
    payload
  )
  return data.data
}

export async function updateOrganizationMember(
  organizationId: string,
  memberId: string,
  payload: UpdateOrganizationMemberInput
): Promise<OrganizationMember> {
  const { data } = await apiClient.patch<{ success: boolean; data: OrganizationMember }>(
    `/organizations/${organizationId}/members/${memberId}`,
    payload
  )
  return data.data
}

export async function deleteOrganizationMember(organizationId: string, memberId: string): Promise<void> {
  await apiClient.delete(`/organizations/${organizationId}/members/${memberId}`)
}

export interface MyMembership {
  member: OrganizationMember
  isOwner: boolean
  permissionKeys: string[]
}

/** Rôle/permissions de l'utilisateur connecté dans cette organisation. */
export async function getMyMembership(organizationId: string): Promise<MyMembership> {
  const { data } = await apiClient.get<{ success: boolean; data: MyMembership }>(
    `/organizations/${organizationId}/members/me`
  )
  return data.data
}

export async function uploadMemberPhoto(
  organizationId: string,
  memberId: string,
  file: File
): Promise<{ photoUrl: string }> {
  const formData = new FormData()
  formData.append('photo', file)
  const { data } = await apiClient.post<{ success: boolean; data: { photoUrl: string } }>(
    `/organizations/${organizationId}/members/${memberId}/photo`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  )
  return data.data
}

export async function inviteMember(
  organizationId: string,
  payload: MemberInviteInput
): Promise<MemberInviteResult> {
  const { data } = await apiClient.post<{ success: boolean; data: MemberInviteResult }>(
    `/organizations/${organizationId}/members/invite`,
    payload
  )
  return data.data
}

export async function importMembers(
  organizationId: string,
  file: File
): Promise<MemberImportResult> {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await apiClient.post<{ success: boolean; data: MemberImportResult }>(
    `/organizations/${organizationId}/members/import`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  )
  return data.data
}
