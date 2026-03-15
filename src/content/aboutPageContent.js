import {
  DEFAULT_LOCALE,
  getLocalizedSiteChromeContent,
  normalizeLocale,
} from '@/content/localizedContent'

const ABOUT_PAGE_CONTENT = {
  ru: {
    hero: {
      eyebrow: 'О платформе',
      title: 'Платформа, которая превращает обращения в понятный маршрут решения',
      description:
        'Realholat.uz объединяет карту, карточки объектов, жалобы и обратную связь в одном интерфейсе, чтобы жителю было проще сообщить о проблеме и увидеть реальный результат.',
      primaryAction: { label: 'Сообщить о проблеме', href: '/first-stage' },
      secondaryAction: { label: 'Как это работает', href: '#about-flow' },
      highlights: [
        'Единое окно для обращений',
        'Публичная картина по объектам',
        'Прозрачные статусы',
      ],
      panel: {
        eyebrow: 'Что внутри платформы',
        title: 'От сигнала жителя до подтвержденного результата',
        description:
          'Сообщение структурируется, уходит по нужному маршруту и сохраняет историю изменений, чтобы пользователь видел не только обещания, но и итог.',
        illustration: {
          src: '/mascot4.png',
          alt: 'Маскот платформы Realholat.uz',
        },
        items: [
          {
            title: 'Сообщение',
            description: 'Житель отмечает объект и добавляет описание проблемы.',
          },
          {
            title: 'Маршрутизация',
            description: 'Обращение передается ответственным без потери контекста.',
          },
          {
            title: 'Статусы',
            description: 'Каждый этап отображается в понятной и проверяемой форме.',
          },
          {
            title: 'Проверка результата',
            description: 'После изменений пользователь может подтвердить итог и дать оценку.',
          },
        ],
      },
    },
    mission: {
      eyebrow: 'Зачем нужна платформа',
      title: 'Мы делаем общественный контроль удобным, а ответы на обращения видимыми',
      description:
        'Вместо разрозненных каналов пользователь получает единый сценарий: найти объект, отправить обращение, дождаться ответа и проверить изменения.',
      leadCard: {
        title: 'Что получает пользователь',
        description:
          'Интерфейс помогает быстро перейти от проблемы к действию и не терять контекст на каждом этапе.',
        items: [
          'Путь от карты и поиска до карточки обращения',
          'Открытую историю статусов и сроков',
          'Простую обратную связь после решения',
          'Единую точку входа для школ и инфраструктуры',
        ],
      },
      principles: [
        {
          title: 'Прозрачность',
          description: 'Пользователь видит, что происходит с обращением и какой следующий шаг.',
        },
        {
          title: 'Проверяемость',
          description: 'Результат подтверждается не только статусом, но и реальными изменениями.',
        },
        {
          title: 'Структура',
          description: 'Карта, таблицы и страницы процесса собраны в одну цельную систему.',
        },
      ],
    },
    workflow: {
      eyebrow: 'Как это работает',
      title: 'Четыре последовательных шага внутри одной платформы',
      description:
        'Путь жителя остается простым, а рабочий процесс для команды и ведомств - понятным и управляемым.',
      steps: [
        {
          number: '01',
          title: 'Фиксация проблемы',
          description: 'Житель выбирает объект и описывает ситуацию.',
          tone: 'light',
        },
        {
          number: '02',
          title: 'Проверка',
          description: 'Система и модерация помогают оформить обращение корректно.',
          tone: 'brand',
        },
        {
          number: '03',
          title: 'Маршрут',
          description: 'Обращение попадает к ответственным сторонам, а статус обновляется.',
          tone: 'light',
        },
        {
          number: '04',
          title: 'Результат',
          description: 'После изменений пользователь оценивает итог и оставляет отзыв.',
          tone: 'light',
        },
      ],
    },
    trust: {
      eyebrow: 'Доверие и контроль',
      title: 'Платформа построена вокруг понятных правил работы с обращениями',
      description:
        'Мы показываем, на каком этапе находится обращение, кто отвечает за следующий шаг и как фиксируется результат для пользователя.',
      commitments: [
        {
          title: 'Единая история',
          description: 'Все ключевые этапы сохраняются в одном интерфейсе.',
        },
        {
          title: 'Публичная видимость',
          description: 'По объектам можно видеть сводную картину и динамику изменений.',
        },
        {
          title: 'Четкие статусы',
          description: 'Система помогает быстро понять текущее состояние запроса.',
        },
        {
          title: 'Финальная оценка',
          description: 'Обратная связь жителя становится частью общей картины качества.',
        },
      ],
      sideCards: [
        {
          title: 'Для жителей',
          description: 'Быстрый вход в обращение через карту, поиск и карточки объектов.',
        },
        {
          title: 'Для команд',
          description: 'Структурированный поток обращений и единая точка наблюдения за статусами.',
        },
        {
          title: 'Для развития',
          description: 'Архитектура готова к подключению API, аналитики и новых сервисов.',
        },
      ],
    },
    stats: {
      eyebrow: 'Преимущества сервиса',
      title: 'О платформе лучше всего говорят ее базовые принципы',
      description:
        'Мы вынесли в интерфейс свойства, которые помогают жителям быстрее действовать, а не разбираться в сложной системе.',
      items: [
        {
          icon: 'participants',
          value: '24/7',
          label: 'доступ к отправке и просмотру обращений',
          tone: 'light',
        },
        {
          icon: 'completed',
          value: '3',
          label: 'языка интерфейса для разных пользователей',
          tone: 'brand',
        },
        {
          icon: 'active',
          value: '1',
          label: 'единое пространство для карты, статусов и жалоб',
          tone: 'light',
        },
      ],
    },
    cta: {
      title: 'Нужен понятный цифровой маршрут для обращения?',
      description: 'Перейдите к форме, выберите объект на карте и отправьте сообщение через Realholat.uz.',
      primaryAction: { label: 'Перейти к обращению', href: '/first-stage' },
      secondaryAction: { label: 'На главную', href: '/' },
    },
  },
  uzb: {
    hero: {
      eyebrow: 'Platforma haqida',
      title: "Murojaatlarni tushunarli yechim yo'liga aylantiradigan platforma",
      description:
        "Realholat.uz xarita, obyekt kartalari, shikoyatlar va fikr-mulohazani bitta interfeysga birlashtiradi, shunda foydalanuvchi muammo haqida tez xabar berib, haqiqiy natijani ko'ra oladi.",
      primaryAction: { label: 'Muammo haqida xabar berish', href: '/first-stage' },
      secondaryAction: { label: 'Qanday ishlaydi', href: '#about-flow' },
      highlights: [
        'Murojaatlar uchun yagona oynacha',
        "Obyektlar bo'yicha ochiq ko'rinish",
        'Shaffof statuslar',
      ],
      panel: {
        eyebrow: 'Platforma ichida',
        title: "Foydalanuvchi signali bilan tasdiqlangan natija orasidagi yo'l",
        description:
          "Xabar tartibga solinadi, kerakli yo'nalishga yuboriladi va o'zgarishlar tarixi saqlanadi, shunda foydalanuvchi va'dani emas, yakunni ko'radi.",
        illustration: {
          src: '/mascot4.png',
          alt: 'Realholat.uz maskoti',
        },
        items: [
          {
            title: 'Xabar',
            description: "Foydalanuvchi obyektni belgilab, muammoni tavsiflaydi.",
          },
          {
            title: "Yo'naltirish",
            description: "Murojaat mazmunini yo'qotmagan holda mas'ullarga yuboriladi.",
          },
          {
            title: 'Statuslar',
            description: "Har bir bosqich tushunarli va tekshiriladigan ko'rinishda bo'ladi.",
          },
          {
            title: 'Natijani tekshirish',
            description: "O'zgarishlardan so'ng foydalanuvchi yakunni tasdiqlab, baho beradi.",
          },
        ],
      },
    },
    mission: {
      eyebrow: 'Platforma nega kerak',
      title: "Biz jamoatchilik nazoratini qulay, murojaatlarga javoblarni esa ko'rinadigan qilamiz",
      description:
        "Tarqoq kanallar o'rniga foydalanuvchi obyektni topish, murojaat yuborish va o'zgarishni tekshirish uchun yagona ssenariy oladi.",
      leadCard: {
        title: "Foydalanuvchi nimaga ega bo'ladi",
        description:
          "Interfeys muammodan amaliy harakatga o'tishni tezlashtiradi va har bir bosqichda kontekstni saqlaydi.",
        items: [
          "Xarita va qidiruvdan murojaat kartasigacha bo'lgan yo'l",
          'Statuslar va muddatlarning ochiq tarixi',
          "Muammo hal bo'lgach sodda fikr-mulohaza",
          'Maktablar va infratuzilma uchun yagona kirish nuqtasi',
        ],
      },
      principles: [
        {
          title: 'Shaffoflik',
          description: "Foydalanuvchi murojaat bilan nima bo'layotganini va keyingi qadamni ko'radi.",
        },
        {
          title: 'Tekshiriluvchanlik',
          description: "Natija faqat status bilan emas, haqiqiy o'zgarish bilan ham belgilanadi.",
        },
        {
          title: 'Tuzilma',
          description: 'Xarita, jadval va jarayon sahifalari yagona tizimga birlashtirilgan.',
        },
      ],
    },
    workflow: {
      eyebrow: 'Qanday ishlaydi',
      title: "Bitta platforma ichidagi to'rtta ketma-ket qadam",
      description:
        "Foydalanuvchi yo'li sodda, jamoa va idoralar uchun ish jarayoni esa boshqariladigan qilib qurilgan.",
      steps: [
        {
          number: '01',
          title: 'Muammoni qayd etish',
          description: "Foydalanuvchi obyektni tanlaydi va vaziyatni tavsiflaydi.",
          tone: 'light',
        },
        {
          number: '02',
          title: 'Tekshirish',
          description: "Tizim va moderatsiya murojaatni to'g'ri shakllantirishga yordam beradi.",
          tone: 'brand',
        },
        {
          number: '03',
          title: "Yo'nalish",
          description: "Murojaat mas'ullarga yuboriladi va status yangilanadi.",
          tone: 'light',
        },
        {
          number: '04',
          title: 'Natija',
          description: "O'zgarishlardan so'ng foydalanuvchi yakunni baholaydi.",
          tone: 'light',
        },
      ],
    },
    trust: {
      eyebrow: 'Ishonch va nazorat',
      title: "Platforma murojaatlar bilan ishlashning tushunarli qoidalari asosida qurilgan",
      description:
        "Biz murojaat qaysi bosqichda ekanini, keyingi qadam uchun kim javob berishini va natija foydalanuvchi uchun qanday qayd etilishini ko'rsatamiz.",
      commitments: [
        {
          title: 'Yagona tarix',
          description: 'Barcha muhim bosqichlar bitta interfeysda saqlanadi.',
        },
        {
          title: "Ochiq ko'rinish",
          description: "Obyektlar bo'yicha umumiy manzara va o'zgarish dinamikasini ko'rish mumkin.",
        },
        {
          title: 'Aniq statuslar',
          description: "Tizim so'rovning aynan qayerdaligini tez tushunishga yordam beradi.",
        },
        {
          title: 'Yakuniy baho',
          description: "Foydalanuvchi fikri xizmat sifati bo'yicha umumiy tasvirga qo'shiladi.",
        },
      ],
      sideCards: [
        {
          title: 'Foydalanuvchilar uchun',
          description: "Xarita, qidiruv va obyekt kartalari orqali tez kirish ssenariysi.",
        },
        {
          title: 'Jamoalar uchun',
          description: "Murojaatlarning tartibli oqimi va statuslarni kuzatish uchun yagona nuqta.",
        },
        {
          title: 'Rivojlanish uchun',
          description: "Arxitektura API, analitika va yangi servislarni ulashga tayyor.",
        },
      ],
    },
    stats: {
      eyebrow: 'Xizmat afzalliklari',
      title: 'Platforma haqida uning asosiy tamoyillari eng yaxshi gapiradi',
      description:
        "Biz interfeysga murakkab tizimni o'rganish emas, tezroq harakat qilishga yordam beradigan xususiyatlarni olib chiqdik.",
      items: [
        {
          icon: 'participants',
          value: '24/7',
          label: "murojaat yuborish va ko'rish imkoniyati",
          tone: 'light',
        },
        {
          icon: 'completed',
          value: '3',
          label: 'turli foydalanuvchilar uchun interfeys tillari',
          tone: 'brand',
        },
        {
          icon: 'active',
          value: '1',
          label: "xarita, status va shikoyatlar uchun yagona makon",
          tone: 'light',
        },
      ],
    },
    cta: {
      title: "Murojaat uchun tushunarli raqamli yo'l kerakmi?",
      description: "Forma sahifasiga o'ting, xaritada obyektni tanlang va Realholat.uz orqali xabar yuboring.",
      primaryAction: { label: "Murojaatga o'tish", href: '/first-stage' },
      secondaryAction: { label: 'Bosh sahifa', href: '/' },
    },
  },
  en: {
    hero: {
      eyebrow: 'About the platform',
      title: 'A platform that turns public appeals into a clear path to resolution',
      description:
        'Realholat.uz brings the map, object cards, complaints, and feedback together in one interface so residents can report an issue quickly and see a real outcome.',
      primaryAction: { label: 'Report an issue', href: '/first-stage' },
      secondaryAction: { label: 'How it works', href: '#about-flow' },
      highlights: [
        'One window for appeals',
        'Public visibility across objects',
        'Clear statuses',
      ],
      panel: {
        eyebrow: 'Inside the platform',
        title: 'From a resident signal to a confirmed result',
        description:
          'A message is structured, routed to the right channel, and keeps a visible change history so people can see not only promises but outcomes.',
        illustration: {
          src: '/mascot4.png',
          alt: 'Realholat.uz platform mascot',
        },
        items: [
          {
            title: 'Message',
            description: 'The resident marks an object and describes the issue.',
          },
          {
            title: 'Routing',
            description: 'The appeal reaches responsible teams without losing context.',
          },
          {
            title: 'Statuses',
            description: 'Each step is shown in a clear and verifiable format.',
          },
          {
            title: 'Result check',
            description: 'After changes, the resident can confirm the outcome and rate it.',
          },
        ],
      },
    },
    mission: {
      eyebrow: 'Why it matters',
      title: 'We make public oversight convenient and responses to appeals visible',
      description:
        'Instead of scattered channels, residents get one flow to find an object, submit an appeal, and verify what changed.',
      leadCard: {
        title: 'What the user gets',
        description:
          'The interface helps people move from issue to action quickly and keep context at every stage.',
        items: [
          'A path from map and search to the appeal card',
          'An open history of statuses and timelines',
          'Simple feedback after resolution',
          'One entry point for schools and infrastructure',
        ],
      },
      principles: [
        {
          title: 'Transparency',
          description: 'Residents can see what is happening with the appeal and the next step.',
        },
        {
          title: 'Verifiability',
          description: 'The outcome is backed not only by status but by real visible changes.',
        },
        {
          title: 'Structure',
          description: 'Maps, tables, and process pages are combined into one system.',
        },
      ],
    },
    workflow: {
      eyebrow: 'How it works',
      title: 'Four connected steps inside one platform',
      description:
        'The resident journey stays simple while the workflow for teams and institutions remains manageable.',
      steps: [
        {
          number: '01',
          title: 'Issue capture',
          description: 'The resident selects an object and describes the situation.',
          tone: 'light',
        },
        {
          number: '02',
          title: 'Review',
          description: 'The system and moderation help format the appeal correctly.',
          tone: 'brand',
        },
        {
          number: '03',
          title: 'Routing',
          description: 'The appeal is sent to the responsible side and the status is updated.',
          tone: 'light',
        },
        {
          number: '04',
          title: 'Outcome',
          description: 'After changes happen, the resident can rate the final result.',
          tone: 'light',
        },
      ],
    },
    trust: {
      eyebrow: 'Trust and control',
      title: 'The platform is built around understandable rules for handling appeals',
      description:
        'We show what stage the appeal is at, who owns the next step, and how the result is recorded for the resident.',
      commitments: [
        {
          title: 'One history',
          description: 'All key stages stay visible in one interface.',
        },
        {
          title: 'Public visibility',
          description: 'Objects can be viewed through a shared picture and change dynamics.',
        },
        {
          title: 'Clear statuses',
          description: 'The system helps people understand the current state of the request.',
        },
        {
          title: 'Final rating',
          description: 'Resident feedback becomes part of the overall quality view.',
        },
      ],
      sideCards: [
        {
          title: 'For residents',
          description: 'A fast entry point through the map, search, and object cards.',
        },
        {
          title: 'For teams',
          description: 'A structured flow of appeals and one place to track statuses.',
        },
        {
          title: 'For growth',
          description: 'The architecture is ready for APIs, analytics, and new services.',
        },
      ],
    },
    stats: {
      eyebrow: 'Service strengths',
      title: 'The platform is best described by its core principles',
      description:
        'We surfaced the properties that help residents act faster instead of learning a complicated system.',
      items: [
        {
          icon: 'participants',
          value: '24/7',
          label: 'access to submit and review appeals',
          tone: 'light',
        },
        {
          icon: 'completed',
          value: '3',
          label: 'interface languages for different user groups',
          tone: 'brand',
        },
        {
          icon: 'active',
          value: '1',
          label: 'shared space for the map, statuses, and complaints',
          tone: 'light',
        },
      ],
    },
    cta: {
      title: 'Need a clear digital route for an appeal?',
      description: 'Open the form, choose an object on the map, and send a message through Realholat.uz.',
      primaryAction: { label: 'Open the appeal flow', href: '/first-stage' },
      secondaryAction: { label: 'Home page', href: '/' },
    },
  },
}

export function getAboutPageContent(locale = DEFAULT_LOCALE) {
  const normalizedLocale = normalizeLocale(locale)

  return {
    ...ABOUT_PAGE_CONTENT[normalizedLocale],
    site: getLocalizedSiteChromeContent(normalizedLocale),
  }
}
