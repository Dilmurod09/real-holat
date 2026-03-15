export const apiConfig = {
  baseUrl: import.meta.env.VITE_API_BASE_URL ?? '',
  endpoints: {
    homePage: import.meta.env.VITE_API_HOME_PAGE_ENDPOINT ?? '/content/home',
    search: import.meta.env.VITE_API_SEARCH_ENDPOINT ?? '/search',
    faq: import.meta.env.VITE_API_FAQ_ENDPOINT ?? '/faq',
    schools: import.meta.env.VITE_API_SCHOOLS_ENDPOINT ?? '/schools',
    mainPageStats:
      import.meta.env.VITE_API_MAIN_PAGE_STATS_ENDPOINT ??
      'https://realholat-production.up.railway.app/api/v1/stats/main-page',
    truthAggregation:
      import.meta.env.VITE_API_TRUTH_ENDPOINT ?? '/analytics/truth-aggregation',
    regionMap: import.meta.env.VITE_API_REGION_MAP_ENDPOINT ?? '/regions/map',
    regionProjects:
      import.meta.env.VITE_API_REGION_PROJECTS_ENDPOINT ?? '/regions/projects',
    infrastructures:
      import.meta.env.VITE_API_INFRASTRUCTURES_ENDPOINT ??
      'https://realholat-production.up.railway.app/api/v1/infrastructures',
    telegramOtpLogin:
      import.meta.env.VITE_API_TELEGRAM_OTP_LOGIN_ENDPOINT ??
      'https://realholat-production.up.railway.app/api/v1/users/login-with-tg-otp',
    users:
      import.meta.env.VITE_API_USERS_ENDPOINT ??
      'https://realholat-production.up.railway.app/api/v1/users',
    imageUpload:
      import.meta.env.VITE_API_IMAGE_UPLOAD_ENDPOINT ??
      'https://realholat-production.up.railway.app/api/v1/image/upload',
    reports:
      import.meta.env.VITE_API_REPORTS_ENDPOINT ??
      'https://realholat-production.up.railway.app/api/v1/reports',
    routing:
      import.meta.env.VITE_API_ROUTING_ENDPOINT ??
      'https://router.project-osrm.org/route/v1/driving',
  },
}

export function getApiUrl(endpoint) {
  if (!endpoint) {
    return ''
  }

  if (/^https?:\/\//i.test(endpoint)) {
    return endpoint
  }

  if (!apiConfig.baseUrl) {
    return ''
  }

  return new URL(endpoint, apiConfig.baseUrl).toString()
}
