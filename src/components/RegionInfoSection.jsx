import MapboxMap from '@/components/MapboxMap'
import StatsCardsSection from '@/components/StatsCardsSection'

const statusDotClasses = {
  red: 'bg-red-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-400',
  gray: 'bg-gray-400',
}

const statusTextClasses = {
  red: 'text-red-600',
  green: 'text-green-600',
  yellow: 'text-amber-600',
  gray: 'text-slate-500',
}

export default function RegionInfoSection({
  id,
  title,
  description,
  map,
  leaderboard,
  stats,
}) {
  return (
    <section id={id} className="w-full py-16 md:py-24">
      <div className="section-shell flex flex-col gap-10">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="section-title">{title}</h2>
          <p className="section-copy mx-auto mt-4">{description}</p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_360px]">
          <div
            className="surface-card flex min-h-[360px] flex-col justify-between overflow-hidden bg-[#EEF1F4] p-4 sm:min-h-[420px] sm:p-6"
            data-api-endpoint={map?.api?.endpoint}
            data-api-resource={map?.api?.resource}
          >
            <MapboxMap map={map} />
            <div className="mt-4 grid gap-2 rounded-[20px] bg-white/95 p-3 shadow-sm sm:grid-cols-2 xl:grid-cols-4">
              {map?.statuses?.map((status) => (
                <div key={status.label} className="flex items-center gap-2 rounded-2xl px-2 py-2">
                  <span
                    className={`inline-block h-3 w-3 rounded-full ${statusDotClasses[status.tone]}`}
                  />
                  <span className="text-xs font-semibold uppercase tracking-[0.04em] text-[#1F1F1F]">
                    {status.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div
            className="surface-card overflow-hidden"
            data-api-endpoint={leaderboard?.api?.endpoint}
            data-api-resource={leaderboard?.api?.resource}
          >
            <div className="grid grid-cols-[minmax(0,1fr)_96px_88px] border-b border-[#F2E7E2] bg-white text-xs font-bold uppercase tracking-[0.04em] text-[#1F1F1F]">
              {leaderboard?.columns?.map((column) => (
                <div key={column} className="px-4 py-4">
                  {column}
                </div>
              ))}
            </div>
            <div>
              {leaderboard?.rows?.map((row) => (
                <div
                  key={`${row.name}-${row.status}-${row.rating}`}
                  className="grid grid-cols-[minmax(0,1fr)_96px_88px] border-b border-[#F6EEEA] text-sm last:border-b-0"
                >
                  <div className="px-4 py-4 text-[#1F1F1F]">{row.name}</div>
                  <div
                    className={`px-3 py-4 text-center text-xs font-semibold uppercase tracking-[0.04em] ${statusTextClasses[row.statusTone]}`}
                  >
                    {row.status}
                  </div>
                  <div className="px-3 py-4 text-center text-[#1F1F1F]">{row.rating}</div>
                </div>
              ))}
            </div>
            <div className="grid gap-3 border-t border-[#F2E7E2] p-4 sm:grid-cols-2">
              {leaderboard?.actions?.map((action) => (
                <a
                  key={action.label}
                  href={action.href}
                  className={action.variant === 'secondary' ? 'btn-secondary' : 'btn-primary'}
                >
                  {action.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <StatsCardsSection stats={stats?.items} api={stats?.api} />
      </div>
    </section>
  )
}
