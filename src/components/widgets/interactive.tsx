import { useEffect, useMemo, useRef, type ReactNode } from 'react'
import { animate, motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

const EASE = [0.22, 1, 0.36, 1] as const

/** animated number — springs to the value on mount/change */
export function CountUp({
  value,
  format = (v: number) => Math.round(v).toLocaleString('ru-RU'),
}: {
  value: number
  format?: (v: number) => string
}) {
  const mv = useMotionValue(0)
  const text = useTransform(mv, format)
  useEffect(() => {
    const controls = animate(mv, value, { duration: 0.9, ease: EASE })
    return () => controls.stop()
  }, [value, mv])
  return <motion.span className="tnum">{text}</motion.span>
}

/** Scroll-reveal: fades content up the first time it enters the viewport */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-32px' }}
      transition={{ duration: 0.5, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

/** true on devices with a real hover-capable pointer; tilt/spotlight are desktop-only */
function useFinePointer() {
  const ref = useRef(false)
  if (typeof window !== 'undefined' && !ref.current) {
    ref.current = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  }
  return ref.current
}

interface TiltCardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  maxTilt?: number
}

/**
 * TiltCard — adapted from the 21st.dev "Spotlight Card" pattern.
 * 3D tilt toward the cursor + a radial spotlight that follows the
 * pointer, both driven by motion values (zero React re-renders).
 * Degrades to a plain card on touch devices.
 */
export function TiltCard({ children, className, onClick, maxTilt = 6 }: TiltCardProps) {
  const fine = useFinePointer()
  const wrapRef = useRef<HTMLDivElement>(null)

  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const sx = useSpring(px, { stiffness: 260, damping: 24 })
  const sy = useSpring(py, { stiffness: 260, damping: 24 })
  const rotateX = useTransform(sy, [0, 1], [maxTilt, -maxTilt])
  const rotateY = useTransform(sx, [0, 1], [-maxTilt, maxTilt])

  if (!fine) {
    return (
      <div className={className} onClick={onClick}>
        {children}
      </div>
    )
  }

  return (
    <div ref={wrapRef} className={cn('[perspective:900px]', className)} onClick={onClick}>
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative h-full w-full"
        onMouseMove={(e) => {
          const rect = wrapRef.current?.getBoundingClientRect()
          if (!rect) return
          const nx = (e.clientX - rect.left) / rect.width
          const ny = (e.clientY - rect.top) / rect.height
          px.set(nx)
          py.set(ny)
          // spotlight position via CSS vars — no re-render
          wrapRef.current?.style.setProperty('--spot-x', `${nx * 100}%`)
          wrapRef.current?.style.setProperty('--spot-y', `${ny * 100}%`)
        }}
        onMouseLeave={() => {
          px.set(0.5)
          py.set(0.5)
        }}
      >
        {children}
        {/* cursor spotlight */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 hover:opacity-100"
          style={{
            background:
              'radial-gradient(260px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgba(129,140,248,0.14), transparent 65%)',
          }}
        />
      </motion.div>
    </div>
  )
}

interface OrbitCTAProps {
  children: ReactNode
  onClick?: () => void
  className?: string
}

/**
 * OrbitCTA — primary action with two satellites orbiting the edge.
 * On fine-pointer devices the button is magnetic: it leans a few
 * pixels toward the cursor (motion values, zero re-renders).
 */
export function OrbitCTA({ children, onClick, className }: OrbitCTAProps) {
  const fine = useFinePointer()
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const x = useSpring(useTransform(px, [-0.5, 0.5], [-5, 5]), { stiffness: 220, damping: 18 })
  const y = useSpring(useTransform(py, [-0.5, 0.5], [-3, 3]), { stiffness: 220, damping: 18 })

  if (!fine) {
    return (
      <button onClick={onClick} className={cn('group relative w-full', className)} data-orbit-cta>
        <span className="orbit-ring" aria-hidden>
          <span className="orbit-satellite orbit-a" />
          <span className="orbit-satellite orbit-b" />
        </span>
        {children}
      </button>
    )
  }

  return (
    <motion.button
      onClick={onClick}
      className={cn('group relative w-full', className)}
      data-orbit-cta
      style={{ x, y }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        px.set((e.clientX - rect.left) / rect.width - 0.5)
        py.set((e.clientY - rect.top) / rect.height - 0.5)
      }}
      onMouseLeave={() => {
        px.set(0)
        py.set(0)
      }}
    >
      <span className="orbit-ring" aria-hidden>
        <span className="orbit-satellite orbit-a" />
        <span className="orbit-satellite orbit-b" />
      </span>
      {children}
    </motion.button>
  )
}

/* ── Meteors: Magic UI-style falling streaks for big buttons ── */

export function Meteors({ number = 8 }: { number?: number }) {
  const meteors = useMemo(
    () =>
      Array.from({ length: number }, (_, i) => ({
        id: i,
        size: 1 + Math.random(),
        delay: `${(Math.random() * 6).toFixed(2)}s`,
        duration: `${(Math.random() * 3 + 3).toFixed(2)}s`,
        left: `${(Math.random() * 100).toFixed(1)}%`,
        top: `${(Math.random() * 25).toFixed(1)}%`,
      })),
    [number]
  )

  return (
    <span className="meteors pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]" aria-hidden>
      {meteors.map((m) => (
        <span
          key={m.id}
          className="meteor-fx absolute rounded-full bg-white shadow-[0_0_0_1px_rgba(255,255,255,0.1)]"
          style={{
            top: m.top,
            left: m.left,
            width: m.size,
            height: m.size,
            animationDelay: m.delay,
            animationDuration: m.duration,
          }}
        />
      ))}
    </span>
  )
}
