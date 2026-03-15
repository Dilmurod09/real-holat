import { startTransition, useEffect, useState } from 'react'

import { buildMainPageStatsContent } from '@/services/mainPageStatsService'
import { fetchMainPageStats } from '@/services/requests/mainPageStatsRequests'

function createState({
  locale,
  stats,
  truthAggregation,
  payload,
  error = null,
  isLoading,
}) {
  const content = buildMainPageStatsContent({
    locale,
    stats,
    truthAggregation,
    payload,
  })

  return {
    ...content,
    error,
    isLoading,
  }
}

export function useMainPageStatsData({ locale, stats, truthAggregation } = {}) {
  const [state, setState] = useState(() =>
    createState({
      locale,
      stats,
      truthAggregation,
      isLoading: true,
    }),
  )

  useEffect(() => {
    const controller = new AbortController()

    startTransition(() => {
      setState(
        createState({
          locale,
          stats,
          truthAggregation,
          isLoading: true,
        }),
      )
    })

    async function loadMainPageStats() {
      try {
        const payload = await fetchMainPageStats({
          signal: controller.signal,
        })

        startTransition(() => {
          setState(
            createState({
              locale,
              stats,
              truthAggregation,
              payload,
              isLoading: false,
            }),
          )
        })
      } catch (error) {
        if (error.name === 'AbortError') {
          return
        }

        startTransition(() => {
          setState(
            createState({
              locale,
              stats,
              truthAggregation,
              error,
              isLoading: false,
            }),
          )
        })
      }
    }

    loadMainPageStats()

    return () => {
      controller.abort()
    }
  }, [locale, stats, truthAggregation])

  return state
}
