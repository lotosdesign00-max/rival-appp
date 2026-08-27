// ── Rival Space · domain types (studio model) ──

export type AccentKey = 'indigo' | 'lavender' | 'sky' | 'rose'

export type AuthProvider = 'telegram' | 'google' | 'guest'

export interface UserProfile {
  id: string
  name: string
  username?: string
  email?: string
  avatar?: string
  provider: AuthProvider
  tier?: string
  joinedAt?: number
}

export interface Service {
  id: string
  title: string
  description: string
  priceFrom: number
  days: string
  accent: AccentKey
}

export type WorkCategory =
  | 'Айдентика'
  | 'Логотип'
  | 'Аватар'
  | 'Баннер'
  | 'Обложка'
  | 'Сайт'

export interface Work {
  id: string
  title: string
  category: WorkCategory
  src: string
  fallback: string
}

export interface Review {
  text: string
  author: string
  source: string
  /** Telegram username — the icon links to t.me/<tg> */
  tg: string
}

export interface CaseStudy {
  id: string
  title: string
  category: string
  style: string
  description: string
  result: string
  images: string[]
  fallbacks: string[]
  review?: Review
  serviceId?: string
}

export type OrderStatus = 'new' | 'progress' | 'review' | 'done' | 'cancelled'

export interface Order {
  id: string
  serviceId: string
  title: string
  brief: string
  refs?: string
  style?: string
  budget?: string
  deadline?: string
  status: OrderStatus
  price: number
  paid: boolean
  createdAt: number
  updatedAt: number
}

export interface ChatMessage {
  id: string
  role: 'user' | 'rival'
  text: string
  ts: number
  /** true while the reply is being revealed */
  pending?: boolean
  /** context attached when AI opened from a screen */
  contextLabel?: string
}

export interface Lesson {
  id: string
  title: string
  minutes: number
  videoUrl: string
  text: string[]
}

export interface Course {
  id: string
  title: string
  description: string
  level: 'Старт' | 'Практика'
  accent: AccentKey
  lessons: Lesson[]
}

export type RouteName = 'order-create' | 'order' | 'case' | 'course' | 'lesson' | 'ai' | 'settings'

export interface Route {
  name: RouteName
  params?: Record<string, string>
}
