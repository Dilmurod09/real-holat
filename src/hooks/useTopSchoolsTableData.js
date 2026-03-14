import { startTransition, useEffect, useState } from 'react'

import { buildSchoolsTableContent } from '@/services/infrastructureService'
import { fetchInfrastructures } from '@/services/requests/infrastructureRequests'

function createState({
  id,
  columns,
  rows,
  ui,
  api,
  infrastructures = [],
  count = 0,
  error = null,
  isLoading,
}) {
  const schoolsTable = {
    id,
    columns,
    rows,
    ui,
    api,
  }

  const content = buildSchoolsTableContent({
    schoolsTable,
    infrastructures,
    count,
  })

  return {
    ...content,
    schoolsTable: {
      ...content.schoolsTable,
      fetchError: error,
      isLoading,
    },
    error,
    isLoading,
  }
}

export function useTopSchoolsTableData({ id, columns, rows, ui, api } = {}) {
  const [state, setState] = useState(() =>
    createState({
      id,
      columns,
      rows,
      ui,
      api,
      isLoading: true,
    }),
  )

  useEffect(() => {
    const controller = new AbortController()

    startTransition(() => {
      setState(
        createState({
          id,
          columns,
          rows,
          ui,
          api,
          isLoading: true,
        }),
      )
    })

    async function loadTopSchools() {
      try {
        const { infrastructures, count } = await fetchInfrastructures({
          signal: controller.signal,
          tops: 6,
        })

        startTransition(() => {
          setState(
            createState({
              id,
              columns,
              rows,
              ui,
              api,
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
              id,
              columns,
              rows,
              ui,
              api,
              error,
              isLoading: false,
            }),
          )
        })
      }
    }

    loadTopSchools()

    return () => {
      controller.abort()
    }
  }, [api, columns, id, rows, ui])

  return state
}
