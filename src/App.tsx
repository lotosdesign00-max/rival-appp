import { Component, useCallback, useEffect, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { StoreProvider, useStore } from '@/lib/store'
import { TelegramProvider, useTelegram } from '@/hooks/useTelegram'
import { applyThemeDom } from '@/lib/theme'
import { GOOGLE_CLIENT_ID } from '@/lib/auth.config'
import { SplashScreen } from '@/components/screens/SplashScreen'
import { AuthScreen } from '@/components/screens/AuthScreen'
import { HomeScreen } from '@/components/screens/HomeScreen'
import { CoursesScreen } from '@/components/screens/CoursesScreen'
import { CourseScreen } from '@/components/screens/CourseScreen'
import { LessonScreen } from '@/components/screens/LessonScreen'
import { GalleryScreen } from '@/components/screens/GalleryScreen'
import { AIScreen } from '@/components/screens/AIScreen'
import { ProfileScreen } from '@/components/screens/ProfileScreen'
import { OrderCreateScreen } from '@/components/screens/OrderCreateScreen'
import { OrderDetailScreen } from '@/components/screens/OrderDetailScreen'
import { CaseDetailScreen } from '@/components/screens/CaseDetailScreen'
import { SettingsScreen } from '@/components/screens/SettingsScreen'
import { TabBar } from '@/components/layout/TabBar'

const EASE = [0.22, 1, 0.36, 1] as const

const tabVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

const overlayVariants = {
  initial: (dir: string) => ({
    x: dir === 'back' ? '-18%' : '100%',
    opacity: dir === 'back' ? 0.6 : 1,
  }),
  animate: { x: 0, opacity: 1 },
  exit: (dir: string) => ({
    x: dir === 'back' ? '100%' : '-14%',
    opacity: dir === 'back' ? 1 : 0,
  }),
}

function AppShell() {
  const { state, tab, overlays, navDirection, popOverlay } = useStore()
  const { backButton } = useTelegram()
  const [showSplash, setShowSplash] = useState(true)
  const handleSplashComplete = useCallback(() => setShowSplash(false), [])

  const topOverlay = overlays[overlays.length - 1]

  // theme → <html data-theme> + Telegram/браузерная шапка
  useEffect(() => {
    applyThemeDom(state.settings.theme)
  }, [state.settings.theme])

  // sky follows the time of day: bluer mornings, deep indigo nights
  useEffect(() => {
    const h = new Date().getHours()
    const [a, b] =
      h >= 22 || h < 5
        ? ['rgba(99,102,241,0.22)', 'rgba(167,139,250,0.14)'] // ночь — глубже
        : h < 12
          ? ['rgba(99,102,241,0.14)', 'rgba(125,211,252,0.13)'] // утро — голубее
          : ['rgba(99,102,241,0.17)', 'rgba(167,139,250,0.10)'] // день/вечер — классика
    const r = document.documentElement.style
    r.setProperty('--aurora-a', a)
    r.setProperty('--aurora-b', b)
  }, [])

  // native Telegram back button mirrors the in-app stack
  useEffect(() => {
    backButton(overlays.length > 0, popOverlay)
  }, [overlays.length, backButton, popOverlay])

  const isAuth = Boolean(state.isAuthenticated && state.user)

  return (
    <div className="min-h-dvh bg-void text-ink max-w-md mx-auto relative">
      <AnimatePresence>{showSplash && <SplashScreen onComplete={handleSplashComplete} />}</AnimatePresence>

      {!showSplash && (
        <AnimatePresence mode="wait">
          {!isAuth ? (
            <motion.div
              key="auth-screen"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="min-h-dvh"
            >
              <AuthScreen />
            </motion.div>
          ) : (
            <motion.div
              key="app-workspace"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="min-h-dvh"
            >
              {/* Tabs */}
              <AnimatePresence mode="wait" initial={false}>
                <motion.main
                  key={tab}
                  variants={tabVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.2, ease: EASE }}
                >
                  {tab === 'home' && <HomeScreen />}
                  {tab === 'academy' && <CoursesScreen />}
                  {tab === 'gallery' && <GalleryScreen />}
                  {tab === 'profile' && <ProfileScreen />}
                </motion.main>
              </AnimatePresence>

              {/* Tab bar hidden while a stacked screen is open */}
              {overlays.length === 0 && <TabBar />}

              {/* Stacked screens */}
              <AnimatePresence custom={navDirection}>
                {topOverlay && (
                  <motion.div
                    key={topOverlay.name + (topOverlay.params?.id ?? '')}
                    custom={navDirection}
                    variants={overlayVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: navDirection === 'none' ? 0.2 : 0.3, ease: EASE }}
                    className="overlay-scroll fixed inset-0 z-30 bg-void overflow-y-auto no-scrollbar shadow-raise border-l border-line/60"
                  >
                    <div className="max-w-md mx-auto min-h-full">
                      {topOverlay.name === 'order-create' && <OrderCreateScreen />}
                      {topOverlay.name === 'ai' && <AIScreen />}
                      {topOverlay.name === 'order' && (
                        <OrderDetailScreen orderId={topOverlay.params?.id ?? ''} />
                      )}
                      {topOverlay.name === 'case' && (
                        <CaseDetailScreen caseId={topOverlay.params?.id ?? ''} />
                      )}
                      {topOverlay.name === 'course' && (
                        <CourseScreen courseId={topOverlay.params?.id ?? ''} />
                      )}
                      {topOverlay.name === 'lesson' && (
                        <LessonScreen
                          lessonId={topOverlay.params?.id ?? ''}
                          courseId={topOverlay.params?.course}
                        />
                      )}
                      {topOverlay.name === 'settings' && <SettingsScreen />}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}

/** keeps one broken screen from blanking the whole app */
class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-dvh bg-void flex items-center justify-center px-8">
          <div className="text-center">
            <p className="font-display font-semibold text-ink">Что-то сломалось</p>
            <p className="text-sm text-mute mt-2">{this.state.error.message}</p>
            <button
              onClick={() => {
                this.setState({ error: null })
                localStorage.removeItem('rival.space.v2')
                location.reload()
              }}
              className="mt-5 h-11 px-6 rounded-xl bg-accent text-white text-sm font-medium active:scale-95 transition-transform"
            >
              Перезапустить
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

export default function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <TelegramProvider>
        <ErrorBoundary>
          <StoreProvider>
            <AppShell />
          </StoreProvider>
        </ErrorBoundary>
      </TelegramProvider>
    </GoogleOAuthProvider>
  )
}
