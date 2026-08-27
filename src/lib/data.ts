import type { CaseStudy, Course, Order, Service, Work } from './types'

// ── Seed state ──────────────────────────────────────────────
// Client data lives in localStorage after first run;
// these factories only seed an empty storage.

const now = Date.now()
const DAY = 86_400_000

export const SERVICES: Service[] = [
  {
    id: 'avatar',
    title: 'Аватар',
    description: 'Личный знак для соцсетей и стрима. Читается даже в 24px.',
    priceFrom: 2_500,
    days: '1–2 дня',
    accent: 'indigo',
  },
  {
    id: 'banner',
    title: 'Баннер',
    description: 'Обложки для каналов, рекламы и превью. Под размер площадки.',
    priceFrom: 1_800,
    days: '1 день',
    accent: 'sky',
  },
  {
    id: 'preview',
    title: 'Превью',
    description: 'Обложка видео: цепляет в ленте, объясняет содержание за секунду.',
    priceFrom: 1_500,
    days: '1 день',
    accent: 'lavender',
  },
  {
    id: 'logo',
    title: 'Логотип',
    description: 'Знак с геометрией и логикой: монохром, мелкий размер, фирменный стиль.',
    priceFrom: 6_000,
    days: '3–5 дней',
    accent: 'indigo',
  },
  {
    id: 'identity',
    title: 'Айдентика',
    description: 'Знак, палитра, типографика и носители. Система, а не набор картинок.',
    priceFrom: 15_000,
    days: '1–2 недели',
    accent: 'rose',
  },
  {
    id: 'cover',
    title: 'Обложка релиза',
    description: 'Арт для музыки или подкаста. Работает и в большом размере, и в миниатюре.',
    priceFrom: 3_500,
    days: '2–3 дня',
    accent: 'lavender',
  },
]

const U = (id: string, w = 900) =>
  `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`

