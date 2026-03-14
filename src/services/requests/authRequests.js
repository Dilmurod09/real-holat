import { apiClient } from '@/services/apiClient'
import { API_ENDPOINTS } from '@/services/endpoints'

/**
 * Start Telegram auth flow. When API_AUTH_TELEGRAM_URL is set,
 * returns user data (e.g. { username }) from backend.
 * Until then returns mock user for demo.
 */
export async function loginWithTelegram() {
  const url = API_ENDPOINTS.authTelegram
  if (url) {
    const data = await apiClient(url, { method: 'POST' })
    return data?.user ?? data
  }
  return { username: 'TelegramUser' }
}
