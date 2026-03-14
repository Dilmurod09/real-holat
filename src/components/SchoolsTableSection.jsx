import { Link } from 'react-router-dom'

export default function SchoolsTableSection({
  id,
  columns = [],
  rows = [],
  ui,
  api,
}) {
  return (
    <section id={id} className="bg-[#F8F8F8] py-8 md:py-12">
      <div className="section-shell">
        <div
          className="surface-card overflow-hidden px-3 py-4 sm:px-4 sm:py-6"
          data-api-endpoint={api?.endpoint}
          data-api-resource={api?.resource}
        >
          <div className="space-y-3 md:hidden">
            {rows.map((row) => (
              <Link
                key={`${row.num}-${row.name}`}
                to={`/schools/${row.num}`}
                className={`block rounded-[22px] border p-4 ${row.highlight ? 'border-[#FF622E] bg-[#FF622E] text-white' : 'border-[#F3E2DB] bg-white text-[#1F1F1F]'}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] opacity-80">
                      #{row.num}
                    </p>
                    <h3 className="mt-2 text-lg font-extrabold">{row.name}</h3>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.04em] ${row.highlight ? 'bg-white/15 text-white' : 'bg-[#F3E2DB] text-[#1F1F1F]'}`}>
                    {row.rating}
                  </span>
                </div>
                <dl className="mt-4 grid gap-3 text-sm">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.08em] opacity-70">
                      {ui?.taskLabel ?? 'Задача'}
                    </dt>
                    <dd className="mt-1 font-medium">{row.task}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.08em] opacity-70">
                      {ui?.regionLabel ?? 'Регион'}
                    </dt>
                    <dd className="mt-1 font-medium">{row.region}</dd>
                  </div>
                </dl>
              </Link>
            ))}
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="min-w-full border-collapse text-left">
              <caption className="sr-only">
                {ui?.caption ?? 'Список школ и текущих задач'}
              </caption>
              <thead>
                <tr className="text-xs font-bold uppercase tracking-[0.08em] text-[#222]">
                  {columns.map((column) => (
                    <th key={column} className="px-4 py-4">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={`${row.num}-${row.name}`}
                    className={
                      row.highlight
                        ? 'bg-[#FF622E] font-semibold text-white'
                        : 'border-t border-[#F6EEEA] hover:bg-[#FFF8F5]'
                    }
                  >
                    <td className="px-4 py-4">{row.num}</td>
                    <td className="px-4 py-4">
                      <Link
                        to={`/schools/${row.num}`}
                        className={`font-medium hover:underline ${row.highlight ? 'text-white' : 'text-[#1F1F1F]'}`}
                      >
                        {row.name}
                      </Link>
                    </td>
                    <td className="px-4 py-4">{row.task}</td>
                    <td className="px-4 py-4">{row.region}</td>
                    <td className="px-4 py-4">{row.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