export const CASES: CaseStudy[] = [
  {
    id: 'c-nebula',
    title: 'Nebula Coffee',
    category: 'Айдентика',
    style: 'Тёмный люкс',
    description:
      'Айдентика для кофейни у метро: знак, палитра, меню и стаканы. Спокойный премиум без лишнего шума — кофейня должна пахнуть кофе, а не кричать вывеской.',
    result: 'Средний чек вырос на 12% за первый месяц после ребрендинга',
    images: [U('photo-1557682250-33bd709cbe85'), U('photo-1618005182384-a83a8bd57fbe'), U('photo-1446776811953-b23d57bd21aa')],
    fallbacks: [
      'radial-gradient(120% 90% at 20% 0%, #4c56c0 0%, #131735 55%, #0a0d1c 100%)',
      'radial-gradient(120% 120% at 30% 20%, #8b5cf61f 0%, transparent 50%), linear-gradient(160deg, #141831, #0a0d1c)',
      'radial-gradient(130% 100% at 70% 10%, #2563eb26 0%, transparent 55%), linear-gradient(200deg, #10142a, #06080e)',
    ],
    review: {
      text: 'Сделали ровно к открытию. Меню и стаканы смотрятся дороже, чем мы рассчитывали. Правки внес за один вечер.',
      author: 'Мария, Nebula Coffee',
      source: 'Telegram',
      tg: 'maria_nebula',
    },
    serviceId: 'identity',
  },
  {
    id: 'c-orbit',
    title: 'Orbit — обложка альбома',
    category: 'Обложка',
    style: 'Космос',
    description:
      'Обложка для synthwave-релиза: глубина, атмосферный градиент, одна деталь вместо десяти. В миниатюре стриминга читается так же, как на виниле.',
    result: 'Обложка попала в редакционные подборки стриминга',
    images: [U('photo-1614854262318-831574f15f1f'), U('photo-1550859492-d5da9d8e45f3')],
    fallbacks: [
      'radial-gradient(110% 80% at 80% 100%, #7c3aed33 0%, transparent 60%), linear-gradient(180deg, #10142a, #0a0d1c)',
      'radial-gradient(120% 100% at 80% 0%, #7c3aed30 0%, transparent 55%), linear-gradient(200deg, #141831, #0a0d1c)',
    ],
    review: {
      text: 'Арт живёт своей жизнью — под него даже анимацию клипа делали. Всё за два дня.',
      author: 'Кирилл, группа Orbit',
      source: 'Telegram',
      tg: 'kirill_orbit',
    },
    serviceId: 'cover',
  },
  {
    id: 'c-signal',
    title: 'Signal — аватар стримера',
    category: 'Аватар',
    style: 'Минимал',
    description:
      'Личный знак для стримера: монохром, чистая геометрия, узнаваемость в маленьком размере. Работает и как аватар, и как watermark.',
    result: 'Оформление канала собрали вокруг знака',
    images: [U('photo-1542281286-9e0a16bb7366'), U('photo-1558618666-fcd25c85cd64')],
    fallbacks: [
      'radial-gradient(100% 80% at 50% 100%, #6366f133 0%, transparent 60%), linear-gradient(180deg, #12162b, #0a0d1c)',
      'linear-gradient(160deg, #151930 0%, #0b0e19 100%)',
    ],
    serviceId: 'avatar',
  },
  {
    id: 'c-atlas',
    title: 'Atlas — лендинг студии',
    category: 'Сайт',
    style: 'Минимал',
    description:
      'Одностраничник для веб-студии: тёмная тема, крупная типографика, один экран — одно сообщение. Дизайн передан в разработку с дизайн-системой.',
    result: 'Конверсия в заявку 8,4% на первой неделе',
    images: [U('photo-1550745165-9bc0b252726f'), U('photo-1557682250-33bd709cbe85')],
    fallbacks: [
      'radial-gradient(110% 80% at 80% 100%, #7c3aed33 0%, transparent 60%), linear-gradient(180deg, #10142a, #0a0d1c)',
      'radial-gradient(120% 90% at 20% 0%, #4c56c0 0%, #131735 55%, #0a0d1c 100%)',
    ],
    review: {
      text: 'Первый лендинг, который не стыдно показать инвесторам. Смета не разрослась ни на рубль.',
      author: 'Дмитрий, Atlas Web',
      source: 'Telegram',
      tg: 'dmitry_atlas',
    },
  },
  {
    id: 'c-race',
    title: 'RaceWeek — баннеры турнира',
    category: 'Баннер',
    style: 'Неон',
    description:
      'Серия баннеров для киберспортивного турнира: афиша, сторис, превью трансляций. Единая система на шести форматах.',
    result: 'Охваты анонсов выше среднего по каналу на 40%',
    images: [U('photo-1542281286-9e0a16bb7366'), U('photo-1550745165-9bc0b252726f')],
    fallbacks: [
      'radial-gradient(100% 80% at 50% 100%, #6366f133 0%, transparent 60%), linear-gradient(180deg, #12162b, #0a0d1c)',
      'radial-gradient(110% 80% at 80% 100%, #7c3aed33 0%, transparent 60%), linear-gradient(180deg, #10142a, #0a0d1c)',
    ],
    serviceId: 'banner',
  },
  {
    id: 'c-luxe',
    title: 'Luxe — знак ювелирного бренда',
    category: 'Логотип',
    style: 'Тёмный люкс',
    description:
      'Знак для мастерской украшений: тонкие линии, монохром, гравировка. Проверен в размере печати — 8 миллиметров, читается.',
    result: 'Знак живёт на печати, бирках и вывеске без изменений',
    images: [U('photo-1557682250-33bd709cbe85'), U('photo-1618005182384-a83a8bd57fbe')],
    fallbacks: [
      'radial-gradient(120% 90% at 20% 0%, #4c56c0 0%, #131735 55%, #0a0d1c 100%)',
      'radial-gradient(120% 120% at 30% 20%, #8b5cf61f 0%, transparent 50%), linear-gradient(160deg, #141831, #0a0d1c)',
    ],
    review: {
      text: 'Три варианта, все сильные. Выбрали один — не пожалели ни разу за год.',
      author: 'Анна, Luxe Workshop',
      source: 'Telegram',
      tg: 'anna_luxe',
    },
    serviceId: 'logo',
  },

]

