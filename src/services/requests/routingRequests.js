import { getApiUrl, apiConfig } from '@/config/api'
import { apiClient } from '@/services/apiClient'

function normalizeBaseUrl(value) {
  return String(value ?? '').replace(/\/+$/, '')
}

export async function fetchDrivingRoute({
  startLat,
  startLng,
  destLat,
  destLng,
  signal,
} = {}) {
  const baseUrl = normalizeBaseUrl(getApiUrl(apiConfig.endpoints.routing))

  if (!baseUrl) {
    throw new Error('Routing API URL is required')
  }

  const coordinates = `${startLng},${startLat};${destLng},${destLat}`
  const requestUrl = new URL(`${baseUrl}/${coordinates}`)

  requestUrl.searchParams.set('overview', 'full')
  requestUrl.searchParams.set('geometries', 'geojson')

  const payload = await apiClient(requestUrl.toString(), { signal })
  const route = payload?.routes?.[0]
  const coordinatesList = route?.geometry?.coordinates

  if (payload?.code !== 'Ok' || !Array.isArray(coordinatesList) || !coordinatesList.length) {
    throw new Error(payload?.message || 'Could not build route')
  }

  return {
    distance: route.distance,
    duration: route.duration,
    coordinates: coordinatesList.map(([lng, lat]) => [lat, lng]),
  }
}
