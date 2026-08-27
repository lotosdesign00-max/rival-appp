import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/lib/store'
import { useTelegram } from '@/hooks/useTelegram'
import type { Language } from '@/lib/i18n'

interface LanguageSwitcherProps {
  className?: string
  compact?: boolean
}

export function LanguageSwitcher({ className = '', compact = false }: LanguageSwitcherProps) {
  const { state, setLang } = useStore()
  const { hapticFeedback } = useTelegram()
  const currentLang = state.settings.lang || 'ru'

  const [isWarping, setIsWarping] = useState(false)
  const [warpDirection, setWarpDirection] = useState<'to-en' | 'to-ru'>('to-en')
  const [hovered, setHovered] = useState(false)
  const switchIndex = useRef(0)

  const handleToggle = (targetLang?: Language) => {
    const nextLang: Language = targetLang || (currentLang === 'ru' ? 'en' : 'ru')
    if (nextLang === currentLang && targetLang) return

    const dir = nextLang === 'en' ? 'to-en' : 'to-ru'
    setWarpDirection(dir)
    setIsWarping(true)
    switchIndex.current += 1

    try {
      hapticFeedback('selection')
    } catch {
      /* noop */
    }

    setLang(nextLang)

    setTimeout(() => {
      setIsWarping(false)
    }, 600)
  }

  const isRu = currentLang === 'ru'

  return (
    <div
      className={`relative inline-flex items-center select-none ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Outer Cosmic Container */}
      <motion.button
        onClick={() => handleToggle()}
        whileTap={{ scale: 0.93 }}
        className={`relative overflow-hidden rounded-full p-[2.5px] flex items-center bg-[#050711]/95 border border-[#2B3558]/80 backdrop-blur-2xl transition-all duration-300 ${
          compact ? 'h-[32px]' : 'h-[36px]'
        }`}
        style={{
          boxShadow: hovered
            ? '0 0 24px rgba(139, 92, 246, 0.35), 0 0 8px rgba(56, 189, 248, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.15)'
            : '0 4px 20px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.08)',
        }}
        aria-label={`Переключить язык (текущий: ${currentLang.toUpperCase()})`}
      >
        {/* Deep Space Background with Stars */}
        <div className="absolute inset-0 bg-gradient-to-r from-void via-[#0B0F24] to-void pointer-events-none" />

        {/* Micro Cosmic Star Sparkles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <span className="absolute top-1 left-3 w-1 h-1 rounded-full bg-white/40 animate-ping opacity-30" />
          <span className="absolute bottom-1.5 right-4 w-1 h-1 rounded-full bg-sky/50 opacity-40" />
          <span className="absolute top-2 right-2 w-0.5 h-0.5 rounded-full bg-lavender/60" />
        </div>

        {/* ── Active Cosmic Pod / Starlight Core ── */}
        <motion.div
          layout
          className="absolute rounded-full pointer-events-none overflow-hidden"
          initial={false}
          animate={{
            x: isRu ? 0 : compact ? 32 : 36,
            scaleX: isWarping ? 1.28 : 1,
            scaleY: isWarping ? 0.9 : 1,
          }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 23,
            mass: 0.7,
          }}
          style={{
            width: compact ? 32 : 36,
            height: compact ? 26 : 30,
            background:
              'linear-gradient(135deg, #4338CA 0%, #7C3AED 45%, #06B6D4 100%)',
            boxShadow:
              '0 0 20px rgba(124, 58, 237, 0.75), 0 0 8px rgba(6, 182, 212, 0.5), inset 0 1px 2px rgba(255, 255, 255, 0.6)',
          }}
        >
          {/* Inner Celestial Prismatic Flare */}
          <div className="absolute top-0 inset-x-1.5 h-[1.5px] rounded-full bg-white/70 blur-[0.3px]" />
          <div className="absolute bottom-0 inset-x-2 h-[1px] rounded-full bg-sky/50 blur-[0.4px]" />

          {/* Hyperspace Warp Streaks during switch */}
          {isWarping && (
            <motion.div
              initial={{ opacity: 0, scaleX: 0.2 }}
              animate={{ opacity: [0, 1, 0], scaleX: [0.2, 1.8, 0.2] }}
              transition={{ duration: 0.45 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="w-full h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent blur-[0.5px]" />
            </motion.div>
          )}
        </motion.div>

        {/* Hyperspace Trail Ejection Particles */}
        <AnimatePresence>
          {isWarping && (
            <motion.span
              key={`trail-${switchIndex.current}`}
              initial={{
                opacity: 0.9,
                scale: 1,
                x: warpDirection === 'to-en' ? 12 : 52,
              }}
              animate={{
                opacity: 0,
                scale: 0.2,
                x: warpDirection === 'to-en' ? -4 : 68,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-sky/90 shadow-[0_0_8px_#38BDF8] pointer-events-none"
            />
          )}
        </AnimatePresence>

        {/* ── RU Button Label ── */}
        <div
          onClick={(e) => {
            e.stopPropagation()
            handleToggle('ru')
          }}
          className={`relative z-10 flex items-center justify-center font-mono font-bold tracking-wider cursor-pointer ${
            compact ? 'w-[32px] text-[11px]' : 'w-[36px] text-[12px]'
          }`}
        >
          <AnimatePresence mode="popLayout">
            <motion.span
              key={`ru-${isRu ? 'active' : 'inactive'}-${switchIndex.current}`}
              initial={{
                opacity: isRu ? 0.35 : 0.7,
                scale: isRu ? 0.75 : 1,
                filter: isWarping ? 'blur(3px)' : 'blur(0px)',
              }}
              animate={{
                opacity: isRu ? 1 : 0.4,
                scale: isRu ? 1 : 0.92,
                filter: 'blur(0px)',
              }}
              exit={{
                opacity: 0,
                scale: 0.6,
                filter: 'blur(4px)',
                x: warpDirection === 'to-en' ? 10 : -10,
              }}
              transition={{
                type: 'spring',
                stiffness: 480,
                damping: 25,
              }}
              className={`transition-colors duration-200 ${
                isRu
                  ? 'text-white font-extrabold drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]'
                  : 'text-dim hover:text-ink'
              }`}
            >
              RU
            </motion.span>
          </AnimatePresence>
        </div>

        {/* ── EN Button Label ── */}
        <div
          onClick={(e) => {
            e.stopPropagation()
            handleToggle('en')
          }}
          className={`relative z-10 flex items-center justify-center font-mono font-bold tracking-wider cursor-pointer ${
            compact ? 'w-[32px] text-[11px]' : 'w-[36px] text-[12px]'
          }`}
        >
          <AnimatePresence mode="popLayout">
            <motion.span
              key={`en-${!isRu ? 'active' : 'inactive'}-${switchIndex.current}`}
              initial={{
                opacity: !isRu ? 0.35 : 0.7,
                scale: !isRu ? 0.75 : 1,
                filter: isWarping ? 'blur(3px)' : 'blur(0px)',
              }}
              animate={{
                opacity: !isRu ? 1 : 0.4,
                scale: !isRu ? 1 : 0.92,
                filter: 'blur(0px)',
              }}
              exit={{
                opacity: 0,
                scale: 0.6,
                filter: 'blur(4px)',
                x: warpDirection === 'to-ru' ? -10 : 10,
              }}
              transition={{
                type: 'spring',
                stiffness: 480,
                damping: 25,
              }}
              className={`transition-colors duration-200 ${
                !isRu
                  ? 'text-white font-extrabold drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]'
                  : 'text-dim hover:text-ink'
              }`}
            >
              EN
            </motion.span>
          </AnimatePresence>
        </div>
      </motion.button>
    </div>
  )
}
