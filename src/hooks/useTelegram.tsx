import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  photo_url?: string
}

export interface TelegramContextType {
  user: TelegramUser | null
  telegram: TelegramWebApp | null
  isTelegram: boolean
  expand: () => void
  ready: () => void
  close: () => void
  hapticFeedback: (type: 'impact' | 'notification' | 'selection') => void
  /** show/hide the native Telegram back button with a handler */
  backButton: (visible: boolean, onClick?: () => void) => void
}

const TelegramContext = createContext<TelegramContextType | null>(null)

// Extend Window interface for Telegram WebApp
declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp
    }
  }
}

interface TelegramWebApp {
  ready: () => void
  expand: () => void
  close: () => void
  initData: string
  initDataUnsafe: {
    user?: TelegramUser
    query_id?: string
    auth_date?: number
    hash?: string
  }
  colorScheme: 'light' | 'dark'
  themeParams: {
    bg_color?: string
    text_color?: string
    hint_color?: string
    link_color?: string
    button_color?: string
    button_text_color?: string
  }
  viewportHeight: number
  viewportStableHeight: number
  isExpanded: boolean
  platform: string
  HapticFeedback?: {
    impactOccurred?: (style?: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void
    notificationOccurred?: (type: 'error' | 'success' | 'warning') => void
    selectionChanged?: () => void
  }
  BackButton?: {
    show: () => void
    hide: () => void
    onClick: (cb: () => void) => void
    offClick: (cb: () => void) => void
  }
}

export function TelegramProvider({ children }: { children: ReactNode }) {
  const [telegram, setTelegram] = useState<TelegramWebApp | null>(null)
  const [user, setUser] = useState<TelegramUser | null>(null)
  const [isTelegram, setIsTelegram] = useState(false)

  useEffect(() => {
    // Initialize Telegram WebApp
    const tg = window.Telegram?.WebApp

    if (tg && tg.initData) {
      setTelegram(tg)
      setUser(tg.initDataUnsafe?.user || null)
      setIsTelegram(true)

      // Auto-expand to full height
      try {
        tg.expand?.()
        tg.ready?.()
      } catch (e) {
        console.warn('Telegram init error:', e)
      }
    } else {
      // Standalone / browser testing
      setIsTelegram(false)
      setUser(null)
    }
  }, [])

  const expand = () => {
    try {
      telegram?.expand?.()
    } catch (e) {
      console.warn('expand error:', e)
    }
  }

  const ready = () => {
    try {
      telegram?.ready?.()
    } catch (e) {
      console.warn('ready error:', e)
    }
  }

  const close = () => {
    try {
      telegram?.close?.()
    } catch (e) {
      console.warn('close error:', e)
    }
  }

  const hapticFeedback = (type: 'impact' | 'notification' | 'selection') => {
    try {
      if (telegram?.HapticFeedback) {
        switch (type) {
          case 'impact':
            telegram.HapticFeedback.impactOccurred?.('medium')
            break
          case 'notification':
            telegram.HapticFeedback.notificationOccurred?.('success')
            break
          case 'selection':
            telegram.HapticFeedback.selectionChanged?.()
            break
        }
      }
    } catch (e) {
      console.warn('Haptic feedback error:', e)
    }
  }

  const backButton = (visible: boolean, onClick?: () => void) => {
    const bb = telegram?.BackButton
    if (!bb) return
    try {
      bb.offClick?.(() => {})
      if (visible && onClick) {
        bb.onClick(onClick)
        bb.show()
      } else {
        bb.hide()
      }
    } catch (e) {
      console.warn('BackButton error:', e)
    }
  }

  return (
    <TelegramContext.Provider
      value={{ user, telegram, isTelegram, expand, ready, close, hapticFeedback, backButton }}
    >
      {children}
    </TelegramContext.Provider>
  )
}

export function useTelegram() {
  const context = useContext(TelegramContext)
  if (!context) {
    throw new Error('useTelegram must be used within a TelegramProvider')
  }
  return context
}
