import { apiClient } from './client'

export interface NotificationItem {
  id: string
  userId: string
  organizationId?: string
  organizationName?: string
  type: string
  title?: string
  message: string
  read: boolean
  data?: Record<string, any>
  createdAt: string
  expiresAt?: string | null
}

export interface NotificationListResult {
  notifications: NotificationItem[]
  unreadCount: number
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Backend: GET /notifications?page=&limit=
// Response: { success: true, data: { notifications: [...], unreadCount: N, pagination: {...} } }
export async function getNotifications(params: { page?: number; limit?: number } = {}): Promise<NotificationListResult> {
  const { data } = await apiClient.get<{ success: boolean; data: NotificationListResult }>('/notifications', {
    params: {
      page: params.page || 1,
      limit: params.limit || 50,
    },
  })
  return data.data
}

export async function markNotificationAsRead(id: string): Promise<void> {
  await apiClient.patch(`/notifications/${id}/read`)
}

export async function markAllNotificationsAsRead(): Promise<void> {
  await apiClient.patch('/notifications/mark-all-read')
}

export async function deleteNotification(id: string): Promise<void> {
  await apiClient.delete(`/notifications/${id}`)
}
