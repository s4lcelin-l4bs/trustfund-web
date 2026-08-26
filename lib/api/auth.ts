import { User } from '@/types'
import { apiClient } from './client'

export interface AuthResponse {
  user: User
  token: string
}

export async function loginApi(
  phoneNumber: string,
  password: string
): Promise<AuthResponse> {
  const { data } = await apiClient.post<{ success: boolean; data: AuthResponse }>('/auth/login', {
    phoneNumber,
    password,
  })
  return data.data
}

export async function registerApi(
  fullName: string,
  phoneNumber: string,
  password: string
): Promise<AuthResponse> {
  const { data } = await apiClient.post<{ success: boolean; data: AuthResponse }>('/auth/register', {
    fullName,
    phoneNumber,
    password,
  })
  return data.data
}
