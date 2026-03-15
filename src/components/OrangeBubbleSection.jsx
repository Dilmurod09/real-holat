import { Link } from 'react-router-dom'

const DEFAULT_PARAGRAPHS = [
  'Фиксируйте проблемы в школах, добавляйте фото и отправляйте обращения через карту или поиск  напрямую государственным органам всего за несколько секунд.',
  'Отслеживайте статус жалоб, проверки и реальные изменения — платформа показывает, что было обещано и что уже сделано.',
  'Зарабатывайте молнии, открывайте новые уровни персонажа и получайте бонусы за активное участие!',
]

const DEFAULT_BUBBLE_TITLE =
  'Начни путь ревизора! Проверяй школы, зарабатывай!\nУлучшай уровень и открывай промокоды!'

const DEFAULT_STEPS = [
  {
    id: 'step-1',
    title: 'Стань ревизором города!\nПройди регистрацию!',
    buttonLabel: 'Шаг первый',
    href: '/first-stage',
    illustration: {
      src: '/mascot2.png',
      alt: 'Первый шаг ревизора',
    },
    variant: 'start',
  },
  {
    id: 'step-2',
    title: 'Проверяй школы, зарабатывай баллы!\nОставляй отзывы и проявляй активность',
    buttonLabel: 'Шаг второй',
    href: '/first-stage',
    illustration: {
      src: '/mascot3.png',
      alt: 'Второй шаг ревизора',
    },
    variant: 'inspect',
  },
  {
    id: 'step-3',
    title: 'Улучшай уровень и открывай промокоды!\nТрать промокоды на свои плюшки',
    buttonLabel: 'Шаг третий',
    href: '/first-stage',
    illustration: {
      src: '/mascot4.png',
      alt: 'Третий шаг ревизора',
    },
    variant: 'reward',
  },
]

const stepCardVariants = {
  start: {
    cardClass:
      'pl-[124px] pr-4 py-4 sm:pl-[180px] sm:pr-5 sm:py-[27px] text-left',
    imageClass:
      'left-0 bottom-0 w-[200px] sm:left-0.1 sm:w-[180px]',
    contentClass: 'items-start text-left',
    textClass: 'max-w-[170px]',
    buttonClass: 'mt-3 min-h-[30px] w-full max-w-[195px] rounded-[8px]',
  },
  inspect: {
    cardClass:
      'pl-6 pr-[132px] py-4 sm:pl-[40px] sm:py-[18px] sm:pr-[160px] text-left',
    imageClass:
      'right-0 bottom-0 w-[132px] sm:right-1 sm:left-60 sm:w-[160px]',
    contentClass: 'items-start text-left',
    textClass: 'max-w-[185px]',
    buttonClass: 'min-h-[30px] w-full max-w-[195px] rounded-[8px]',
  },
  reward: {
    cardClass:
      'pl-[112px] pr-4 py-4 sm:pl-[170px] sm:pr-z sm:py-[18px] text-left',
    imageClass:
      'left-0 bottom-0 w-[124px] sm:left-1 sm:w-[204px]',
    contentClass: 'items-start text-right',
    textClass: 'max-w-[190px]',
    buttonClass: 'mt-3 min-h-[30px] w-full max-w-[195px] rounded-[8px]',
  },
}

function MascotImage({ src, alt, className, fallbackSrc = '/mascot.png' }) {
  return (
    <img
      src={src ?? fallbackSrc}
      alt={alt}
      className={className}
      onError={(event) => {
        if (event.currentTarget.dataset.fallbackApplied === 'true') return
        event.currentTarget.dataset.fallbackApplied = 'true'
        event.currentTarget.src = fallbackSrc
      }}
    />
  )
}

