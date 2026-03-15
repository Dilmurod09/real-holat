import { HOME_PAGE_CONTENT } from '@/content/homePageContent'
import { siteChromeContent } from '@/content/siteContent'

export const DEFAULT_LOCALE = 'ru'
export const SUPPORTED_LOCALES = ['ru', 'uzb', 'en']

const LOCALE_OPTIONS = [
  { code: 'ru', label: 'Ru' },
  { code: 'uzb', label: 'Uzb' },
  { code: 'en', label: 'En' },
]

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function cloneContent(value) {
  if (Array.isArray(value)) {
    return value.map((item) => cloneContent(item))
  }

  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [key, cloneContent(nestedValue)]),
    )
  }

  return value
}

function mergeLocalizedContent(baseValue, overrideValue) {
  if (overrideValue === undefined) {
    return cloneContent(baseValue)
  }

  if (Array.isArray(overrideValue)) {
    return overrideValue.map((item, index) =>
      mergeLocalizedContent(baseValue?.[index], item),
    )
  }

  if (isPlainObject(overrideValue)) {
    const keys = new Set([
      ...Object.keys(baseValue ?? {}),
      ...Object.keys(overrideValue),
    ])

    return Object.fromEntries(
      [...keys].map((key) => [
        key,
        mergeLocalizedContent(baseValue?.[key], overrideValue[key]),
      ]),
    )
  }

  return overrideValue
}

export function normalizeLocale(locale) {
  return SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE
}

const SITE_CHROME_OVERRIDES = {
  ru: {
    locale: {
      active: 'ru',
      label: 'Ru',
      ariaLabel: 'Выбор языка',
      options: LOCALE_OPTIONS,
    },
    ui: {
      openMenuLabel: 'Открыть меню',
      closeMenuLabel: 'Закрыть меню',
    },
    alerts: {
      apiFallback:
        'Не удалось загрузить данные из API. На странице показан локальный контент, чтобы интерфейс продолжал работать.',
    },
  },
  uzb: {
    navigation: [
      { label: 'Bosh sahifa', href: '/' },
      { label: 'Platforma haqida', href: '/about' },
      { label: 'Kontaktlar', href: '/contact' },
    ],
    search: {
      placeholder: 'Qidiruv',
      buttonLabel: "Murojaatlar bo'yicha qidirish",
    },
    auth: {
      label: 'Kirish',
    },
    locale: {
      active: 'uzb',
      label: 'Uzb',
      ariaLabel: 'Tilni tanlash',
      options: LOCALE_OPTIONS,
    },
    ui: {
      openMenuLabel: 'Menyuni ochish',
      closeMenuLabel: 'Menyuni yopish',
    },
    alerts: {
      apiFallback:
        "API dan ma'lumotlarni yuklab bo'lmadi. Interfeys ishlashda davom etishi uchun sahifada mahalliy kontent ko'rsatilmoqda.",
    },
    footer: {
      columns: [
        {
          title: 'Fuqarolar uchun',
          links: [
            'Shaxsiy kabinet',
            'Xizmatni qanday topish',
            "Davlat xizmatlarida ro'yxatdan o'tish",
            'Yordam',
          ],
        },
        {
          title: 'Hamkorlar uchun',
          links: [
            'Biznes uchun',
            'Xorijliklar uchun',
            'Platforma hamkorlariga',
          ],
        },
        {
          title: 'Aloqa',
          links: ['Kontaktlar', 'Xizmat markazlari xaritasi'],
        },
      ],
    },
  },
  en: {
    navigation: [
      { label: 'Home', href: '/' },
      { label: 'About the platform', href: '/about' },
      { label: 'Contacts', href: '/contact' },
    ],
    search: {
      placeholder: 'Search',
      buttonLabel: 'Search appeals',
    },
    auth: {
      label: 'Sign in',
    },
    locale: {
      active: 'en',
      label: 'En',
      ariaLabel: 'Choose language',
      options: LOCALE_OPTIONS,
    },
    ui: {
      openMenuLabel: 'Open menu',
      closeMenuLabel: 'Close menu',
    },
    alerts: {
      apiFallback:
        'We could not load data from the API. Local content is shown on the page so the interface keeps working.',
    },
    footer: {
      columns: [
        {
          title: 'For citizens',
          links: [
            'Personal account',
            'How to find a service',
            'Register on e-government services',
            'Help',
          ],
        },
        {
          title: 'For partners',
          links: ['For business', 'For foreigners', 'Platform partners'],
        },
        {
          title: 'Contact',
          links: ['Contacts', 'Service center map'],
        },
      ],
    },
  },
}

