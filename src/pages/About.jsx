import InfoPage from '@/components/InfoPage'
import { getInfoPageContent } from '@/content/infoPagesContent'
import { getLocalizedSiteChromeContent } from '@/content/localizedContent'
import SiteLayout from '@/layouts/SiteLayout'

export default function About({ locale, onLocaleChange, user }) {
  const site = getLocalizedSiteChromeContent(locale)
  const content = getInfoPageContent(locale).about

  return (
    <SiteLayout site={site} onLocaleChange={onLocaleChange} user={user}>
      <InfoPage {...content} />
    </SiteLayout>
  )
}
