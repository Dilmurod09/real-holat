function renderStatIcon(icon, tone) {
  const isBrand = tone === 'brand'
  const frameFill = isBrand ? '#FFFFFF' : '#FF622E'
  const iconStroke = isBrand ? '#FF622E' : '#1F1F1F'

  if (icon === 'participants') {
    return (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <rect
          x="8"
          y="8"
          width="32"
          height="32"
          rx="10"
          fill={frameFill}
          opacity={isBrand ? '0.18' : '1'}
        />
        <path
          d="M24 24C27.866 24 31 20.866 31 17C31 13.134 27.866 10 24 10C20.134 10 17 13.134 17 17C17 20.866 20.134 24 24 24ZM24 27C18.477 27 14 30.582 14 35V38H34V35C34 30.582 29.523 27 24 27Z"
          fill={iconStroke}
        />
      </svg>
    )
  }

  if (icon === 'completed') {
    return (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <rect
          x="8"
          y="8"
          width="32"
          height="32"
          rx="10"
          fill={frameFill}
          opacity={isBrand ? '0.18' : '1'}
        />
        <path
          d="M18 24L22 28L30 20"
          stroke={iconStroke}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M24 13C29.523 13 34 17.477 34 23C34 28.523 29.523 33 24 33C18.477 33 14 28.523 14 23"
          stroke={iconStroke}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect
        x="8"
        y="8"
        width="32"
        height="32"
        rx="10"
        fill={frameFill}
        opacity={isBrand ? '0.18' : '1'}
      />
      <path
        d="M18 18H30M18 24H26M18 30H24"
        stroke={iconStroke}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="31" cy="30" r="3" fill={iconStroke} />
    </svg>
  )
}

const cardToneClasses = {
  brand: 'border-transparent bg-[#FF622E] text-white shadow-[0_30px_70px_rgba(255,98,46,0.24)]',
  light: 'surface-card bg-white text-[#1F1F1F]',
}

export default function StatsCardsSection({ stats = [], api }) {
  return (
    <section
      className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
      data-api-endpoint={api?.endpoint}
      data-api-resource={api?.resource}
    >
      {stats.map((stat) => (
        <div
          key={`${stat.value}-${stat.label}`}
          className={`rounded-[28px] border px-6 py-6 ${cardToneClasses[stat.tone]}`}
        >
          <div className="mb-4">{renderStatIcon(stat.icon, stat.tone)}</div>
          <div className="text-3xl font-extrabold tracking-[-0.04em]">{stat.value}</div>
          <p
            className={`mt-2 text-sm leading-6 ${stat.tone === 'brand' ? 'text-white/80' : 'text-[#5C6876]'}`}
          >
            {stat.label}
          </p>
        </div>
      ))}
    </section>
  )
}
