import type { ThemeId } from './store'

/** Apply theme to <html data-theme> + browser/Telegram header color */
export function applyThemeDom(theme: ThemeId) {
  if (theme === 'light') document.documentElement.dataset.theme = 'light'
  else delete document.documentElement.dataset.theme
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', theme === 'light' ? '#FFFFFF' : '#05070D')
}

type VTDocument = Document & {
  startViewTransition?: (cb: () => void) => { ready: Promise<void> }
}

/**
 * Animated theme switch (Magic UI AnimatedThemeToggler):
 * a circle of the new theme expands from the toggle across the screen.
 * Uses the View Transitions API where available, falls back to an
 * instant swap otherwise.
 */
export async function animatedThemeChange(
  next: ThemeId,
  originEl: Element | null,
  apply: (t: ThemeId) => void
) {
  const doc = document as VTDocument

  const commit = () => {
    // apply DOM state synchronously so the transition captures the new look
    applyThemeDom(next)
    apply(next)
  }

  if (!doc.startViewTransition || typeof window === 'undefined') {
    commit()
    return
  }

  const transition = doc.startViewTransition(commit)
  await transition.ready.catch(() => {})

  const rect = originEl?.getBoundingClientRect()
  if (!rect) return

  const x = rect.left + rect.width / 2
  const y = rect.top + rect.height / 2
  const maxRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  )

  document.documentElement.animate(
    {
      clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${maxRadius}px at ${x}px ${y}px)`],
    },
    {
      duration: 550,
      easing: 'ease-in-out',
      pseudoElement: '::view-transition-new(root)',
    }
  )
}
