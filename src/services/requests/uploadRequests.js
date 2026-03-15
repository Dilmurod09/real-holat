import { getApiUrl, apiConfig } from '@/config/api'
import { apiClient } from '@/services/apiClient'

export async function uploadImageFile({ file, signal } = {}) {
  const url = getApiUrl(apiConfig.endpoints.imageUpload)

  if (!url) {
    throw new Error('Image upload API URL is required')
  }

  if (!file) {
    throw new Error('File is required for upload')
  }

  const formData = new FormData()
  formData.append('file', file)

  const payload = await apiClient(url, {
    method: 'POST',
    signal,
    body: formData,
  })

  if (payload?.error) {
    throw new Error(payload.message || 'Не удалось загрузить файл.')
  }

  const uploadedUrl = payload?.data?.url

  if (!uploadedUrl) {
    throw new Error('Сервер не вернул URL загруженного файла.')
  }

  return uploadedUrl
}
