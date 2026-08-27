import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ChevronsLeftRight } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * ComparisonSlider — before/after image comparison with a draggable
 * divider (React Bits "Comparison Slider" behavior, self-contained).
 * Pointer-based: touch and mouse. On release the divider springs
 * back to the middle.
 */
export function ComparisonSlider({
  before,
  after,
  beforeLabel = 'До',
  afterLabel = 'После',
  className,
}: {
  /** node shown on the left side («до») */
  before: React.ReactNode
  /** node shown on the right side («после») */
  after: React.ReactNode
  beforeLabel?: string
  afterLabel?: string
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  // raw pointer position → spring smooths every visual
  const pos = useMotionValue(50)
  const spring = useSpring(pos, { stiffness: 280, damping: 28 })
  const left = useTransform(spring, (v) => `${v}%`)
  const clip = useTransform(spring, (v) => `inset(0 ${100 - v}% 0 0)`)
  const [ariaNow, setAriaNow] = useState(50)

  const setFromClientX = (clientX: number) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    pos.set(Math.min(96, Math.max(4, ((clientX - rect.left) / rect.width) * 100)))
  }

  return (
    <div
      ref={ref}
      className={cn(
        'relative aspect-[4/3] rounded-2xl overflow-hidden border border-linex select-none touch-none cursor-ew-resize',
        className
      )}
      onPointerDown={(e) => {
        dragging.current = true
        ref.current?.setPointerCapture(e.pointerId)
        setFromClientX(e.clientX)
      }}
      onPointerMove={(e) => {
        if (dragging.current) setFromClientX(e.clientX)
      }}
      onPointerUp={() => {
        dragging.current = false
        pos.set(50) // spring carries the divider back to center
      }}
      onPointerCancel={() => {
        dragging.current = false
        pos.set(50)
      }}
      role="slider"
      aria-valuenow={ariaNow}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Сравнение до и после — отпусти, чтобы вернуть в центр"
    >
      {/* after (right, full) */}
      <div className="absolute inset-0">{after}</div>

      {/* before (left, clipped by spring) */}
      <motion.div className="absolute inset-0" style={{ clipPath: clip }}>
        {before}
      </motion.div>

      {/* labels */}
      <span className="absolute top-[60px] left-2.5 px-2 py-0.5 rounded-full bg-abyss/60 backdrop-blur-sm border border-white/10 text-[10px] text-ink/90">
        {beforeLabel}
      </span>
      <span className="absolute top-[60px] right-2.5 px-2 py-0.5 rounded-full bg-accent/70 backdrop-blur-sm border border-white/10 text-[10px] text-white">
        {afterLabel}
      </span>

      {/* divider + handle */}
      <motion.div
        className="absolute inset-y-0 w-[2px] bg-white/90 pointer-events-none"
        style={{ left }}
        aria-hidden
      />
      <motion.div
        className="absolute top-1/2 w-9 h-9 rounded-full bg-surface border border-linex shadow-raise flex items-center justify-center pointer-events-none"
        style={{ left, translateY: '-50%', translateX: '-50%' }}
        aria-hidden
      >
        <ChevronsLeftRight size={15} className="text-ink" />
      </motion.div>

      <AriaMirror spring={spring} onValue={(v) => setAriaNow(v)} />
    </div>
  )
}

/** wires spring position → aria-valuenow without re-rendering the visuals */
import { useMotionValueEvent } from 'framer-motion'
function AriaMirror({
  spring,
  onValue,
}: {
  spring: ReturnType<typeof useSpring>
  onValue: (v: number) => void
}) {
  useMotionValueEvent(spring, 'change', (v) => onValue(Math.round(v)))
  return null
}
