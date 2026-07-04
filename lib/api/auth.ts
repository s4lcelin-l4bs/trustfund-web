import { User } from '@/types'

export interface AuthResponse {
  user: User
  token: string
}

export async function loginApi(
  phoneNumber: string,
  password: string
): Promise<AuthResponse> {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return {
    user: {
      id: 'mock-user-1',
      phoneNumber,
      fullName: 'Salcelin K.',
      createdAt: new Date().toISOString(),
    },
    token: 'mock-token-abc123',
  }
}

export async function registerApi(
  fullName: string,
  phoneNumber: string,
  password: string
): Promise<AuthResponse> {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return {
    user: {
      id: 'mock-user-1',
      phoneNumber,
      fullName,
      createdAt: new Date().toISOString(),
    },
    token: 'mock-token-abc123',
  }
}
