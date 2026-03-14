import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function FaqSection({ id, title, items = [], api }) {
  const [open, setOpen] = useState(0)

  return (
    <section
      id={id}
      className="bg-[#F8F8F8] py-12 md:py-16"
      data-api-endpoint={api?.endpoint}
      data-api-resource={api?.resource}
    >
      <div className="section-shell">
        <h2 className="section-title text-center">{title}</h2>
        <div className="mx-auto mt-8 flex max-w-3xl flex-col gap-4">
          {items.map((item, index) => {
            const isOpen = open === index

            return (
              <div key={item.question} className="surface-card overflow-hidden">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-8 sm:py-6"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${index}`}
                  onClick={() => setOpen(isOpen ? null : index)}
                >
                  <span className="pr-2 text-base font-bold text-[#1F1F1F] sm:text-lg">
                    {item.question}
                  </span>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FF622E] text-white">
                    <ChevronDown
                      size={18}
                      className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </span>
                </button>
                <div
                  id={`faq-panel-${index}`}
                  className={`grid transition-[grid-template-rows] duration-300 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm leading-7 text-[#4A6174] sm:px-8 sm:pb-6 sm:text-[15px]">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