const MORE_CASES: CaseStudy[] = [
  {
    id: 'c-bloom',
    title: 'Bloom — флористика',
    category: 'Айдентика',
    style: 'Минимал',
    description: 'Магазин цветов: знак, пакеты, открытки. Мягкая палитра вместо розовых клише.',
    result: 'Повторные заказы выросли на треть за два месяца',
    images: [U('photo-1618005182384-a83a8bd57fbe'), U('photo-1557682250-33bd709cbe85')],
    fallbacks: [
      'radial-gradient(120% 120% at 30% 20%, #8b5cf61f 0%, transparent 50%), linear-gradient(160deg, #141831, #0a0d1c)',
      'radial-gradient(120% 90% at 20% 0%, #4c56c0 0%, #131735 55%, #0a0d1c 100%)',
    ],
    serviceId: 'identity',
  },
  {
    id: 'c-kova',
    title: 'Kova — пекарня',
    category: 'Айдентика',
    style: 'Ретро',
    description: 'Соседская пекарня: тёплый знак, ценники, крафт-пакеты. Ретро без нафталина.',
    result: 'Вывеска стала самой фотографируемой на улице',
    images: [U('photo-1550859492-d5da9d8e45f3'), U('photo-1541701494587-cb58502866ab')],
    fallbacks: [
      'radial-gradient(120% 100% at 80% 0%, #7c3aed30 0%, transparent 55%), linear-gradient(200deg, #141831, #0a0d1c)',
      'radial-gradient(120% 100% at 20% 100%, #e11d4822 0%, transparent 55%), linear-gradient(180deg, #131735, #0a0d1c)',
    ],
    serviceId: 'identity',
  },
  {
    id: 'c-nord',
    title: 'Nord — снаряжение',
    category: 'Логотип',
    style: 'Минимал',
    description: 'Туристическое снаряжение: знак-компас, выживает на бирке, вышивке и гравировке.',
    result: 'Знак живёт на 12 видах носителей без адаптаций',
    images: [U('photo-1557682250-33bd709cbe85'), U('photo-1550859492-d5da9d8e45f3')],
    fallbacks: [
      'radial-gradient(120% 90% at 20% 0%, #4c56c0 0%, #131735 55%, #0a0d1c 100%)',
      'radial-gradient(120% 100% at 80% 0%, #7c3aed30 0%, transparent 55%), linear-gradient(200deg, #141831, #0a0d1c)',
    ],
    serviceId: 'logo',
  },
  {
    id: 'c-vega',
    title: 'Vega — аватар музыканта',
    category: 'Аватар',
    style: 'Неон',
    description: 'Аватар для electronic-музыканта: неоновый профиль, узнаваемость в ленте.',
    result: 'Оформление релиза собрано вокруг аватара',
    images: [U('photo-1550745165-9bc0b252726f'), U('photo-1542281286-9e0a16bb7366')],
    fallbacks: [
      'radial-gradient(110% 80% at 80% 100%, #7c3aed33 0%, transparent 60%), linear-gradient(180deg, #10142a, #0a0d1c)',
      'radial-gradient(100% 80% at 50% 100%, #6366f133 0%, transparent 60%), linear-gradient(180deg, #12162b, #0a0d1c)',
    ],
    serviceId: 'avatar',
  },
  {
    id: 'c-raven',
    title: 'Raven — аватар геймера',
    category: 'Аватар',
    style: 'Гранж',
    description: 'Знак для игрового канала: агрессивная геометрия, монохром с одним акцентом.',
    result: 'Аватар + баннер + оверлеи собраны как система',
    images: [U('photo-1542281286-9e0a16bb7366'), U('photo-1550745165-9bc0b252726f')],
    fallbacks: [
      'radial-gradient(100% 80% at 50% 100%, #6366f133 0%, transparent 60%), linear-gradient(180deg, #12162b, #0a0d1c)',
      'radial-gradient(110% 80% at 80% 100%, #7c3aed33 0%, transparent 60%), linear-gradient(180deg, #10142a, #0a0d1c)',
    ],
    serviceId: 'avatar',
  },
  {
    id: 'c-forum',
    title: 'Forum — баннеры конференции',
    category: 'Баннер',
    style: 'Минимал',
    description: 'Серия баннеров для IT-конференции: афиша, сторис, email-хедер. Одна система.',
    result: 'Регистрации через баннеры — 22% от всех',
    images: [U('photo-1558618666-fcd25c85cd64'), U('photo-1542281286-9e0a16bb7366')],
    fallbacks: [
      'linear-gradient(160deg, #151930 0%, #0b0e19 100%)',
      'radial-gradient(100% 80% at 50% 100%, #6366f133 0%, transparent 60%), linear-gradient(180deg, #12162b, #0a0d1c)',
    ],
    serviceId: 'banner',
  },
  {
    id: 'c-drive',
    title: 'Drive — баннеры автосалона',
    category: 'Баннер',
    style: 'Тёмный люкс',
    description: 'Баннеры для салона премиум-авто: сдержанный люкс, крупная типографика, ни одной стрелки.',
    result: 'CTR рекламной кампании вырос в 1,8 раза',
    images: [U('photo-1550859492-d5da9d8e45f3'), U('photo-1534796636912-3b95b3ab5986')],
    fallbacks: [
      'radial-gradient(120% 100% at 80% 0%, #7c3aed30 0%, transparent 55%), linear-gradient(200deg, #141831, #0a0d1c)',
      'radial-gradient(120% 100% at 50% 0%, #7dd3fc22 0%, transparent 55%), linear-gradient(180deg, #10142a, #06080e)',
    ],
    serviceId: 'banner',
  },
  {
    id: 'c-echo',
    title: 'Echo — обложка подкаста',
    category: 'Обложка',
    style: 'Минимал',
    description: 'Обложка для подкаста о звуке: волна, один цвет, читается в размере марки.',
    result: 'Обложка без изменений живёт третий сезон',
    images: [U('photo-1534796636912-3b95b3ab5986'), U('photo-1614854262318-831574f15f1f')],
    fallbacks: [
      'radial-gradient(120% 100% at 50% 0%, #7dd3fc22 0%, transparent 55%), linear-gradient(180deg, #10142a, #06080e)',
      'radial-gradient(110% 80% at 80% 100%, #7c3aed33 0%, transparent 60%), linear-gradient(180deg, #10142a, #0a0d1c)',
    ],
    serviceId: 'cover',
  },
  {
    id: 'c-mono',
    title: 'Mono — сайт фотографа',
    category: 'Сайт',
    style: 'Минимал',
    description: 'Портфолио фотографа: чёрно-белая сетка, ноль украшений, фото говорят сами.',
    result: 'Среднее время на сайте — 3 минуты 40 секунд',
    images: [U('photo-1561070791-2526d30994b5'), U('photo-1557672172-298e090bd0f1')],
    fallbacks: [
      'linear-gradient(170deg, #171b31 0%, #0b0e19 100%)',
      'radial-gradient(110% 90% at 30% 80%, #6366f126 0%, transparent 60%), linear-gradient(160deg, #12162b, #0a0d1c)',
    ],
    review: {
      text: 'Сайт как фотокнига: ничего лишнего, и именно это продаёт.',
      author: 'Олег, Mono Photo',
      source: 'Telegram',
      tg: 'oleg_mono',
    },
  },
]
CASES.push(...MORE_CASES)

