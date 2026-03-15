import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, Search, X } from 'lucide-react'

import { fetchInfrastructures } from '@/services/requests/infrastructureRequests'

function SearchField({ search, onResultNavigate }) {
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    function handlePointerDown(event) {
      if (!containerRef.current?.contains(event.target)) {
        setIsOpen(false)
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('touchstart', handlePointerDown)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('touchstart', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  useEffect(() => {
    const trimmedQuery = query.trim()

    if (!trimmedQuery) {
      setResults([])
      setErrorMessage('')
      setIsLoading(false)
      return undefined
    }

    const controller = new AbortController()
    const timeoutId = window.setTimeout(async () => {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const { infrastructures } = await fetchInfrastructures({
          signal: controller.signal,
          query: trimmedQuery,
        })

        setResults(infrastructures)
        setIsOpen(true)
      } catch (error) {
        if (error.name === 'AbortError') {
          return
        }

        setResults([])
        setErrorMessage('Не удалось выполнить поиск. Попробуйте еще раз.')
        setIsOpen(true)
      } finally {
        setIsLoading(false)
      }
    }, 250)

    return () => {
      window.clearTimeout(timeoutId)
      controller.abort()
    }
  }, [query])

  function formatSecondaryText(item) {
    const parts = [
      item?.infrastructure_type_info?.name,
      item?.address,
    ].filter(Boolean)

    return parts.join(' · ')
  }

  function handleSelectResult(item) {
    if (!item?.id) {
      return
    }

    setQuery(item.name ?? '')
    setResults([])
    setIsOpen(false)
    onResultNavigate?.()
    navigate(`/schools/${item.id}`)
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (results[0]?.id) {
      handleSelectResult(results[0])
      return
    }

    if (query.trim()) {
      setIsOpen(true)
    }
  }

  const showDropdown = isOpen && Boolean(query.trim())

  return (
    <div ref={containerRef} className="relative w-full md:w-auto">
      <form
        className="search-box w-full md:w-auto"
        data-api-endpoint={search?.api?.endpoint}
        data-api-resource={search?.api?.resource}
        onSubmit={handleSubmit}
      >
        <input
          type="search"
          value={query}
          placeholder={search?.placeholder ?? 'Поиск'}
          className="search-input"
          aria-label={search?.buttonLabel ?? 'Искать'}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => {
            if (query.trim()) {
              setIsOpen(true)
            }
          }}
        />
        <button
          type="submit"
          className="search-btn"
          aria-label={search?.buttonLabel ?? 'Искать'}
        >
          <Search size={18} />
        </button>
      </form>

      {showDropdown ? (
        <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-40 overflow-hidden rounded-[20px] border border-[#F3E2DB] bg-white shadow-[0_24px_60px_rgba(18,28,45,0.12)]">
          {isLoading ? (
            <div className="px-4 py-4 text-sm text-[#66768A]">Ищем школы...</div>
          ) : null}

          {!isLoading && errorMessage ? (
            <div className="px-4 py-4 text-sm text-[#A24722]">{errorMessage}</div>
          ) : null}

          {!isLoading && !errorMessage && results.length === 0 ? (
            <div className="px-4 py-4 text-sm text-[#66768A]">Ничего не найдено.</div>
          ) : null}

          {!isLoading && !errorMessage && results.length > 0 ? (
            <div className="max-h-[320px] overflow-y-auto py-2">
              {results.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="flex w-full flex-col items-start px-4 py-3 text-left hover:bg-[#FFF6F2]"
                  onClick={() => handleSelectResult(item)}
                >
                  <span className="text-sm font-semibold text-[#1F1F1F]">
                    {item.name ?? 'Школа'}
                  </span>
                  <span className="mt-1 text-xs leading-5 text-[#66768A]">
                    {formatSecondaryText(item)}
                  </span>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

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
        <SearchField search={search} onResultNavigate={onActionClick} />
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
          aria-label={
            isMenuOpen ? ui?.closeMenuLabel ?? 'Close menu' : ui?.openMenuLabel ?? 'Open menu'
          }
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
