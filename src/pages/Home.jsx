import { useState } from 'react'

import FaqSection from '@/components/FaqSection'
import Hero from '@/components/Hero'
import OrangeBubbleSection from '@/components/OrangeBubbleSection'
import RegionInfoSection from '@/components/RegionInfoSection'
import SchoolsTableSection from '@/components/SchoolsTableSection'
import TruthAggregationBox from '@/components/TruthAggregationBox'
import { useHomePageContent } from '@/hooks/useHomePageContent'
import { useMainPageStatsData } from '@/hooks/useMainPageStatsData'
import SiteLayout from '@/layouts/SiteLayout'

export default function Home({ locale, onLocaleChange, user }) {
  const { content, error } = useHomePageContent(locale)
  const [schoolsCondition, setSchoolsCondition] = useState('best')
  const {
    stats: mainPageStats,
    truthAggregation,
    error: statsError,
  } = useMainPageStatsData({
    locale,
    stats: content.regionInfo?.stats,
    truthAggregation: content.truthAggregation,
  })
  const hasApiAlert = Boolean(error || statsError)

  return (
    <SiteLayout site={content.site} onLocaleChange={onLocaleChange} user={user}>
      {hasApiAlert ? (
        <section className="section-shell pt-4">
          <div className="rounded-2xl border border-[#FFD1C2] bg-[#FFF3ED] px-4 py-3 text-sm text-[#8A3D20]">
            {content.site?.alerts?.apiFallback}
          </div>
        </section>
      ) : null}
      <Hero {...content.hero} />
      <OrangeBubbleSection {...content.orangeBubble} />
      <RegionInfoSection {...content.regionInfo} stats={mainPageStats} />
      <TruthAggregationBox
        {...truthAggregation}
        activeCondition={schoolsCondition}
        onConditionChange={setSchoolsCondition}
      />
      <SchoolsTableSection {...content.schoolsTable} condition={schoolsCondition} />
      <FaqSection {...content.faq} />
    </SiteLayout>
  )
}
