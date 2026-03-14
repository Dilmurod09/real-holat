const stepCardVariants = {
  start: {
    cardPadding: 'pl-[138px] pr-4 py-4 sm:pl-[140px] sm:pr-5',
    imageClass: 'left-3 bottom-0 w-[112px] sm:left-4 sm:w-[118px]',
    contentMax: 'max-w-[190px]',
  },
  inspect: {
    cardPadding: 'px-4 py-4 pr-[138px] sm:px-5 sm:pr-[148px]',
    imageClass: 'right-3 bottom-0 w-[118px] sm:right-4 sm:w-[124px]',
    contentMax: 'max-w-[190px]',
  },
  reward: {
    cardPadding: 'pl-[126px] pr-4 py-4 sm:pl-[132px] sm:pr-5',
    imageClass: 'left-3 bottom-[2px] w-[108px] sm:left-4 sm:w-[116px]',
    contentMax: 'max-w-[196px]',
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

function StepCard({ card, defaultIllustration }) {
  const variant = stepCardVariants[card.variant] ?? stepCardVariants.start
  const illustration = card.illustration ?? defaultIllustration

  return (
    <article className="relative min-h-[154px] overflow-hidden rounded-[14px] bg-[#ff622e] text-white sm:min-h-[164px]">
      <MascotImage
        src={illustration?.src}
        alt={illustration?.alt}
        fallbackSrc={defaultIllustration?.fallbackSrc}
        className={`pointer-events-none absolute z-10 select-none ${variant.imageClass}`}
      />

      <div className={`relative z-20 flex h-full w-full flex-col ${variant.cardPadding}`}>
        <div className={`flex h-full flex-col items-start text-left ${variant.contentMax}`}>
          <h3 className="text-[15px] font-medium leading-5 text-white">
            {card.title}
          </h3>

          <p className="mt-2 text-[14px] leading-5 text-white">
            {card.description}
          </p>

          <a
            href={card.cta?.href}
            className="mt-3 inline-flex h-[32px] w-full max-w-[228px] items-center justify-center rounded-[6px] bg-white px-5 text-[14px] font-normal text-[#2b2b2b]"
          >
            {card.cta?.label}
          </a>
        </div>
      </div>
    </article>
  )
}

export default function OrangeBubbleSection({
  id,
  title,
  paragraphs = [],
  topBubble,
  cards = [],
  illustration,
  api,
}) {
  return (
    <section
      id={id}
      className="w-full py-10 md:py-12"
      data-api-endpoint={api?.endpoint}
      data-api-resource={api?.resource}
    >
      <div className="section-shell">
        <div className="mx-auto max-w-[1240px]">
          <div className="grid items-start gap-9 xl:grid-cols-[minmax(0,1fr)_minmax(560px,700px)] xl:gap-10">
            <div className="max-w-[560px] pt-6">
              <h2 className="text-[24px] font-bold leading-[1.2] text-black sm:text-[26px]">
                {title}
              </h2>

              <div className="mt-5 space-y-4">
                {paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="max-w-[540px] text-[14px] leading-[1.45] text-[#24345c]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div className="w-full">
              <div className="relative ml-auto w-full max-w-[700px] pt-4">
                <div className="relative min-h-[228px] overflow-visible rounded-[30px] bg-[#ff622e] sm:min-h-[276px] sm:rounded-[32px] xl:min-h-[320px] xl:rounded-[38px]">
                  <div className="absolute left-0 top-0 z-10 h-[82px] w-[82px] rounded-br-[30px] bg-[#fffdfb] sm:h-[104px] sm:w-[104px] sm:rounded-br-[36px] xl:h-[132px] xl:w-[132px] xl:rounded-br-[44px]" />
                  <div className="absolute bottom-0 left-0 z-10 h-[46px] w-[142px] rounded-tr-[24px] bg-[#fffdfb] sm:h-[56px] sm:w-[188px] sm:rounded-tr-[28px] xl:h-[68px] xl:w-[252px] xl:rounded-tr-[34px]" />

                  <MascotImage
                    src={topBubble?.illustration?.src ?? illustration?.src}
                    alt={topBubble?.illustration?.alt ?? illustration?.alt}
                    fallbackSrc={illustration?.fallbackSrc}
                    className="pointer-events-none absolute bottom-[-6px] right-[-2px] z-30 h-[152px] w-[144px] max-w-none select-none object-contain sm:bottom-[-10px] sm:right-[2px] sm:h-[214px] sm:w-[206px] xl:bottom-[-12px] xl:right-[-6px] xl:h-[290px] xl:w-[290px]"
                  />

                  <div className="relative z-20 flex min-h-[228px] items-center justify-center px-5 pb-[86px] pt-9 sm:min-h-[276px] sm:px-[48px] sm:pb-[72px] sm:pt-[46px] xl:min-h-[320px] xl:px-[104px] xl:py-[56px] xl:pl-[156px] xl:pr-[232px]">
                    <div className="w-full max-w-[440px] text-center text-white">
                      <p className="m-0 whitespace-pre-line text-[16px] font-normal leading-[1.35] sm:text-[20px] xl:text-[23px]">
                        {topBubble?.title}
                      </p>

                      {topBubble?.description ? (
                        <p className="mx-auto mt-4 max-w-[360px] text-[13px] leading-[1.42] text-white/92 xl:mt-5 xl:text-[14px]">
                          {topBubble.description}
                        </p>
                      ) : null}

                      <a
                        href={topBubble?.cta?.href}
                        className={`mx-auto inline-flex w-full max-w-[420px] items-center justify-center gap-2 rounded-[12px] bg-[#f1f1f1] px-5 font-semibold uppercase tracking-[0.02em] text-[#111] shadow-[0_10px_24px_rgba(0,0,0,0.08)] ${
                          topBubble?.description
                            ? 'mt-7 min-h-[34px] text-[14px] sm:min-h-[38px] sm:text-[14px] xl:mt-9 xl:min-h-[42px] xl:rounded-[14px] xl:text-[15px]'
                            : 'mt-8 min-h-[34px] text-[14px] sm:mt-10 sm:min-h-[38px] sm:text-[14px] xl:mt-[38px] xl:min-h-[42px] xl:rounded-[14px] xl:text-[15px]'
                        }`}
                      >
                        <span>{topBubble?.cta?.label}</span>
                        <span className="text-[16px] leading-none sm:text-[18px] xl:text-[20px]">
                          &raquo;
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-9 grid gap-3 lg:grid-cols-3 lg:gap-3">
            {cards.map((card) => (
              <StepCard
                key={card.id}
                card={card}
                defaultIllustration={illustration}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
