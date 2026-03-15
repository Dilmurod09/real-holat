import { getApiUrl, apiConfig } from '@/config/api'
import { apiClient } from '@/services/apiClient'

export async function fetchMainPageStats({ signal } = {}) {
  const url = getApiUrl(apiConfig.endpoints.mainPageStats)

  if (!url) {
    return null
  }

  const payload = await apiClient(url, { signal })

  if (payload?.error) {
    throw new Error('Main page stats API returned an error response')
  }

  return payload
}
