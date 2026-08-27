/**
 * CosmicOrb — the app's visual signature: a ringed planet with an
 * orbiting satellite. Pure SVG + two slow CSS rotations, GPU-only,
 * silenced under reduced motion. Sits behind content, never on top.
 */
export function CosmicOrb({
  size = 190,
  className,
}: {
  size?: number
  className?: string
}) {
  return (
    <div
      className={`pointer-events-none select-none ${className ?? ''}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <div className="relative w-full h-full orb-float">
        {/* halo */}
        <div
          className="absolute inset-[-30%] rounded-full"
          style={{
            background:
              'radial-gradient(closest-side, rgba(99,102,241,0.22), rgba(167,139,250,0.08) 55%, transparent 75%)',
          }}
        />

        <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full">
          <defs>
            <radialGradient id="orb-core" cx="0.35" cy="0.3" r="0.9">
              <stop offset="0" stopColor="#A5B4FC" />
              <stop offset="0.55" stopColor="#6366F1" />
              <stop offset="1" stopColor="#1E1B4B" />
            </radialGradient>
            <linearGradient id="orb-ring" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="rgba(167,139,250,0.9)" />
              <stop offset="0.5" stopColor="rgba(125,211,252,0.5)" />
              <stop offset="1" stopColor="rgba(167,139,250,0.15)" />
            </linearGradient>
          </defs>

          {/* planet */}
          <circle cx="100" cy="100" r="52" fill="url(#orb-core)" />
          {/* terminator shading */}
          <ellipse cx="118" cy="112" rx="40" ry="34" fill="rgba(5,7,13,0.35)" />

          {/* ring system — slow tilt rotation */}
          <g className="orb-ring-spin" style={{ transformOrigin: '100px 100px' }}>
            <ellipse
              cx="100"
              cy="100"
              rx="88"
              ry="26"
              transform="rotate(-18 100 100)"
              fill="none"
              stroke="url(#orb-ring)"
              strokeWidth="2.5"
              opacity="0.85"
            />
            <ellipse
              cx="100"
              cy="100"
              rx="74"
              ry="20"
              transform="rotate(-18 100 100)"
              fill="none"
              stroke="rgba(241,242,248,0.18)"
              strokeWidth="1"
            />
          </g>

          {/* satellite — fast orbit on the ring path */}
          <g className="orb-satellite-spin" style={{ transformOrigin: '100px 100px' }}>
            <circle cx="188" cy="100" r="4" fill="#E11D48" />
            <circle cx="188" cy="100" r="7" fill="rgba(225,29,72,0.25)" />
          </g>
        </svg>
      </div>
    </div>
  )
}