// ── Works — отдельные от кейсов работы (1024×1280) ──

const W = (id: string) =>
  `https://images.unsplash.com/${id}?w=1024&h=1280&q=80&auto=format&fit=crop`

export const WORKS: Work[] = [
  { id: 'w1', title: 'Пакет для пекарни', category: 'Айдентика', src: W('photo-1557682250-33bd709cbe85'), fallback: 'radial-gradient(120% 90% at 20% 0%, #4c56c0 0%, #131735 55%, #0a0d1c 100%)' },
  { id: 'w2', title: 'Визитки студии', category: 'Айдентика', src: W('photo-1618005182384-a83a8bd57fbe'), fallback: 'linear-gradient(160deg, #141831, #0a0d1c)' },
  { id: 'w3', title: 'Бирки украшений', category: 'Айдентика', src: W('photo-1558655146-9f40138edfeb'), fallback: 'linear-gradient(200deg, #10142a, #06080e)' },
  { id: 'w4', title: 'Знак на вывеске', category: 'Логотип', src: W('photo-1614854262318-831574f15f1f'), fallback: 'linear-gradient(180deg, #10142a, #0a0d1c)' },
  { id: 'w5', title: 'Монохром-эскизы', category: 'Логотип', src: W('photo-1550859492-d5da9d8e45f3'), fallback: 'linear-gradient(200deg, #141831, #0a0d1c)' },
  { id: 'w6', title: 'Аватар в круге', category: 'Аватар', src: W('photo-1542281286-9e0a16bb7366'), fallback: 'linear-gradient(180deg, #12162b, #0a0d1c)' },
  { id: 'w7', title: 'Мини-знак 24px', category: 'Аватар', src: W('photo-1558618666-fcd25c85cd64'), fallback: 'linear-gradient(160deg, #151930, #0b0e19)' },
  { id: 'w8', title: 'Обложка канала', category: 'Баннер', src: W('photo-1550745165-9bc0b252726f'), fallback: 'linear-gradient(180deg, #10142a, #0a0d1c)' },
  { id: 'w9', title: 'Рекламный баннер', category: 'Баннер', src: W('photo-1541701494587-cb58502866ab'), fallback: 'linear-gradient(180deg, #131735, #0a0d1c)' },
  { id: 'w10', title: 'Арт релиза', category: 'Обложка', src: W('photo-1557672172-298e090bd0f1'), fallback: 'linear-gradient(160deg, #12162b, #0a0d1c)' },
  { id: 'w11', title: 'Подкаст-обложка', category: 'Обложка', src: W('photo-1534796636912-3b95b3ab5986'), fallback: 'linear-gradient(180deg, #10142a, #06080e)' },
  { id: 'w12', title: 'Тёмный лендинг', category: 'Сайт', src: W('photo-1561070791-2526d30994b5'), fallback: 'linear-gradient(170deg, #171b31, #0b0e19)' },
  { id: 'w13', title: 'Мобильный экран', category: 'Сайт', src: W('photo-1558655146-9f40138edfeb'), fallback: 'linear-gradient(160deg, #12162b, #0a0d1c)' },
]

