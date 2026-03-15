const LOCALE_FORMATS = {
  ru: 'ru-RU',
  uzb: 'uz-UZ',
  en: 'en-US',
}

function toNumber(value) {
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

function formatNumber(value, locale) {
  const formatterLocale = LOCALE_FORMATS[locale] ?? LOCALE_FORMATS.ru
  const safeValue = toNumber(value) ?? 0

  return new Intl.NumberFormat(formatterLocale).format(safeValue)
}

function clampPercent(value) {
  const numericValue = toNumber(value) ?? 0
  return Math.min(100, Math.max(0, Math.round(numericValue)))
}

export function buildMainPageStatsContent({
  locale = 'ru',
  stats,
  truthAggregation,
  payload,
} = {}) {
  const apiData = payload?.data ?? {}
  const aggregationReport = apiData?.aggregation_report ?? {}
  const values = [
    apiData?.total_reports,
    apiData?.verified_reports,
    apiData?.participated_users,
  ]

  const statItems = (stats?.items ?? []).map((item, index) => ({
    ...item,
    value: formatNumber(values[index], locale),
  }))

  return {
    stats: {
      ...stats,
      items: statItems,
    },
    truthAggregation: {
      ...truthAggregation,
      checked: toNumber(aggregationReport?.total_checked_infrastructures) ?? 0,
      total: toNumber(aggregationReport?.total_infrastructures) ?? 0,
      percent: clampPercent(aggregationReport?.infrastructures_checked_percentage),
    },
  }
}
