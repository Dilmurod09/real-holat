import { apiConfig } from '@/config/api'
import { getStoredAccessToken } from '@/services/authStorage'

function tryParseJsonString(value) {
  if (typeof value !== 'string') {
    return value
  }

  const normalizedValue = value.trim().replace(/^\uFEFF/, '')

  if (!normalizedValue) {
    return null
  }

  try {
    return JSON.parse(normalizedValue)
  } catch {
    return value
  }
}

function extractErrorMessage(payload, fallbackMessage) {
  const normalizedPayload = tryParseJsonString(payload)

  if (
    normalizedPayload &&
    typeof normalizedPayload === 'object' &&
    typeof normalizedPayload.error === 'string' &&
    normalizedPayload.error.trim()
  ) {
    return normalizedPayload.error
  }

  if (typeof normalizedPayload === 'string' && normalizedPayload.trim()) {
    return normalizedPayload
  }

  if (!normalizedPayload || typeof normalizedPayload !== 'object') {
    return fallbackMessage
  }

  return (
    normalizedPayload.message ||
    normalizedPayload.detail ||
    normalizedPayload.error?.message ||
    normalizedPayload.error_message ||
    normalizedPayload.errors?.[0]?.message ||
    fallbackMessage
  )
}

async function parseResponseBody(response) {
  if (response.status === 204) {
    return null
  }

  const responseText = await response.text()

  if (!responseText.trim()) {
    return null
  }

  return tryParseJsonString(responseText)
}

function getAllowedAuthOrigins() {
  const endpoints = [
    window.location.origin,
    apiConfig.baseUrl,
    apiConfig.endpoints.telegramOtpLogin,
    apiConfig.endpoints.users,
  ]

  return new Set(
    endpoints
      .filter(Boolean)
      .map((endpoint) => {
        try {
          return new URL(endpoint, window.location.origin).origin
        } catch {
          return null
        }
      })
      .filter(Boolean),
  )
}

function shouldAttachAuthorizationHeader(url) {
  if (typeof window === 'undefined') {
    return false
  }

  try {
    const requestUrl = new URL(url, window.location.origin)
    return getAllowedAuthOrigins().has(requestUrl.origin)
  } catch {
    return false
  }
}

function buildRequestBody(body) {
  if (body === undefined || body === null) {
    return undefined
  }

  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData

  if (isFormData || typeof body === 'string') {
    return body
  }

  return JSON.stringify(body)
}

export async function apiClient(url, { method = 'GET', signal, headers, body } = {}) {
  if (!url) {
    throw new Error('API URL is required for apiClient')
  }

  const accessToken = getStoredAccessToken()
  const shouldAttachToken = Boolean(accessToken) && shouldAttachAuthorizationHeader(url)
  const requestBody = buildRequestBody(body)
  const isFormDataBody = typeof FormData !== 'undefined' && body instanceof FormData

  const response = await fetch(url, {
    method,
    signal,
    headers: {
      Accept: 'application/json',
      ...(body && !isFormDataBody && typeof body !== 'string' && {
        'Content-Type': 'application/json',
      }),
      ...(shouldAttachToken && !headers?.Authorization
        ? { Authorization: `Bearer ${accessToken}` }
        : {}),
      ...headers,
    },
    body: requestBody,
  })

  const payload = await parseResponseBody(response)

  if (!response.ok) {
    const error = new Error(
      extractErrorMessage(payload, `Request failed with status ${response.status}`),
    )
    error.status = response.status
    error.payload = payload
    throw error
  }

  return payload
}
