import {
  DEFAULT_LOCALE,
  getLocalizedHomePageContent,
} from '@/content/localizedContent'
import { fetchHomePageContent } from '@/services/requests/homePageRequests'

function mergeObjects(baseValue, nextValue) {
  if (!nextValue) {
    return baseValue
  }

  return {
    ...baseValue,
    ...nextValue,
  }
}

function mergeNested(baseValue, nextValue, keys) {
  const mergedValue = mergeObjects(baseValue, nextValue)

  for (const key of keys) {
    if (baseValue?.[key] || nextValue?.[key]) {
      mergedValue[key] = mergeObjects(baseValue?.[key], nextValue?.[key])
    }
  }

  return mergedValue
}

function mergeHomePageContent(baseContent, payload = {}) {
  return {
    ...baseContent,
    ...payload,
    site: mergeNested(baseContent.site, payload.site, [
      'brand',
      'search',
      'auth',
      'locale',
      'ui',
      'alerts',
      'footer',
    ]),
    hero: mergeNested(baseContent.hero, payload.hero, [
      'primaryAction',
      'api',
    ]),
    orangeBubble: mergeNested(baseContent.orangeBubble, payload.orangeBubble, [
      'cta',
      'illustration',
      'api',
    ]),
    regionInfo: mergeNested(baseContent.regionInfo, payload.regionInfo, [
      'map',
      'leaderboard',
      'stats',
    ]),
    truthAggregation: mergeNested(baseContent.truthAggregation, payload.truthAggregation, [
      'api',
    ]),
    schoolsTable: mergeNested(baseContent.schoolsTable, payload.schoolsTable, [
      'api',
      'ui',
    ]),
    faq: mergeNested(baseContent.faq, payload.faq, ['api']),
  }
}

function withLocalizedNestedContent(baseContent, payload = {}) {
  const mergedContent = mergeHomePageContent(baseContent, payload)

  if (baseContent.regionInfo?.map || payload.regionInfo?.map) {
    mergedContent.regionInfo.map = mergeNested(
      baseContent.regionInfo?.map,
      payload.regionInfo?.map,
      ['api', 'view', 'ui'],
    )
  }

  if (baseContent.regionInfo?.leaderboard || payload.regionInfo?.leaderboard) {
    mergedContent.regionInfo.leaderboard = mergeNested(
      baseContent.regionInfo?.leaderboard,
      payload.regionInfo?.leaderboard,
      ['api'],
    )
  }

  if (baseContent.regionInfo?.stats || payload.regionInfo?.stats) {
    mergedContent.regionInfo.stats = mergeNested(
      baseContent.regionInfo?.stats,
      payload.regionInfo?.stats,
      ['api'],
    )
  }

  return mergedContent
}

export async function getHomePageContent({
  signal,
  locale = DEFAULT_LOCALE,
} = {}) {
  const baseContent = getLocalizedHomePageContent(locale)
  const payload = await fetchHomePageContent({ signal, locale })

  if (!payload) {
    return baseContent
  }

  return withLocalizedNestedContent(baseContent, payload)
}
