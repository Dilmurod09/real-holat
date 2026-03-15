import { getApiUrl, apiConfig } from '@/config/api'
import { apiClient } from '@/services/apiClient'

export async function createReport({ report, signal } = {}) {
  const url = getApiUrl(apiConfig.endpoints.reports)

  if (!url) {
    throw new Error('Reports API URL is required')
  }

  if (!report) {
    throw new Error('Report payload is required')
  }

  const payload = await apiClient(url, {
    method: 'POST',
    signal,
    body: report,
  })

  if (payload?.error) {
    throw new Error(payload.message || 'Не удалось отправить обращение.')
  }

  return payload?.data ?? payload
}
