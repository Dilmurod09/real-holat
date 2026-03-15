import { getApiUrl, apiConfig } from '@/config/api'
import { apiClient } from '@/services/apiClient'

export async function fetchInfrastructures({ signal, tops, condition } = {}) {
  const url = getApiUrl(apiConfig.endpoints.infrastructures)

  if (!url) {
    return {
      infrastructures: [],
      count: 0,
    }
  }

  const requestUrl = new URL(url)

  if (tops !== undefined && tops !== null) {
    requestUrl.searchParams.set('tops', String(tops))
  }

  if (condition) {
    requestUrl.searchParams.set('condition', String(condition))
  }

  const payload = await apiClient(requestUrl.toString(), { signal })

  if (payload?.error) {
    throw new Error('Infrastructure API returned an error response')
  }

  const infrastructures = Array.isArray(payload?.data?.infrastructures)
    ? payload.data.infrastructures
    : []

  const count = Number(payload?.data?.count)

  return {
    infrastructures,
    count: Number.isFinite(count) ? count : infrastructures.length,
  }
}
