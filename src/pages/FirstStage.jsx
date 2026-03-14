import { useRef, useState } from 'react'
import MapboxMap from '@/components/MapboxMap'
import FaqSection from '@/components/FaqSection'
import OrangeBubbleSection from '@/components/OrangeBubbleSection'
import { getLocalizedHomePageContent } from '@/content/localizedContent'
import { useInfrastructureData } from '@/hooks/useInfrastructureData'
import SiteLayout from '@/layouts/SiteLayout'

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

function ProblemAddressStep({ map }) {
  const { map: mapData } = useInfrastructureData({ map })
  const statuses = mapData?.statuses ?? []

  return (
    <section className="bg-[#FFFDFB] py-10">
      <div className="section-shell">
        <h2 className="text-base font-semibold text-[#111827]">
          Шаг 1 из 3. Адрес проблемы.
        </h2>
        <div className="mt-4 overflow-hidden rounded-[28px] border border-[#F3E2DB] bg-white shadow-[0_20px_40px_rgba(18,28,45,0.06)]">
          <div className="h-[320px] w-full sm:h-[380px] lg:h-[420px]">
            <MapboxMap map={mapData} />
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

function ProblemDescriptionStep() {
  const [files, setFiles] = useState([])
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const chosen = Array.from(e.target.files ?? [])
    if (chosen.length === 0) return
    setFiles((prev) => [...prev, ...chosen].slice(0, 3))
    e.target.value = ''
  }

  const slots = [0, 1, 2]
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
                placeholder="Кратко опишите суть проблемы"
                className="mt-2 w-full rounded-[14px] border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2 text-sm text-[#111827] outline-none focus:border-[#FF622E]"
              />
            </div>
            <div className="rounded-[24px] border border-dashed border-[#D1D5DB] bg-white px-5 py-5">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6B7280]">
                Фото и вложения
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {slots.map((_, index) => {
                  const file = files[index]
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex h-[120px] flex-col items-center justify-center gap-1 rounded-[18px] border border-dashed border-[#D1D5DB] bg-[#F9FAFB] text-xs text-[#9CA3AF] hover:border-[#FF622E] hover:bg-[#FFF8F5]"
                    >
                      {file ? (
                        <>
                          <span className="truncate px-2 text-[#1F1F1F]">
                            {file.name}
                          </span>
                          <span className="text-[10px] text-[#6B7280]">
                            {(file.size / 1024).toFixed(1)} KB
                          </span>
                        </>
                      ) : (
                        'Загрузите файл'
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-[24px] border border-[#F3E2DB] bg-white px-5 py-4">
              <label className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#6B7280]">
                Подробное описание
              </label>
              <textarea
                rows={6}
                placeholder="Расскажите, что именно происходит, как давно длится проблема и кого она затрагивает."
                className="mt-2 w-full resize-none rounded-[14px] border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2 text-sm text-[#111827] outline-none focus:border-[#FF622E]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const META_TOGGLE_LABELS = [
  'Показывать другим пользователям',
  'Коллективное обращение',
  'Подать от имени организации',
]

function ProblemMetaStep() {
  const [toggles, setToggles] = useState([true, true, true])

  const toggle = (index) => {
    setToggles((prev) => {
      const next = [...prev]
      next[index] = !next[index]
      return next
    })
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
                  placeholder="Улица, дом, ориентир"
                  className="mt-2 w-full rounded-[14px] border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2 text-sm text-[#111827] outline-none focus:border-[#FF622E]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#6B7280]">
                  Категория проблемы
                </label>
                <select className="mt-2 w-full rounded-[14px] border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2 text-sm text-[#111827] outline-none focus:border-[#FF622E]">
                  <option>Выберите категорию</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#6B7280]">
                Краткое описание
              </label>
              <input
                type="text"
                placeholder="Добавьте короткий комментарий"
                className="mt-2 w-full rounded-[14px] border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2 text-sm text-[#111827] outline-none focus:border-[#FF622E]"
              />
            </div>
          </div>
          <div className="space-y-3 rounded-[24px] border border-[#F3E2DB] bg-white px-5 py-5">
            {META_TOGGLE_LABELS.map((label, index) => {
              const isOn = toggles[index]
              return (
                <div
                  key={label}
                  className="flex items-center justify-between gap-4"
                >
                  <span className="text-sm text-[#111827]">{label}</span>
                  <button
                    type="button"
                    onClick={() => toggle(index)}
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
            })}
          </div>
        </div>
        <div>
          <button type="button" className="btn-primary text-[#fff]">
            Завершить
          </button>
        </div>
      </div>
    </section>
  )
}

export default function FirstStage({ locale, onLocaleChange, user }) {
  const { site, regionInfo, orangeBubble, faq } = getLocalizedHomePageContent(
    locale,
  )

  return (
    <SiteLayout site={site} onLocaleChange={onLocaleChange} user={user}>
      <StepHeader />
      <ProblemAddressStep map={regionInfo?.map} />
      <ProblemDescriptionStep />
      <ProblemMetaStep />
      <OrangeBubbleSection {...orangeBubble} />
      <FaqSection {...faq} />
    </SiteLayout>
  )
}
