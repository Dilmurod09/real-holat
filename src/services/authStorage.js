export const AUTH_TOKEN_STORAGE_KEY = 'realholat-access-token'
export const USER_STORAGE_KEY = 'realholat-user'

function getStorage() {
  if (typeof window === 'undefined') {
    return null
  }

  return window.localStorage
}

export function getStoredAccessToken() {
  return getStorage()?.getItem(AUTH_TOKEN_STORAGE_KEY) ?? ''
}

export function getStoredUser() {
  const storage = getStorage()

  if (!storage || !getStoredAccessToken()) {
    return null
  }

  try {
    const rawUser = storage.getItem(USER_STORAGE_KEY)
    return rawUser ? JSON.parse(rawUser) : null
  } catch {
    return null
  }
}

export function getStoredAuthState() {
  return {
    accessToken: getStoredAccessToken(),
    user: getStoredUser(),
  }
}

export function persistAuthSession({ accessToken, user }) {
  const storage = getStorage()

  if (!storage) {
    return
  }

  if (!accessToken) {
    clearStoredAuthSession()
    return
  }

  storage.setItem(AUTH_TOKEN_STORAGE_KEY, accessToken)

  if (user) {
    storage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
  } else {
    storage.removeItem(USER_STORAGE_KEY)
  }
}

export function clearStoredAuthSession() {
  const storage = getStorage()

  if (!storage) {
    return
  }

  storage.removeItem(AUTH_TOKEN_STORAGE_KEY)
  storage.removeItem(USER_STORAGE_KEY)
}
