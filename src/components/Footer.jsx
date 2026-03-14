import { FaOdnoklassniki, FaRss, FaTelegramPlane, FaVk } from 'react-icons/fa'

const socialIconMap = {
  telegram: FaTelegramPlane,
  vk: FaVk,
  ok: FaOdnoklassniki,
  rss: FaRss,
}

export default function Footer({ footer }) {
  return (
    <footer id="footer" className="mt-10 bg-black py-10 text-white md:py-12">
      <div className="section-shell flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div className="grid flex-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {footer?.columns?.map((column) => (
            <div key={column.title}>
              <h2 className="text-sm font-bold uppercase tracking-[0.08em] text-white/55">
                {column.title}
              </h2>
              <ul className="mt-4 space-y-3">
                {column.links.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-white/75 hover:text-white">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-row gap-3">
          {footer?.social?.map((item) => {
            const Icon = socialIconMap[item.icon]

            return (
              <a
                key={item.label}
                href={item.href}
                aria-label={item.label}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-xl text-white/70 hover:border-white/25 hover:text-white"
              >
                <Icon />
              </a>
            )
          })}
        </div>
      </div>
    </footer>
  )
}
