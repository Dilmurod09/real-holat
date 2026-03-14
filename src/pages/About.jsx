import PagePlaceholder from '@/components/PagePlaceholder'
import { getLocalizedSiteChromeContent } from '@/content/localizedContent'
import SiteLayout from '@/layouts/SiteLayout'

export default function About({ locale, onLocaleChange, user }) {
  const site = getLocalizedSiteChromeContent(locale)
  return (
    <SiteLayout site={site} onLocaleChange={onLocaleChange} user={user}>
      <PagePlaceholder
        eyebrow="Страница в подготовке"
        title="О платформе"
        description="Здесь можно будет разместить миссию проекта, команду, правила модерации и ключевые показатели доверия. Каркас уже приведён к общему layout, поэтому новую страницу будет легко собрать из существующих секций."
      />
    </SiteLayout>
  )
}
