import { Link } from 'react-router-dom'

import StatsCardsSection from '@/components/StatsCardsSection'
import { getAboutPageContent } from '@/content/aboutPageContent'
import SiteLayout from '@/layouts/SiteLayout'

function ActionButton({ action, tone = 'primary' }) {
  if (!action?.label || !action?.href) return null

  const toneClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    dark:
      'inline-flex items-center justify-center rounded-[14px] bg-[#1F1F1F] px-6 py-3 font-semibold text-white shadow-[0_18px_34px_rgba(15,23,42,0.18)] hover:bg-[#111111]',
    inverse:
      'inline-flex items-center justify-center rounded-[14px] bg-white px-6 py-3 font-semibold text-[#FF622E] shadow-[0_18px_34px_rgba(15,23,42,0.12)] hover:bg-[#FFF3ED]',
    ghost:
      'inline-flex items-center justify-center rounded-[14px] border border-white/30 bg-transparent px-6 py-3 font-semibold text-white hover:bg-white/10',
  }

  const className = toneClasses[tone] ?? toneClasses.primary

  if (action.href.startsWith('/')) {
    return (
      <Link to={action.href} className={className}>
        {action.label}
      </Link>
    )
  }

  return (
    <a href={action.href} className={className}>
      {action.label}
    </a>
  )
}

function SectionHeader({ eyebrow, title, description, align = 'left' }) {
  const alignmentClass = align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'

  return (
    <div className={alignmentClass}>
      <span className="inline-flex rounded-full bg-[#FFE6DE] px-4 py-2 text-sm font-semibold text-[#FF622E]">
        {eyebrow}
      </span>
      <h2 className="section-title mt-5">{title}</h2>
      <p className="section-copy mt-4">{description}</p>
    </div>
  )
}

