import { Link } from 'react-router-dom'

function InfoAction({ action, className = '' }) {
  if (!action?.href || !action?.label) {
    return null
  }

  const toneClassName =
    action.variant === 'secondary' ? 'btn-secondary' : 'btn-primary'
  const resolvedClassName = `${toneClassName} ${className}`.trim()

  if (action.external) {
    return (
      <a
        href={action.href}
        target="_blank"
        rel="noreferrer"
        className={resolvedClassName}
      >
        {action.label}
      </a>
    )
  }

  return (
    <Link to={action.href} className={resolvedClassName}>
      {action.label}
    </Link>
  )
}

export default function InfoPage({
  eyebrow,
  title,
  description,
  actions = [],
  items = [],
  note,
}) {
  return (
    <section className="py-10 sm:py-14">
      <div className="section-shell">
        <div className="surface-card overflow-hidden">
          <div className="grid gap-8 px-6 py-8 sm:px-8 sm:py-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:px-12 lg:py-12">
            <div>
              {eyebrow ? (
                <span className="inline-flex rounded-full bg-[#FFF0E9] px-4 py-2 text-sm font-semibold text-[#FF622E]">
                  {eyebrow}
                </span>
              ) : null}

              <h1 className="section-title mt-4 max-w-[14ch] sm:max-w-none">
                {title}
              </h1>

              <p className="section-copy mt-4 max-w-2xl">{description}</p>

              {actions.length ? (
                <div className="mt-6 flex flex-wrap gap-3">
                  {actions.map((action) => (
                    <InfoAction
                      key={`${action.label}-${action.href}`}
                      action={action}
                      className="min-h-[48px] px-5 text-sm"
                    />
                  ))}
                </div>
              ) : null}
            </div>

            <div className="grid gap-4">
              {items.map((item) => (
                <article
                  key={`${item.title}-${item.meta ?? ''}`}
                  className="rounded-[22px] border border-[#F3E2DB] bg-[#FFF8F5] p-5"
                >
                  {item.meta ? (
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#FF622E]">
                      {item.meta}
                    </p>
                  ) : null}

                  <h2 className="mt-1 text-lg font-bold tracking-[-0.02em] text-[#1F1F1F]">
                    {item.title}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[#4A6174]">
                    {item.description}
                  </p>

                  {item.action ? (
                    <div className="mt-4">
                      <InfoAction
                        action={item.action}
                        className="min-h-[44px] px-4 text-sm"
                      />
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </div>

          {note ? (
            <div className="border-t border-[#F3E2DB] bg-[#FFF4EE] px-6 py-4 text-sm leading-6 text-[#8A3D20] sm:px-8 lg:px-12">
              {note}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
