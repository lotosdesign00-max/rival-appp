import { useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ArrowLeft, Bell, ChevronRight, Globe, LifeBuoy, Palette } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Sheet } from '@/components/ui/Sheet'
import { Toggle } from '@/components/ui/misc'
import { LanguageSwitcher } from '@/components/widgets/LanguageSwitcher'
import { toast } from '@/components/ui/Toast'
import { useStore } from '@/lib/store'
import { useTelegram } from '@/hooks/useTelegram'
import { animatedThemeChange } from '@/lib/theme'
import type { ThemeId } from '@/lib/store'

export function SettingsScreen() {
  const { state, popOverlay, setNotifications, setTheme, clearAll, logout, t } = useStore()
  const { hapticFeedback } = useTelegram()
  const switchRef = useRef<HTMLElement | null>(null)

  const toggleTheme = () => {
    const next: ThemeId = state.settings.theme === 'light' ? 'cosmic' : 'light'
    hapticFeedback('selection')
    void animatedThemeChange(next, switchRef.current, setTheme)
  }
  const [confirmClear, setConfirmClear] = useState(false)
  const [confirmLogout, setConfirmLogout] = useState(false)

  return (
    <div className="relative min-h-dvh bg-void">
      <div className="pt-[max(10px,env(safe-area-inset-top))] pb-[calc(40px+env(safe-area-inset-bottom))]">
        <header className="flex items-center gap-2 px-4 py-3">
          <button
            onClick={popOverlay}
            aria-label="Назад"
            className="w-10 h-10 rounded-full flex items-center justify-center text-mute hover:text-ink active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-bright/60"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-display text-[17px] font-semibold text-ink">{t('settingsTitle')}</h1>
        </header>

        <div className="px-5">
          {/* Preferences */}
          <div className="bg-surface border border-line rounded-2xl divide-y divide-line/60 overflow-hidden">
            {/* Theme row */}
            <div className="flex items-center justify-between px-4 py-4">
              <span className="flex items-center gap-3">
                <Palette size={18} className="text-mute" />
                <span>
                  <span className="block text-sm text-ink">{t('settingsTheme')}</span>
                  <span className="block text-xs text-dim mt-0.5">
                    {state.settings.theme === 'light' ? t('settingsThemeLight') : t('settingsThemeCosmic')}
                  </span>
                </span>
              </span>
              <label
                ref={(el) => {
                  switchRef.current = el
                }}
                className="theme-switch theme-switch--compact"
                aria-label="Переключить тему"
              >
                <input
                  type="checkbox"
                  className="theme-switch__checkbox"
                  checked={state.settings.theme !== 'light'}
                  onChange={toggleTheme}
                />
                <div className="theme-switch__container">
                  <div className="theme-switch__clouds" />
                  <div className="theme-switch__stars-container">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 144 55" fill="none">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M135.831 3.00688C135.055 3.85027 134.111 4.29946 133 4.35447C134.111 4.40947 135.055 4.85867 135.831 5.71123C136.607 6.55462 136.996 7.56303 136.996 8.72727C136.996 7.95722 137.172 7.25134 137.525 6.59129C137.886 5.93124 138.372 5.39954 138.98 5.00535C139.598 4.60199 140.268 4.39114 141 4.35447C139.88 4.2903 138.936 3.85027 138.16 3.00688C137.384 2.16348 136.996 1.16425 136.996 0C136.996 1.16425 136.607 2.16348 135.831 3.00688ZM31 23.3545C32.1114 23.2995 33.0551 22.8503 33.8313 22.0069C34.6075 21.1635 34.9956 20.1642 34.9956 19C34.9956 20.1642 35.3837 21.1635 36.1599 22.0069C36.9361 22.8503 37.8798 23.2903 39 23.3545C38.2679 23.3911 37.5976 23.602 36.9802 24.0053C36.3716 24.3995 35.8864 24.9312 35.5248 25.5913C35.172 26.2513 34.9956 26.9572 34.9956 27.7273C34.9956 26.563 34.6075 25.5546 33.8313 24.7112C33.0551 23.8587 32.1114 23.4095 31 23.3545ZM0 36.3545C1.11136 36.2995 2.05513 35.8503 2.83131 35.0069C3.6075 34.1635 3.99559 33.1642 3.99559 32C3.99559 33.1642 4.38368 34.1635 5.15987 35.0069C5.93605 35.8503 6.87982 36.2903 8 36.3545C7.26792 36.3911 6.59757 36.602 5.98015 37.0053C5.37155 37.3995 4.88644 37.9312 4.52481 38.5913C4.172 39.2513 3.99559 39.9572 3.99559 40.7273C3.99559 39.563 3.6075 38.5546 2.83131 37.7112C2.05513 36.8587 1.11136 36.4095 0 36.3545ZM56.8313 24.0069C56.0551 24.8503 55.1114 25.2995 54 25.3545C55.1114 25.4095 56.0551 25.8587 56.8313 26.7112C57.6075 27.5546 57.9956 28.563 57.9956 29.7273C57.9956 28.9572 58.172 28.2513 58.5248 27.5913C58.8864 26.9312 59.3716 26.3995 59.9802 26.0053C60.5976 25.602 61.2679 25.3911 62 25.3545C60.8798 25.2903 59.9361 24.8503 59.1599 24.0069C58.3837 23.1635 57.9956 22.1642 57.9956 21C57.9956 22.1642 57.6075 23.1635 56.8313 24.0069ZM81 25.3545C82.1114 25.2995 83.0551 24.8503 83.8313 24.0069C84.6075 23.1635 84.9956 22.1642 84.9956 21C84.9956 22.1642 85.3837 23.1635 86.1599 24.0069C86.9361 24.8503 87.8798 25.2903 89 25.3545C88.2679 25.3911 87.5976 25.602 86.9802 26.0053C86.3716 26.3995 85.8864 26.9312 85.5248 27.5913C85.172 28.2513 84.9956 28.9572 84.9956 29.7273C84.9956 28.563 84.6075 27.5546 83.8313 26.7112C83.0551 25.8587 82.1114 25.4095 81 25.3545ZM136 36.3545C137.111 36.2995 138.055 35.8503 138.831 35.0069C139.607 34.1635 139.996 33.1642 139.996 32C139.996 33.1642 140.384 34.1635 141.16 35.0069C141.936 35.8503 142.88 36.2903 144 36.3545C143.268 36.3911 142.598 36.602 141.98 37.0053C141.372 37.3995 140.886 37.9312 140.525 38.5913C140.172 39.2513 139.996 39.9572 139.996 40.7273C139.996 39.563 139.607 38.5546 138.831 37.7112C138.055 36.8587 137.111 36.4095 136 36.3545ZM101.831 49.0069C101.055 49.8503 100.111 50.2995 99 50.3545C100.111 50.4095 101.055 50.8587 101.831 51.7112C102.607 52.5546 102.996 53.563 102.996 54.7273C102.996 53.9572 103.172 53.2513 103.525 52.5913C103.886 51.9312 104.372 51.3995 104.98 51.0053C105.598 50.602 106.268 50.3911 107 50.3545C105.88 50.2903 104.936 49.8503 104.16 49.0069C103.384 48.1635 102.996 47.1642 102.996 46C102.996 47.1642 102.607 48.1635 101.831 49.0069Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <div className="theme-switch__circle-container">
                    <div className="theme-switch__sun-moon-container">
                      <div className="theme-switch__moon">
                        <div className="theme-switch__spot" />
                        <div className="theme-switch__spot" />
                        <div className="theme-switch__spot" />
                      </div>
                    </div>
                  </div>
                </div>
              </label>
            </div>

            {/* Language row with signature liquid morph switcher */}
            <div className="flex items-center justify-between px-4 py-3.5">
              <span className="flex items-center gap-3">
                <Globe size={18} className="text-mute" />
                <span>
                  <span className="block text-sm text-ink">{t('settingsLanguage')}</span>
                  <span className="block text-xs text-dim mt-0.5">
                    {state.settings.lang === 'en' ? 'English (EN)' : 'Русский (RU)'}
                  </span>
                </span>
              </span>
              <LanguageSwitcher compact />
            </div>

            {/* Notifications row */}
            <div className="flex items-center justify-between px-4 py-4">
              <span className="flex items-center gap-3">
                <Bell size={18} className="text-mute" />
                <span>
                  <span className="block text-sm text-ink">{t('settingsNotifications')}</span>
                  <span className="block text-xs text-dim mt-0.5">{t('settingsNotificationsDesc')}</span>
                </span>
              </span>
              <Toggle
                checked={state.settings.notifications}
                onChange={(v) => {
                  setNotifications(v)
                  toast(v ? (state.settings.lang === 'en' ? 'Notifications on' : 'Уведомления включены') : (state.settings.lang === 'en' ? 'Notifications off' : 'Уведомления выключены'))
                }}
                label="Уведомления"
              />
            </div>

            <a
              href="https://t.me/rivalspace"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between px-4 py-4 active:bg-white/[0.02]"
            >
              <span className="flex items-center gap-3">
                <LifeBuoy size={18} className="text-mute" />
                <span className="text-sm text-ink">{t('settingsSupport')}</span>
              </span>
              <ChevronRight size={16} className="text-dim" />
            </a>
          </div>

          {/* Account */}
          <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-dim mt-7 mb-3 px-1">
            {t('settingsAccount')}
          </p>
          <div className="bg-surface border border-line rounded-2xl divide-y divide-line/60 overflow-hidden mb-6">
            <div className="flex items-center justify-between px-4 py-3.5">
              <div>
                <span className="block text-sm font-medium text-ink">{state.user?.name || 'User'}</span>
                <span className="block text-xs text-dim mt-0.5 font-mono">
                  {state.user?.username ? `@${state.user.username}` : (state.user?.email || 'Authorized')}
                </span>
              </div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-accent/[0.12] text-accent-bright border border-accent/25">
                {state.user?.tier || 'Client'}
              </span>
            </div>

            <button
              onClick={() => setConfirmLogout(true)}
              className="w-full flex items-center justify-between px-4 py-3.5 active:bg-white/[0.02] text-left group"
            >
              <span className="text-sm text-err group-hover:underline">{t('profileLogout')}</span>
              <span className="text-xs text-dim">switch account</span>
            </button>
          </div>

          {/* Data */}
          <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-dim mt-4 mb-3 px-1">
            Data
          </p>
          <button
            onClick={() => setConfirmClear(true)}
            className="w-full flex items-center justify-between bg-surface border border-line rounded-2xl px-4 py-4 active:scale-[0.985] transition-all duration-200"
          >
            <span className="text-sm text-err">{t('settingsClearData')}</span>
            <span className="text-xs text-dim">{t('settingsClearDataDesc')}</span>
          </button>
        </div>
      </div>

      {/* Clear Data Sheet */}
      <AnimatePresence>
        {confirmClear && (
          <Sheet open={confirmClear} onClose={() => setConfirmClear(false)} title={t('settingsClearConfirmTitle')}>
            <p className="text-sm text-mute -mt-1 mb-5">
              {t('settingsClearConfirmDesc')}
            </p>
            <div className="flex gap-2.5">
              <Button variant="secondary" className="flex-1" onClick={() => setConfirmClear(false)}>
                {t('profileCancel')}
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                onClick={() => {
                  clearAll()
                  setConfirmClear(false)
                  popOverlay()
                  toast(t('settingsClearedToast'))
                }}
              >
                {t('settingsClearData')}
              </Button>
            </div>
          </Sheet>
        )}
      </AnimatePresence>

      {/* Logout Sheet */}
      <AnimatePresence>
        {confirmLogout && (
          <Sheet open={confirmLogout} onClose={() => setConfirmLogout(false)} title={t('profileLogoutConfirmTitle')}>
            <p className="text-sm text-mute -mt-1 mb-5">
              {t('profileLogoutConfirmDesc')}
            </p>
            <div className="flex gap-2.5">
              <Button variant="secondary" className="flex-1" onClick={() => setConfirmLogout(false)}>
                {t('profileCancel')}
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                onClick={() => {
                  setConfirmLogout(false)
                  logout()
                  toast(t('profileLoggedOutToast'))
                }}
              >
                {t('profileExit')}
              </Button>
            </div>
          </Sheet>
        )}
      </AnimatePresence>
    </div>
  )
}