export default function About({ locale, onLocaleChange, user }) {
  const content = getAboutPageContent(locale)

  return (
    <SiteLayout site={content.site} onLocaleChange={onLocaleChange} user={user}>
      <section className="section-shell py-8 md:py-12">
        <div className="surface-card overflow-hidden">
          <div className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
            <div className="px-6 py-10 sm:px-8 md:px-10 md:py-12">
              <span className="inline-flex rounded-full bg-[#FFE6DE] px-4 py-2 text-sm font-semibold text-[#FF622E]">
                {content.hero.eyebrow}
              </span>
              <h1 className="mt-5 text-[2rem] font-extrabold leading-[1.05] tracking-[-0.04em] text-[#1F1F1F] sm:text-[2.5rem] lg:text-[3.1rem]">
                {content.hero.title}
              </h1>
              <p className="section-copy mt-5 max-w-2xl">{content.hero.description}</p>

              <div className="mt-7 flex flex-wrap gap-3">
                <ActionButton action={content.hero.primaryAction} tone="primary" />
                <ActionButton action={content.hero.secondaryAction} tone="secondary" />
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {content.hero.highlights.map((highlight) => (
                  <span
                    key={highlight}
                    className="rounded-full border border-[#F3E2DB] bg-[#FFF7F3] px-4 py-2 text-sm font-semibold text-[#425466]"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden bg-[#FF622E] px-6 py-8 text-white sm:px-8 md:px-10">
              <img
                src={content.hero.panel.illustration.src}
                alt={content.hero.panel.illustration.alt}
                className="pointer-events-none absolute bottom-0 right-3 h-[170px] w-[170px] object-contain sm:right-5 sm:h-[210px] sm:w-[210px]"
              />

              <div className="relative z-10 max-w-[480px] pb-[160px] sm:pb-[190px]">
                <span className="inline-flex rounded-full bg-white/16 px-4 py-2 text-sm font-semibold text-white">
                  {content.hero.panel.eyebrow}
                </span>
                <h2 className="mt-4 text-[1.5rem] font-extrabold leading-[1.08] tracking-[-0.03em] text-white sm:text-[1.85rem]">
                  {content.hero.panel.title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-white/84 sm:text-[15px]">
                  {content.hero.panel.description}
                </p>

                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {content.hero.panel.items.map((item) => (
                    <div
                      key={item.title}
                      className="rounded-[22px] border border-white/14 bg-white/12 p-4 backdrop-blur-sm"
                    >
                      <h3 className="text-base font-extrabold tracking-[-0.02em] text-white">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-white/82">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell py-4 md:py-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="surface-card px-6 py-8 sm:px-8 md:px-10 md:py-10">
            <SectionHeader
              eyebrow={content.mission.eyebrow}
              title={content.mission.title}
              description={content.mission.description}
            />

            <div className="mt-8 rounded-[30px] bg-[#FFF4EF] p-6 sm:p-7">
              <h3 className="text-[1.4rem] font-extrabold leading-tight tracking-[-0.03em] text-[#1F1F1F]">
                {content.mission.leadCard.title}
              </h3>
              <p className="mt-3 text-[15px] leading-7 text-[#4A6174]">
                {content.mission.leadCard.description}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {content.mission.leadCard.items.map((item) => (
                  <div
                    key={item}
                    className="rounded-[20px] bg-white px-4 py-4 text-sm leading-6 text-[#24345C] shadow-[0_12px_28px_rgba(18,28,45,0.06)]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {content.mission.principles.map((principle) => (
              <article key={principle.title} className="surface-card px-6 py-6 sm:px-7">
                <h3 className="text-[1.2rem] font-extrabold leading-tight tracking-[-0.03em] text-[#1F1F1F]">
                  {principle.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#4A6174]">
                  {principle.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="about-flow" className="section-shell py-10 md:py-14">
        <SectionHeader
          eyebrow={content.workflow.eyebrow}
          title={content.workflow.title}
          description={content.workflow.description}
          align="center"
        />

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {content.workflow.steps.map((step) => {
            const isBrand = step.tone === 'brand'

            return (
              <article
                key={step.number}
                className={`rounded-[28px] border px-6 py-6 ${
                  isBrand
                    ? 'border-transparent bg-[#FF622E] text-white shadow-[0_30px_70px_rgba(255,98,46,0.24)]'
                    : 'surface-card bg-white text-[#1F1F1F]'
                }`}
              >
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] ${
                    isBrand ? 'bg-white/16 text-white' : 'bg-[#FFF4EF] text-[#FF622E]'
                  }`}
                >
                  {step.number}
                </span>
                <h3 className="mt-5 text-[1.25rem] font-extrabold leading-tight tracking-[-0.03em]">
                  {step.title}
                </h3>
                <p className={`mt-3 text-sm leading-7 ${isBrand ? 'text-white/84' : 'text-[#4A6174]'}`}>
                  {step.description}
                </p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="section-shell py-4 md:py-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="overflow-hidden rounded-[32px] bg-[#1F1F1F] px-6 py-8 text-white shadow-[0_32px_80px_rgba(18,28,45,0.18)] sm:px-8 md:px-10 md:py-10">
            <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white">
              {content.trust.eyebrow}
            </span>
            <h2 className="mt-5 text-[2rem] font-extrabold leading-[1.08] tracking-[-0.04em] text-white sm:text-[2.4rem]">
              {content.trust.title}
            </h2>
            <p className="mt-4 max-w-3xl text-[15px] leading-7 text-white/75">
              {content.trust.description}
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {content.trust.commitments.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[24px] border border-white/10 bg-white/6 p-5"
                >
                  <h3 className="text-[1.05rem] font-extrabold leading-tight tracking-[-0.02em] text-white">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-white/72">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            {content.trust.sideCards.map((card) => (
              <article key={card.title} className="surface-card px-6 py-6 sm:px-7">
                <h3 className="text-[1.15rem] font-extrabold leading-tight tracking-[-0.03em] text-[#1F1F1F]">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#4A6174]">
                  {card.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell py-10 md:py-14">
        <SectionHeader
          eyebrow={content.stats.eyebrow}
          title={content.stats.title}
          description={content.stats.description}
          align="center"
        />

        <div className="mt-8">
          <StatsCardsSection stats={content.stats.items} />
        </div>
      </section>

      <section className="section-shell pb-16 pt-4 md:pb-24">
        <div className="relative overflow-hidden rounded-[34px] bg-[#FF622E] px-6 py-8 text-white shadow-[0_34px_80px_rgba(255,98,46,0.26)] sm:px-8 md:px-10 md:py-10">
          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-[2rem] font-extrabold leading-[1.06] tracking-[-0.04em] text-white sm:text-[2.5rem]">
                {content.cta.title}
              </h2>
              <p className="mt-4 text-[15px] leading-7 text-white/82">
                {content.cta.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <ActionButton action={content.cta.primaryAction} tone="dark" />
              <ActionButton action={content.cta.secondaryAction} tone="ghost" />
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
