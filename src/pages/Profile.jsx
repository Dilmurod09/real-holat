import { startTransition, useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { getLocalizedSiteChromeContent } from '@/content/localizedContent'
import SiteLayout from '@/layouts/SiteLayout'
import { clearStoredAuthSession } from '@/services/authStorage'
import { fetchUserProfile } from '@/services/requests/userRequests'

const FALLBACK_LEVELS = [
  { id: 'intern', label: 'Стажер', image: '/mascot2.png' },
  { id: 'junior', label: 'Младший инспектор', image: '/mascot3.png' },
  { id: 'revisor', label: 'Ревизор', image: '/mascot.png' },
  { id: 'senior', label: 'Старший инспектор', image: '/mascot4.png' },
  { id: 'expert', label: 'Эксперт', image: '/mascot3.png' },
  { id: 'master', label: 'Мастер Ревизии', image: '/mascot2.png' },
]

const FALLBACK_ACTIVITY_ROWS = [
  {
    activity: 'ПОДТВЕРДИЛ КОММЕНТАРИЙ',
    topic: 'ШКОЛА 45',
    date: '12.03.2025-11.12.2026',
    confirmed: '2',
    lightning: '+15',
    isHighlighted: true,
  },
  {
    activity: 'ОСТАВИЛ ЖАЛОБУ',
    topic: 'ШКОЛА 45',
    date: '12.03.2025-11.12.2026',
    confirmed: '5',
    lightning: '+15',
  },
  {
    activity: 'ОСТАВИЛ ЖАЛОБУ',
    topic: 'ШКОЛА 45',
    date: '12.03.2025-11.12.2026',
    confirmed: '10',
    lightning: '+15',
  },
  {
    activity: 'ОСТАВИЛ ЖАЛОБУ',
    topic: 'ТАШКЕНТ',
    date: '12.03.2025-11.12.2026',
    confirmed: '5',
    lightning: '+15',
  },
  {
    activity: 'ОСТАВИЛ ЖАЛОБУ',
    topic: 'ТАШКЕНТ',
    date: '12.03.2025-11.12.2026',
    confirmed: '5',
    lightning: '+15',
  },
  {
    activity: 'ОСТАВИЛ ЖАЛОБУ',
    topic: 'ТАШКЕНТ',
    date: '12.03.2025-11.12.2026',
    confirmed: '5',
    lightning: '+10',
  },
  {
    activity: 'ОСТАВИЛ ЖАЛОБУ',
    topic: 'ТАШКЕНТ',
    date: '12.03.2025-11.12.2026',
    confirmed: '5',
    lightning: '+10',
  },
  {
    activity: 'ОСТАВИЛ ЖАЛОБУ',
    topic: 'ТАШКЕНТ',
    date: '12.03.2025-11.12.2026',
    confirmed: '5',
    lightning: '+10',
  },
  {
    activity: 'ПОДТВЕРДИЛ КОММЕНТАРИЙ',
    topic: 'ТАШКЕНТ',
    date: '12.03.2025-11.12.2026',
    confirmed: '4',
    lightning: '+10',
  },
  {
    activity: 'ПОДТВЕРДИЛ КОММЕНТАРИЙ',
    topic: 'ТАШКЕНТ',
    date: '12.03.2025-11.12.2026',
    confirmed: '2',
    lightning: '+10',
  },
]

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

function formatProfileValue(value, fallbackValue = '-') {
  if (value === null || value === undefined || value === '') {
    return fallbackValue
  }

  return String(value)
}

function formatCompactDate(value, locale) {
  if (!value) {
    return '-'
  }

  const parsedDate = new Date(value)

  if (Number.isNaN(parsedDate.getTime())) {
    return String(value)
  }

  return new Intl.DateTimeFormat(resolveLocaleTag(locale), {
    dateStyle: 'short',
  }).format(parsedDate)
}

function formatNumber(value, locale, fallbackValue = '0') {
  const parsedNumber = Number(value)

  if (!Number.isFinite(parsedNumber)) {
    return fallbackValue
  }

  return new Intl.NumberFormat(resolveLocaleTag(locale)).format(parsedNumber)
}

function splitFullName(fullName) {
  const normalizedValue = formatProfileValue(fullName, '').trim()

  if (!normalizedValue) {
    return {
      firstName: '-',
      lastName: '-',
    }
  }

  const nameParts = normalizedValue.split(/\s+/).filter(Boolean)

  if (nameParts.length === 1) {
    return {
      firstName: nameParts[0],
      lastName: '-',
    }
  }

  return {
    firstName: nameParts[0],
    lastName: nameParts.slice(1).join(' '),
  }
}

function toFiniteNumber(value, fallbackValue) {
  const parsedNumber = Number(value)
  return Number.isFinite(parsedNumber) ? parsedNumber : fallbackValue
}

function clamp(value, minValue, maxValue) {
  return Math.min(Math.max(value, minValue), maxValue)
}

function resolveProfilePresentation(profile) {
  const baseLevels =
    Array.isArray(profile?.levels) && profile.levels.length ? profile.levels : FALLBACK_LEVELS
  const levels = baseLevels.map((level, index) => ({
    id: level?.id ?? FALLBACK_LEVELS[index % FALLBACK_LEVELS.length]?.id ?? `level-${index}`,
    label: formatProfileValue(
      level?.label ?? level?.name,
      FALLBACK_LEVELS[index % FALLBACK_LEVELS.length]?.label ?? 'Уровень',
    ),
    image:
      level?.image ??
      level?.icon ??
      level?.image_url ??
      FALLBACK_LEVELS[index % FALLBACK_LEVELS.length]?.image ??
      '/mascot.png',
  }))
  const activeLevelIndex = clamp(
    toFiniteNumber(
      profile?.current_level_index ?? profile?.level_index ?? profile?.current_level - 1,
      2,
    ),
    0,
    levels.length - 1,
  )
  const currentLevelLabel =
    formatProfileValue(
      profile?.level_name ?? profile?.current_level_name,
      levels[activeLevelIndex]?.label ?? 'Ревизор',
    )
  const currentExperience = toFiniteNumber(
    profile?.experience_current ?? profile?.xp_current,
    480,
  )
  const nextExperience = toFiniteNumber(
    profile?.experience_target ?? profile?.xp_target,
    780,
  )
  const progressPercent = clamp(
    Math.round((currentExperience / Math.max(nextExperience, 1)) * 100),
    0,
    100,
  )

  return {
    levels,
    activeLevelIndex,
    currentLevelLabel,
    currentLevelNumber: activeLevelIndex + 1,
    currentExperience,
    nextExperience,
    progressPercent,
  }
}

function normalizeActivityRows(profile, locale) {
  const apiRows = Array.isArray(profile?.activity_history)
    ? profile.activity_history
    : Array.isArray(profile?.activityHistory)
      ? profile.activityHistory
      : []

  if (!apiRows.length) {
    return FALLBACK_ACTIVITY_ROWS
  }

  return apiRows.map((item, index) => ({
    activity: formatProfileValue(item?.activity ?? item?.action ?? item?.type),
    topic: formatProfileValue(item?.topic ?? item?.subject ?? item?.title),
    date: formatProfileValue(
      item?.date ?? formatCompactDate(item?.created_at, locale),
      '-',
    ),
    confirmed: formatProfileValue(
      item?.confirmed ?? item?.confirmed_count ?? item?.verifications,
      '0',
    ),
    lightning: formatProfileValue(item?.lightning ?? item?.coins ?? item?.points, '0'),
    isHighlighted: Boolean(item?.is_highlighted) || index === 0,
  }))
}

function ProfileShell({ children }) {
  return (
    <section className="mx-auto w-full max-w-[1696px] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      {children}
    </section>
  )
}

function ProfileLoadingSkeleton() {
  return (
    <ProfileShell>
      <div className="space-y-4 sm:space-y-6">
        <div className="surface-card h-[332px] animate-pulse bg-[#FFF8F5]" />
        <div className="grid gap-4 xl:grid-cols-2">
          <div className="surface-card h-[580px] animate-pulse bg-white" />
          <div className="surface-card h-[580px] animate-pulse bg-white" />
        </div>
        <div className="h-[220px] animate-pulse rounded-[28px] bg-[#FFF8F5]" />
        <div className="surface-card h-[520px] animate-pulse bg-white" />
      </div>
    </ProfileShell>
  )
}

function ProfileErrorState({ message }) {
  return (
    <ProfileShell>
      <div className="surface-card px-6 py-8 sm:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#FF622E]">
          User Cabinet
        </p>
        <h1 className="section-title mt-3">Личный кабинет</h1>
        <div className="mt-6 rounded-[24px] border border-[#FFD2C2] bg-[#FFF4EE] px-5 py-4 text-sm font-medium text-[#A24722]">
          {message}
        </div>
      </div>
    </ProfileShell>
  )
}

function ProfileHeroSection({ profile, locale }) {
  const presentation = resolveProfilePresentation(profile)

  return (
    <div className="surface-card min-h-[332px] overflow-hidden px-6 py-8 sm:px-8 lg:px-12 lg:py-12">
      <div className="grid gap-8 xl:grid-cols-[420px_minmax(0,1fr)] xl:items-center">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center xl:flex-col xl:items-start">
          <div className="flex h-[170px] w-[170px] items-center justify-center rounded-full bg-[#E4E1DE] p-3">
            <img
              src={presentation.levels[presentation.activeLevelIndex]?.image ?? '/mascot.png'}
              alt={presentation.currentLevelLabel}
              className="h-full w-full object-contain"
            />
          </div>

          <div className="flex-1">
            <span className="inline-flex h-[46px] items-center rounded-[14px] bg-[#FF622E] px-8 text-sm font-semibold text-white">
              Активный
            </span>
            <h2 className="mt-7 text-[30px] font-extrabold tracking-[-0.04em] text-[#101828] sm:text-[36px]">
              {presentation.currentLevelLabel}
            </h2>
            <p className="mt-2 text-base text-[#4A6174]">
              Уровень {presentation.currentLevelNumber} из {presentation.levels.length}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-[#8B97A5]">
              <span>Username: {formatProfileValue(profile?.tg_user_name)}</span>
              <span>Молнии: {formatNumber(profile?.coins, locale)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm font-semibold text-[#3E4C59]">
            <span>Опыт {formatNumber(presentation.currentExperience, locale)} молний</span>
            <span>Опыт {formatNumber(presentation.nextExperience, locale)} молний</span>
          </div>

          <div className="h-[32px] overflow-hidden rounded-[10px] border border-[#FFB597] bg-white">
            <div
              className="h-full rounded-[9px] bg-[#FF622E]"
              style={{ width: `${presentation.progressPercent}%` }}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            {presentation.levels.map((level, index) => {
              const isActive = index === presentation.activeLevelIndex

              return (
                <div
                  key={level.id}
                  className={`min-w-[146px] rounded-[12px] border px-4 py-3 text-center text-sm font-medium ${
                    isActive
                      ? 'border-[#FF8E69] bg-[#FFF8F5] text-[#FF622E]'
                      : 'border-[#CCD5DF] bg-white text-[#7A8699]'
                  }`}
                >
                  {level.label}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function PersonalInfoCard({ profile, onLogout }) {
  const { firstName, lastName } = splitFullName(profile?.full_name)
  const rows = [
    { label: 'Фамилия', value: lastName },
    { label: 'Имя', value: firstName },
    { label: 'Username', value: formatProfileValue(profile?.tg_user_name) },
    { label: 'Номер телефона', value: formatProfileValue(profile?.phone_number) },
  ]

  return (
    <div className="surface-card flex min-h-[580px] flex-col px-6 py-8 sm:px-8 lg:px-12 lg:py-12">
      <div className="space-y-8">
        {rows.map((row) => (
          <div key={row.label} className="border-b border-[#EEF2F7] pb-5">
            <p className="text-[18px] font-semibold text-[#101828] sm:text-[20px]">
              {row.label}
            </p>
            <p className="mt-4 text-[18px] font-medium text-[#101828]">{row.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-auto flex flex-wrap gap-3">
        <button
          type="button"
          className="inline-flex h-[52px] w-[212px] items-center justify-center gap-3 rounded-[12px] border border-[#FF8E69] bg-white text-sm font-semibold text-[#FF622E] hover:bg-[#FFF5F1]"
        >
          Confirm
          <ArrowRight size={16} />
        </button>

        <button
          type="button"
          onClick={onLogout}
          className="inline-flex h-[52px] w-[212px] items-center justify-center rounded-[12px] border border-[#E7B8A7] bg-[#FFF4EE] text-sm font-semibold text-[#A24722] hover:bg-[#FFE9E0]"
        >
          Выйти
        </button>
      </div>
    </div>
  )
}

function FeaturesCard({ profile, locale }) {
  const actionLabels = [
    'Отметить проблему на карте',
    'Создавать коллективные обращения',
    'Значок "Проверено"',
  ]

  return (
    <div className="surface-card flex min-h-[580px] flex-col px-6 py-8 sm:px-8 lg:px-12 lg:py-12">
      <h2 className="text-[24px] font-semibold tracking-[-0.03em] text-[#8B97A5]">
        Доступные возможности
      </h2>

      <div className="relative mt-5 overflow-hidden rounded-[20px] bg-[linear-gradient(135deg,#FFA158_0%,#F8B25C_100%)] px-6 py-6">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <span className="absolute -left-8 top-0 h-24 w-24 rounded-full bg-[rgba(255,120,40,0.16)]" />
          <span className="absolute left-1/3 -top-8 h-28 w-28 rounded-full bg-[rgba(255,120,40,0.16)]" />
          <span className="absolute right-3 top-8 h-16 w-16 rounded-full bg-[rgba(255,120,40,0.16)]" />
          <span className="absolute right-0 bottom-0 h-20 w-20 rounded-full bg-[rgba(255,120,40,0.16)]" />
        </div>

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-end gap-4">
            <img
              src="/mascot3.png"
              alt="Lightning mascot"
              className="h-[140px] w-[140px] shrink-0 object-contain"
            />
            <div className="pb-3 text-white">
              <p className="text-[34px] font-extrabold leading-none sm:text-[42px]">
                {formatNumber(profile?.coins ?? 265780, locale, '265 780')}
              </p>
              <p className="mt-3 text-sm font-medium text-white/90 sm:text-base">
                Текущий баланс молний
              </p>
            </div>
          </div>

          <Link
            to="/lightning-marketplace"
            className="inline-flex h-[52px] items-center justify-center gap-3 rounded-[12px] bg-white px-6 text-sm font-semibold text-[#FF622E] shadow-[0_12px_24px_rgba(116,66,22,0.14)] hover:bg-[#FFF6F2]"
          >
            Обменять молнии
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <div className="mt-8 flex flex-1 flex-col gap-4">
        {actionLabels.map((actionLabel) => (
          <button
            key={actionLabel}
            type="button"
            className="flex h-[56px] w-full items-center justify-between rounded-[12px] border border-[#FF8E69] bg-white px-5 text-left text-sm font-medium text-[#FF622E] hover:bg-[#FFF7F3]"
          >
            <span>{actionLabel}</span>
            <ArrowRight size={16} />
          </button>
        ))}
      </div>
    </div>
  )
}

function LevelPathSection({ profile }) {
  const presentation = resolveProfilePresentation(profile)

  return (
    <div className="px-2 py-8 sm:px-4">
      <div className="overflow-x-auto">
        <div className="mx-auto flex min-w-max items-center justify-center gap-4 px-2 py-4">
          {presentation.levels.map((level, index) => {
            const isActive = index === presentation.activeLevelIndex

            return (
              <div key={level.id} className="flex items-center gap-4">
                {index > 0 ? (
                  <div
                    className={`h-[4px] w-[120px] rounded-full ${
                      index <= presentation.activeLevelIndex
                        ? 'bg-[linear-gradient(90deg,#C8E5AF_0%,#FFB07B_52%,#FF622E_100%)]'
                        : 'bg-[#90A4C1]'
                    }`}
                  />
                ) : null}

                <div className="flex flex-col items-center text-center">
                  <div
                    className={`flex items-center justify-center rounded-full ${
                      isActive
                        ? 'h-[122px] w-[122px] bg-[#FF622E] shadow-[0_18px_30px_rgba(255,98,46,0.24)]'
                        : 'h-[92px] w-[92px] bg-white shadow-[0_10px_24px_rgba(18,28,45,0.08)]'
                    }`}
                  >
                    <div
                      className={`flex items-center justify-center rounded-full ${
                        isActive
                          ? 'h-[98px] w-[98px] bg-white'
                          : 'h-[82px] w-[82px] bg-[#FFF8F5]'
                      }`}
                    >
                      <img
                        src={level.image}
                        alt={level.label}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  </div>

                  <p
                    className={`mt-4 max-w-[150px] font-medium ${
                      isActive ? 'text-[18px] text-[#FF622E]' : 'text-sm text-[#6B7787]'
                    }`}
                  >
                    {level.label}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function ActivityHistoryTable({ profile, locale }) {
  const rows = normalizeActivityRows(profile, locale)
  const headers = ['АКТИВНОСТЬ', 'ТЕМА', 'ДАТА', 'ПОДТВЕРЖДЕНО', 'МОЛНИИ']

  return (
    <div className="surface-card min-h-[520px] overflow-hidden px-6 py-8 sm:px-8 lg:px-6 lg:py-10">
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0 overflow-hidden rounded-[18px]">
          <thead>
            <tr className="bg-white text-left text-xs font-bold uppercase tracking-[0.08em] text-[#4A6174]">
              {headers.map((header) => (
                <th
                  key={header}
                  className="border-b border-[#EEF2F7] px-3 py-3 lg:px-4 lg:py-3"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const isHighlighted = row.isHighlighted ?? index === 0

              return (
                <tr
                  key={`${row.activity}-${row.topic}-${row.date}-${index}`}
                  className={
                    isHighlighted
                      ? 'bg-[#FF622E] text-white'
                      : 'bg-white text-[#3E4C59]'
                  }
                >
                  <td className="border-b border-[#EEF2F7] px-3 py-3 text-sm lg:px-4">
                    {row.activity}
                  </td>
                  <td className="border-b border-[#EEF2F7] px-3 py-3 text-sm lg:px-4">
                    {row.topic}
                  </td>
                  <td className="border-b border-[#EEF2F7] px-3 py-3 text-sm lg:px-4">
                    {row.date}
                  </td>
                  <td className="border-b border-[#EEF2F7] px-3 py-3 text-sm lg:px-4">
                    {row.confirmed}
                  </td>
                  <td className="border-b border-[#EEF2F7] px-3 py-3 text-sm lg:px-4">
                    {row.lightning}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function Profile({ locale, onLocaleChange, user, onLoginSuccess }) {
  const site = getLocalizedSiteChromeContent(locale)
  const { id } = useParams()
  const navigate = useNavigate()
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

  function handleLogout() {
    clearStoredAuthSession()
    onLoginSuccess?.({
      accessToken: '',
      user: null,
    })
    navigate('/')
  }

  return (
    <SiteLayout site={site} onLocaleChange={onLocaleChange} user={user}>
      {state.isLoading ? <ProfileLoadingSkeleton /> : null}

      {!state.isLoading && state.errorMessage ? (
        <ProfileErrorState message={state.errorMessage} />
      ) : null}

      {!state.isLoading && !state.errorMessage ? (
        <ProfileShell>
          <div className="space-y-4 sm:space-y-6">
            <ProfileHeroSection profile={state.profile} locale={locale} />

            <div className="grid gap-4 xl:grid-cols-2">
              <PersonalInfoCard profile={state.profile} onLogout={handleLogout} />
              <FeaturesCard profile={state.profile} locale={locale} />
            </div>

            <LevelPathSection profile={state.profile} />

            <ActivityHistoryTable profile={state.profile} locale={locale} />
          </div>
        </ProfileShell>
      ) : null}
    </SiteLayout>
  )
}
