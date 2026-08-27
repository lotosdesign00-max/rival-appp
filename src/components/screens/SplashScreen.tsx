import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { BrandWordmark } from '@/components/widgets/BrandMark'
import { Starfield } from '@/components/widgets/Starfield'

interface SplashScreenProps {
  onComplete: () => void
}

/** Quiet brand moment: orbit draws itself, core ignites once, fades out. */
export function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const t = window.setTimeout(onComplete, 2000)
    return () => window.clearTimeout(t)
  }, [onComplete])

  return (
    <motion.div
      className="fixed inset-0 z-[80] bg-abyss flex items-center justify-center"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* single faint halo */}
      <div
        className="absolute w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(closest-side, rgba(99,102,241,.12), transparent 72%)',
        }}
        aria-hidden
      />
      <Starfield density={1.4} />

      <motion.div
        className="relative flex flex-col items-center"
        initial={{ scale: 1.06, y: 22 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.svg
          width="84"
          height="84"
          viewBox="0 0 32 32"
          fill="none"
          initial={{ opacity: 0, scale: 0.86 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden
        >
          <defs>
            <linearGradient id="splash-core" x1="8" y1="8" x2="24" y2="24" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#818CF8" />
              <stop offset="1" stopColor="#A78BFA" />
            </linearGradient>
          </defs>

          {/* orbit draws itself */}
          <motion.ellipse
            cx="16"
            cy="16"
            rx="13.5"
            ry="5.4"
            transform="rotate(-24 16 16)"
            stroke="rgba(129,140,248,.55)"
            strokeWidth="1"
            pathLength={1}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1], delay: 0.15 }}
          />

          {/* core */}
          <motion.circle
            cx="16"
            cy="16"
            r="6.2"
            fill="url(#splash-core)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.55 }}
            style={{ transformOrigin: '16px 16px' }}
          />

          {/* red satellite */}
          <motion.circle
            cx="28"
            cy="11.6"
            r="1.9"
            fill="#E11D48"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1] }}
            transition={{ duration: 1.2, times: [0, 0.7, 1], delay: 0.9 }}
          />
        </motion.svg>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6"
        >
          <BrandWordmark />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
