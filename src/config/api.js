export const apiConfig = {
  baseUrl: import.meta.env.VITE_API_BASE_URL ?? '',
  endpoints: {
    homePage: import.meta.env.VITE_API_HOME_PAGE_ENDPOINT ?? '/content/home',
    search: import.meta.env.VITE_API_SEARCH_ENDPOINT ?? '/search',
    faq: import.meta.env.VITE_API_FAQ_ENDPOINT ?? '/faq',
    schools: import.meta.env.VITE_API_SCHOOLS_ENDPOINT ?? '/schools',
    truthAggregation:
      import.meta.env.VITE_API_TRUTH_ENDPOINT ?? '/analytics/truth-aggregation',
    regionMap: import.meta.env.VITE_API_REGION_MAP_ENDPOINT ?? '/regions/map',
    regionProjects:
      import.meta.env.VITE_API_REGION_PROJECTS_ENDPOINT ?? '/regions/projects',
  },
}

export function getApiUrl(endpoint) {
  if (!apiConfig.baseUrl || !endpoint) {
    return ''
  }

  return new URL(endpoint, apiConfig.baseUrl).toString()
}
