import { startTransition, useEffect, useState } from 'react'

import {
  DEFAULT_LOCALE,
  getLocalizedHomePageContent,
} from '@/content/localizedContent'
import { getHomePageContent } from '@/services/homePageService'

function createInitialState(locale = DEFAULT_LOCALE) {
  return {
    content: getLocalizedHomePageContent(locale),
    error: null,
  }
}

export function useHomePageContent(locale = DEFAULT_LOCALE) {
  const [state, setState] = useState(() => createInitialState(locale))

  useEffect(() => {
    const controller = new AbortController()

    startTransition(() => {
      setState(createInitialState(locale))
    })

    async function loadContent() {
      try {
        const content = await getHomePageContent({
          signal: controller.signal,
          locale,
        })

        startTransition(() => {
          setState({
            content,
            error: null,
          })
        })
      } catch (error) {
        if (error.name === 'AbortError') {
          return
        }

        startTransition(() => {
          setState((currentState) => ({
            ...currentState,
            error,
          }))
        })
      }
    }

    loadContent()

    return () => {
      controller.abort()
    }
  }, [locale])

  return state
}