const HOME_PAGE_OVERRIDES = {
  ru: {
    regionInfo: {
      map: {
        ui: {
          ratingLabel: 'Рейтинг',
          descriptionLabel: 'Описание',
          addressLabel: 'Адрес',
          statusLabel: 'Статус',
          contractorLabel: 'Подрядчик',
          checkItemsLabel: 'Чек-листы',
          routeButtonLabel: 'Построить маршрут',
          locationButtonLabel: 'Моё местоположение',
          locatingButtonLabel: 'Определяем...',
          locationReadyLabel: 'Местоположение определено',
          locationErrorLabel: 'Не удалось определить местоположение',
          routePendingLabel: 'Подготавливаем маршрут...',
          routeReadyLabel: 'Маршрут готов',
          routeFallbackLabel: 'Показываем упрощённый маршрут',
          routeErrorLabel: 'Не удалось построить маршрут',
          loadingLabel: 'Загружаем инфраструктуру...',
          emptyStateLabel: 'Инфраструктура пока не найдена.',
          apiErrorDescription:
            'Не удалось загрузить инфраструктуру. Карта продолжает работать без маркеров.',
          noDataLabel: 'Нет данных',
          untitledLabel: 'Объект инфраструктуры',
          missingTokenTitle:
            'Интерактивная карта загружается автоматически',
          missingTokenDescription:
            'Если карта не появилась, проверьте подключение к интернету и обновите страницу.',
          loadErrorTitle: 'Не удалось загрузить карту',
          loadErrorDescription:
            'Проверьте подключение к интернету и перезагрузите страницу. После этого блок перерисуется автоматически.',
        },
      },
      leaderboard: {
        ui: {
          loadingText: 'Загружаем инфраструктуру...',
          emptyText: 'Инфраструктурные объекты пока не найдены.',
          errorText:
            'Не удалось загрузить инфраструктуру. Попробуйте обновить страницу.',
        },
      },
    },
    schoolsTable: {
      ui: {
        reportsLabel: 'Жалобы',
        regionLabel: 'Регион',
        caption: 'Список школ и жалоб',
        loadingText: 'Загружаем школы...',
        emptyText: 'Школы пока не найдены.',
        errorText: 'Не удалось загрузить школы. Попробуйте обновить страницу.',
        noDataLabel: 'Нет данных',
        untitledLabel: 'Школа',
      },
    },
  },
  uzb: {
    hero: {
      title: 'Har qanday muammo haqida xabar bering va davlat organlaridan javob oling',
      description:
        '“Feedback.uz Birga hal qilamiz” ilovasi muammolarni yechishga yordam beradi. Shikoyat yuboring, savol bering, taklif kiriting, so‘rov va ovoz berishlarda qatnashing, shunda yashash sifati yaxshilanadi. Bu qulay va tez.',
      primaryAction: {
        label: 'Muammo haqida xabar berish',
      },
      backgroundAlt: 'Shahar panoramasi',
    },
    orangeBubble: {
      title: 'Sizni nima tashvishlantirayotganini ayting',
      paragraphs: [
        "Maktablardagi muammolar haqida xabar bering, foto biriktiring va murojaatlarni xarita yoki qidiruv orqali bir necha daqiqada yuboring.",
        "Murojaat holati, va'da qilingan muddatlar va haqiqiy o'zgarishlarni bitta joyda kuzatib boring.",
        'Faollik uchun ball to‘plang, qahramon darajasini oshiring va ishtirok uchun bonuslarni oching.',
      ],
      topBubble: {
        title:
          "Revizor yo'lini boshlang! Maktablarni tekshiring, ball to'plang!\nDarajani oshiring va promokodlarni oching!",
        cta: {
          label: 'Boshlash',
        },
        illustration: {
          alt: 'Birinchi darajadagi maskot',
        },
      },
      cards: [
        {
          id: 'step-1',
          variant: 'start',
          title: "Ro'yxatdan o'ting",
          description:
            "Revizor profilini yarating va birinchi tekshiruv yo'nalishingizni tanlang.",
          illustration: {
            alt: 'Birinchi qadam maskoti',
          },
          cta: {
            label: 'Birinchi qadam',
          },
        },
        {
          id: 'step-2',
          variant: 'inspect',
          title: 'Maktablarni tekshiring',
          description:
            "Fikr qoldiring, o'zgarishlarni tasdiqlang va faollik uchun ball to'plang.",
          illustration: {
            alt: 'Ikkinchi qadam maskoti',
          },
          cta: {
            label: 'Ikkinchi qadam',
          },
        },
        {
          id: 'step-3',
          variant: 'reward',
          title: 'Mukofotlarni oling',
          description:
            'Qahramon darajasini oshiring va ballarni promokodlar hamda bonuslarga almashtiring.',
          illustration: {
            alt: 'Uchinchi qadam maskoti',
          },
          cta: {
            label: 'Uchinchi qadam',
          },
        },
      ],
      illustration: {
        alt: 'Platforma maskoti',
      },
    },
    regionInfo: {
      title: 'Hududingizda nimalar so‘ralayotganini bilib oling',
      description:
        'Xaritada hududingizdagi ommaviy xabarlar va murojaatlarni ko‘ring, qo‘shnilaringizni nimalar bezovta qilayotganini va qaysi loyihalar allaqachon ishga tushganini biling.',
      map: {
        placeholder: 'Bu yerda hudud xaritasi bo‘ladi',
        points: [
          {
            id: 'project-1',
            title: 'Hojatxonalarni taʼmirlash',
            region: 'Mirobod tumani, Toshkent',
            rating: '4.5',
            statusLabel: 'Faol',
          },
          {
            id: 'project-2',
            title: 'Tomni almashtirish',
            region: 'Samarqand',
            rating: '4.1',
            statusLabel: 'Jarayonda',
          },
          {
            id: 'project-3',
            title: 'Oshxonani tekshirish',
            region: 'Andijon',
            rating: 'Baholanmagan',
            statusLabel: 'Kutilmoqda',
          },
          {
            id: 'project-4',
            title: 'Yangi sport maydonchasi',
            region: 'Buxoro',
            rating: '4.8',
            statusLabel: 'Faol',
          },
          {
            id: 'project-5',
            title: 'Sizib chiqishni bartaraf etish',
            region: 'Namangan',
            rating: '3.9',
            statusLabel: 'Tekshirilmagan',
          },
        ],
        statuses: [
          { label: 'Kutilmoqda', tone: 'red' },
          { label: 'Faol', tone: 'green' },
          { label: 'Jarayonda', tone: 'yellow' },
          { label: 'Tekshirilmagan', tone: 'gray' },
        ],
        ui: {
          ratingLabel: 'Reyting',
          descriptionLabel: 'Tavsif',
          addressLabel: 'Manzil',
          statusLabel: 'Holat',
          contractorLabel: 'Pudratchi',
          checkItemsLabel: 'Tekshiruv bandlari',
          routeButtonLabel: 'Marshrut qurish',
          locationButtonLabel: 'Mening joylashuvim',
          locatingButtonLabel: 'Aniqlanmoqda...',
          locationReadyLabel: 'Joylashuv aniqlandi',
          locationErrorLabel: 'Joylashuvni aniqlab bo‘lmadi',
          routePendingLabel: 'Marshrut tayyorlanmoqda...',
          routeReadyLabel: 'Marshrut tayyor',
          routeFallbackLabel: 'Soddalashtirilgan marshrut ko‘rsatilmoqda',
          routeErrorLabel: 'Marshrutni qurib bo‘lmadi',
          loadingLabel: 'Infratuzilma yuklanmoqda...',
          emptyStateLabel: 'Hozircha infratuzilma topilmadi.',
          apiErrorDescription:
            'Infratuzilmani yuklab bo‘lmadi. Xarita markerlarsiz ishlashda davom etadi.',
          noDataLabel: 'Maʼlumot yo‘q',
          untitledLabel: 'Infratuzilma obyekti',
          missingTokenTitle:
            'Interaktiv xarita avtomatik yuklanadi',
          missingTokenDescription:
            'Agar xarita ko‘rinmasa, internet ulanishini tekshirib sahifani qayta yuklang.',
          loadErrorTitle: 'Xaritani yuklab bo‘lmadi',
          loadErrorDescription:
            'Internet ulanishini tekshiring va sahifani qayta yuklang. Shundan so‘ng blok avtomatik yangilanadi.',
        },
      },
      leaderboard: {
        columns: ['Loyiha', 'Holat', 'Reyting'],
        rows: [
          {
            name: 'Hojatxonalarni taʼmirlash',
            status: 'Faol',
            rating: '4.5',
          },
          {
            name: 'Tomni almashtirish',
            status: 'Jarayonda',
            rating: '4.1',
          },
          {
            name: 'Oshxonani tekshirish',
            status: 'Kutilmoqda',
            rating: 'Baholanmagan',
          },
          {
            name: 'Yangi sport maydonchasi',
            status: 'Faol',
            rating: '4.8',
          },
          {
            name: 'Sizib chiqishni bartaraf etish',
            status: 'Tekshirilmagan',
            rating: '3.9',
          },
        ],
        actions: [
          { label: 'Ochish', href: '#' },
          {
            label: 'Muammo haqida xabar berish',
            href: '#schools-table',
            variant: 'secondary',
          },
        ],
        ui: {
          loadingText: 'Infratuzilma yuklanmoqda...',
          emptyText: 'Hozircha infratuzilma obyektlari topilmadi.',
          errorText:
            'Infratuzilmani yuklab bo‘lmadi. Sahifani qayta yuklab ko‘ring.',
        },
      },
      stats: {
        items: [
          {
            icon: 'participants',
            value: '0',
            label: 'jami murojaatlar',
            tone: 'light',
          },
          {
            icon: 'completed',
            value: '0',
            label: 'tasdiqlangan murojaatlar',
            tone: 'brand',
          },
          {
            icon: 'active',
            value: '0',
            label: 'ishtirok etgan foydalanuvchilar',
            tone: 'light',
          },
        ],
      },
    },
    truthAggregation: {
      heading: 'Haqiqat agregatsiyasi',
      entityLabel: 'obyekt',
      actions: [
        { label: 'Tekshirilgan', href: '#schools-table', condition: 'best' },
        {
          label: 'Tekshirilmagan',
          href: '#schools-table',
          variant: 'secondary',
          condition: 'worst',
        },
      ],
    },
    schoolsTable: {
      columns: ['Raqam', 'Nomi', 'Shikoyatlar', 'Hudud', 'Reyting'],
      rows: [],
      ui: {
        reportsLabel: 'Shikoyatlar',
        regionLabel: 'Hudud',
        caption: 'Maktablar va shikoyatlar ro‘yxati',
        loadingText: 'Maktablar yuklanmoqda...',
        emptyText: 'Hozircha maktablar topilmadi.',
        errorText: 'Maktablarni yuklab bo‘lmadi. Sahifani qayta yuklab ko‘ring.',
        noDataLabel: 'Maʼlumot yo‘q',
        untitledLabel: 'Maktab',
      },
    },
    faq: {
      title: 'Bu qanday ishlaydi?',
      items: [
        {
          question: 'Murojaat formasini qayerda to‘ldirsam bo‘ladi?',
          answer:
            'Bosh sahifadagi mos bo‘limni tanlang va forma orqali murojaat yuboring. API ulangach, bu yerda admin paneldan dolzarb ssenariylar ham yuklanadi.',
        },
        {
          question: 'Murojaatlarni kim ko‘rib chiqadi?',
          answer:
            'Har bir xabar muammoni hal qilish uchun mas’ul bo‘lgan tegishli davlat organi yoki mahalliy ma’muriyatga yuboriladi.',
        },
        {
          question: 'Javob qancha vaqtda keladi?',
          answer:
            'Standart javob muddati 30 kungacha, ammo qo‘shimcha tekshiruv talab qilinmasa, ko‘plab murojaatlar tezroq yopiladi.',
        },
        {
          question: 'Loyiha holatini kuzatish mumkinmi?',
          answer:
            'Ha, statuslar va reytinglar loyiha kartasida ham, statuslar API si ulangach, foydalanuvchining shaxsiy kabinetida ham ko‘rinadi.',
        },
        {
          question: 'Natija qanday baholanadi?',
          answer:
            'Murojaat yopilgach, foydalanuvchi baho qo‘yishi va izoh qoldirishi mumkin, tizim esa buni umumiy reytingda hisobga oladi.',
        },
      ],
    },
  },
  en: {
    hero: {
      title: 'Report any issue and get a response from public authorities',
      description:
        '“Feedback.uz We solve it together” is an app for resolving everyday issues. Submit complaints, ask questions, send proposals, and take part in polls and discussions to improve quality of life. It is simple and fast.',
      primaryAction: {
        label: 'Report an issue',
      },
      backgroundAlt: 'Panoramic city view',
    },
    orangeBubble: {
      title: 'Tell us what matters',
      paragraphs: [
        'Report school issues, attach photos, and send appeals through the map or search in just a few minutes.',
        'Track appeal statuses, promised deadlines, and real changes in one place.',
        'Earn points for activity, level up your mascot, and unlock bonuses for participation.',
      ],
      topBubble: {
        title:
          'Start your inspector journey! Check schools, earn points!\nLevel up and unlock promo codes!',
        cta: {
          label: 'Start',
        },
        illustration: {
          alt: 'Level one mascot',
        },
      },
      cards: [
        {
          id: 'step-1',
          variant: 'start',
          title: 'Register',
          description:
            'Create your inspector profile and choose your first inspection route.',
          illustration: {
            alt: 'Step one mascot',
          },
          cta: {
            label: 'Step one',
          },
        },
        {
          id: 'step-2',
          variant: 'inspect',
          title: 'Inspect schools',
          description:
            'Leave feedback, confirm changes, and earn points for staying active.',
          illustration: {
            alt: 'Step two mascot',
          },
          cta: {
            label: 'Step two',
          },
        },
        {
          id: 'step-3',
          variant: 'reward',
          title: 'Get rewards',
          description:
            'Level up your mascot and exchange points for promo codes and bonuses.',
          illustration: {
            alt: 'Step three mascot',
          },
          cta: {
            label: 'Step three',
          },
        },
      ],
      illustration: {
        alt: 'Platform mascot',
      },
    },
    regionInfo: {
      title: 'See what people are asking in your region',
      description:
        'Browse public messages and appeals on the map, learn what concerns your neighbors, and see which projects are already moving forward.',
      map: {
        placeholder: 'The regional map will appear here',
        points: [
          {
            id: 'project-1',
            title: 'Restroom renovation',
            region: 'Mirabad district, Tashkent',
            rating: '4.5',
            statusLabel: 'Active',
          },
          {
            id: 'project-2',
            title: 'Roof replacement',
            region: 'Samarkand',
            rating: '4.1',
            statusLabel: 'In progress',
          },
          {
            id: 'project-3',
            title: 'Cafeteria inspection',
            region: 'Andijan',
            rating: 'No rating',
            statusLabel: 'Pending',
          },
          {
            id: 'project-4',
            title: 'New sports ground',
            region: 'Bukhara',
            rating: '4.8',
            statusLabel: 'Active',
          },
          {
            id: 'project-5',
            title: 'Leak repair',
            region: 'Namangan',
            rating: '3.9',
            statusLabel: 'Not verified',
          },
        ],
        statuses: [
          { label: 'Pending', tone: 'red' },
          { label: 'Active', tone: 'green' },
          { label: 'In progress', tone: 'yellow' },
          { label: 'Not verified', tone: 'gray' },
        ],
        ui: {
          ratingLabel: 'Rating',
          descriptionLabel: 'Description',
          addressLabel: 'Address',
          statusLabel: 'Status',
          contractorLabel: 'Contractor',
          checkItemsLabel: 'Check items',
          routeButtonLabel: 'Build Route',
          locationButtonLabel: 'My Location',
          locatingButtonLabel: 'Locating...',
          locationReadyLabel: 'Location detected',
          locationErrorLabel: 'Could not determine your location',
          routePendingLabel: 'Preparing route...',
          routeReadyLabel: 'Route is ready',
          routeFallbackLabel: 'Showing simplified route',
          routeErrorLabel: 'Could not build the route',
          loadingLabel: 'Loading infrastructure...',
          emptyStateLabel: 'No infrastructure found yet.',
          apiErrorDescription:
            'Could not load infrastructure data. The map is still available without markers.',
          noDataLabel: 'N/A',
          untitledLabel: 'Infrastructure object',
          missingTokenTitle:
            'The interactive map loads automatically',
          missingTokenDescription:
            'If the map does not appear, check your internet connection and reload the page.',
          loadErrorTitle: 'Could not load the map',
          loadErrorDescription:
            'Check the network connection and reload the page. The block will redraw automatically afterwards.',
        },
      },
      leaderboard: {
        columns: ['Project', 'Status', 'Rating'],
        rows: [
          {
            name: 'Restroom renovation',
            status: 'Active',
            rating: '4.5',
          },
          {
            name: 'Roof replacement',
            status: 'In progress',
            rating: '4.1',
          },
          {
            name: 'Cafeteria inspection',
            status: 'Pending',
            rating: 'No rating',
          },
          {
            name: 'New sports ground',
            status: 'Active',
            rating: '4.8',
          },
          {
            name: 'Leak repair',
            status: 'Not verified',
            rating: '3.9',
          },
        ],
        actions: [
          { label: 'Open', href: '#' },
          {
            label: 'Report an issue',
            href: '#schools-table',
            variant: 'secondary',
          },
        ],
        ui: {
          loadingText: 'Loading infrastructure...',
          emptyText: 'No infrastructure objects found yet.',
          errorText: 'Could not load infrastructure. Please reload the page.',
        },
      },
      stats: {
        items: [
          {
            icon: 'participants',
            value: '0',
            label: 'total reports',
            tone: 'light',
          },
          {
            icon: 'completed',
            value: '0',
            label: 'verified reports',
            tone: 'brand',
          },
          {
            icon: 'active',
            value: '0',
            label: 'participated users',
            tone: 'light',
          },
        ],
      },
    },
    truthAggregation: {
      heading: 'Truth aggregation',
      entityLabel: 'objects',
      actions: [
        { label: 'Verified', href: '#schools-table', condition: 'best' },
        {
          label: 'Not verified',
          href: '#schools-table',
          variant: 'secondary',
          condition: 'worst',
        },
      ],
    },
    schoolsTable: {
      columns: ['No.', 'Name', 'Complaints', 'Region', 'Rating'],
      rows: [],
      ui: {
        reportsLabel: 'Complaints',
        regionLabel: 'Region',
        caption: 'List of schools and complaints',
        loadingText: 'Loading schools...',
        emptyText: 'No schools found yet.',
        errorText: 'Could not load schools. Please reload the page.',
        noDataLabel: 'N/A',
        untitledLabel: 'School',
      },
    },
    faq: {
      title: 'How does it work?',
      items: [
        {
          question: 'Where can I fill in the feedback form?',
          answer:
            'Choose the relevant section on the home page and submit your appeal through the form. Once the API is connected, current scenarios can also be loaded here from the admin panel.',
        },
        {
          question: 'Who reviews the appeals?',
          answer:
            'Each message is sent to the relevant public authority or local administration responsible for resolving the specific issue.',
        },
        {
          question: 'How long does a response take?',
          answer:
            'The standard response time is up to 30 days, but many appeals are resolved faster if no additional inspection is required.',
        },
        {
          question: 'Can I track the status of a project?',
          answer:
            'Yes, statuses and ratings can be shown both in the public project card and in the user account once the status API is connected.',
        },
        {
          question: 'How is the result evaluated?',
          answer:
            'After an appeal is closed, the user can leave a rating and comment, and the system takes this into account in the overall score.',
        },
      ],
    },
  },
}

export function getLocalizedSiteChromeContent(locale = DEFAULT_LOCALE) {
  return mergeLocalizedContent(
    siteChromeContent,
    SITE_CHROME_OVERRIDES[normalizeLocale(locale)],
  )
}

export function getLocalizedHomePageContent(locale = DEFAULT_LOCALE) {
  const normalizedLocale = normalizeLocale(locale)
  const localizedContent = mergeLocalizedContent(
    HOME_PAGE_CONTENT,
    HOME_PAGE_OVERRIDES[normalizedLocale],
  )

  return {
    ...localizedContent,
    site: getLocalizedSiteChromeContent(normalizedLocale),
  }
}
