import SiteLayout from '@/layouts/SiteLayout'
import { getLocalizedSiteChromeContent } from '@/content/localizedContent'

const MARKETPLACE_OFFERS = [
  {
    id: 'yaponamama-1',
    brand: 'yaponamama',
    description: 'Промокод на скидку всего меню на 70%',
    cost: '5000 баллов',
    featured: true,
  },
  {
    id: 'skillbox',
    brand: 'skillbox',
    description: 'Промокод на скидку всего меню на 70%',
    cost: '5000 баллов',
  },
  {
    id: 'proweb',
    brand: 'proweb',
    description: 'Промокод на скидку всего меню на 70%',
    cost: '5000 баллов',
  },
  {
    id: 'wok',
    brand: 'wok',
    description: 'Промокод на скидку всего меню на 70%',
    cost: '5000 баллов',
  },
  {
    id: 'car-wash',
    brand: 'carwash',
    description: 'Промокод на скидку всего меню на 70%',
    cost: '5000 баллов',
  },
  {
    id: 'chekhov',
    brand: 'chekhov',
    description: 'Промокод на скидку всего меню на 70%',
    cost: '5000 баллов',
  },
  {
    id: 'yaponamama-2',
    brand: 'yaponamama',
    description: 'Промокод на скидку всего меню на 70%',
    cost: '5000 баллов',
  },
  {
    id: 'yaponamama-3',
    brand: 'yaponamama',
    description: 'Промокод на скидку всего меню на 70%',
    cost: '5000 баллов',
  },
  {
    id: 'yaponamama-4',
    brand: 'yaponamama',
    description: 'Промокод на скидку всего меню на 70%',
    cost: '5000 баллов',
  },
]

function MarketplaceShell({ children }) {
  return (
    <section className="mx-auto w-full max-w-[1696px] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      {children}
    </section>
  )
}

