import { startTransition, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { getLocalizedSiteChromeContent } from '@/content/localizedContent'
import SiteLayout from '@/layouts/SiteLayout'
import { fetchUserProfile } from '@/services/requests/userRequests'

function createInitialProfileState() {
  return {
    profile: null,
    errorMessage: '',
    isLoading: true,
  }
}

function resolveLocaleTag(locale) {
  if (locale === 'uzb') {
    return 'uz-UZ'
  }

  if (locale === 'en') {
    return 'en-US'
  }

  return 'ru-RU'
}

function formatProfileDate(value, locale) {
  if (!value) {
    return '-'
  }

  const parsedDate = new Date(value)

  if (Number.isNaN(parsedDate.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat(resolveLocaleTag(locale), {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(parsedDate)
}

function formatProfileValue(value) {
  if (value === null || value === undefined || value === '') {
    return '-'
  }

  return String(value)
}

export default function Profile({ locale, onLocaleChange, user }) {
  const site = getLocalizedSiteChromeContent(locale)
  const { id } = useParams()
  const [state, setState] = useState(() => createInitialProfileState())

  useEffect(() => {
    const controller = new AbortController()

    startTransition(() => {
      setState(createInitialProfileState())
    })

    async function loadProfile() {
      try {
        const profile = await fetchUserProfile({
          userId: id,
          signal: controller.signal,
        })

        startTransition(() => {
          setState({
            profile,
            errorMessage: '',
            isLoading: false,
          })
        })
      } catch (error) {
        if (error.name === 'AbortError') {
          return
        }

        startTransition(() => {
          setState({
            profile: null,
            errorMessage: error.message || 'Не удалось загрузить профиль.',
            isLoading: false,
          })
        })
      }
    }

    loadProfile()

    return () => {
      controller.abort()
    }
  }, [id])

  const profileFields = [
    { label: 'Full name', value: formatProfileValue(state.profile?.full_name) },
    { label: 'Telegram username', value: formatProfileValue(state.profile?.tg_user_name) },
    { label: 'Phone number', value: formatProfileValue(state.profile?.phone_number) },
    { label: 'Role', value: formatProfileValue(state.profile?.role) },
    { label: 'Coins', value: formatProfileValue(state.profile?.coins) },
    { label: 'Created at', value: formatProfileDate(state.profile?.created_at, locale) },
  ]

  return (
    <SiteLayout site={site} onLocaleChange={onLocaleChange} user={user}>
      <section className="section-shell py-12 md:py-20">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#FF622E]">
              User Profile
            </p>
            <h1 className="section-title mt-2">Профиль пользователя</h1>
          </div>

          <Link to="/" className="btn-secondary">
            На главную
          </Link>
        </div>

        <div className="surface-card overflow-hidden">
          <div className="border-b border-[#F3E2DB] bg-[#FFF4EE] px-6 py-5 sm:px-8">
            <p className="text-sm text-[#5A6673]">
              Временная страница профиля. Позже здесь можно будет разместить
              расширенную статистику и историю активности пользователя.
            </p>
          </div>

          <div className="px-6 py-6 sm:px-8 sm:py-8">
            {state.isLoading ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {Array.from({ length: 6 }, (_, index) => (
                  <div
                    key={index}
                    className="rounded-3xl border border-[#F3E2DB] bg-[#FFFDFB] p-5"
                  >
                    <div className="h-3 w-24 rounded-full bg-[#F5E3DA]" />
                    <div className="mt-4 h-6 w-36 rounded-full bg-[#FFE6DE]" />
                  </div>
                ))}
              </div>
            ) : null}

            {!state.isLoading && state.errorMessage ? (
              <div className="rounded-3xl border border-[#FFD2C2] bg-[#FFF4EE] px-5 py-4 text-sm font-medium text-[#A24722]">
                {state.errorMessage}
              </div>
            ) : null}

            {!state.isLoading && !state.errorMessage ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {profileFields.map((field) => (
                  <div
                    key={field.label}
                    className="rounded-3xl border border-[#F3E2DB] bg-[#FFFDFB] p-5"
                  >
                    <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#FF622E]">
                      {field.label}
                    </p>
                    <p className="mt-3 break-words text-lg font-semibold text-[#1F1F1F]">
                      {field.value}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
