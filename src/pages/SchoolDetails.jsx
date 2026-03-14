import { useParams, Link } from 'react-router-dom'
import { Star } from 'lucide-react'
import { getSchoolById } from '@/content/schoolDetailsContent'
import { getLocalizedSiteChromeContent } from '@/content/localizedContent'
import SiteLayout from '@/layouts/SiteLayout'

const statusTextClasses = {
  green: 'text-green-600',
  yellow: 'text-amber-600',
  red: 'text-red-600',
  gray: 'text-slate-500',
}

export default function SchoolDetails({ locale, onLocaleChange, user }) {
  const { schoolId } = useParams()
  const school = getSchoolById(schoolId)
  const site = getLocalizedSiteChromeContent(locale)

  if (!school) {
    return (
      <SiteLayout site={site} onLocaleChange={onLocaleChange} user={user}>
        <div className="section-shell py-16">
          <p className="text-[#4A6174]">Школа не найдена.</p>
          <Link to="/" className="btn-primary mt-4 inline-block">
            На главную
          </Link>
        </div>
      </SiteLayout>
    )
  }

  const { name, region, image, imageAlt, stats, tasksTable, complaints } = school

  return (
    <SiteLayout site={site} onLocaleChange={onLocaleChange} user={user}>
      <section className="relative w-full overflow-hidden">
        <img
          src={image}
          alt={imageAlt}
          className="h-[320px] w-full object-cover sm:h-[380px] md:h-[420px]"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
          <div className="section-shell">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
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
                    {tasksTable.columns.map((col) => (
                      <th key={col} className="px-4 py-4">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tasksTable.rows.map((row, idx) => (
                    <tr
                      key={idx}
                      className="border-t border-[#F6EEEA] text-sm hover:bg-[#FFF8F5]"
                    >
                      <td className="px-4 py-4 font-medium text-[#1F1F1F]">{row.task}</td>
                      <td className="px-4 py-4 text-[#4A6174]">{row.period}</td>
                      <td className={`px-4 py-4 font-semibold ${statusTextClasses[row.statusTone] ?? 'text-[#1F1F1F]'}`}>
                        {row.status}
                      </td>
                      <td className="px-4 py-4 text-[#1F1F1F]">{row.responsible}</td>
                      <td className="px-4 py-4 text-[#1F1F1F]">{row.actions}</td>
                    </tr>
                  ))}
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
            {complaints.length === 0 ? (
              <p className="text-[#4A6174]">Пока нет отзывов.</p>
            ) : (
              complaints.map((item, idx) => (
                <article
                  key={idx}
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
                          className={n <= item.rating ? 'fill-[#FF622E] text-[#FF622E]' : 'text-[#E5E7EB]'}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm leading-6 text-[#4A6174]">{item.text}</p>
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.imageAlt ?? ''}
                      className="h-24 w-auto max-w-[200px] rounded-xl object-cover"
                    />
                  ) : null}
                  <Link
                    to="/first-stage"
                    className="inline-flex w-fit items-center justify-center rounded-[999px] bg-[#FF622E] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#EA5825]"
                  >
                    Подробнее
                  </Link>
                </article>
              ))
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
