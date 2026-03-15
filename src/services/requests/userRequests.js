import { getApiUrl, apiConfig } from '@/config/api'
import { apiClient } from '@/services/apiClient'

function buildUserProfileUrl(userId) {
  const baseUrl = getApiUrl(apiConfig.endpoints.users)

  if (!baseUrl) {
    throw new Error('Users API URL is required')
  }

  const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`

  return new URL(encodeURIComponent(userId), normalizedBaseUrl).toString()
}

export async function fetchUserProfile({ userId, signal } = {}) {
  if (!userId) {
    throw new Error('User id is required')
  }

  const payload = await apiClient(buildUserProfileUrl(userId), { signal })

  if (payload?.error) {
    throw new Error(payload.message || 'Не удалось загрузить профиль пользователя.')
  }

  return payload?.data ?? payload
}
