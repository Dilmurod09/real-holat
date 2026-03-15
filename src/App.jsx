import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'

import { DEFAULT_LOCALE, normalizeLocale } from '@/content/localizedContent'
import {
  clearStoredAuthSession,
  getStoredAuthState,
  persistAuthSession,
} from '@/services/authStorage'
import Home from '@/pages/Home'
import FirstStage from '@/pages/FirstStage'
import SchoolDetails from '@/pages/SchoolDetails'
import Login from '@/pages/Login'
import About from '@/pages/About'
import Contact from '@/pages/Contact'
import Profile from '@/pages/Profile'

const LOCALE_STORAGE_KEY = 'realholat-locale'

export default function App() {
  const [locale, setLocale] = useState(() => {
    if (typeof window === 'undefined') return DEFAULT_LOCALE
    return normalizeLocale(window.localStorage.getItem(LOCALE_STORAGE_KEY))
  })

  const [authState, setAuthState] = useState(() => getStoredAuthState())

  useEffect(() => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  }, [locale])

  useEffect(() => {
    if (authState.accessToken) {
      persistAuthSession(authState)
    } else {
      clearStoredAuthSession()
    }
  }, [authState])

  useEffect(() => {
    function handleStorageSync() {
      setAuthState(getStoredAuthState())
    }

    window.addEventListener('storage', handleStorageSync)

    return () => {
      window.removeEventListener('storage', handleStorageSync)
    }
  }, [])

  function handleLoginSuccess(nextAuthState) {
    const normalizedAuthState = {
      accessToken: nextAuthState?.accessToken ?? '',
      user: nextAuthState?.user ?? null,
    }

    if (normalizedAuthState.accessToken) {
      persistAuthSession(normalizedAuthState)
    } else {
      clearStoredAuthSession()
    }

    setAuthState(normalizedAuthState)
  }

  const commonProps = {
    locale,
    onLocaleChange: setLocale,
    user: authState.user,
    isAuthenticated: Boolean(authState.accessToken),
    onLoginSuccess: handleLoginSuccess,
  }

  return (
    <Routes>
      <Route path="/" element={<Home {...commonProps} />} />
      <Route path="/first-stage" element={<FirstStage {...commonProps} />} />
      <Route path="/schools/:schoolId" element={<SchoolDetails {...commonProps} />} />
      <Route path="/login" element={<Login {...commonProps} />} />
      <Route path="/profile/:id" element={<Profile {...commonProps} />} />
      <Route path="/about" element={<About {...commonProps} />} />
      <Route path="/contact" element={<Contact {...commonProps} />} />
      <Route path="*" element={<Home {...commonProps} />} />
    </Routes>
  )
}