function StepCard({ step }) {
  const variant = stepCardVariants[step.variant] ?? stepCardVariants.start

  return (
    <article className="relative min-h-[116px] overflow-hidden rounded-[14px] bg-[#ff622e] shadow-[0_18px_34px_rgba(255,98,46,0.18)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.14),transparent_42%)]" />

      <MascotImage
        src={step.illustration?.src}
        alt={step.illustration?.alt}
        className={`pointer-events-none absolute z-10 select-none object-contain ${variant.imageClass}`}
      />

      <div className={`relative z-20 flex min-h-[116px] ${variant.cardClass}`}>
        <div className={`flex w-full flex-col ${variant.contentClass}`}>
          {step.variant === 'inspect' ? (
            <Link
              to={step.href}
              className={`orange-bubble-button ${variant.buttonClass}`}
            >
              {step.buttonLabel}
            </Link>
          ) : null}

          <p
            className={`whitespace-pre-line text-[13px] leading-[1.45] text-white sm:text-[14px] ${variant.textClass} ${
              step.variant === 'inspect' ? 'mt-3' : ''
            }`}
          >
            {step.title}
          </p>

          {step.variant !== 'inspect' ? (
            <Link
              to={step.href}
              className={`orange-bubble-button ${variant.buttonClass}`}
            >
              {step.buttonLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  )
}

export default function OrangeBubbleSection({
  id = 'participation',
  title = 'Расскажите, что волнует',
  paragraphs = DEFAULT_PARAGRAPHS,
  topBubble,
  illustration,
  steps = DEFAULT_STEPS,
  api,
}) {
  const bubbleTitle = topBubble?.title ?? DEFAULT_BUBBLE_TITLE
  const bubbleCtaLabel = topBubble?.cta?.label ?? 'Заполнить форму'
  const bubbleCtaHref = topBubble?.cta?.href ?? '/first-stage'
  const mascotSrc = illustration?.src ?? topBubble?.illustration?.src
  const mascotAlt =
    illustration?.alt ?? topBubble?.illustration?.alt ?? 'Маскот платформы'
  const mascotFallback = illustration?.fallbackSrc ?? '/mascot.png'

  return (
    <section
      id={id}
      className="w-full bg-[#fffdfb] py-9 md:py-10"
      data-api-endpoint={api?.endpoint}
      data-api-resource={api?.resource}
    >
      <div className="section-shell">
        <div className="mx-auto grid max-w-[1240px] items-center gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(500px,660px)] xl:gap-10">
          <div className="max-w-[560px]">
            <h2 className="text-[28px] font-black leading-[1.08] tracking-[-0.03em] text-[#141414] sm:text-[32px]">
              {title}
            </h2>

            <div className="mt-5 space-y-3.5">
              {paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-[15px] leading-6 text-[#324a60] sm:text-[16px]"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="w-full">
            <div className="relative mx-auto w-full max-w-[660px] pt-2">
              <div className="relative min-h-[216px] overflow-visible rounded-[30px] bg-[#ff622e] shadow-[0_24px_48px_rgba(255,98,46,0.24)] sm:min-h-[248px] sm:rounded-[34px] xl:min-h-[286px] xl:rounded-[40px]">
                <div className="absolute inset-[14px] rounded-[24px] bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.22),transparent_46%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.16),transparent_42%)] sm:inset-[16px] xl:inset-[20px]" />

                <MascotImage
                  src={mascotSrc}
                  alt={mascotAlt}
                  fallbackSrc={mascotFallback}
                  className="pointer-events-none absolute bottom-[-14px] right-[-2px] z-30 h-[150px] w-[136px] max-w-none select-none object-contain drop-shadow-[0_18px_24px_rgba(125,49,23,0.28)] sm:bottom-[-18px] sm:right-[4px] sm:h-[188px] sm:w-[176px] xl:bottom-[-20px] xl:right-[-10px] xl:h-[248px] xl:w-[232px]"
                />

                <div className="relative z-20 flex min-h-[216px] items-center px-5 pb-[72px] pt-7 sm:min-h-[248px] sm:px-10 sm:pb-[70px] sm:pt-9 xl:min-h-[286px] xl:px-[74px] xl:pl-[114px] xl:pr-[186px]">
                  <div className="w-full max-w-[390px] text-center text-white">
                    <p className="whitespace-pre-line text-[18px] font-semibold leading-[1.24] sm:text-[21px] xl:text-[25px]">
                      {bubbleTitle}
                    </p>

                    <Link
                      to={bubbleCtaHref}
                      className="orange-bubble-button mx-auto mt-6 min-h-[36px] w-full max-w-[280px] rounded-[10px]"
                    >
                      {bubbleCtaLabel}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-5 grid max-w-[1240px] gap-3 lg:grid-cols-3">
          {steps.map((step) => (
            <StepCard key={step.id} step={step} />
          ))}
        </div>
      </div>
    </section>
  )
}
