import { getApiUrl, apiConfig } from '@/config/api'
import { apiClient } from '@/services/apiClient'

function getReportsBaseUrl() {
  const baseUrl = getApiUrl(apiConfig.endpoints.reports)

  if (!baseUrl) {
    throw new Error('Reports API URL is required')
  }

  return baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
}

function buildReportActionUrl(reportId, action) {
  if (!reportId) {
    throw new Error('Report id is required')
  }

  const normalizedBaseUrl = getReportsBaseUrl()
  const normalizedAction = String(action ?? '').replace(/^\/+/, '')
  const relativePath = normalizedAction
    ? `${encodeURIComponent(reportId)}/${normalizedAction}`
    : encodeURIComponent(reportId)

  return new URL(relativePath, normalizedBaseUrl).toString()
}

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

export async function verifyReport({ reportId, signal } = {}) {
  const payload = await apiClient(buildReportActionUrl(reportId, 'verify'), {
    method: 'POST',
    signal,
  })

  if (payload?.error) {
    throw new Error(payload.message || 'Не удалось подтвердить обращение.')
  }

  return payload?.data ?? payload
}