/** Studio status line on Home */
export const STUDIO_STATUS = {
  online: true,
  responseTime: 'отвечаю ~2 часа',
  load: 'свободна с 28 авг',
}

export function seedOrders(): Order[] {
  return [
    {
      id: 'SRV-2901',
      serviceId: 'logo',
      title: 'Знак для мастерства керамики',
      brief: 'Мастерская керамики, ручная работа. Хочется тёплый, но современный знак. Без «гончарного» клише с кругом.',
      refs: 'pin.it/ceramic-mood',
      style: 'Минимал',
      budget: '6 000–10 000 ₽',
      deadline: '1–2 недели',
      status: 'progress',
      price: 8_000,
      paid: true,
      createdAt: now - 3 * DAY,
      updatedAt: now - 5 * 3600_000,
    },
    {
      id: 'SRV-2899',
      serviceId: 'preview',
      title: 'Превью для выпуска подкаста',
      brief: 'Выпуск про городские легенды. Нужна обложка с настроением ночного города.',
      style: 'Неон',
      budget: '1 500–2 500 ₽',
      deadline: 'До недели',
      status: 'review',
      price: 1_800,
      paid: false,
      createdAt: now - 2 * DAY,
      updatedAt: now - DAY,
    },
    {
      id: 'SRV-2890',
      serviceId: 'banner',
      title: 'Баннер для канала новостей',
      brief: 'Ежедневные новости в телеграме. Строгий, читаемый, без кликбейта.',
      budget: '1 800 ₽',
      deadline: '1 день',
      status: 'done',
      price: 1_800,
      paid: true,
      createdAt: now - 12 * DAY,
      updatedAt: now - 10 * DAY,
    },
  ]
}

