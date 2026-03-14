import PagePlaceholder from '@/components/PagePlaceholder'
import { getLocalizedSiteChromeContent } from '@/content/localizedContent'
import SiteLayout from '@/layouts/SiteLayout'

export default function Contact({ locale, onLocaleChange, user }) {
  const site = getLocalizedSiteChromeContent(locale)
  return (
    <SiteLayout site={site} onLocaleChange={onLocaleChange} user={user}>
      <PagePlaceholder
        eyebrow="Страница в подготовке"
        title="Контакты"
        description="Здесь можно будет подключить форму обратной связи, контактные каналы ведомств, карту центров обслуживания и FAQ по обращениям. Страница уже использует общий layout и готова к подключению реального контента."
      />
    </SiteLayout>
  )
}
