export async function apiClient(url, { method = 'GET', signal, headers, body } = {}) {
  if (!url) {
    throw new Error('API URL is required for apiClient')
  }

  const response = await fetch(url, {
    method,
    signal,
    headers: {
      Accept: 'application/json',
      ...(body && { 'Content-Type': 'application/json' }),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const error = new Error(`Request failed with status ${response.status}`)
    error.status = response.status
    throw error
  }

  return response.json()
}

