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

function SushiPiece({ className = '' }) {
  return (
    <div
      className={`relative h-[68px] w-[68px] rounded-[22px] bg-white shadow-[0_20px_40px_rgba(113,22,16,0.18)] ${className}`}
    >
      <span className="absolute inset-[10px] rounded-[18px] bg-[#F5F5F5]" />
      <span className="absolute inset-[14px] rounded-[16px] border-[8px] border-[#1E8E54]" />
      <span className="absolute inset-[24px] rounded-full bg-[#FF8A3D]" />
    </div>
  )
}

function DiscountBadge({ className = '' }) {
  return (
    <div
      className={`flex h-[88px] w-[88px] items-center justify-center rounded-full bg-[#E83224] text-[44px] font-extrabold leading-none text-white shadow-[0_20px_40px_rgba(110,16,12,0.18)] ${className}`}
    >
      %
    </div>
  )
}

function MarketplaceBanner() {
  return (
    <div className="relative overflow-hidden rounded-[28px] bg-[#F12F35] px-6 py-8 sm:px-8 lg:min-h-[320px] lg:px-12 lg:py-10">
      <div className="grid gap-8 lg:grid-cols-[420px_minmax(0,1fr)] lg:items-center">
        <div className="relative flex min-h-[220px] items-end justify-center lg:min-h-[240px] lg:justify-start">
          <img
            src="/mascot3.png"
            alt="Marketplace mascot"
            className="relative z-10 h-[240px] w-auto object-contain sm:h-[280px] lg:h-[330px]"
          />
          <div className="absolute left-1/2 top-1/2 z-0 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0)_70%)] lg:left-[46%]" />
          <SushiPiece className="absolute right-6 top-10 z-20 rotate-[14deg]" />
          <SushiPiece className="absolute left-4 bottom-6 z-20 -rotate-[18deg] scale-[0.88]" />
        </div>

        <div className="relative z-10 py-2 text-white">
          <h1 className="max-w-[720px] text-[34px] font-extrabold leading-[1.05] tracking-[-0.04em] sm:text-[44px] lg:text-[56px]">
            Потратьте молнии с пользой ⚡
          </h1>
          <p className="mt-5 max-w-[680px] text-[20px] font-medium leading-[1.3] text-white sm:text-[28px]">
            Обменивайте накопленные молнии на промокоды и получайте скидки!
          </p>
        </div>
      </div>

      <DiscountBadge className="absolute right-[48px] top-[18px] hidden lg:flex" />
      <DiscountBadge className="absolute right-[280px] bottom-[-10px] hidden lg:flex scale-[0.8]" />
      <SushiPiece className="absolute right-[120px] top-[110px] hidden rotate-[32deg] lg:block" />
      <SushiPiece className="absolute right-[22px] bottom-[30px] hidden -rotate-[18deg] scale-[1.05] lg:block" />
      <SushiPiece className="absolute right-[128px] bottom-[8px] hidden rotate-[10deg] scale-[0.92] lg:block" />
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
