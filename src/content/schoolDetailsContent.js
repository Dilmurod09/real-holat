// Mock data for school detail page. Replace with API later.
const STATUS_TONE_COLORS = {
  red: '#ef4444',
  green: '#22c55e',
  yellow: '#facc15',
  gray: '#94a3b8',
}

export function getSchoolById(schoolId) {
  const id = String(schoolId)
  const schools = {
    1: {
      id: '1',
      name: 'Школа 45',
      region: 'Мирабадский район, Ташкент',
      image: '/hero-image.png',
      imageAlt: 'Школа 45',
      stats: [
        { icon: 'participants', value: '265 780', label: 'Всего участников в проекте', tone: 'light' },
        { icon: 'completed', value: '123 780', label: 'Записи (Отчеты)', tone: 'brand' },
        { icon: 'active', value: '265 780', label: 'Всего просмотров', tone: 'light' },
        { icon: 'active', value: '5', label: 'добавлено объектов', tone: 'light' },
      ],
      tasksTable: {
        columns: ['ЗАДАЧА', 'ПЕРИОД', 'СТАТУС', 'ОТВЕТСТВ', 'ДЕЙСТВИЯ'],
        rows: [
          { task: 'РЕКОНСТРУКЦИЯ', period: '12.03.2023-9.11.2024', status: 'АКТИВНЫЙ', statusTone: 'green', responsible: 'ТАЙМЕНТ', actions: 'Д/С' },
          { task: 'РЕМОНТ', period: '01.02.2024-15.06.2024', status: 'НЕ ПРОВЕРЕНО', statusTone: 'gray', responsible: 'ТАЛЕНТ', actions: '4.0' },
          { task: 'РЕМОНТ', period: '10.01.2024-30.05.2024', status: 'ЗАВЕРШЕННЫЙ', statusTone: 'green', responsible: 'ТАЛЕНТ', actions: '4.0' },
        ],
      },
      complaints: [
        { author: 'Hoodieburg', avatar: null, rating: 3, text: 'Проблему рассмотрит профильный орган власти или администрация учреждения. Без ответа оно не останется — ведомство обязано дать ответ в течение 30 дней. Некоторые проблемы решаются быстрее в срок до 10 дней.', image: '/hero-image.png', imageAlt: 'Фото' },
        { author: 'Anonymous', avatar: null, rating: 5, text: 'Проблему рассмотрит профильный орган власти или администрация учреждения. Без ответа оно не останется — ведомство обязано дать ответ в течение 30 дней. Некоторые проблемы решаются быстрее в срок до 10 дней.', image: null },
        { author: 'Hoodieburg', avatar: null, rating: 4, text: 'Проблему рассмотрит профильный орган власти или администрация учреждения. Без ответа оно не останется — ведомство обязано дать ответ в течение 30 дней. Некоторые проблемы решаются быстрее в срок до 10 дней.', image: '/hero-image.png', imageAlt: 'Фото' },
      ],
    },
    2: { id: '2', name: 'Школа 12', region: 'Юнусабад, Ташкент', image: '/hero-image.png', imageAlt: 'Школа 12', stats: [{ icon: 'participants', value: '120 000', label: 'Участников', tone: 'light' }, { icon: 'completed', value: '45 000', label: 'Записи (Отчеты)', tone: 'brand' }, { icon: 'active', value: '80 000', label: 'Просмотров', tone: 'light' }, { icon: 'active', value: '4.3', label: 'Рейтинг', tone: 'light' }], tasksTable: { columns: ['ЗАДАЧА', 'ПЕРИОД', 'СТАТУС', 'ОТВЕТСТВ', 'ДЕЙСТВИЯ'], rows: [{ task: 'РЕМОНТ', period: '01.01.2024-01.06.2024', status: 'ЗАВЕРШЕННЫЙ', statusTone: 'green', responsible: 'ТАЛЕНТ', actions: '4.3' }] }, complaints: [] },
  }
  return schools[id] || schools[1]
}

export { STATUS_TONE_COLORS }
