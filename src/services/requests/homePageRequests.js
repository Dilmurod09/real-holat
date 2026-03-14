import { getApiUrl, apiConfig } from '@/config/api'
import { apiClient } from '@/services/apiClient'

export async function fetchHomePageContent({ signal, locale }) {
  const url = getApiUrl(apiConfig.endpoints.homePage)

  if (!url) {
    return null
  }

  const requestUrl = new URL(url)
  requestUrl.searchParams.set('locale', locale)

  return apiClient(requestUrl.toString(), { signal })
}

