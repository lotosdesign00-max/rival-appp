import { useMemo } from 'react'

/**
 * Starfield — adapted from 21st.dev "Stars" (bundui) box-shadow technique,
 * reworked for mobile: static layers (zero continuous layout cost),
 * seeded positions, soft twinkle on the bright layer only.
 * Disabled motion via CSS prefers-reduced-motion.
 */
function makeShadows(count: number, seed: number, colors: string[]): string {
  const shadows: string[] = []
  let x = seed || 1
  const rnd = () => {
    x = (x * 1664525 + 1013904223) >>> 0
    return x / 0xffffffff
  }
  for (let i = 0; i < count; i++) {
    const px = Math.floor(rnd() * 2000) - 500
    const py = Math.floor(rnd() * 3000) - 500
    const color = colors[Math.floor(rnd() * colors.length)]
    shadows.push(`${px}px ${py}px ${color}`)
  }
  return shadows.join(',')
}

const DIM_COLORS = [
  'rgba(241,242,248,0.45)',
  'rgba(241,242,248,0.30)',
  'rgba(154,160,187,0.40)',
]
const BRIGHT_COLORS = [
  'rgba(241,242,248,0.95)',
  'rgba(167,139,250,0.85)',
  'rgba(125,211,252,0.80)',
  'rgba(241,242,248,0.65)',
]

export function Starfield({ density = 1.3 }: { density?: number }) {
  const dim = useMemo(() => makeShadows(Math.round(120 * density), 7, DIM_COLORS), [density])
  const bright = useMemo(() => makeShadows(Math.round(34 * density), 1337, BRIGHT_COLORS), [density])

  return (
    <div className="starfield-root absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <div
        className="absolute top-[-500px] left-[-500px] w-px h-px rounded-full"
        style={{ boxShadow: dim }}
      />
      <div
        className="absolute top-[-500px] left-[-500px] w-[2px] h-[2px] rounded-full star-twinkle"
        style={{ boxShadow: bright }}
      />
      {/* rare meteors */}
      <span className="meteor" style={{ top: '12%', right: '-8%' }} />
      <span className="meteor meteor-2" style={{ top: '4%', right: '2%' }} />
    </div>
  )
}
