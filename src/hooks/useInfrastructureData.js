import { startTransition, useEffect, useMemo, useState } from 'react'

import { buildInfrastructureContent } from '@/services/infrastructureService'
import { fetchInfrastructures } from '@/services/requests/infrastructureRequests'

function createState({
  map,
  leaderboard,
  infrastructures = [],
  count = 0,
  error = null,
  isLoading,
}) {
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

function createFetchState({
  infrastructures = [],
  count = 0,
  error = null,
  isLoading = true,
} = {}) {
  return {
    infrastructures,
    count,
    error,
    isLoading,
  }
}

export function useInfrastructureData({ map, leaderboard } = {}) {
  const [fetchState, setFetchState] = useState(() => createFetchState())
  const infrastructureResourceKey =
    map?.api?.endpoint ??
    leaderboard?.api?.endpoint ??
    map?.api?.resource ??
    leaderboard?.api?.resource ??
    'infrastructures'

  useEffect(() => {
    const controller = new AbortController()

    startTransition(() => {
      setFetchState((currentState) => ({
        ...currentState,
        error: null,
        isLoading: true,
      }))
    })

    async function loadInfrastructures() {
      try {
        const { infrastructures, count } = await fetchInfrastructures({
          signal: controller.signal,
        })

        startTransition(() => {
          setFetchState(
            createFetchState({
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
          setFetchState((currentState) => ({
            ...currentState,
            error,
            isLoading: false,
          }))
        })
      }
    }

    loadInfrastructures()

    return () => {
      controller.abort()
    }
  }, [infrastructureResourceKey])

  return useMemo(
    () =>
      createState({
        map,
        leaderboard,
        infrastructures: fetchState.infrastructures,
        count: fetchState.count,
        error: fetchState.error,
        isLoading: fetchState.isLoading,
      }),
    [
      fetchState.count,
      fetchState.error,
      fetchState.infrastructures,
      fetchState.isLoading,
      leaderboard,
      map,
    ],
  )
}
