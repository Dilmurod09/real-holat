import { Link, useNavigate } from 'react-router-dom'
import { getLocalizedSiteChromeContent } from '@/content/localizedContent'
import SiteLayout from '@/layouts/SiteLayout'
import { loginWithTelegram } from '@/services/requests/authRequests'

export default function Login({ locale, onLocaleChange, user, onLoginSuccess }) {
  const site = getLocalizedSiteChromeContent(locale)
  const navigate = useNavigate()

  async function handleTelegramLogin() {
    const userData = await loginWithTelegram()
    onLoginSuccess?.(userData)
    navigate('/', { replace: true })
  }

  return (
    <SiteLayout site={site} onLocaleChange={onLocaleChange} user={user}>
      <section className="section-shell py-16 md:py-24">
        <div className="mx-auto max-w-md">
          <div className="surface-card px-6 py-10 sm:px-8 sm:py-12">
            <h1 className="section-title text-center">
              Вход через Telegram
            </h1>
            <p className="section-copy mt-4 text-center">
              Для входа в личный кабинет используется бот Telegram. Нажмите кнопку ниже — откроется диалог с ботом, после подтверждения вы вернётесь на сайт уже авторизованным.
            </p>
            <div className="mt-8 flex flex-col gap-4">
              <button
                type="button"
                onClick={handleTelegramLogin}
                className="btn-primary w-full"
              >
                Продолжить в Telegram
              </button>
              <Link
                to="/"
                className="btn-secondary w-full text-center"
              >
                На главную
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
