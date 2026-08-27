import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { ChatMessage, Order, Route, RouteName, UserProfile } from './types'
import { SERVICES } from './data'
import { backend } from './backend'
import { translations, type Language, type TranslationKey } from './i18n'

// ── Persistent state ────────────────────────────────────────

export type ThemeId = 'cosmic' | 'light'

export interface Settings {
  notifications: boolean
  theme: ThemeId
  lang: Language
}

/** Draft of an order being composed — survives tab switches and AI detours */
export interface OrderDraft {
  serviceId?: string
  brief: string
  refs: string
  style: string | null
  budget: string | null
  deadline: string | null
  step: number
}

export const EMPTY_DRAFT: OrderDraft = {
  brief: '',
  refs: '',
  style: null,
  budget: null,
  deadline: null,
  step: 0,
}

export interface AppState {
  orders: Order[]
  balance: number
  chat: ChatMessage[]
  settings: Settings
  draft: OrderDraft
  /** completed lesson ids → true */
  lessonsDone: Record<string, true>
  user: UserProfile | null
  isAuthenticated: boolean
}

const WELCOME_TEXT =
  'Я Rival — ассистент студии.\nПомогу сформулировать ТЗ, подобрать услугу и бюджет, объясню, что влияет на срок. О дизайне тоже поговорим. С чего начнём?'

export function freshState(): AppState {
  return {
    orders: [], // New accounts start with empty orders!
    balance: 0, // New accounts start with zero balance!
    chat: [
      {
        id: 'welcome',
        role: 'rival',
        text: WELCOME_TEXT,
        ts: Date.now(),
      },
    ],
    settings: { notifications: true, theme: 'cosmic', lang: 'ru' },
    draft: { ...EMPTY_DRAFT },
    lessonsDone: {},
    user: null,
    isAuthenticated: false,
  }
}

export function hydrate(parsed: Partial<AppState> | null): AppState {
  if (!parsed) return freshState()
  // never restore half-streamed replies
  const chat = (parsed.chat ?? []).map((m) =>
    m.role === 'rival' && m.pending ? { ...m, pending: false } : m
  )
  const isAuth = Boolean(parsed.isAuthenticated && parsed.user)
  const fresh = freshState()
  return {
    ...fresh,
    ...parsed,
    chat: chat.length > 0 ? chat : fresh.chat,
    draft: { ...EMPTY_DRAFT, ...parsed.draft },
    settings: {
      ...fresh.settings,
      ...parsed.settings,
      lang: parsed.settings?.lang === 'en' ? 'en' : 'ru',
    },
    user: isAuth ? (parsed.user ?? null) : null,
    isAuthenticated: isAuth,
  }
}

function loadState(): AppState {
  try {
    const activeUserId = localStorage.getItem('rival.active_user')
    if (!activeUserId) return freshState()
    
    const raw = localStorage.getItem(`rival.data.${activeUserId}`)
    if (!raw) return freshState()
    
    return hydrate(JSON.parse(raw) as Partial<AppState>)
  } catch {
    return freshState()
  }
}

const uid = () => Math.random().toString(36).slice(2, 9)

// ── Navigation ──────────────────────────────────────────────

export type TabId = 'home' | 'academy' | 'gallery' | 'profile'
export type GalleryTab = 'cases' | 'shots'

interface StoreValue {
  state: AppState
  tab: TabId
  overlays: Route[]
  navDirection: 'forward' | 'back' | 'none'
  galleryTab: GalleryTab
  setGalleryTab: (t: GalleryTab) => void
  aiContext: { label: string; prompt: string } | null
  /** where to return from the AI tab */
  aiReturnTo: RouteName | null

  setTab: (tab: TabId) => void
  openOrder: (id: string) => void
  openCase: (id: string) => void
  openAi: (context?: { label: string; prompt: string }, returnTo?: RouteName) => void
  pushOverlay: (name: RouteName, params?: Record<string, string>) => void
  popOverlay: () => void

  login: (profile: UserProfile) => void
  logout: () => void
  updateUser: (patch: Partial<UserProfile>) => void

  updateDraft: (patch: Partial<OrderDraft>) => void
  submitOrder: (serviceId: string) => string
  cancelOrder: (id: string) => void
  payOrder: (id: string) => boolean
  topUp: (amount: number) => void
  toggleLessonDone: (lessonId: string) => void
  setTheme: (theme: ThemeId) => void
  setLang: (lang: Language) => void
  t: (key: TranslationKey) => string
  setNotifications: (on: boolean) => void
  clearAll: () => void