function MarketplaceBanner() {
  return (
    <div className="relative overflow-hidden rounded-[28px] bg-[#F12F35] px-6 py-6 sm:px-8 sm:py-7 lg:px-12 lg:py-8">
      <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-center">
        <div className="relative flex min-h-[160px] items-end justify-center lg:min-h-[190px] lg:justify-start">
          <img
            src="/mascot3.png"
            alt="Marketplace mascot"
            className="relative z-10 h-[190px] w-auto object-contain sm:h-[220px] lg:h-[250px]"
          />
          <div className="absolute left-1/2 top-1/2 z-0 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0)_70%)] lg:left-[44%]" />
        </div>

        <div className="relative z-10 py-1 text-white">
          <img
            src="/sushi.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute pl-25 right-[-40px] top-1/2 z-0 w-[150px] -translate-y-1/2 opacity-90 sm:right-[-30px] sm:w-[400px] lg:right-[-50px] lg:w-[800px]"          />

          <div className="relative z-10 max-w-[860px] pr-14 sm:pr-28 lg:pr-44">
            <h1 className="pl-15 max-w-[800px] text-[30px] font-extrabold leading-[1.05] tracking-[-0.04em] sm:text-[38px] lg:text-[48px] sl:text-[100px]">
              Потратьте молнии с пользой ⚡
            </h1>
            <p className="pl-15 mt-3 max-w-[620px] text-[18px] font-medium leading-[1.3] text-white sm:text-[22px]">
              Обменивайте накопленные молнии на промокоды и получайте скидки!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function BrandArtwork({ brand }) {
  if (brand === 'skillbox') {
    return (
      <div className="flex h-[164px] items-center justify-center rounded-[16px] bg-[linear-gradient(135deg,#4738FF_0%,#2A29D8_100%)] px-6 text-center text-[56px] font-medium tracking-[-0.04em] text-white">
        Skillbox
      </div>
    )
  }

  if (brand === 'proweb') {
    return (
      <div className="flex h-[164px] flex-col items-center justify-center rounded-[16px] bg-black px-6 text-center text-white">
        <span className="text-[60px] font-extrabold leading-none tracking-[-0.05em]">
          PROWEB
        </span>
        <span className="mt-2 text-[18px] font-medium text-white/80">
          курсы современных профессий
        </span>
      </div>
    )
  }

  if (brand === 'wok') {
    return (
      <div className="flex h-[164px] items-center justify-center rounded-[16px] bg-white px-6 text-center">
        <span className="text-[120px] font-black uppercase leading-none tracking-[-0.08em] text-[#F97316]">
          WOK
        </span>
      </div>
    )
  }

  if (brand === 'carwash') {
    return (
      <div className="relative flex h-[164px] items-center justify-center overflow-hidden rounded-[16px] bg-white px-6 text-center">
        <div className="absolute inset-x-8 top-[26px] h-[46px] rounded-full bg-[#1A74CF]" />
        <div className="absolute inset-x-12 top-[16px] h-[26px] rounded-full border-[8px] border-[#1A74CF] border-b-0" />
        <span className="relative z-10 mt-[44px] text-[72px] font-black uppercase leading-none tracking-[-0.08em] text-[#1A74CF]">
          CAR WASH
        </span>
      </div>
    )
  }

  if (brand === 'chekhov') {
    return (
      <div className="flex h-[164px] flex-col items-center justify-center rounded-[16px] bg-[#F93134] px-6 text-center text-white">
        <span className="text-[52px] font-bold uppercase tracking-[0.12em]">CHEKHOV</span>
        <span className="mt-2 text-[12px] font-medium uppercase tracking-[0.5em] text-white/75">
          Sport Club
        </span>
      </div>
    )
  }

  return (
    <div className="flex h-[164px] flex-col items-center justify-center rounded-[16px] bg-white px-6 text-center">
      <div className="flex h-[82px] w-[82px] items-center justify-center rounded-full bg-[#F9373B]">
        <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-white text-[18px] font-bold text-[#2C3E50]">
          :)
        </div>
      </div>
      <span className="mt-5 text-[30px] font-black uppercase leading-none tracking-[-0.05em] text-[#334B67]">
        YAPONAMAMA
      </span>
      <span className="mt-1 text-[14px] font-medium text-[#5C6876]">
        Pan-Asian restaurant chain
      </span>
    </div>
  )
}

function MarketplaceOfferCard({ offer }) {
  return (
    <article className="surface-card flex min-h-[440px] flex-col rounded-[28px] px-6 py-6">
      <BrandArtwork brand={offer.brand} />

      <div className="mt-8 flex flex-1 flex-col">
        <p className="text-[18px] font-semibold leading-[1.35] text-[#111827]">
          {offer.description}
        </p>
        <p className="mt-3 text-[20px] font-extrabold leading-none text-[#111827]">
          {offer.cost}
        </p>

        <button
          type="button"
          className={`mt-auto inline-flex h-[52px] w-full items-center justify-center rounded-[12px] border text-sm font-semibold ${
            offer.featured
              ? 'border-[#FF622E] bg-[#FF622E] text-white hover:bg-[#EA5825]'
              : 'border-[#FF8E69] bg-white text-[#FF622E] hover:bg-[#FFF7F3]'
          }`}
        >
          Обменять »
        </button>
      </div>
    </article>
  )
}

export default function LightningMarketplace({ locale, onLocaleChange, user }) {
  const site = getLocalizedSiteChromeContent(locale)

  return (
    <SiteLayout site={site} onLocaleChange={onLocaleChange} user={user}>
      <section className="bg-[#F7F5F3]">
        <MarketplaceShell>
          <div className="space-y-4 sm:space-y-5">
            <MarketplaceBanner />

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {MARKETPLACE_OFFERS.map((offer) => (
                <MarketplaceOfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          </div>
        </MarketplaceShell>
      </section>
    </SiteLayout>
  )
}
