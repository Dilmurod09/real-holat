import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowUpRight, MessageCircleMore, ShieldCheck } from 'lucide-react'

import { getLocalizedSiteChromeContent } from '@/content/localizedContent'
import SiteLayout from '@/layouts/SiteLayout'
import { verifyTelegramOtp } from '@/services/requests/authRequests'

const OTP_LENGTH = 6
const TELEGRAM_BOT_URL = 'https://t.me/realholatbot'

function createEmptyOtp() {
  return Array.from({ length: OTP_LENGTH }, () => '')
}

function sanitizeOtpValue(value) {
  return String(value ?? '')
    .replace(/\D/g, '')
    .slice(0, OTP_LENGTH)
}

export default function Login({
  locale,
  onLocaleChange,
  user,
  isAuthenticated,
  onLoginSuccess,
}) {
  const site = getLocalizedSiteChromeContent(locale)
  const navigate = useNavigate()
  const inputRefs = useRef([])
  const [otpDigits, setOtpDigits] = useState(() => createEmptyOtp())
  const [activeIndex, setActiveIndex] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const otpCode = otpDigits.join('')
  const isCodeComplete = otpCode.length === OTP_LENGTH

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      inputRefs.current[0]?.focus()
    }, 0)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [])

  function focusInput(index) {
    const nextIndex = Math.max(0, Math.min(index, OTP_LENGTH - 1))
    const input = inputRefs.current[nextIndex]

    if (!input) {
      return
    }

    input.focus()
    input.select()
    setActiveIndex(nextIndex)
  }

  function updateDigit(index, value) {
    setErrorMessage('')
    setOtpDigits((currentDigits) => {
      const nextDigits = [...currentDigits]
      nextDigits[index] = value
      return nextDigits
    })
  }

  function fillOtpDigits(value, startIndex = 0) {
    const nextValues = sanitizeOtpValue(value).split('')

    if (!nextValues.length) {
      return
    }

    setErrorMessage('')
    setOtpDigits((currentDigits) => {
      const nextDigits = [...currentDigits]

      nextValues.forEach((digit, offset) => {
        const targetIndex = startIndex + offset

        if (targetIndex < OTP_LENGTH) {
          nextDigits[targetIndex] = digit
        }
      })

      return nextDigits
    })

    focusInput(Math.min(startIndex + nextValues.length, OTP_LENGTH - 1))
  }

  function handleOtpChange(index, event) {
    const value = sanitizeOtpValue(event.target.value)

    if (!value) {
      updateDigit(index, '')
      return
    }

    if (value.length > 1) {
      fillOtpDigits(value, index)
      return
    }

    updateDigit(index, value)

    if (index < OTP_LENGTH - 1) {
      focusInput(index + 1)
    }
  }

  function handleOtpKeyDown(index, event) {
    if (event.key === 'Backspace') {
      event.preventDefault()

      if (otpDigits[index]) {
        updateDigit(index, '')
        return
      }

      if (index > 0) {
        updateDigit(index - 1, '')
        focusInput(index - 1)
      }

      return
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault()
      focusInput(index - 1)
    }

    if (event.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      event.preventDefault()
      focusInput(index + 1)
    }
  }

  function handleOtpPaste(index, event) {
    event.preventDefault()
    fillOtpDigits(event.clipboardData.getData('text'), index)
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!isCodeComplete) {
      setErrorMessage('Введите 6-значный код из Telegram-бота.')
      focusInput(otpDigits.findIndex((digit) => !digit))
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const authData = await verifyTelegramOtp({ code: otpCode })
      onLoginSuccess?.(authData)
      navigate('/', { replace: true })
    } catch (error) {
      setErrorMessage(error.message || 'Не удалось подтвердить код. Попробуйте ещё раз.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SiteLayout site={site} onLocaleChange={onLocaleChange} user={user}>
      <section className="section-shell py-12 md:py-20">
        <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="surface-card relative overflow-hidden border-[#F8D9CC] bg-[#FFF4EE] px-6 py-8 sm:px-8 sm:py-10 lg:px-10">
            <div className="absolute -right-12 -top-14 h-40 w-40 rounded-full bg-[#FFD7C9]/70 blur-2xl" />
            <div className="absolute -bottom-16 left-8 h-36 w-36 rounded-full bg-white/60 blur-2xl" />

            <div className="relative">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/80 bg-white/80 px-4 py-3 shadow-[0_16px_40px_rgba(255,98,46,0.08)] backdrop-blur">
                <img
                  src="/favicon.svg"
                  alt="Realholat logo"
                  className="h-11 w-11 rounded-2xl"
                />
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#FF622E]">
                    Realholat.uz
                  </p>
                  <p className="text-sm text-[#5A6673]">
                    Telegram OTP authentication
                  </p>
                </div>
              </div>

              <h1 className="section-title mt-8">Kodni Kiriting</h1>
              <p className="section-copy mt-4 max-w-xl">
                Telegram botni oching, 6 xonali OTP kodni oling va uni quyidagi
                maydonga kiriting. Если код не пришёл, откройте бот ещё раз и
                запросите новый OTP.
              </p>

              <a
                href={TELEGRAM_BOT_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#FFD2C2] bg-white px-5 py-3 text-sm font-semibold text-[#1F1F1F] shadow-[0_18px_45px_rgba(18,28,45,0.08)] hover:border-[#FF622E] hover:text-[#FF622E]"
              >
                <MessageCircleMore size={18} />
                <span>@realholatbot</span>
                <ArrowUpRight size={16} />
              </a>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/80 bg-white/80 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#FF622E]">
                    1. Telegram
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#5A6673]">
                    Нажмите на ссылку выше и откройте действующий Telegram-бот проекта.
                  </p>
                </div>

                <div className="rounded-3xl border border-white/80 bg-white/80 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#FF622E]">
                    2. OTP
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#5A6673]">
                    Получите код подтверждения в боте и введите его в форму справа.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="surface-card px-6 py-8 sm:px-8 sm:py-10">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF1EB] text-[#FF622E]">
                <ShieldCheck size={24} />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#FF622E]">
                  Secure Login
                </p>
                <p className="text-sm text-[#5A6673]">
                  Введите одноразовый код из Telegram
                </p>
              </div>
            </div>

            <form className="mt-8" onSubmit={handleSubmit}>
              <div className="flex items-center justify-between gap-2 sm:gap-3">
                {otpDigits.map((digit, index) => {
                  const isActive = activeIndex === index

                  return (
                    <input
                      key={index}
                      ref={(element) => {
                        inputRefs.current[index] = element
                      }}
                      type="text"
                      inputMode="numeric"
                      autoComplete={index === 0 ? 'one-time-code' : 'off'}
                      maxLength={OTP_LENGTH}
                      value={digit}
                      onChange={(event) => handleOtpChange(index, event)}
                      onFocus={() => setActiveIndex(index)}
                      onKeyDown={(event) => handleOtpKeyDown(index, event)}
                      onPaste={(event) => handleOtpPaste(index, event)}
                      aria-label={`OTP digit ${index + 1}`}
                      className={`h-16 w-11 rounded-2xl border text-center text-2xl font-extrabold outline-none sm:h-[4.5rem] sm:w-14 ${
                        isActive
                          ? 'border-[#FF622E] bg-[#FFF7F3] text-[#FF622E] shadow-[0_0_0_4px_rgba(255,98,46,0.12)]'
                          : 'border-[#F3E2DB] bg-white text-[#1F1F1F]'
                      }`}
                    />
                  )
                })}
              </div>

              <p className="mt-4 text-sm leading-6 text-[#5A6673]">
                Код должен состоять из 6 цифр. Поддерживается вставка полного кода
                из буфера обмена.
              </p>

              {errorMessage ? (
                <div className="mt-5 rounded-3xl border border-[#FFD2C2] bg-[#FFF4EE] px-4 py-3 text-sm font-medium text-[#A24722]">
                  {errorMessage}
                </div>
              ) : null}

              <div className="mt-8 flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? 'Проверяем код...' : 'Подтвердить код'}
                </button>

                <Link to="/" className="btn-secondary w-full text-center">
                  На главную
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
