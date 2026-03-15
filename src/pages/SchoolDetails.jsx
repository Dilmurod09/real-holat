import { startTransition, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Star } from 'lucide-react'

import { getLocalizedSiteChromeContent } from '@/content/localizedContent'
import SiteLayout from '@/layouts/SiteLayout'
import {
  fetchInfrastructureById,
  fetchInfrastructureReports,
} from '@/services/requests/infrastructureRequests'
import { verifyReport } from '@/services/requests/reportRequests'

const statusTextClasses = {
  green: 'text-green-600',
  yellow: 'text-amber-600',
  red: 'text-red-600',
  gray: 'text-slate-500',
}

function createInitialState() {
  return {
    infrastructure: null,
    reportsData: null,
    errorMessage: '',
    isLoading: true,
    verifyingReportId: '',
    verificationErrorReportId: '',
    verificationErrorMessage: '',
    verifiedReportIds: [],
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

function formatTextValue(value, fallbackValue = 'Нет данных') {
  if (value === null || value === undefined || value === '') {
    return fallbackValue
  }

  return String(value)
}

function formatNumber(value, locale, fallbackValue = '0') {
  const parsedNumber = Number(value)

  if (!Number.isFinite(parsedNumber)) {
    return fallbackValue
  }

  return new Intl.NumberFormat(resolveLocaleTag(locale)).format(parsedNumber)
}

function formatRating(value) {
  const parsedNumber = Number(value)

  if (!Number.isFinite(parsedNumber)) {
    return 'Нет данных'
  }

  return Number.isInteger(parsedNumber) ? String(parsedNumber) : parsedNumber.toFixed(1)
}

function formatShortDate(value, locale) {
  if (!value) {
    return 'Нет данных'
  }

  const parsedDate = new Date(value)

  if (Number.isNaN(parsedDate.getTime())) {
    return String(value)
  }

  return new Intl.DateTimeFormat(resolveLocaleTag(locale), {
    dateStyle: 'short',
  }).format(parsedDate)
}

function clamp(value, minValue, maxValue) {
  return Math.min(Math.max(value, minValue), maxValue)
}

function resolveCheckItemStatus(isActive) {
  return isActive
    ? { label: 'АКТИВНЫЙ', tone: 'green' }
    : { label: 'НЕАКТИВНЫЙ', tone: 'gray' }
}

function getReportAuthor(report) {
  if (report?.organization_name?.trim()) {
    return report.organization_name.trim()
  }

  if (report?.group_name?.trim()) {
    return report.group_name.trim()
  }

  if (report?.user_id) {
    return `Пользователь ${String(report.user_id).slice(0, 8)}`
  }

  return 'Анонимный пользователь'
}

function getReportImage(report) {
  if (!Array.isArray(report?.photo_url)) {
    return ''
  }

  return report.photo_url.find((url) => typeof url === 'string' && url.trim()) ?? ''
}

function getReportRating(report) {
  const verificationCount = Number(report?.verification_count)

  if (!Number.isFinite(verificationCount)) {
    return 0
  }

  return clamp(Math.round(verificationCount), 0, 5)
}

function buildReportText(report, locale) {
  const parts = []

  if (report?.comment?.trim()) {
    parts.push(report.comment.trim())
  }

  if (report?.group_name?.trim()) {
    parts.push(`Группа: ${report.group_name.trim()}`)
  }

  if (report?.organization_name?.trim()) {
    parts.push(`Организация: ${report.organization_name.trim()}`)
  }

  if (report?.verification_count !== null && report?.verification_count !== undefined) {
    parts.push(`Подтверждений: ${formatNumber(report.verification_count, locale)}`)
  }

  if (report?.created_at) {
    parts.push(`Создано: ${formatShortDate(report.created_at, locale)}`)
  }

  return parts.join(' · ') || 'Комментарий не указан.'
}

function buildSchoolViewModel({ infrastructure, reportsData, locale }) {
  const checkItems = Array.isArray(infrastructure?.check_items)
    ? infrastructure.check_items
    : []
  const reports = Array.isArray(reportsData?.reports) ? reportsData.reports : []

  return {
    name: formatTextValue(infrastructure?.name, 'Школа'),
    region: formatTextValue(infrastructure?.address),
    image: '/hero-image.png',
    imageAlt: formatTextValue(infrastructure?.name, 'School image'),
    stats: [
      {
        value: formatNumber(reportsData?.participated_users_count, locale),
        label: 'Всего участников в проекте',
        tone: 'light',
      },
      {
        value: formatNumber(reportsData?.total_reports_count, locale),
        label: 'Записи (Отчеты)',
        tone: 'brand',
      },
      {
        value: formatNumber(reportsData?.verified_reports_count, locale),
        label: 'Подтверждено',
        tone: 'light',
      },
      {
        value: formatRating(
          reportsData?.infrastructure_rating ?? infrastructure?.overall_rating,
        ),
        label: 'Рейтинг объекта',
        tone: 'light',
      },
    ],
    tasksTable: {
      columns: ['ВОПРОС', 'СОЗДАНО', 'СТАТУС', 'КАТЕГОРИЯ', 'ОБНОВЛЕНО'],
      rows: checkItems.map((item) => {
        const status = resolveCheckItemStatus(Boolean(item?.is_active))

        return {
          id: item?.id,
          task: formatTextValue(item?.question),
          period: formatShortDate(item?.created_at, locale),
          status: status.label,
          statusTone: status.tone,
          responsible: formatTextValue(item?.category),
          actions: formatShortDate(item?.updated_at, locale),
        }
      }),
    },
    complaints: reports.map((report) => ({
      id: report?.id,
      infrastructureId: report?.infrastructure_id,
      verifyId: report?.id ?? report?.infrastructure_id,
      author: getReportAuthor(report),
      rating: getReportRating(report),
      text: buildReportText(report, locale),
      image: getReportImage(report),
      imageAlt: report?.comment || report?.id || 'Фото обращения',
    })),
  }
}

function SchoolDetailsLoading({ site, onLocaleChange, user }) {
  return (
    <SiteLayout site={site} onLocaleChange={onLocaleChange} user={user}>
      <section className="relative w-full overflow-hidden">
        <div className="h-[320px] w-full animate-pulse bg-[#E9E3DE] sm:h-[380px] md:h-[420px]" />
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
          <div className="section-shell">
            <div className="mb-6 h-14 max-w-[420px] animate-pulse rounded-[20px] bg-white/50" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[116px] animate-pulse rounded-[28px] bg-white/80"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F8F8F8] py-8 md:py-12">
        <div className="section-shell">
          <div className="surface-card h-[280px] animate-pulse bg-white" />
        </div>
      </section>

      <section className="bg-[#FFFDFB] py-8 md:py-12">
        <div className="section-shell">
          <div className="space-y-6">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="surface-card h-[180px] animate-pulse bg-white"
              />
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}

function SchoolDetailsError({ site, onLocaleChange, user, message }) {
  return (
    <SiteLayout site={site} onLocaleChange={onLocaleChange} user={user}>
      <div className="section-shell py-16">
        <div className="surface-card px-6 py-8 sm:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#FF622E]">
            Schools
          </p>
          <h1 className="section-title mt-3">Информация о школе недоступна</h1>
          <div className="mt-6 rounded-[24px] border border-[#FFD2C2] bg-[#FFF4EE] px-5 py-4 text-sm font-medium text-[#A24722]">
            {message}
          </div>
          <Link to="/" className="btn-primary mt-6 inline-flex">
            На главную
          </Link>
        </div>
      </div>
    </SiteLayout>
  )
}

export default function SchoolDetails({ locale, onLocaleChange, user }) {
  const { schoolId } = useParams()
  const site = getLocalizedSiteChromeContent(locale)
  const [state, setState] = useState(() => createInitialState())

  useEffect(() => {
    const controller = new AbortController()

    if (!schoolId) {
      startTransition(() => {
        setState({
          infrastructure: null,
          reportsData: null,
          errorMessage: 'Идентификатор школы не указан.',
          isLoading: false,
          verifyingReportId: '',
          verificationErrorReportId: '',
          verificationErrorMessage: '',
          verifiedReportIds: [],
        })
      })

      return undefined
    }

    startTransition(() => {
      setState(createInitialState())
    })

    async function loadSchoolDetails() {
      try {
        const [infrastructure, reportsData] = await Promise.all([
          fetchInfrastructureById({
            infrastructureId: schoolId,
            signal: controller.signal,
          }),
          fetchInfrastructureReports({
            infrastructureId: schoolId,
            signal: controller.signal,
          }),
        ])

        startTransition(() => {
          setState({
            infrastructure,
            reportsData,
            errorMessage: '',
            isLoading: false,
            verifyingReportId: '',
            verificationErrorReportId: '',
            verificationErrorMessage: '',
            verifiedReportIds: [],
          })
        })
      } catch (error) {
        if (error.name === 'AbortError') {
          return
        }

        startTransition(() => {
          setState({
            infrastructure: null,
            reportsData: null,
            errorMessage: error.message || 'Не удалось загрузить данные школы.',
            isLoading: false,
            verifyingReportId: '',
            verificationErrorReportId: '',
            verificationErrorMessage: '',
            verifiedReportIds: [],
          })
        })
      }
    }

    loadSchoolDetails()

    return () => {
      controller.abort()
    }
  }, [schoolId])

  if (state.isLoading) {
    return (
      <SchoolDetailsLoading
        site={site}
        onLocaleChange={onLocaleChange}
        user={user}
      />
    )
  }

  if (state.errorMessage || !state.infrastructure) {
    return (
      <SchoolDetailsError
        site={site}
        onLocaleChange={onLocaleChange}
        user={user}
        message={state.errorMessage || 'Не удалось загрузить данные школы.'}
      />
    )
  }

  const school = buildSchoolViewModel({
    infrastructure: state.infrastructure,
    reportsData: state.reportsData,
    locale,
  })

  async function handleVerifyReport(reportItem) {
    const targetReportId = reportItem?.verifyId

    if (!targetReportId) {
      startTransition(() => {
        setState((currentState) => ({
          ...currentState,
          verificationErrorReportId: reportItem?.id ?? '',
          verificationErrorMessage: 'Не удалось определить идентификатор обращения.',
        }))
      })
      return
    }

    startTransition(() => {
      setState((currentState) => ({
        ...currentState,
        verifyingReportId: reportItem.id,
        verificationErrorReportId: '',
        verificationErrorMessage: '',
      }))
    })

    try {
      await verifyReport({ reportId: targetReportId })

      startTransition(() => {
        setState((currentState) => {
          const nextVerifiedIds = currentState.verifiedReportIds.includes(reportItem.id)
            ? currentState.verifiedReportIds
            : [...currentState.verifiedReportIds, reportItem.id]
          const nextReports = Array.isArray(currentState.reportsData?.reports)
            ? currentState.reportsData.reports.map((report) => {
              if (report?.id !== reportItem.id) {
                return report
              }

              const currentVerificationCount = Number(report?.verification_count)

              return {
                ...report,
                verification_count: Number.isFinite(currentVerificationCount)
                  ? currentVerificationCount + 1
                  : 1,
              }
            })
            : currentState.reportsData?.reports

          return {
            ...currentState,
            reportsData: currentState.reportsData
              ? {
                ...currentState.reportsData,
                reports: nextReports,
              }
              : currentState.reportsData,
            verifyingReportId: '',
            verificationErrorReportId: '',
            verificationErrorMessage: '',
            verifiedReportIds: nextVerifiedIds,
          }
        })
      })
    } catch (error) {
      startTransition(() => {
        setState((currentState) => ({
          ...currentState,
          verifyingReportId: '',
          verificationErrorReportId: reportItem.id,
          verificationErrorMessage:
            error.message || 'Не удалось подтвердить обращение.',
        }))
      })
    }
  }

  return (
    <SiteLayout site={site} onLocaleChange={onLocaleChange} user={user}>
      <section className="relative w-full overflow-hidden">
        <img
          src={school.image}
          alt={school.imageAlt}
          className="h-[320px] w-full object-cover sm:h-[380px] md:h-[420px]"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
          <div className="section-shell">
            <div className="mb-5 max-w-[680px] text-white">
              <p className="text-sm font-medium uppercase tracking-[0.12em] text-white/80">
                {school.region}
              </p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">
                {school.name}
              </h1>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {school.stats.map((stat) => (
                <div
                  key={stat.label}
                  className={`rounded-[28px] border px-5 py-5 ${
                    stat.tone === 'brand'
                      ? 'border-transparent bg-[#FF622E] text-white shadow-[0_30px_70px_rgba(255,98,46,0.24)]'
                      : 'surface-card bg-white text-[#1F1F1F]'
                  }`}
                >
                  <div className="text-2xl font-extrabold tracking-[-0.04em] sm:text-3xl">
                    {stat.value}
                  </div>
                  <p
                    className={`mt-1 text-sm leading-6 ${
                      stat.tone === 'brand' ? 'text-white/80' : 'text-[#5C6876]'
                    }`}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F8F8F8] py-8 md:py-12">
        <div className="section-shell">
          <div className="surface-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-left">
                <thead>
                  <tr className="bg-[#FF622E] text-xs font-bold uppercase tracking-[0.08em] text-white">
                    {school.tasksTable.columns.map((col) => (
                      <th key={col} className="px-4 py-4">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {school.tasksTable.rows.map((row) => (
                    <tr
                      key={row.id ?? `${row.task}-${row.period}-${row.actions}`}
                      className="border-t border-[#F6EEEA] text-sm hover:bg-[#FFF8F5]"
                    >
                      <td className="px-4 py-4 font-medium text-[#1F1F1F]">{row.task}</td>
                      <td className="px-4 py-4 text-[#4A6174]">{row.period}</td>
                      <td
                        className={`px-4 py-4 font-semibold ${
                          statusTextClasses[row.statusTone] ?? 'text-[#1F1F1F]'
                        }`}
                      >
                        {row.status}
                      </td>
                      <td className="px-4 py-4 text-[#1F1F1F]">{row.responsible}</td>
                      <td className="px-4 py-4 text-[#1F1F1F]">{row.actions}</td>
                    </tr>
                  ))}
                  {!school.tasksTable.rows.length ? (
                    <tr className="border-t border-[#F6EEEA] text-sm">
                      <td className="px-4 py-5 text-[#4A6174]" colSpan={school.tasksTable.columns.length}>
                        Чек-лист для этой школы пока не добавлен.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#FFFDFB] py-8 md:py-12">
        <div className="section-shell">
          <h2 className="section-title mb-6">Жалобы и отзывы</h2>
          <div className="space-y-6">
            {!school.complaints.length ? (
              <p className="text-[#4A6174]">Пока нет отзывов.</p>
            ) : (
              school.complaints.map((item) => (
                <article
                  key={item.id ?? `${item.author}-${item.text}`}
                  className="surface-card flex flex-col gap-4 p-5 sm:p-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F3E2DB] text-[#1F1F1F]">
                      {item.author.charAt(0)}
                    </div>
                    <span className="font-semibold text-[#1F1F1F]">{item.author}</span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          size={18}
                          className={
                            n <= item.rating
                              ? 'fill-[#FF622E] text-[#FF622E]'
                              : 'text-[#E5E7EB]'
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm leading-6 text-[#4A6174]">{item.text}</p>
                  {item.image ? (
                    <div className="w-fit overflow-hidden rounded-[18px] border border-[#F3E2DB] bg-[#FFF8F5] shadow-[0_12px_24px_rgba(18,28,45,0.08)]">
                      <img
                        src={item.image}
                        alt={item.imageAlt}
                        className="h-[84px] w-[128px] object-cover"
                      />
                    </div>
                  ) : null}
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => handleVerifyReport(item)}
                      disabled={
                        state.verifyingReportId === item.id ||
                        state.verifiedReportIds.includes(item.id)
                      }
                      className={`inline-flex w-fit items-center justify-center rounded-[999px] px-5 py-2.5 text-sm font-semibold text-white ${
                        state.verifiedReportIds.includes(item.id)
                          ? 'bg-[#8FA2B6]'
                          : 'bg-[#FF622E] hover:bg-[#EA5825]'
                      }`}
                    >
                      {state.verifiedReportIds.includes(item.id)
                        ? 'Подтверждено'
                        : state.verifyingReportId === item.id
                          ? 'Подтверждаем...'
                          : 'Подтверждаю'}
                    </button>
                    {state.verificationErrorReportId === item.id &&
                    state.verificationErrorMessage ? (
                      <p className="text-sm text-[#A24722]">
                        {state.verificationErrorMessage}
                      </p>
                    ) : null}
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
