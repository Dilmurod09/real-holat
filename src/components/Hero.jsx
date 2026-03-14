export default function Hero({
  id,
  title,
  description,
  primaryAction,
  backgroundImage,
  backgroundAlt,
  api,
}) {
  return (
    <section
      id={id}
      className="relative w-full overflow-hidden"
      data-api-endpoint={api?.endpoint}
      data-api-resource={api?.resource}
    >
      <img
        src={backgroundImage}
        alt={backgroundAlt}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/25" />

      <div className="relative z-10 mx-auto flex min-h-[380px] max-w-[1440px] items-center px-4 py-12 sm:min-h-[420px] sm:px-6 md:min-h-[460px] lg:min-h-[500px] lg:px-8">
        <div className="w-full max-w-[720px] rounded-[24px] bg-white/95 p-5 shadow-lg backdrop-blur-sm sm:p-6 md:max-w-[760px] lg:max-w-[620px] lg:p-8">
          <h1 className="text-[22px] font-extrabold leading-[1.15] text-[#1F1F1F] sm:text-[28px] md:text-[32px] lg:text-[36px]">
            {title}
          </h1>

          <p className="mt-4 text-sm leading-6 text-[#0B1F33] sm:text-[15px] sm:leading-7 md:text-base">
            {description}
          </p>

          <a href={primaryAction?.href} className="btn-primary mt-5 w-full sm:w-auto">
            {primaryAction?.label}
          </a>
        </div>
      </div>
    </section>
  )
}