  sendMessage: (text: string) => void
  appendToMessage: (id: string, chunk: string) => void
  finishMessage: (id: string, fullText: string) => void
  clearChat: () => void
}

const StoreContext = createContext<StoreValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(loadState)
  const [tab, setTabState] = useState<TabId>('home')
  const [overlays, setOverlays] = useState<Route[]>([])
  const [navDirection, setNavDirection] = useState<'forward' | 'back' | 'none'>('none')
  const [aiContext, setAiContext] = useState<{ label: string; prompt: string } | null>(null)
  const [aiReturnTo, setAiReturnTo] = useState<RouteName | null>(null)
  const [galleryTab, setGalleryTab] = useState<GalleryTab>('cases')
  const saveTimer = useRef<number | undefined>(undefined)

  // debounced persistence — never blocks interaction
  useEffect(() => {
    window.clearTimeout(saveTimer.current)
    saveTimer.current = window.setTimeout(() => {
      void backend.save(state)
    }, 400)
    return () => window.clearTimeout(saveTimer.current)
  }, [state])

  // remote hydration (only when a REST backend is configured)
  useEffect(() => {
    if (backend.name !== 'rest') return
    let alive = true
    void backend.load().then((remote) => {
      if (alive && remote) setState((s) => ({ ...hydrate(remote), draft: s.draft }))
    })
    return () => {
      alive = false
    }
  }, [])

  const setTab = useCallback((next: TabId) => {
    setTabState(next)
    setNavDirection('none')
    setOverlays([])
  }, [])

  const pushOverlay = useCallback((name: RouteName, params?: Record<string, string>) => {
    setNavDirection('forward')
    setOverlays((prev) => [...prev, { name, params }])
  }, [])

  const popOverlay = useCallback(() => {
    setNavDirection('back')
    setOverlays((prev) => prev.slice(0, -1))
  }, [])

  const openOrder = useCallback((id: string) => pushOverlay('order', { id }), [pushOverlay])
  const openCase = useCallback((id: string) => pushOverlay('case', { id }), [pushOverlay])

  const openAi = useCallback(
    (context?: { label: string; prompt: string }, returnTo?: RouteName) => {
      setAiContext(context ?? null)
      setAiReturnTo(returnTo ?? null)
      setNavDirection('forward')
      setOverlays((prev) => [...prev, { name: 'ai' }])
    },
    []
  )

  // ── Orders ──

  const updateDraft = useCallback((patch: Partial<OrderDraft>) => {
    setState((s) => ({ ...s, draft: { ...s.draft, ...patch } }))
  }, [])

  const submitOrder = useCallback((serviceId: string) => {
    const id = `SRV-${2900 + Math.floor(Math.random() * 90)}`
    const ts = Date.now()
    const price = SERVICES.find((s) => s.id === serviceId)?.priceFrom ?? 0
    setState((s) => {
      const draft = s.draft
      const order: Order = {
        id,
        serviceId,
        title: draft.brief.trim().split('\n')[0].slice(0, 60) || 'Заказ без описания',
        brief: draft.brief.trim(),
        refs: draft.refs.trim() || undefined,
        style: draft.style ?? undefined,
        budget: draft.budget ?? undefined,
        deadline: draft.deadline ?? undefined,
        status: 'new',
        price,
        paid: false,
        createdAt: ts,
        updatedAt: ts,
      }
      return {
        ...s,
        orders: [order, ...s.orders],
        draft: { ...EMPTY_DRAFT },
      }
    })
    return id
  }, [])

  const cancelOrder = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      orders: s.orders.map((o) =>
        o.id === id && o.status === 'new' ? { ...o, status: 'cancelled', updatedAt: Date.now() } : o
      ),
    }))
  }, [])

  const payOrder = useCallback((id: string) => {
    let ok = false
    setState((s) => {
      const order = s.orders.find((o) => o.id === id)
      if (!order || order.paid || s.balance < order.price) return s
      ok = true
      return {
        ...s,
        balance: s.balance - order.price,
        orders: s.orders.map((o) =>
          o.id === id ? { ...o, paid: true, updatedAt: Date.now() } : o
        ),
      }
    })
    return ok
  }, [])

  const topUp = useCallback((amount: number) => {
    setState((s) => ({ ...s, balance: s.balance + amount }))
  }, [])

  const setTheme = useCallback((theme: ThemeId) => {
    setState((s) => ({ ...s, settings: { ...s.settings, theme } }))
  }, [])

  const setLang = useCallback((lang: Language) => {
    setState((s) => ({ ...s, settings: { ...s.settings, lang } }))
  }, [])

  const t = useCallback(
    (key: TranslationKey): string => {
      const currentLang = state.settings.lang || 'ru'
      const dict = translations[currentLang] || translations.ru
      return (dict[key] || translations.ru[key] || key) as string
    },
    [state.settings.lang]
  )

  const toggleLessonDone = useCallback((lessonId: string) => {
    setState((s) => {
      const lessonsDone = { ...s.lessonsDone }
      if (lessonsDone[lessonId]) delete lessonsDone[lessonId]
      else lessonsDone[lessonId] = true
      return { ...s, lessonsDone }
    })
  }, [])

  const setNotifications = useCallback((on: boolean) => {
    setState((s) => ({ ...s, settings: { ...s.settings, notifications: on } }))
  }, [])

  const login = useCallback((profile: UserProfile) => {
    try {
      const raw = localStorage.getItem(`rival.data.${profile.id}`)
      if (raw) {
        // Return user! Restore their exact state.
        const savedState = hydrate(JSON.parse(raw) as Partial<AppState>)
        setState({
          ...savedState,
          user: { ...savedState.user, ...profile }, // update avatar/name if changed
          isAuthenticated: true,
        })
      } else {
        // Brand new user! Start fresh.
        const fresh = freshState()
        setState({
          ...fresh,
          user: profile,
          isAuthenticated: true,
        })
      }
    } catch {
      const fresh = freshState()
      setState({ ...fresh, user: profile, isAuthenticated: true })
    }
  }, [])

  const logout = useCallback(() => {
    setState(freshState())
    setTabState('home')
    setOverlays([])
    setNavDirection('none')
    localStorage.removeItem('rival.active_user')
  }, [])

  const updateUser = useCallback((patch: Partial<UserProfile>) => {
    setState((s) => (s.user ? { ...s, user: { ...s.user, ...patch } } : s))
  }, [])

  const clearAll = useCallback(() => {
    try {
      const activeUserId = localStorage.getItem('rival.active_user')
      if (activeUserId) {
        localStorage.removeItem(`rival.data.${activeUserId}`)
        localStorage.removeItem('rival.active_user')
      }
    } catch {
      /* noop */
    }
    setState(freshState())
    setTabState('home')
    setOverlays([])
  }, [])

  // ── Chat ──

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim()
      if (!trimmed) return
      const ctx = aiContext
      const userMsg: ChatMessage = { id: uid(), role: 'user', text: trimmed, ts: Date.now() }
      const rivalMsg: ChatMessage = {
        id: uid(),
        role: 'rival',
        text: '',
        ts: Date.now(),
        pending: true,
        contextLabel: ctx?.label,
      }
      setAiContext(null)
      setState((s) => ({ ...s, chat: [...s.chat, userMsg, rivalMsg] }))
    },
    [aiContext]
  )

  const appendToMessage = useCallback((id: string, chunk: string) => {
    setState((s) => ({
      ...s,
      chat: s.chat.map((m) => (m.id === id ? { ...m, text: m.text + chunk } : m)),
    }))
  }, [])

  const finishMessage = useCallback((id: string, fullText: string) => {
    setState((s) => ({
      ...s,
      chat: s.chat.map((m) => (m.id === id ? { ...m, text: fullText, pending: false } : m)),
    }))
  }, [])

  const clearChat = useCallback(() => {
    setState((s) => ({ ...s, chat: freshState().chat }))
  }, [])

  const value = useMemo<StoreValue>(
    () => ({
      state,
      tab,
      overlays,
      navDirection,
      galleryTab,
      setGalleryTab,
      aiContext,
      aiReturnTo,
      setTab,
      openOrder,
      openCase,
      openAi,
      pushOverlay,
      popOverlay,
      login,
      logout,
      updateUser,
      updateDraft,
      submitOrder,
      cancelOrder,
      payOrder,
      topUp,
      toggleLessonDone,
      setTheme,
      setLang,
      t,
      setNotifications,
      clearAll,
      sendMessage,
      appendToMessage,
      finishMessage,
      clearChat,
    }),
    [
      state,
      tab,
      overlays,
      navDirection,
      galleryTab,
      setGalleryTab,
      aiContext,
      aiReturnTo,
      setTab,
      openOrder,
      openCase,
      openAi,
      pushOverlay,
      popOverlay,
      login,
      logout,
      updateUser,
      updateDraft,
      submitOrder,
      cancelOrder,
      payOrder,
      topUp,
      toggleLessonDone,
      setTheme,
      setLang,
      t,
      setNotifications,
      clearAll,
      sendMessage,
      appendToMessage,
      finishMessage,
      clearChat,
    ]
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
