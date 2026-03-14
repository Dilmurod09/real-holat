export default function PagePlaceholder({ eyebrow, title, description }) {
  return (
    <section className="section-shell py-16 md:py-24">
      <div className="surface-card px-6 py-10 sm:px-8 md:px-12 md:py-14">
        {eyebrow ? (
          <span className="inline-flex rounded-full bg-[#FFE6DE] px-4 py-2 text-sm font-semibold text-[#FF622E]">
            {eyebrow}
          </span>
        ) : null}
        <div className="mt-5 max-w-3xl">
          <h1 className="section-title">{title}</h1>
          <p className="section-copy mt-4">{description}</p>
        </div>
      </div>
    </section>
  )
}
