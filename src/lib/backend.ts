import type { AppState } from './store'

/**
 * Data backend abstraction.
 *
 * Today: LocalBackend (localStorage) — works offline, zero infra.
 * Release: set VITE_API_URL and the same UI talks to your REST
 * backend (Supabase Edge / any server). See RELEASE.md for the
 * expected endpoints and schema.
 */

export interface DataBackend {
  readonly name: 'local' | 'rest'
  /** pull remote state; null = nothing stored yet */
  load(): Promise<Partial<AppState> | null>
  /** persist full state; fire-and-forget friendly */
  save(state: AppState): Promise<void>
}

class LocalBackend implements DataBackend {
  readonly name = 'local' as const

  async load(): Promise<Partial<AppState> | null> {
    try {
      const activeUserId = localStorage.getItem('rival.active_user')
      if (!activeUserId) return null
      const raw = localStorage.getItem(`rival.data.${activeUserId}`)
      return raw ? (JSON.parse(raw) as Partial<AppState>) : null
    } catch {
      return null
    }
  }

  async save(state: AppState): Promise<void> {
    try {
      if (state.isAuthenticated && state.user) {
        localStorage.setItem('rival.active_user', state.user.id)
        localStorage.setItem(`rival.data.${state.user.id}`, JSON.stringify(state))
      } else {
        localStorage.removeItem('rival.active_user')
      }
    } catch {
      /* storage full / private mode — memory keeps working */
    }
  }
}

class RestBackend implements DataBackend {
  readonly name = 'rest' as const
  private baseUrl: string
  private localMirror: LocalBackend

  constructor(baseUrl: string, localMirror: LocalBackend) {
    this.baseUrl = baseUrl
    this.localMirror = localMirror
  }

  private async authHeaders(): Promise<Record<string, string>> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    // Telegram initData — the backend validates the HMAC against the bot token
    const initData = window.Telegram?.WebApp?.initData
    if (initData) headers['X-Telegram-Init-Data'] = initData
    return headers
  }

  async load(): Promise<Partial<AppState> | null> {
    try {
      const res = await fetch(`${this.baseUrl}/state`, { headers: await this.authHeaders() })
      if (!res.ok) return null
      return (await res.json()) as Partial<AppState>
    } catch {
      // offline / backend down — local mirror keeps the app usable
      return this.localMirror.load()
    }
  }

  async save(state: AppState): Promise<void> {
    // always mirror locally first: instant restore, offline-safe
    await this.localMirror.save(state)
    try {
      await fetch(`${this.baseUrl}/state`, {
        method: 'PUT',
        headers: await this.authHeaders(),
        body: JSON.stringify(state),
      })
    } catch {
      /* queued for next save — local copy is authoritative until then */
    }
  }
}

const local = new LocalBackend()

const apiUrl = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '')

export const backend: DataBackend = apiUrl ? new RestBackend(apiUrl, local) : local


