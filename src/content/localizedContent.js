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
          missingTokenTitle:
            'Подключите токен Mapbox, чтобы отобразить интерактивную карту',
          missingTokenDescription:
            'Добавьте `VITE_MAPBOX_ACCESS_TOKEN` в `.env.local`, и карта автоматически появится в этом блоке.',
          loadErrorTitle: 'Не удалось загрузить карту Mapbox',
          loadErrorDescription:
            'Проверьте токен, стиль карты и сетевое подключение. После этого блок перерисуется автоматически.',
        },
      },
    },
    schoolsTable: {
      ui: {
        taskLabel: 'Задача',
        regionLabel: 'Регион',
        caption: 'Список школ и текущих задач',
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
          missingTokenTitle:
            'Interaktiv xaritani ko‘rsatish uchun Mapbox tokenini ulang',
          missingTokenDescription:
            '`VITE_MAPBOX_ACCESS_TOKEN` ni `.env.local` ga qo‘shing, xarita shu blokda avtomatik ko‘rinadi.',
          loadErrorTitle: 'Mapbox xaritasini yuklab bo‘lmadi',
          loadErrorDescription:
            'Token, xarita uslubi va tarmoq ulanishini tekshiring. Shundan so‘ng blok avtomatik yangilanadi.',
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
      },
      stats: {
        items: [
          {
            icon: 'participants',
            value: '265 780',
            label: 'kishi muhokamalarda qatnashdi',
            tone: 'light',
          },
          {
            icon: 'completed',
            value: '18 420',
            label: 'murojaat tasdiqlangan yechim oldi',
            tone: 'brand',
          },
          {
            icon: 'active',
            value: '6 910',
            label: 'xabar va murojaat hozir ish jarayonida',
            tone: 'light',
          },
        ],
      },
    },
    truthAggregation: {
      heading: 'Haqiqat agregatsiyasi',
      entityLabel: 'maktab',
      actions: [
        { label: 'Tekshirilgan', href: '#schools-table' },
        {
          label: 'Tekshirilmagan',
          href: '#schools-table',
          variant: 'secondary',
        },
      ],
    },
    schoolsTable: {
      columns: ['Raqam', 'Nomi', 'Vazifa', 'Hudud', 'Reyting'],
      rows: [
        {
          num: 1,
          name: '45-maktab',
          task: 'Rekonstruksiya',
          region: 'Mirobod tumani, Toshkent',
          rating: '4.5',
          highlight: true,
        },
        {
          num: 2,
          name: '12-maktab',
          task: "Kapital ta'mirlash",
          region: 'Yunusobod, Toshkent',
          rating: '4.3',
        },
        {
          num: 3,
          name: '108-maktab',
          task: 'Sinf xonalarini jihozlash',
          region: 'Samarqand',
          rating: '4.7',
        },
        {
          num: 4,
          name: '7-maktab',
          task: "Sport zalini ta'mirlash",
          region: 'Buxoro',
          rating: '4.2',
        },
        {
          num: 5,
          name: '93-maktab',
          task: 'Oshxonani tekshirish',
          region: 'Andijon',
          rating: 'Baholanmagan',
        },
        {
          num: 6,
          name: '31-maktab',
          task: 'Fasadni yangilash',
          region: 'Namangan',
          rating: '4.1',
        },
      ],
      ui: {
        taskLabel: 'Vazifa',
        regionLabel: 'Hudud',
        caption: 'Maktablar va joriy vazifalar ro‘yxati',
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
          missingTokenTitle:
            'Add a Mapbox token to display the interactive map',
          missingTokenDescription:
            'Add `VITE_MAPBOX_ACCESS_TOKEN` to `.env.local`, and the map will appear in this block automatically.',
          loadErrorTitle: 'Could not load the Mapbox map',
          loadErrorDescription:
            'Check the token, map style, and network connection. The block will redraw automatically afterwards.',
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
      },
      stats: {
        items: [
          {
            icon: 'participants',
            value: '265 780',
            label: 'people joined discussions',
            tone: 'light',
          },
          {
            icon: 'completed',
            value: '18 420',
            label: 'appeals received a confirmed solution',
            tone: 'brand',
          },
          {
            icon: 'active',
            value: '6 910',
            label: 'messages and appeals are currently in progress',
            tone: 'light',
          },
        ],
      },
    },
    truthAggregation: {
      heading: 'Truth aggregation',
      entityLabel: 'schools',
      actions: [
        { label: 'Verified', href: '#schools-table' },
        {
          label: 'Not verified',
          href: '#schools-table',
          variant: 'secondary',
        },
      ],
    },
    schoolsTable: {
      columns: ['No.', 'Name', 'Task', 'Region', 'Rating'],
      rows: [
        {
          num: 1,
          name: 'School 45',
          task: 'Reconstruction',
          region: 'Mirabad district, Tashkent',
          rating: '4.5',
          highlight: true,
        },
        {
          num: 2,
          name: 'School 12',
          task: 'Major repair',
          region: 'Yunusabad, Tashkent',
          rating: '4.3',
        },
        {
          num: 3,
          name: 'School 108',
          task: 'Classroom equipment',
          region: 'Samarkand',
          rating: '4.7',
        },
        {
          num: 4,
          name: 'School 7',
          task: 'Gym repair',
          region: 'Bukhara',
          rating: '4.2',
        },
        {
          num: 5,
          name: 'School 93',
          task: 'Cafeteria inspection',
          region: 'Andijan',
          rating: 'No rating',
        },
        {
          num: 6,
          name: 'School 31',
          task: 'Facade renewal',
          region: 'Namangan',
          rating: '4.1',
        },
      ],
      ui: {
        taskLabel: 'Task',
        regionLabel: 'Region',
        caption: 'List of schools and current tasks',
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