/** Balance seeds high enough to try payment flow */
export const SEED_BALANCE = 12_000

// ── Courses ─────────────────────────────────────────────────
// Video lessons. Public sample streams stand in for production
// hosting — swap VITE_VIDEO_BASE / course.videoUrl when the real
// library is uploaded (see RELEASE.md).

const V = (name: string) =>
  `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/${name}.mp4`

export const COURSES: Course[] = [
  {
    id: 'course-brief',
    title: 'Бриф, который работает',
    description: 'Составляешь ТЗ так, что студия попадает с первого варианта. Экономит круг правок и неделю ожиданий.',
    level: 'Старт',
    accent: 'indigo',
    lessons: [
      {
        id: 'l-brief-1',
        title: 'Задача вместо пожеланий',
        minutes: 4,
        videoUrl: V('ForBiggerBlazes'),
        text: [
          'Бриф начинается не с «хочу логотип», а с задачи: что должен сделать человек, увидев результат. Запомнить, кликнуть, понять цену — измеримая цель.',
          'Проверка на практике: опиши свой проект одним предложением формата «помочь [кому] [что сделать]». Если предложение не складывается — задача ещё не созрела.',
          'Этот же вопрос Rival AI задаёт первым в брифе заказа — не случайно.',
        ],
      },
      {
        id: 'l-brief-2',
        title: 'Аудитория и место показа',
        minutes: 3,
        videoUrl: V('ForBiggerEscapes'),
        text: [
          'Аватар в Telegram живёт в круге 40 пикселей. Баннер на фасаде читают с двадцати метров. Одна картинка — два разных проекта.',
          'Выпиши все площадки, где будет жить работа, с размерами. Этот список студия спросит всё равно — лучше, чтобы он был в брифе сразу.',
        ],
      },
      {
        id: 'l-brief-3',
        title: 'Референсы: два «да» и одно «нет»',
        minutes: 4,
        videoUrl: V('ForBiggerFun'),
        text: [
          'Два-три референса «в эту сторону» задают направление. Один пример «не сюда» с причиной работает сильнее всех: он отсекает целый класс ошибок.',
          'Причина обязательна. «Не нравится» — не причина. «Слишком агрессивно для нашей аудитории» — причина.',
        ],
      },
      {
        id: 'l-brief-4',
        title: 'Собираем ТЗ за 10 минут',
        minutes: 5,
        videoUrl: V('ForBiggerJoyrides'),
        text: [
          'Каркас: задача, аудитория, площадки, настроение в трёх прилагательных, референсы, что НЕ входит в задачу.',
          'Шесть пунктов — и студия отвечает сметой в тот же день, а не серией уточняющих вопросов.',
          'Шаблон этого каркаса зашит в Rival AI: попроси «составь ТЗ» — получишь черновик по пунктам.',
        ],
      },
    ],
  },
  {
    id: 'course-sign',
    title: 'Знак с характером',
    description: 'Разбираешься, чем знак отличается от логотипа, и проверяешь работу как арт-директор.',
    level: 'Практика',
    accent: 'lavender',
    lessons: [
      {
        id: 'l-sign-1',
        title: 'Знак против логотипа',
        minutes: 4,
        videoUrl: V('ForBiggerMeltdowns'),
        text: [
          'Логотип — надпись: работает, когда имя уникальное и короткое. Знак — символ: работает без слов, в аватаре и на вывеске.',
          'Сильная система — почти всегда пара: знак для мелких размеров, надпись для документов и сайта.',
        ],
      },
      {
        id: 'l-sign-2',
        title: 'Тест трёх размеров',
        minutes: 3,
        videoUrl: V('Sintel'),
        text: [
          'Знак должен читаться в 24px (фавикон), 48px (аватар) и на фасаде. Не проходит один из размеров — знак не готов, каким красивым ни казался в портфолио.',
          'Второй тест — монохром. Знак, который разваливается без цвета, развалится и на печати.',
        ],
      },
      {
        id: 'l-sign-3',
        title: 'Геометрия и модуль',
        minutes: 5,
        videoUrl: V('TearsOfSteel'),
        text: [
          '«Дорогая» точность строится от модуля: толщины линий и радиусы кратны базовой величине. Глаз считывает ритм, даже не зная о сетке.',
          'Проверь любой знак, который любишь: почти всегда внутри простая кратность — 1x, 2x, 4x.',
        ],
      },
      {
        id: 'l-sign-4',
        title: 'Как принимать работу студии',
        minutes: 4,
        videoUrl: V('VolkswagenGTIReview'),
        text: [
          'Чек-лист приёмки: три размера, монохром, отличие от двух конкурентов ниши, поведение на тёмном и светлом фоне.',
          'Правки формулируй через цель: «читаться издалека», а не «шрифт побольше». Цель студия выполнит точно.',
        ],
      },
    ],
  },
  {
    id: 'course-brand',
    title: 'Айдентика без бюджета корпорации',
    description: 'Минимальная система для маленького бренда: палитра, типографика, носители — без воды.',
    level: 'Практика',
    accent: 'sky',
    lessons: [
      {
        id: 'l-brand-1',
        title: 'Палитра из трёх цветов',
        minutes: 4,
        videoUrl: V('WeAreGoingOnBullrun'),
        text: [
          'База, поверхность, акцент. Акцент занимает меньше 10% — тогда он работает. Всё остальное — оттенки базы.',
          'Проверка контраста обязательна: текст на фоне должен проходить 4.5:1, иначе «премиальность» съест читаемость.',
        ],
      },
      {
        id: 'l-brand-2',
        title: 'Пара шрифтов и иерархия',
        minutes: 4,
        videoUrl: V('WhatCarCanYouGetForAGrand'),
        text: [
          'Гротеск для заголовков, нейтральный для текста. Контраст — размером и весом: 24/600 против 14/400, а не капслоком.',
          'Три уровня достаточно: заголовок, текст, подпись. Четвёртый уровень — почти всегда признак структуры, которой нет.',
        ],
      },
      {
        id: 'l-brand-3',
        title: 'Носители: что реально нужно',
        minutes: 4,
        videoUrl: V('ElephantsDream'),
        text: [
          'Минимальный набор: аватар, шапка профиля, шаблон поста, визитка или упаковка. Остальное достраивается, когда появится задача.',
          'Не заказывай «дизайн всего» впрок. Система + один носитель под реальную задачу дешевле и живучее.',
        ],
      },
      {
        id: 'l-brand-4',
        title: 'Гайд, который спасёт систему',
        minutes: 3,
        videoUrl: V('BigBuckBunny'),
        text: [
          'Одна страница: как пользоваться знаком, чего избегать, где какие цвета. Без гайда айдентика разваливается за полгода.',
          'Гайд входит в айдентику студии по умолчанию — требуй его вместе с исходниками.',
        ],
      },
    ],
  },
]
