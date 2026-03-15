import { useMemo, useRef, useState } from 'react'
import { X } from 'lucide-react'

import MapboxMap from '@/components/MapboxMap'
import FaqSection from '@/components/FaqSection'
import OrangeBubbleSection from '@/components/OrangeBubbleSection'
import { getLocalizedHomePageContent } from '@/content/localizedContent'
import { useInfrastructureData } from '@/hooks/useInfrastructureData'
import SiteLayout from '@/layouts/SiteLayout'
import { createReport } from '@/services/requests/reportRequests'
import { uploadImageFile } from '@/services/requests/uploadRequests'

const MAX_UPLOAD_SLOTS = 3

function StepHeader() {
  return (
    <section className="border-b border-[#FFD9C7] bg-white">
      <div className="section-shell py-8">
        <div className="flex flex-col items-center gap-6">
          <div className="h-[88px] w-full max-w-[720px] bg-[url('/first-stage-header.svg')] bg-contain bg-center bg-no-repeat" />
          <div className="text-center">
            <h1 className="text-[26px] font-extrabold leading-tight tracking-[-0.03em] text-[#1F1F1F] sm:text-[30px]">
              Выявление проблемы
            </h1>
            <p className="mt-3 max-w-[720px] text-sm leading-6 text-[#4A6174] sm:text-[15px]">
              Пожалуйста, последовательно укажите адрес и описание проблемы, чтобы помочь
              органам власти быстрее разобраться в ситуации. На шаге 1 выберите место на
              карте, затем на шагах 2 и 3 дополните обращение деталями и параметрами.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

const STATUS_TONE_COLORS = {
  red: '#ef4444',
  green: '#22c55e',
  yellow: '#facc15',
  gray: '#94a3b8',
}

function createEmptyUploadSlot() {
  return {
    fileName: '',
    fileSizeLabel: '',
    url: '',
    isUploading: false,
    errorMessage: '',
  }
}

function createUploadSlots() {
  return Array.from({ length: MAX_UPLOAD_SLOTS }, () => createEmptyUploadSlot())
}

function createInitialFormState() {
  return {
    title: '',
    address: '',
    category: '',
    comment: '',
    infrastructureId: '',
    latAtSubmission: null,
    longAtSubmission: null,
    isPublic: true,
    isCollective: false,
    groupName: '',
    isOrganization: false,
    organizationName: '',
  }
}

function normalizeDisplayValue(value, fallback = 'Нет данных') {
  if (value === null || value === undefined || value === '') {
    return fallback
  }

  return String(value)
}

function extractCategoryOptions(points = [], noDataLabel = 'Нет данных') {
  const categorySet = new Set()

  points.forEach((point) => {
    const category = String(point?.type ?? '').trim()

    if (!category || category === noDataLabel) {
      return
    }

    categorySet.add(category)
  })

  return [...categorySet]
}

function ProblemAddressStep({
  mapData,
  onPointSelect,
  onReportRequest,
}) {
  const statuses = mapData?.statuses ?? []

  return (
    <section className="bg-[#FFFDFB] py-10">
      <div className="section-shell">
        <h2 className="text-base font-semibold text-[#111827]">
          Шаг 1 из 3. Адрес проблемы.
        </h2>
        <div className="mt-4 overflow-hidden rounded-[28px] border border-[#F3E2DB] bg-white shadow-[0_20px_40px_rgba(18,28,45,0.06)]">
          <div className="h-[320px] w-full sm:h-[380px] lg:h-[420px]">
            <MapboxMap
              map={mapData}
              onPointSelect={onPointSelect}
              onPopupAction={onReportRequest}
              popupActionLabel="Жаловаться"
            />
          </div>
          <div className="flex flex-col gap-4 border-t border-[#F3E2DB] bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex flex-wrap gap-3">
              {statuses.map((status) => (
                <div
                  key={status.label}
                  className="flex items-center gap-2 rounded-full bg-[#FFF4EF] px-3 py-1.5"
                >
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{
                      backgroundColor:
                        status.color ?? STATUS_TONE_COLORS[status.tone] ?? '#FF622E',
                    }}
                  />
                  <span className="text-xs font-semibold uppercase tracking-[0.06em] text-[#1F2933]">
                    {status.label}
                  </span>
                </div>
              ))}
            </div>
            <a
              href="#step-2"
              className="inline-flex items-center justify-center rounded-[999px] bg-[#FF622E] px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(255,98,46,0.35)] hover:bg-[#EA5825]"
            >
              Сообщить о проблеме
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function SelectedInfrastructureCard({ selectedInfrastructure }) {
  const details = selectedInfrastructure
    ? [
        {
          label: 'Описание',
          value: normalizeDisplayValue(selectedInfrastructure.description),
        },
        {
          label: 'Статус',
          value: normalizeDisplayValue(
            selectedInfrastructure.statusLabel ?? selectedInfrastructure.status,
          ),
        },
        {
          label: 'Рейтинг',
          value: normalizeDisplayValue(selectedInfrastructure.overallRating),
        },
        {
          label: 'Подрядчик',
          value: normalizeDisplayValue(selectedInfrastructure.contractorName),
        },
        {
          label: 'Подтверждённые жалобы',
          value: normalizeDisplayValue(selectedInfrastructure.verifiedReportsCount, '0'),
        },
      ]
    : []

  return (
    <div className="space-y-4">
      <div className="rounded-[24px] border border-[#F3E2DB] bg-white px-5 py-4">
        <label className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#6B7280]">
          Выбранный объект
        </label>

        {selectedInfrastructure ? (
          <div className="mt-3 space-y-4">
            <div>
              <p className="text-lg font-semibold text-[#111827]">
                {normalizeDisplayValue(selectedInfrastructure.name)}
              </p>
              <p className="mt-1 text-sm leading-6 text-[#4A6174]">
                {normalizeDisplayValue(selectedInfrastructure.address)}
              </p>
            </div>

            <div className="grid gap-3">
              {details.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[18px] border border-[#F3E2DB] bg-[#F9FAFB] px-4 py-3"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6B7280]">
                    {item.label}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[#111827]">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="mt-3 text-sm leading-6 text-[#4A6174]">
            Выберите объект на карте, чтобы посмотреть его описание и параметры.
          </p>
        )}
      </div>
    </div>
  )
}

function ProblemDescriptionStep({
  formState,
  onFieldChange,
  uploadSlots,
  onUploadFileSelect,
  isSubmitting,
  selectedInfrastructure,
}) {
  const fileInputRefs = useRef([])
  const slots = Array.from({ length: MAX_UPLOAD_SLOTS }, (_, index) => index)

  return (
    <section id="step-2" className="bg-[#F8F8F8] py-10">
      <div className="section-shell space-y-6">
        <h2 className="text-base font-semibold text-[#111827]">
          Шаг 2 из 3. Описание проблемы.
        </h2>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="space-y-4">
            <div className="rounded-[24px] border border-[#F3E2DB] bg-white px-5 py-4">
              <label className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#6B7280]">
                Заголовок обращения
              </label>
              <input
                type="text"
                value={formState.title}
                onChange={(event) => onFieldChange('title', event.target.value)}
                placeholder="Кратко опишите суть проблемы"
                className="mt-2 w-full rounded-[14px] border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2 text-sm text-[#111827] outline-none focus:border-[#FF622E]"
              />
            </div>
            <div className="rounded-[24px] border border-dashed border-[#D1D5DB] bg-white px-5 py-5">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6B7280]">
                Фото и вложения
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {slots.map((slotIndex) => {
                  const slot = uploadSlots[slotIndex] ?? createEmptyUploadSlot()

                  return (
                    <div key={slotIndex} className="space-y-2">
                      <input
                        ref={(element) => {
                          fileInputRefs.current[slotIndex] = element
                        }}
                        type="file"
                        accept="image/*,.pdf,.doc,.docx"
                        className="hidden"
                        onChange={(event) => {
                          const file = event.target.files?.[0]
                          if (file) {
                            onUploadFileSelect(slotIndex, file)
                          }
                          event.target.value = ''
                        }}
                      />

                      <button
                        type="button"
                        onClick={() => fileInputRefs.current[slotIndex]?.click()}
                        disabled={slot.isUploading || isSubmitting}
                        className="flex h-[120px] w-full flex-col items-center justify-center gap-1 rounded-[18px] border border-dashed border-[#D1D5DB] bg-[#F9FAFB] px-2 text-center text-xs text-[#9CA3AF] hover:border-[#FF622E] hover:bg-[#FFF8F5] disabled:cursor-wait disabled:opacity-70"
                      >
                        {slot.fileName ? (
                          <>
                            <span className="truncate px-2 text-[#1F1F1F]">
                              {slot.fileName}
                            </span>
                            <span
                              className={`text-[10px] ${
                                slot.errorMessage
                                  ? 'text-[#A12C2C]'
                                  : slot.url
                                    ? 'text-[#17663C]'
                                    : 'text-[#6B7280]'
                              }`}
                            >
                              {slot.isUploading
                                ? 'Загрузка...'
                                : slot.errorMessage
                                  ? 'Ошибка загрузки'
                                  : slot.url
                                    ? 'Файл загружен'
                                    : slot.fileSizeLabel}
                            </span>
                          </>
                        ) : (
                          'Загрузите файл'
                        )}
                      </button>

                      {slot.errorMessage ? (
                        <p className="text-[11px] leading-4 text-[#A12C2C]">
                          {slot.errorMessage}
                        </p>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <SelectedInfrastructureCard selectedInfrastructure={selectedInfrastructure} />
        </div>
      </div>
    </section>
  )
}

function ToggleRow({ label, isOn, onClick }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-[#111827]">{label}</span>
      <button
        type="button"
        onClick={onClick}
        className={`relative inline-flex h-6 w-10 shrink-0 items-center rounded-full transition-colors ${
          isOn ? 'bg-[#FF622E]' : 'bg-[#E5E7EB]'
        }`}
        aria-pressed={isOn}
      >
        <span
          className={`absolute h-4 w-4 rounded-full bg-white shadow transition-transform ${
            isOn ? 'left-[18px]' : 'left-1'
          }`}
        />
      </button>
    </div>
  )
}

function ProblemMetaStep({
  formState,
  categoryOptions,
  onFieldChange,
  onToggleChange,
  onSubmit,
  isSubmitting,
  isUploadingFiles,
  submitError,
}) {
  const resolvedCategoryOptions = [...categoryOptions]

  if (
    formState.category &&
    !resolvedCategoryOptions.includes(formState.category)
  ) {
    resolvedCategoryOptions.unshift(formState.category)
  }

  return (
    <section className="bg-[#FFFDFB] pb-10">
      <div className="section-shell space-y-6">
        <h2 className="text-base font-semibold text-[#111827]">
          Шаг 3 из 3. Параметры обращения.
        </h2>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <div className="space-y-4 rounded-[24px] border border-[#F3E2DB] bg-white px-5 py-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#6B7280]">
                  Адрес
                </label>
                <input
                  type="text"
                  value={formState.address}
                  onChange={(event) => onFieldChange('address', event.target.value)}
                  placeholder="Улица, дом, ориентир"
                  className="mt-2 w-full rounded-[14px] border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2 text-sm text-[#111827] outline-none focus:border-[#FF622E]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#6B7280]">
                  Категория проблемы
                </label>
                <select
                  value={formState.category}
                  onChange={(event) => onFieldChange('category', event.target.value)}
                  className="mt-2 w-full rounded-[14px] border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2 text-sm text-[#111827] outline-none focus:border-[#FF622E]"
                >
                  <option value="">Выберите категорию</option>
                  {resolvedCategoryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#6B7280]">
                Краткое описание
              </label>
              <input
                type="text"
                value={formState.comment}
                onChange={(event) => onFieldChange('comment', event.target.value)}
                placeholder="Добавьте короткий комментарий"
                className="mt-2 w-full rounded-[14px] border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2 text-sm text-[#111827] outline-none focus:border-[#FF622E]"
              />
            </div>
          </div>

          <div className="space-y-3 rounded-[24px] border border-[#F3E2DB] bg-white px-5 py-5">
            <ToggleRow
              label="Показывать другим пользователям"
              isOn={formState.isPublic}
              onClick={() => onToggleChange('isPublic')}
            />
            <ToggleRow
              label="Коллективное обращение"
              isOn={formState.isCollective}
              onClick={() => onToggleChange('isCollective')}
            />
            {formState.isCollective ? (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#6B7280]">
                  group_name
                </label>
                <input
                  type="text"
                  value={formState.groupName}
                  onChange={(event) => onFieldChange('groupName', event.target.value)}
                  placeholder="Перечислите участников обращения"
                  className="mt-2 w-full rounded-[14px] border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2 text-sm text-[#111827] outline-none focus:border-[#FF622E]"
                />
              </div>
            ) : null}

            <ToggleRow
              label="Подать от имени организации"
              isOn={formState.isOrganization}
              onClick={() => onToggleChange('isOrganization')}
            />
            {formState.isOrganization ? (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#6B7280]">
                  organization_name
                </label>
                <input
                  type="text"
                  value={formState.organizationName}
                  onChange={(event) =>
                    onFieldChange('organizationName', event.target.value)
                  }
                  placeholder="Введите название организации"
                  className="mt-2 w-full rounded-[14px] border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2 text-sm text-[#111827] outline-none focus:border-[#FF622E]"
                />
              </div>
            ) : null}
          </div>
        </div>

        <div className="space-y-3">
          {isUploadingFiles ? (
            <div className="rounded-[18px] border border-[#FFD9C7] bg-[#FFF4EE] px-4 py-3 text-sm text-[#8A3D20]">
              Дождитесь завершения загрузки файлов перед отправкой обращения.
            </div>
          ) : null}

          {submitError ? (
            <div className="rounded-[18px] border border-[#FFD3D3] bg-[#FFF4F4] px-4 py-3 text-sm text-[#A12C2C]">
              {submitError}
            </div>
          ) : null}

          <div>
            <button
              type="button"
              onClick={onSubmit}
              disabled={isSubmitting || isUploadingFiles}
              className="btn-primary text-[#fff] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Отправляем...' : 'Завершить'}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

function SuccessRewardModal({ reward, onClose }) {
  if (!reward) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-[rgba(17,24,39,0.28)] p-4 backdrop-blur-[4px]"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[1640px] overflow-hidden rounded-[28px] bg-[#FF622E] px-6 py-8 text-white shadow-[0_24px_60px_rgba(18,28,45,0.20)] sm:px-10 sm:py-10 lg:px-14 lg:py-12"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(255,255,255,0.14)] text-white hover:bg-[rgba(255,255,255,0.2)]"
          aria-label="Закрыть"
        >
          <X size={28} />
        </button>

        <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
          <div className="text-center lg:text-left">
            <h3 className="text-[34px] font-extrabold leading-tight tracking-[-0.03em] sm:text-[42px]">
              🎉 Ура! Вы получили {reward.givenCoins} монет!
            </h3>
            <p className="mt-6 text-[24px] font-semibold leading-tight sm:text-[30px]">
              Теперь у вас {reward.totalCoins} монет.
            </p>
            <p className="mt-3 text-lg font-medium text-white/90 sm:text-xl">
              Спасибо за ваш вклад!
            </p>

            <div className="mt-10">
              <p className="text-[44px] font-extrabold leading-none sm:text-[56px]">
                +{reward.givenCoins}⚡
              </p>
              <p className="mt-4 text-sm tracking-[0.04em] text-white/90 sm:text-base">
                Ваша активность приносит реальные изменения
              </p>
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <span className="absolute left-[18%] top-[4%] text-[52px] text-[#FFE25B]">
              ⚡
            </span>
            <span className="absolute left-[10%] top-[28%] text-[42px] text-[#FFE25B]">
              ⚡
            </span>
            <span className="absolute right-[16%] top-[6%] text-[48px] text-[#FFE25B]">
              ⚡
            </span>
            <span className="absolute right-[6%] top-[34%] text-[44px] text-[#FFE25B]">
              ⚡
            </span>
            <img
              src="/mascot.png"
              alt="Награда за активность"
              className="relative w-full max-w-[360px] object-contain drop-shadow-[0_18px_40px_rgba(18,28,45,0.20)]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FirstStage({
  locale,
  onLocaleChange,
  user,
  isAuthenticated,
}) {
  const { site, regionInfo, orangeBubble, faq } = useMemo(
    () => getLocalizedHomePageContent(locale),
    [locale],
  )
  const { map: mapData } = useInfrastructureData({ map: regionInfo?.map })
  const [selectedInfrastructure, setSelectedInfrastructure] = useState(null)
  const [formState, setFormState] = useState(() => createInitialFormState())
  const [uploadSlots, setUploadSlots] = useState(() => createUploadSlots())
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reward, setReward] = useState(null)

  const isUploadingFiles = uploadSlots.some((slot) => slot.isUploading)
  const uploadedPhotoUrls = uploadSlots
    .map((slot) => slot.url)
    .filter(Boolean)
  const categoryOptions = extractCategoryOptions(
    mapData?.points,
    mapData?.ui?.noDataLabel,
  )

  function syncFormWithInfrastructure(point) {
    if (!point) {
      return
    }

    setFormState((currentState) => ({
      ...currentState,
      title: point.name ?? '',
      address: point.address ?? '',
      category: point.infrastructureTypeName ?? point.type ?? '',
      infrastructureId: point.infrastructureId ?? point.id ?? '',
      latAtSubmission: point.latitude ?? null,
      longAtSubmission: point.longitude ?? null,
    }))
  }

  function handleFieldChange(field, value) {
    setSubmitError('')
    setFormState((currentState) => ({
      ...currentState,
      [field]: value,
    }))
  }

  function handleToggleChange(field) {
    setSubmitError('')
    setFormState((currentState) => {
      const nextValue = !currentState[field]

      return {
        ...currentState,
        [field]: nextValue,
        ...(field === 'isCollective' && !nextValue ? { groupName: '' } : {}),
        ...(field === 'isOrganization' && !nextValue
          ? { organizationName: '' }
          : {}),
      }
    })
  }

  function handlePointSelect(point) {
    setSelectedInfrastructure(point)
    setSubmitError('')
    syncFormWithInfrastructure(point)
  }

  function handleReportRequest(point) {
    setSelectedInfrastructure(point)
    setSubmitError('')
    syncFormWithInfrastructure(point)

    if (typeof document !== 'undefined') {
      document.getElementById('step-2')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  async function handleUploadFileSelect(slotIndex, file) {
    setSubmitError('')
    setUploadSlots((currentSlots) =>
      currentSlots.map((slot, index) =>
        index === slotIndex
          ? {
              fileName: file.name,
              fileSizeLabel: `${(file.size / 1024).toFixed(1)} KB`,
              url: '',
              isUploading: true,
              errorMessage: '',
            }
          : slot,
      ),
    )

    try {
      const uploadedUrl = await uploadImageFile({ file })

      setUploadSlots((currentSlots) =>
        currentSlots.map((slot, index) =>
          index === slotIndex
            ? {
                ...slot,
                url: uploadedUrl,
                isUploading: false,
                errorMessage: '',
              }
            : slot,
        ),
      )
    } catch (error) {
      setUploadSlots((currentSlots) =>
        currentSlots.map((slot, index) =>
          index === slotIndex
            ? {
                ...slot,
                url: '',
                isUploading: false,
                errorMessage: error.message || 'Не удалось загрузить файл.',
              }
            : slot,
        ),
      )
    }
  }

  async function handleSubmit() {
    setSubmitError('')
    const resolvedInfrastructureId =
      formState.infrastructureId || selectedInfrastructure?.infrastructureId || ''
    const resolvedLatitude =
      formState.latAtSubmission ?? selectedInfrastructure?.latitude ?? null
    const resolvedLongitude =
      formState.longAtSubmission ?? selectedInfrastructure?.longitude ?? null

    if (!isAuthenticated) {
      setSubmitError('Для отправки обращения сначала авторизуйтесь через Telegram.')
      return
    }

    if (isUploadingFiles) {
      setSubmitError('Дождитесь завершения загрузки файлов перед отправкой обращения.')
      return
    }

    if (
      !resolvedInfrastructureId ||
      !Number.isFinite(Number(resolvedLatitude)) ||
      !Number.isFinite(Number(resolvedLongitude))
    ) {
      setSubmitError('Выберите объект на карте.')
      return
    }

    if (!formState.comment.trim()) {
      setSubmitError('Добавьте краткое описание проблемы перед отправкой.')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await createReport({
        report: {
          infrastructure_id: resolvedInfrastructureId,
          photo_url: uploadedPhotoUrls,
          comment: formState.comment.trim(),
          lat_at_submission: Number(resolvedLatitude),
          long_at_submission: Number(resolvedLongitude),
          is_public: formState.isPublic,
          group_name: formState.isCollective ? formState.groupName.trim() : '',
          organization_name: formState.isOrganization
            ? formState.organizationName.trim()
            : '',
        },
      })

      setReward({
        givenCoins: response?.given_coins ?? 0,
        totalCoins: response?.total_coins ?? 0,
      })
      setUploadSlots(createUploadSlots())
      setFormState((currentState) => ({
        ...currentState,
        comment: '',
        isPublic: true,
        isCollective: false,
        groupName: '',
        isOrganization: false,
        organizationName: '',
      }))
    } catch (error) {
      setSubmitError(error.message || 'Не удалось отправить обращение.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SiteLayout site={site} onLocaleChange={onLocaleChange} user={user}>
      <StepHeader />
      <ProblemAddressStep
        mapData={mapData}
        onPointSelect={handlePointSelect}
        onReportRequest={handleReportRequest}
      />
      <ProblemDescriptionStep
        formState={formState}
        onFieldChange={handleFieldChange}
        uploadSlots={uploadSlots}
        onUploadFileSelect={handleUploadFileSelect}
        isSubmitting={isSubmitting}
        selectedInfrastructure={selectedInfrastructure}
      />
      <ProblemMetaStep
        formState={formState}
        categoryOptions={categoryOptions}
        onFieldChange={handleFieldChange}
        onToggleChange={handleToggleChange}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        isUploadingFiles={isUploadingFiles}
        submitError={submitError}
      />
      <OrangeBubbleSection {...orangeBubble} />
      <FaqSection {...faq} />
      <SuccessRewardModal reward={reward} onClose={() => setReward(null)} />
    </SiteLayout>
  )
}
