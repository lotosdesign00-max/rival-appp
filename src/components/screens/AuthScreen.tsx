import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, ChevronRight, Lock, User, ArrowRight } from 'lucide-react'
import { useGoogleLogin } from '@react-oauth/google'
import { useStore } from '@/lib/store'
import { useTelegram } from '@/hooks/useTelegram'
import { GOOGLE_CLIENT_ID, TELEGRAM_BOT_USERNAME } from '@/lib/auth.config'
import { Starfield } from '@/components/widgets/Starfield'
import { BrandMark } from '@/components/widgets/BrandMark'
import { CosmicOrb } from '@/components/widgets/CosmicOrb'
import { LanguageSwitcher } from '@/components/widgets/LanguageSwitcher'
import { TelegramLoginWidget, type TelegramAuthData } from '@/components/widgets/TelegramLoginWidget'
import { Sheet } from '@/components/ui/Sheet'
import { toast } from '@/components/ui/Toast'
import type { UserProfile } from '@/lib/types'

export function AuthScreen() {
  const { login, t } = useStore()
  const { user: tgUser, isTelegram, hapticFeedback } = useTelegram()

  const [loadingProvider, setLoadingProvider] = useState<'telegram' | 'google' | 'guest' | null>(null)
  const [telegramSheetOpen, setTelegramSheetOpen] = useState(false)

  const features = [
    {
      icon: '⚡',
      title: t('featAiTitle'),
      desc: t('featAiDesc'),
    },
    {
      icon: '🎨',
      title: t('featTrackTitle'),
      desc: t('featTrackDesc'),
    },
    {
      icon: '💎',
      title: t('featAcadTitle'),
      desc: t('featAcadDesc'),
    },
  ]

  // ── Google OAuth (real GIS flow) ──────────────────────────
  const googleLogin = useGoogleLogin({
    flow: 'implicit',
    onSuccess: async (tokenResponse) => {
      setLoadingProvider('google')
      hapticFeedback('impact')

      try {
        // Fetch user info from Google's userinfo endpoint
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        })
        const userInfo = await res.json()

        const profile: UserProfile = {
          id: `goog_${userInfo.sub}`,
          name: userInfo.name || userInfo.email?.split('@')[0] || 'Google User',
          email: userInfo.email,
          username: userInfo.email?.split('@')[0],
          avatar: userInfo.picture,
          provider: 'google',
          tier: 'Pro Partner',
          joinedAt: Date.now(),
        }

        login(profile)
        toast(`${t('authWelcome')}: ${profile.email}`)
      } catch (err) {
        console.error('Google auth error:', err)
        toast('Google auth failed')
      } finally {
        setLoadingProvider(null)
      }
    },
    onError: (error) => {
      console.error('Google login error:', error)
      setLoadingProvider(null)
      toast('Google auth error')
    },
  })


  const handleGoogleClick = () => {
    if (!GOOGLE_CLIENT_ID) {
      toast('Google Client ID не настроен — см. auth.config.ts')
      return
    }
    setLoadingProvider('google')
    googleLogin()
  }

  // ── Telegram Auth ─────────────────────────────────────────

  // Inside Telegram Mini App: use native WebApp user data
  const handleTelegramNative = () => {
    if (!tgUser) return
    setLoadingProvider('telegram')
    hapticFeedback('impact')

    setTimeout(() => {
      const profile: UserProfile = {
        id: `tg_${tgUser.id}`,
        name: [tgUser.first_name, tgUser.last_name].filter(Boolean).join(' ') || 'Telegram User',
        username: tgUser.username ? tgUser.username.replace(/^@/, '') : `user_${tgUser.id}`,
        avatar: tgUser.photo_url || undefined,
        provider: 'telegram',
        tier: 'VIP Client',
        joinedAt: Date.now(),
      }

      login(profile)
      setLoadingProvider(null)
      toast(`${t('authWelcome')}, ${profile.name}!`)
    }, 400)
  }

  // In browser: Telegram Login Widget callback
  const handleTelegramWidget = (data: TelegramAuthData) => {
    setLoadingProvider('telegram')
    hapticFeedback('impact')

    const profile: UserProfile = {
      id: `tg_${data.id}`,
      name: [data.first_name, data.last_name].filter(Boolean).join(' ') || 'Telegram User',
      username: data.username || `user_${data.id}`,
      avatar: data.photo_url,
      provider: 'telegram',
      tier: 'VIP Client',
      joinedAt: Date.now(),
    }

    login(profile)
    setTelegramSheetOpen(false)
    setLoadingProvider(null)
    toast(`${t('authWelcome')}, ${profile.name}!`)
  }

  const handleTelegramClick = () => {
    if (isTelegram && tgUser) {
      // Inside Telegram app — instant login
      handleTelegramNative()
    } else if (TELEGRAM_BOT_USERNAME) {
      // In browser with bot configured — show widget sheet
      setTelegramSheetOpen(true)
    } else {
      toast('Telegram Bot не настроен — см. auth.config.ts')
    }
  }

  // ── Guest Auth ────────────────────────────────────────────

  const handleGuestAuth = () => {
    setLoadingProvider('guest')
    hapticFeedback('selection')

    setTimeout(() => {
      const guestId = Math.floor(1000 + Math.random() * 9000)
      const profile: UserProfile = {
        id: `guest_${guestId}`,
        name: `Guest #${guestId}`,
        username: `guest_${guestId}`,
        provider: 'guest',
        tier: 'Standard',
        joinedAt: Date.now(),
      }

      login(profile)
      setLoadingProvider(null)
      toast(t('authWelcomeGuest'))
    }, 450)
  }

  return (
    <div className="relative min-h-dvh bg-void text-ink flex flex-col justify-between overflow-hidden px-5 py-6 select-none">
      {/* Background Starfield and Orb */}
      <Starfield />
      <CosmicOrb size={260} className="absolute -top-24 -right-24 opacity-60 pointer-events-none" />
      <div className="aurora pointer-events-none" />

      {/* Top Brand Mark & Language Switcher */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center justify-between z-10 pt-2"
      >
        <div className="flex items-center gap-2.5">
          <BrandMark size={28} />
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-[15px] font-bold tracking-[0.2em] text-ink">RIVAL</span>
            <span className="font-display text-[13px] font-medium tracking-[0.2em] text-dim">SPACE</span>
          </div>
        </div>

        {/* Liquid Morphing Language Switcher */}
        <LanguageSwitcher compact />
      </motion.div>

      {/* Center Hero & Value Proposition */}
      <div className="my-auto py-4 z-10">
        {/* Glowing badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center mb-5"
        >
          <div className="story-ring relative p-[2px] rounded-2xl">
            <div className="w-20 h-20 rounded-2xl bg-surface/90 border border-linex/80 flex items-center justify-center backdrop-blur-md shadow-2xl">
              <BrandMark size={44} />
            </div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-5"
        >
          <h1 className="font-display text-[28px] font-bold text-ink leading-tight tracking-[-0.02em]">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-bright via-lavender to-sky">
              {t('authTitle')}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-mute mt-2 max-w-[310px] mx-auto leading-relaxed">
            {t('authSubtitle')}
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-2 mb-6"
        >
          {features.map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl bg-surface/60 border border-line/70 backdrop-blur-sm shadow-sm"
            >
              <div className="w-8 h-8 rounded-lg bg-raise/80 border border-line flex items-center justify-center text-sm shrink-0 shadow-inner">
                {f.icon}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-ink truncate">{f.title}</p>
                <p className="text-[11px] text-dim truncate">{f.desc}</p>
              </div>
              <CheckCircle2 size={13} className="text-accent-bright/60 shrink-0 ml-1" />
            </div>
          ))}
        </motion.div>

        {/* Authentication Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-3"
        >
          {/* Telegram Login Button */}
          <button
            onClick={handleTelegramClick}
            disabled={loadingProvider !== null}
            className="shine w-full relative overflow-hidden group rounded-2xl py-3.5 px-4 flex items-center justify-between text-white font-medium text-sm transition-all duration-300 active:scale-[0.98] shadow-lg shadow-[#0088cc]/15 bg-gradient-to-r from-[#229ED9] via-[#1E96D1] to-[#0088CC] border border-[#52BCEE]/40"
          >
            <span className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shadow-inner">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21.928 2.54a1.35 1.35 0 0 0-1.472-.2L2.52 10.198a1.36 1.36 0 0 0-.083 2.478l4.98 2.053 2.023 6.096a1.35 1.35 0 0 0 2.278.43l3.05-3.056 4.966 3.666a1.35 1.35 0 0 0 2.128-.85l3.1-16.71a1.35 1.35 0 0 0-.034-.765zM8.32 14.17l-1.02-3.08 10.37-6.52-8.52 8.35a.8.8 0 0 0-.23.47l-.6 2.08v-.002l-.001.002.001-.002v1.3-.602z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              <span className="font-semibold text-white tracking-wide">
                {isTelegram && tgUser
                  ? `${t('authContinueTelegramAs')} @${tgUser.username || tgUser.first_name}`
                  : t('authContinueTelegram')}
              </span>
            </span>

            {loadingProvider === 'telegram' ? (
              <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <ChevronRight size={18} className="text-white/80 group-hover:translate-x-0.5 transition-transform" />
            )}
          </button>

          {/* Google Login Button */}
          <button
            onClick={handleGoogleClick}
            disabled={loadingProvider !== null}
            className="edge-shine w-full relative overflow-hidden group rounded-2xl py-3.5 px-4 flex items-center justify-between text-ink font-medium text-sm transition-all duration-300 active:scale-[0.98] bg-surface/90 hover:bg-raise border border-linex/80 shadow-md backdrop-blur-md"
          >
            <span className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                <svg width="15" height="15" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </span>
              <span className="font-semibold tracking-wide">{t('authContinueGoogle')}</span>
            </span>

            {loadingProvider === 'google' ? (
              <span className="w-5 h-5 border-2 border-mute/40 border-t-accent-bright rounded-full animate-spin" />
            ) : (
              <ChevronRight size={18} className="text-mute group-hover:text-ink group-hover:translate-x-0.5 transition-all" />
            )}
          </button>

          {/* Guest Button */}
          <div className="pt-2 text-center">
            <button
              onClick={handleGuestAuth}
              disabled={loadingProvider !== null}
              className="text-xs text-mute hover:text-ink transition-colors py-1.5 px-3 rounded-lg hover:bg-white/[0.03] inline-flex items-center gap-1.5"
            >
              <User size={13} className="text-dim" />
              <span>{t('authContinueGuest')}</span>
              <ArrowRight size={12} className="text-dim" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Footer Security Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="text-center z-10 pt-2"
      >
        <p className="text-[11px] text-dim flex items-center justify-center gap-1.5">
          <Lock size={11} className="text-dim" />
          <span>{t('authSecureNote')}</span>
        </p>
      </motion.div>

      {/* ── Telegram Login Widget Sheet (browser only) ── */}
      <AnimatePresence>
        {telegramSheetOpen && (
          <Sheet open={telegramSheetOpen} onClose={() => setTelegramSheetOpen(false)} title={t('authTelegramSync')}>
            <div className="space-y-4 pt-1">
              <div className="p-3.5 rounded-2xl bg-[#229ED9]/10 border border-[#229ED9]/30 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#229ED9] flex items-center justify-center text-white shrink-0 shadow-md">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M21.928 2.54a1.35 1.35 0 0 0-1.472-.2L2.52 10.198a1.36 1.36 0 0 0-.083 2.478l4.98 2.053 2.023 6.096a1.35 1.35 0 0 0 2.278.43l3.05-3.056 4.966 3.666a1.35 1.35 0 0 0 2.128-.85l3.1-16.71a1.35 1.35 0 0 0-.034-.765zM8.32 14.17l-1.02-3.08 10.37-6.52-8.52 8.35a.8.8 0 0 0-.23.47l-.6 2.08v-.002l-.001.002.001-.002v1.3-.602z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-ink">{t('authTelegramSync')}</p>
                  <p className="text-[11px] text-mute">{t('authTelegramSyncDesc')}</p>
                </div>
              </div>

              {/* Real Telegram Login Widget */}
              <TelegramLoginWidget onAuth={handleTelegramWidget} />

              <p className="text-[11px] text-dim text-center">
                Нажмите кнопку выше для авторизации через Telegram
              </p>
            </div>
          </Sheet>
        )}
      </AnimatePresence>
    </div>
  )
}
