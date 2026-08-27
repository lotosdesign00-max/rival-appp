import { useEffect, useRef, useCallback } from 'react'
import { TELEGRAM_BOT_USERNAME } from '@/lib/auth.config'

export interface TelegramAuthData {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
  auth_date: number
  hash: string
}

interface TelegramLoginWidgetProps {
  /** Called when user successfully authenticates via the widget */
  onAuth: (user: TelegramAuthData) => void
  /** Button size: small | medium | large */
  buttonSize?: 'small' | 'medium' | 'large'
  /** Corner radius of the button */
  cornerRadius?: number
  /** Show user photo next to the button */
  showAvatar?: boolean
  /** Request write access to user's messages */
  requestAccess?: boolean
}

/**
 * Telegram Login Widget component.
 * Injects the official Telegram widget script which renders
 * a "Log in with Telegram" button and handles the OAuth flow.
 *
 * Requirements:
 * - Bot must be created via @BotFather
 * - Domain must be linked via /setdomain (doesn't work on localhost)
 */
export function TelegramLoginWidget({
  onAuth,
  buttonSize = 'large',
  cornerRadius = 14,
  showAvatar = true,
  requestAccess = true,
}: TelegramLoginWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const callbackRef = useRef(onAuth)
  callbackRef.current = onAuth

  // Register global callback for Telegram widget
  const setupCallback = useCallback(() => {
    // The widget calls window.TelegramLoginWidget.dataOnauth
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any
    w.__telegram_login_callback = (user: TelegramAuthData) => {
      callbackRef.current(user)
    }
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container || !TELEGRAM_BOT_USERNAME) return

    // Clean up any previous widget
    container.innerHTML = ''
    setupCallback()

    const script = document.createElement('script')
    script.src = 'https://telegram.org/js/telegram-widget.js?22'
    script.async = true
    script.setAttribute('data-telegram-login', TELEGRAM_BOT_USERNAME)
    script.setAttribute('data-size', buttonSize)
    script.setAttribute('data-radius', String(cornerRadius))
    script.setAttribute('data-onauth', '__telegram_login_callback(user)')
    if (showAvatar) {
      script.setAttribute('data-userpic', 'true')
    }
    if (requestAccess) {
      script.setAttribute('data-request-access', 'write')
    }

    container.appendChild(script)

    return () => {
      container.innerHTML = ''
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).__telegram_login_callback
    }
  }, [buttonSize, cornerRadius, showAvatar, requestAccess, setupCallback])

  if (!TELEGRAM_BOT_USERNAME) {
    return (
      <div className="text-center py-4">
        <p className="text-xs text-mute">
          Telegram Bot не настроен.
        </p>
        <p className="text-[11px] text-dim mt-1">
          Укажите TELEGRAM_BOT_USERNAME в auth.config.ts
        </p>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="flex justify-center py-2 [&>iframe]:rounded-xl [&>iframe]:!border-0"
    />
  )
}
