import { normalizeLocale } from '@/content/localizedContent'

const INFO_PAGES_CONTENT = {
  ru: {
    about: {
      eyebrow: 'Коротко',
      title: 'О платформе',
      description:
        'Real Holat помогает жителям сообщать о городских и инфраструктурных проблемах, прикладывать фото и отправлять обращения ответственным службам.',
      actions: [
        {
          label: 'Сообщить о проблеме',
          href: '/first-stage',
        },
      ],
      items: [
        {
          title: 'Сообщить',
          description:
            'Выберите объект на карте, добавьте описание и отправьте обращение за несколько минут.',
        },
        {
          title: 'Следить',
          description:
            'Проверяйте публичные обращения, статусы и изменения по объектам в одном месте.',
        },
        {
          title: 'Участвовать',
          description:
            'Получайте молнии за активность и открывайте бонусы в маркетплейсе.',
        },
      ],
      note:
        'Платформа делает обращения понятнее для жителей и заметнее для ответственных служб.',
    },
    contact: {
      eyebrow: 'Связь',
      title: 'Контакты',
      description:
        'Для обращения и входа в аккаунт используйте основные каналы платформы.',
      items: [
        {
          meta: 'На сайте',
          title: 'Форма обращения',
          description:
            'Откройте страницу сообщения о проблеме, отметьте объект и отправьте обращение.',
          action: {
            label: 'Открыть форму',
            href: '/first-stage',
          },
        },
        {
          meta: '@realholatbot',
          title: 'Telegram',
          description:
            'Используется для входа и подтверждения аккаунта в платформе.',
          action: {
            label: 'Открыть бот',
            href: 'https://t.me/realholatbot',
            external: true,
            variant: 'secondary',
          },
        },
      ],
      note:
        'Основной канал работы с платформой — форма обращения на сайте и авторизация через Telegram.',
    },
  },
  uzb: {
    about: {
      eyebrow: 'Qisqacha',
      title: 'Platforma haqida',
      description:
        "Real Holat aholiga xaritada muammolarni ko'rsatish, foto biriktirish va murojaatlarni mas'ul xizmatlarga yuborishda yordam beradi.",
      actions: [
        {
          label: 'Muammo haqida xabar berish',
          href: '/first-stage',
        },
      ],
      items: [
        {
          title: 'Xabar berish',
          description:
            "Xaritada nuqtani tanlang, tavsif qo'shing va murojaatni bir necha daqiqada yuboring.",
        },
        {
          title: 'Kuzatish',
          description:
            "Ommaviy murojaatlar, holatlar va obyektlar bo'yicha o'zgarishlarni bir joyda ko'ring.",
        },
        {
          title: 'Ishtirok etish',
          description:
            "Faollik uchun molniyalar oling va marketpleysdagi bonuslarni oching.",
        },
      ],
      note:
        "Platforma murojaatlarni fuqarolar uchun tushunarli va mas'ul xizmatlar uchun ko'rinadigan qiladi.",
    },
    contact: {
      eyebrow: 'Aloqa',
      title: 'Kontaktlar',
      description:
        "Murojaat yuborish va akkauntga kirish uchun platformaning asosiy kanallaridan foydalaning.",
      items: [
        {
          meta: 'Saytda',
          title: 'Murojaat formasi',
          description:
            "Muammo sahifasini oching, obyektni belgilang va murojaat yuboring.",
          action: {
            label: 'Formani ochish',
            href: '/first-stage',
          },
        },
        {
          meta: '@realholatbot',
          title: 'Telegram',
          description:
            'Platformaga kirish va akkauntni tasdiqlash uchun ishlatiladi.',
          action: {
            label: 'Botni ochish',
            href: 'https://t.me/realholatbot',
            external: true,
            variant: 'secondary',
          },
        },
      ],
      note:
        "Platforma bilan ishlashning asosiy yo'li saytdagi murojaat formasi va Telegram orqali avtorizatsiyadir.",
    },
  },
  en: {
    about: {
      eyebrow: 'Overview',
      title: 'About the platform',
      description:
        'Real Holat helps residents report local and infrastructure issues, attach photos, and send appeals to responsible services.',
      actions: [
        {
          label: 'Report an issue',
          href: '/first-stage',
        },
      ],
      items: [
        {
          title: 'Report',
          description:
            'Choose a point on the map, add a short description, and submit an appeal in minutes.',
        },
        {
          title: 'Track',
          description:
            'See public appeals, statuses, and changes for infrastructure in one place.',
        },
        {
          title: 'Participate',
          description:
            'Earn lightnings for activity and unlock bonuses in the marketplace.',
        },
      ],
      note:
        'The platform makes local issues clearer for residents and more visible to responsible services.',
    },
    contact: {
      eyebrow: 'Contacts',
      title: 'Contacts',
      description:
        'Use the main platform channels below to submit an appeal or sign in.',
      items: [
        {
          meta: 'On the website',
          title: 'Appeal form',
          description:
            'Open the issue page, select an object, and send your appeal.',
          action: {
            label: 'Open form',
            href: '/first-stage',
          },
        },
        {
          meta: '@realholatbot',
          title: 'Telegram',
          description:
            'Used for sign-in and account confirmation on the platform.',
          action: {
            label: 'Open bot',
            href: 'https://t.me/realholatbot',
            external: true,
            variant: 'secondary',
          },
        },
      ],
      note:
        'The main platform flow is the website appeal form plus Telegram authorization.',
    },
  },
}

export function getInfoPageContent(locale) {
  return INFO_PAGES_CONTENT[normalizeLocale(locale)] ?? INFO_PAGES_CONTENT.ru
}
