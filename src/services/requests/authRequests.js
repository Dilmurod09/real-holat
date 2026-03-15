import { getApiUrl, apiConfig } from '@/config/api'
import { apiClient } from '@/services/apiClient'

export async function verifyTelegramOtp({ code, signal } = {}) {
  const url = getApiUrl(apiConfig.endpoints.telegramOtpLogin)

  if (!url) {
    throw new Error('Telegram OTP login API URL is required')
  }

  const payload = await apiClient(url, {
    method: 'POST',
    signal,
    body: { code },
  })

  if (payload?.error) {
    throw new Error(payload.message || 'Не удалось подтвердить код. Попробуйте ещё раз.')
  }

  const accessToken = payload?.data?.access_token
  const user = payload?.data?.user

  if (!accessToken || !user) {
    throw new Error('Сервер не вернул данные авторизации. Попробуйте ещё раз.')
  }

  return {
    accessToken,
    user,
  }
}
