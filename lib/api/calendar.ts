import { apiClient } from './client'
import { CalendarEvent, CalendarListParams } from '@/types'

export interface CalendarResponse {
  events: CalendarEvent[]
  synthetic: {
    id: string
    type: string
    title: string
    date: string
    amount?: number
    status?: string
    synthetic: true
  }[]
}

export async function getCalendarEvents(
  params: CalendarListParams
): Promise<CalendarResponse> {
  const { data } = await apiClient.get<{ success: boolean; data: CalendarResponse }>(
    '/calendar/events',
    { params }
  )
  return data.data
}

export async function createCalendarEvent(payload: Partial<CalendarEvent>): Promise<CalendarEvent> {
  const { data } = await apiClient.post<{ success: boolean; data: CalendarEvent }>(
    '/calendar/events',
    payload
  )
  return data.data
}

export async function updateCalendarEvent(id: string, payload: Partial<CalendarEvent>): Promise<CalendarEvent> {
  const { data } = await apiClient.patch<{ success: boolean; data: CalendarEvent }>(
    `/calendar/events/${id}`,
    payload
  )
  return data.data
}

export async function deleteCalendarEvent(id: string): Promise<void> {
  await apiClient.delete(`/calendar/events/${id}`)
}
