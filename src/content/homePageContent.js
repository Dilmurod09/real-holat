import { siteChromeContent } from '@/content/siteContent'

export const HOME_PAGE_CONTENT = {
  site: siteChromeContent,
  hero: {
    id: 'hero',
    title: 'Сообщите о любой проблеме и получите ответ от органов власти',
    description:
      '«Feedback.uz Решаем вместе» — приложение для решения проблем. Подавайте жалобы, задавайте вопросы, вносите предложения, участвуйте в опросах и голосованиях, чтобы повышать качество жизни. Это просто и быстро.',
    primaryAction: {
      label: 'Сообщить о проблеме',
      href: '/first-stage',
    },
    backgroundImage: '/hero-image.png',
    backgroundAlt: 'Панорамный вид города',
    api: {
      resource: 'hero',
      endpoint: '/content/home/hero',
    },
  },
  orangeBubble: {
    id: 'participation',
    title: 'Расскажите, что волнует',
    paragraphs: [
      'Сообщайте о проблемах в школах, прикрепляйте фото и отправляйте обращения через карту или поиск за пару минут.',
      'Следите за статусом обращений, обещанными сроками и реальными изменениями в одном месте.',
      'Получайте баллы за активность, повышайте уровень персонажа и открывайте бонусы за участие.',
    ],
    topBubble: {
      title:
        'Начни путь ревизора! Проверяй школы, зарабатывай!\nУлучшай уровень и открывай промокоды!',
      cta: {
        label: 'Начать',
        href: '#schools-table',
      },
      illustration: {
        src: '/mascot1.png',
        alt: 'Маскот первого уровня',
      },
    },
    cards: [
      {
        id: 'step-1',
        variant: 'start',
        title: 'Зарегистрируйся',
        description: 'Создай профиль ревизора и выбери свой первый маршрут проверок.',
        illustration: {
          src: '/mascot2.png',
          alt: 'Маскот шага один',
        },
        cta: {
          label: 'Шаг первый',
          href: '#schools-table',
        },
      },
      {
        id: 'step-2',
        variant: 'inspect',
        title: 'Проверяй школы',
        description: 'Оставляй отзывы, подтверждай изменения и зарабатывай баллы за активность.',
        illustration: {
          src: '/mascot3.png',
          alt: 'Маскот шага два',
        },
        cta: {
          label: 'Шаг второй',
          href: '#schools-table',
        },
      },
      {
        id: 'step-3',
        variant: 'reward',
        title: 'Получай награды',
        description: 'Повышай уровень персонажа и обменивай баллы на промокоды и бонусы.',
        illustration: {
          src: '/mascot4.png',
          alt: 'Маскот шага три',
        },
        cta: {
          label: 'Шаг третий',
          href: '#schools-table',
        },
      },
    ],
    illustration: {
      src: '/mascot.png',
      alt: 'Маскот платформы',
      fallbackSrc: '/mascot.png',
    },
    api: {
      resource: 'participation',
      endpoint: '/content/home/participation',
    },
  },
  regionInfo: {
    id: 'regions',
    title: 'Узнайте, о чём спрашивают в вашем регионе',
    description:
      'На карте можно посмотреть публичные сообщения и обращения региона, узнать, что волнует ваших соседей, и какие проекты уже находятся в работе.',
    map: {
      placeholder: 'Здесь будет карта региона',
      styleUrl: 'mapbox://styles/mapbox/light-v11',
      view: {
        center: [66.9, 41.2],
        zoom: 5.2,
        maxZoom: 18,
      },
      points: [
        {
          id: 'project-1',
          title: 'Ремонт туалетов',
          region: 'Мирабадский район, Ташкент',
          rating: '4.5',
          statusLabel: 'Активный',
          statusTone: 'green',
          coordinates: [69.2797, 41.3111],
        },
        {
          id: 'project-2',
          title: 'Замена кровли',
          region: 'Самарканд',
          rating: '4.1',
          statusLabel: 'В процессе',
          statusTone: 'yellow',
          coordinates: [66.9597, 39.6542],
        },
        {
          id: 'project-3',
          title: 'Проверка столовой',
          region: 'Андижан',
          rating: 'Без оценки',
          statusLabel: 'В ожидании',
          statusTone: 'red',
          coordinates: [72.3442, 40.7831],
        },
        {
          id: 'project-4',
          title: 'Новая спортивная площадка',
          region: 'Бухара',
          rating: '4.8',
          statusLabel: 'Активный',
          statusTone: 'green',
          coordinates: [64.4231, 39.7681],
        },
        {
          id: 'project-5',
          title: 'Устранение протечек',
          region: 'Наманган',
          rating: '3.9',
          statusLabel: 'Не проверено',
          statusTone: 'gray',
          coordinates: [71.6726, 41.0011],
        },
      ],
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
        loadErrorTitle: 'Не удалось загрузить карту',
        loadErrorDescription:
          'Проверьте подключение к интернету и перезагрузите страницу.',
      },
      statuses: [
        { label: 'В ожидании', tone: 'red' },
        { label: 'Активный', tone: 'green' },
        { label: 'В процессе', tone: 'yellow' },
        { label: 'Не проверено', tone: 'gray' },
      ],
      api: {
        resource: 'infrastructures',
        endpoint: '/api/v1/infrastructures',
      },
    },
    leaderboard: {
      columns: ['Проект', 'Статус', 'Рейтинг'],
      rows: [
        {
          name: 'Ремонт туалетов',
          status: 'Активный',
          statusTone: 'green',
          rating: '4.5',
        },
        {
          name: 'Замена кровли',
          status: 'В процессе',
          statusTone: 'yellow',
          rating: '4.1',
        },
        {
          name: 'Проверка столовой',
          status: 'В ожидании',
          statusTone: 'red',
          rating: 'Без оценки',
        },
        {
          name: 'Новая спортивная площадка',
          status: 'Активный',
          statusTone: 'green',
          rating: '4.8',
        },
        {
          name: 'Устранение протечек',
          status: 'Не проверено',
          statusTone: 'gray',
          rating: '3.9',
        },
      ],
      actions: [
        { label: 'Перейти', href: '#' },
        { label: 'Сообщить о проблеме', href: '/first-stage', variant: 'secondary' },
      ],
      ui: {
        loadingText: 'Загружаем инфраструктуру...',
        emptyText: 'Инфраструктурные объекты пока не найдены.',
        errorText: 'Не удалось загрузить инфраструктуру. Попробуйте обновить страницу.',
      },
      api: {
        resource: 'infrastructures',
        endpoint: '/api/v1/infrastructures',
      },
    },
    stats: {
      items: [
        {
          icon: 'participants',
          value: '265 780',
          label: 'человек участвовали в обсуждениях',
          tone: 'light',
        },
        {
          icon: 'completed',
          value: '18 420',
          label: 'обращений получили подтверждённое решение',
          tone: 'brand',
        },
        {
          icon: 'active',
          value: '6 910',
          label: 'сообщений и обращений сейчас в работе',
          tone: 'light',
        },
      ],
      api: {
        resource: 'stats',
        endpoint: '/analytics/summary',
      },
    },
  },
  truthAggregation: {
    id: 'truth-aggregation',
    heading: 'Агрегация правды',
    checked: 150,
    total: 200,
    entityLabel: 'школ',
    actions: [
      { label: 'Проверено', href: '#schools-table' },
      { label: 'Не проверено', href: '#schools-table', variant: 'secondary' },
    ],
    api: {
      resource: 'truthAggregation',
      endpoint: '/analytics/truth-aggregation',
    },
  },
  schoolsTable: {
    id: 'schools-table',
    columns: ['Номер', 'Название', 'Жалобы', 'Регион', 'Рейтинг'],
    rows: [
      {
        num: 1,
        name: 'Школа 45',
        complaints: 12,
        region: 'Мирабадский район, Ташкент',
        rating: '4.5',
        highlight: true,
      },
      {
        num: 2,
        name: 'Школа 12',
        complaints: 8,
        region: 'Юнусабад, Ташкент',
        rating: '4.3',
      },
      {
        num: 3,
        name: 'Школа 108',
        complaints: 6,
        region: 'Самарканд',
        rating: '4.7',
      },
      {
        num: 4,
        name: 'Школа 7',
        complaints: 5,
        region: 'Бухара',
        rating: '4.2',
      },
      {
        num: 5,
        name: 'Школа 93',
        complaints: 3,
        region: 'Андижан',
        rating: 'Без оценки',
      },
      {
        num: 6,
        name: 'Школа 31',
        complaints: 2,
        region: 'Наманган',
        rating: '4.1',
      },
    ],
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
    api: {
      resource: 'infrastructures',
      endpoint: '/api/v1/infrastructures?tops=6',
    },
  },
  faq: {
    id: 'faq',
    title: 'Как это работает?',
    items: [
      {
        question: 'Где заполнить форму обратной связи?',
        answer:
          'Выберите подходящий раздел на главной странице и отправьте обращение через форму. После подключения API здесь можно будет подгружать актуальные сценарии из админ-панели.',
      },
      {
        question: 'Кто рассматривает обращения?',
        answer:
          'Каждое сообщение уходит в профильный орган власти или локальную администрацию, которые отвечают за решение конкретной проблемы.',
      },
      {
        question: 'Сколько времени занимает ответ?',
        answer:
          'Стандартный срок ответа — до 30 дней, но многие обращения закрываются быстрее, если не требуется дополнительная проверка.',
      },
      {
        question: 'Можно ли следить за статусом проекта?',
        answer:
          'Да, статусы и рейтинг можно отображать в публичной карточке проекта и в личном кабинете пользователя после интеграции с API статусов.',
      },
      {
        question: 'Как оценивается результат?',
        answer:
          'После закрытия обращения пользователь может поставить оценку и оставить комментарий, а система учтёт это в общем рейтинге.',
      },
    ],
    api: {
      resource: 'faq',
      endpoint: '/faq',
    },
  },
}
