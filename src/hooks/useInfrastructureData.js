import { startTransition, useEffect, useState } from 'react'

import { buildInfrastructureContent } from '@/services/infrastructureService'
import { fetchInfrastructures } from '@/services/requests/infrastructureRequests'

function createState({ map, leaderboard, infrastructures = [], count = 0, error = null, isLoading }) {
  const content = buildInfrastructureContent({
    map,
    leaderboard,
    infrastructures,
    count,
  })

  return {
    ...content,
    map: {
      ...content.map,
      fetchError: error,
      isLoading,
    },
    leaderboard: content.leaderboard
      ? {
          ...content.leaderboard,
          fetchError: error,
          isLoading,
        }
      : content.leaderboard,
    error,
    isLoading,
  }
}

export function useInfrastructureData({ map, leaderboard } = {}) {
  const [state, setState] = useState(() =>
    createState({
      map,
      leaderboard,
      isLoading: true,
    }),
  )

  useEffect(() => {
    const controller = new AbortController()

    startTransition(() => {
      setState(
        createState({
          map,
          leaderboard,
          isLoading: true,
        }),
      )
    })

    async function loadInfrastructures() {
      try {
        const { infrastructures, count } = await fetchInfrastructures({
          signal: controller.signal,
        })

        startTransition(() => {
          setState(
            createState({
              map,
              leaderboard,
              infrastructures,
              count,
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
              map,
              leaderboard,
              error,
              isLoading: false,
            }),
          )
        })
      }
    }

    loadInfrastructures()

    return () => {
      controller.abort()
    }
  }, [map, leaderboard])

  return state
}
