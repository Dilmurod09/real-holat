export default function TruthAggregationBox({
  id,
  heading,
  checked = 0,
  total = 0,
  percent,
  entityLabel = 'школ',
  actions = [],
  api,
  activeCondition,
  onConditionChange,
}) {
  const resolvedPercent =
    Number.isFinite(Number(percent))
      ? Math.min(100, Math.max(0, Math.round(Number(percent))))
      : Math.min(100, Math.round(((checked || 0) / Math.max(total || 0, 1)) * 100))

  function handleActionClick(action) {
    if (action.condition) {
      onConditionChange?.(action.condition)
    }

    if (typeof document !== 'undefined' && action.href?.startsWith('#')) {
      document.querySelector(action.href)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  return (
    <section id={id} className="bg-[#F8F8F8] py-8 md:py-12">
      <div className="section-shell">
        <div
          className="surface-card px-5 py-6 sm:px-6 sm:py-7"
          data-api-endpoint={api?.endpoint}
          data-api-resource={api?.resource}
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-[#111827] sm:text-[30px]">
              {heading}: <span className="text-[#FF622E]">{checked}</span>/{total} {entityLabel}
            </h2>
            <div className="flex flex-col gap-3 sm:flex-row">
              {actions.map((action) => {
                const isActive = action.condition
                  ? action.condition === activeCondition
                  : action.variant !== 'secondary'

                return (
                  <button
                    key={action.label}
                    type="button"
                    className={isActive ? 'btn-primary' : 'btn-secondary'}
                    aria-pressed={action.condition ? isActive : undefined}
                    onClick={() => handleActionClick(action)}
                  >
                    {action.label} <span aria-hidden="true">&raquo;</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div
              className="flex h-8 flex-1 items-center overflow-hidden rounded-[14px] border border-[#FF622E] bg-white"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={resolvedPercent}
              aria-label={`${heading}: ${resolvedPercent}%`}
            >
              <div
                className="h-full rounded-[14px] bg-[#FF622E] transition-all duration-500"
                style={{ width: `${resolvedPercent}%` }}
              />
            </div>
            <div className="text-right text-3xl font-extrabold tracking-[-0.04em] text-[#111827]">
              {resolvedPercent}%
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
