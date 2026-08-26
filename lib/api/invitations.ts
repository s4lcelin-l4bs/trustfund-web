import { apiClient } from './client'

export interface InviteInfo {
  organizationName: string
  currency: string
  memberCount: number
  description?: string
}

export interface GenerateInviteResult {
  inviteCode: string
  inviteUrl: string
  expiresAt: string
}

export async function generateOrganizationInvite(organizationId: string): Promise<GenerateInviteResult> {
  const { data } = await apiClient.post<{ success: boolean; data: GenerateInviteResult }>(
    `/invitations/organization/${organizationId}/generate`
  )
  return data.data
}

export async function getInviteInfo(code: string): Promise<InviteInfo> {
  const { data } = await apiClient.get<{ success: boolean; data: InviteInfo }>(
    `/invitations/${code}`
  )
  return data.data
}

export async function joinOrganization(code: string): Promise<any> {
  const { data } = await apiClient.post<{ success: boolean; data: any }>(
    `/invitations/${code}/join`
  )
  return data.data
}
