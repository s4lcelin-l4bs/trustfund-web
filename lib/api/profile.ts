import { apiClient } from './client'
import { User } from '@/types'

export interface UpdateProfileInput {
  fullName?: string
  avatarUrl?: string
}

export async function getMe(): Promise<User> {
  const { data } = await apiClient.get<{ success: boolean; data: { user: User } }>('/auth/me')
  return data.data.user
}

export async function updateProfile(payload: UpdateProfileInput): Promise<User> {
  const { data } = await apiClient.patch<{ success: boolean; data: { user: User } }>('/auth/me', payload)
  return data.data.user
}
