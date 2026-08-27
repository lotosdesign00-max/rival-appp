/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // semantic tokens — values live in index.css :root / [data-theme='light']
        void: 'var(--c-void)',
        abyss: 'var(--c-abyss)',
        surface: 'var(--c-surface)',
        raise: 'var(--c-raise)',
        line: 'var(--c-line)',
        linex: 'var(--c-linex)',
        ink: 'var(--c-ink)',
        mute: 'var(--c-mute)',
        dim: 'var(--c-dim)',
        accent: 'var(--c-accent)',
        'accent-bright': 'var(--c-accent-bright)',
        lavender: 'var(--c-lavender)',
        sky: 'var(--c-sky)',
        rival: 'var(--c-rival)',
        ok: 'var(--c-ok)',
        warn: 'var(--c-warn)',
        err: 'var(--c-err)',
      },

      fontFamily: {
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },

      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,.4)',
        raise: '0 8px 24px rgba(0,0,0,.45)',
        'glow-sm': '0 0 16px rgba(99,102,241,.18)',
        'glow-md': '0 0 28px rgba(99,102,241,.25)',
        'inner-top': 'inset 0 1px 0 rgba(255,255,255,.04)',
      },

      backgroundImage: {
        'radial-fade': 'radial-gradient(var(--tw-gradient-stops))',
      },

      transitionTimingFunction: {
        out: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
