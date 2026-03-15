export const siteChromeContent = {
  brand: {
    mark: null,
    name: 'Realholat.uz',
  },
  navigation: [
    { label: 'Главная', href: '/' },
    { label: 'О платформе', href: '/about' },
    { label: 'Контакты', href: '/contact' },
  ],
  search: {
    placeholder: 'Поиск',
    buttonLabel: 'Искать по обращениям',
    api: {
      resource: 'search',
      endpoint: '/search',
      queryParam: 'query',
    },
  },
  auth: {
    label: 'Login / Войти',
    href: '/login',
  },
  locale: {
    label: 'Ru',
    options: [
      { code: 'ru', label: 'Ru' },
      { code: 'uzb', label: 'Uzb' },
      { code: 'en', label: 'En' },
    ],
  },
  footer: {
    columns: [
      {
        title: 'Гражданам',
        links: [
          'Личный кабинет',
          'Как найти услугу',
          'Регистрация на Госуслугах',
          'Помощь',
        ],
      },
      {
        title: 'Партнёрам',
        links: ['Бизнесу', 'Иностранцам', 'Партнёрам платформы'],
      },
      {
        title: 'Связь',
        links: ['Контакты', 'Карта центров обслуживания'],
      },
    ],
    social: [
      { href: '#', label: 'Telegram', icon: 'telegram' },
      { href: '#', label: 'VK', icon: 'vk' },
      { href: '#', label: 'OK', icon: 'ok' },
      { href: '#', label: 'RSS', icon: 'rss' },
    ],
  },
}
