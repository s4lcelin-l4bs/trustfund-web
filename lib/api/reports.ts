import { apiClient } from './client'
import { ReportExportParams } from '@/types'

export async function exportReport(
  params: ReportExportParams
): Promise<Blob> {
  const response = await apiClient.get('/reports/export', {
    params,
    responseType: 'blob',
  })
  return response.data
}
