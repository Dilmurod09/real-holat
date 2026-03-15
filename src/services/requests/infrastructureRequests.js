import { getApiUrl, apiConfig } from '@/config/api'
import { apiClient } from '@/services/apiClient'

function getInfrastructuresBaseUrl() {
  const baseUrl = getApiUrl(apiConfig.endpoints.infrastructures)

  if (!baseUrl) {
    throw new Error('Infrastructures API URL is required')
  }

  return baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
}

function buildInfrastructureUrl(infrastructureId, nestedPath = '') {
  if (!infrastructureId) {
    throw new Error('Infrastructure id is required')
  }

  const normalizedBaseUrl = getInfrastructuresBaseUrl()
  const normalizedNestedPath = String(nestedPath ?? '').replace(/^\/+/, '')
  const relativePath = normalizedNestedPath
    ? `${encodeURIComponent(infrastructureId)}/${normalizedNestedPath}`
    : encodeURIComponent(infrastructureId)

  return new URL(relativePath, normalizedBaseUrl).toString()
}

function toFiniteNumber(value, fallbackValue = 0) {
  const parsedNumber = Number(value)
  return Number.isFinite(parsedNumber) ? parsedNumber : fallbackValue
}

export async function fetchInfrastructures({ signal, tops, condition, query } = {}) {
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

  if (query) {
    requestUrl.searchParams.set('query', String(query))
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

export async function fetchInfrastructureById({ infrastructureId, signal } = {}) {
  const payload = await apiClient(buildInfrastructureUrl(infrastructureId), { signal })

  if (payload?.error) {
    throw new Error(payload.message || 'Не удалось загрузить данные школы.')
  }

  return payload?.data ?? payload
}

export async function fetchInfrastructureReports({ infrastructureId, signal } = {}) {
  const payload = await apiClient(buildInfrastructureUrl(infrastructureId, 'reports'), {
    signal,
  })

  if (payload?.error) {
    throw new Error(payload.message || 'Не удалось загрузить обращения школы.')
  }

  const data = payload?.data ?? {}
  const reports = Array.isArray(data.reports) ? data.reports : []

  return {
    ...data,
    reports,
    count: toFiniteNumber(data.count, reports.length),
    participated_users_count: toFiniteNumber(data.participated_users_count, 0),
    total_reports_count: toFiniteNumber(data.total_reports_count, reports.length),
    verified_reports_count: toFiniteNumber(data.verified_reports_count, 0),
    infrastructure_rating: data.infrastructure_rating,
  }
}
