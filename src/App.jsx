import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'

import { DEFAULT_LOCALE, normalizeLocale } from '@/content/localizedContent'
import Home from '@/pages/Home'
import FirstStage from '@/pages/FirstStage'
import SchoolDetails from '@/pages/SchoolDetails'
import Login from '@/pages/Login'
import About from '@/pages/About'
import Contact from '@/pages/Contact'

const LOCALE_STORAGE_KEY = 'realholat-locale'
const USER_STORAGE_KEY = 'realholat-user'

export default function App() {
  const [locale, setLocale] = useState(() => {
    if (typeof window === 'undefined') return DEFAULT_LOCALE
    return normalizeLocale(window.localStorage.getItem(LOCALE_STORAGE_KEY))
  })

  const [user, setUser] = useState(() => {
    if (typeof window === 'undefined') return null
    try {
      const raw = window.localStorage.getItem(USER_STORAGE_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  }, [locale])

  useEffect(() => {
    if (user) {
      window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
    } else {
      window.localStorage.removeItem(USER_STORAGE_KEY)
    }
  }, [user])

  const commonProps = { locale, onLocaleChange: setLocale, user, onLoginSuccess: setUser }

  return (
    <Routes>
      <Route path="/" element={<Home {...commonProps} />} />
      <Route path="/first-stage" element={<FirstStage {...commonProps} />} />
      <Route path="/schools/:schoolId" element={<SchoolDetails {...commonProps} />} />
      <Route path="/login" element={<Login {...commonProps} />} />
      <Route path="/about" element={<About {...commonProps} />} />
      <Route path="/contact" element={<Contact {...commonProps} />} />
      <Route path="*" element={<Home {...commonProps} />} />
    </Routes>
  )
}
