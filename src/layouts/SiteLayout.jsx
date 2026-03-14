import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'

export default function SiteLayout({ site, onLocaleChange, user, children }) {
  return (
    <div className="min-h-screen bg-[#FFFDFB] text-[#1F1F1F]">
      <Navbar
        brand={site?.brand}
        navigation={site?.navigation}
        search={site?.search}
        auth={site?.auth}
        locale={site?.locale}
        ui={site?.ui}
        onLocaleChange={onLocaleChange}
        user={user}
      />
      <main>{children}</main>
      <Footer footer={site?.footer} />
    </div>
  )
}
