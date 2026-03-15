import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, Search, X } from 'lucide-react'

export default function Navbar({
  brand,
  navigation = [],
  search,
  auth,
  locale,
  ui,
  onLocaleChange,
  user,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const localeOptions =
    locale?.options?.map((option) =>
      typeof option === 'string'
        ? { code: option.toLowerCase(), label: option }
        : option,
    ) ?? [
      { code: 'ru', label: 'Ru' },
      { code: 'uzb', label: 'Uzb' },
      { code: 'en', label: 'En' },
    ]
  const activeLocale = locale?.active ?? localeOptions[0]?.code ?? 'ru'
  const userDisplayName =
    user?.tg_user_name ?? user?.username ?? user?.full_name ?? null
  const userProfileHref = user?.id ? `/profile/${user.id}` : null

  const localeSwitcher = (
    <div
      className="inline-flex items-center rounded-full border border-[#F3E2DB] bg-[#FFF7F3] p-1"
      aria-label={locale?.ariaLabel ?? 'Language switcher'}
    >
      {localeOptions.map((option) => {
        const isActive = activeLocale === option.code

        return (
          <button
            key={option.code}
            type="button"
            className={`rounded-full px-3 py-1.5 text-[14px] font-semibold transition ${
              isActive
                ? 'bg-[#FF622E] text-white shadow-sm'
                : 'text-[#5A6673] hover:text-[#FF622E]'
            }`}
            aria-pressed={isActive}
            onClick={() => onLocaleChange?.(option.code)}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )

  function renderAuthAction(onActionClick) {
    if (userDisplayName) {
      if (!userProfileHref) {
        return (
          <span className="inline-flex items-center rounded-full border border-[#F3E2DB] bg-[#FFF7F3] px-4 py-2 text-[15px] font-semibold text-[#1F1F1F]">
            {userDisplayName}
          </span>
        )
      }

      return (
        <Link
          to={userProfileHref}
          className="inline-flex items-center rounded-full border border-[#F3E2DB] bg-[#FFF7F3] px-4 py-2 text-[15px] font-semibold text-[#1F1F1F] hover:border-[#FF622E] hover:text-[#FF622E]"
          onClick={onActionClick}
        >
          {userDisplayName}
        </Link>
      )
    }

    return (
      <Link
        to={auth?.href ?? '/login'}
        className="text-[16px] font-medium text-[#1F1F1F] hover:text-[#FF622E]"
        onClick={onActionClick}
      >
        {auth?.label ?? 'Войти'}
      </Link>
    )
  }

  function renderActionLinks(onActionClick) {
    return (
      <>
        <form
          className="search-box w-full md:w-auto"
          data-api-endpoint={search?.api?.endpoint}
          data-api-resource={search?.api?.resource}
          onSubmit={(event) => event.preventDefault()}
        >
          <input
            type="search"
            placeholder={search?.placeholder ?? 'Поиск'}
            className="search-input"
            aria-label={search?.buttonLabel ?? 'Искать'}
          />
          <button
            type="submit"
            className="search-btn"
            aria-label={search?.buttonLabel ?? 'Искать'}
          >
            <Search size={18} />
          </button>
        </form>

        {renderAuthAction(onActionClick)}
        {localeSwitcher}
      </>
    )
  }

  return (
    <header className="w-full border-b border-orange-100 bg-white">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          {brand?.mark ? (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF622E] text-lg font-bold text-white">
              {brand.mark}
            </div>
          ) : null}
          <span className="text-xl font-extrabold tracking-[-0.03em] text-[#1F1F1F]">
            {brand?.name ?? 'Logo'}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navigation.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="text-[16px] font-medium text-[#1F1F1F] transition hover:text-[#FF622E]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">{renderActionLinks()}</div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#F3E2DB] text-[#1F1F1F] md:hidden"
          onClick={() => setIsMenuOpen((currentState) => !currentState)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={isMenuOpen ? ui?.closeMenuLabel ?? 'Close menu' : ui?.openMenuLabel ?? 'Open menu'}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {isMenuOpen ? (
        <div
          id="mobile-navigation"
          className="border-t border-orange-100 bg-white md:hidden"
        >
          <div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-4 py-4 sm:px-6">
            <nav className="flex flex-col gap-3">
              {navigation.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="rounded-xl px-1 py-2 text-base font-semibold text-[#1F1F1F] hover:text-[#FF622E]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col gap-3">{renderActionLinks(() => setIsMenuOpen(false))}</div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
