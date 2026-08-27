import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, FolderOpen, X } from 'lucide-react'
import { Screen, PageTitle } from '@/components/layout/Screen'
import { ChipGroup } from '@/components/ui/Chip'
import { EmptyState } from '@/components/ui/misc'
import { Reveal, TiltCard } from '@/components/widgets/interactive'
import { CaseCard } from '@/components/widgets/cards'
import { CASES, WORKS } from '@/lib/data'
import { useStore } from '@/lib/store'
import { useTelegram } from '@/hooks/useTelegram'
import type { Work } from '@/lib/types'

const FILTERS = [
  { id: 'cases', label: 'Кейсы' },
  { id: 'Айдентика', label: 'Айдентика' },
  { id: 'Логотип', label: 'Логотип' },
  { id: 'Аватар', label: 'Аватар' },
  { id: 'Баннер', label: 'Баннер' },
  { id: 'Обложка', label: 'Обложка' },
  { id: 'Сайт', label: 'Сайт' },
]

export function GalleryScreen() {
  const { openCase, pushOverlay, updateDraft } = useStore()
  const { hapticFeedback } = useTelegram()
  const [filter, setFilter] = useState('cases')
  const [lightbox, setLightbox] = useState<Work | null>(null)

  const caseItems = useMemo(
    () => (filter === 'cases' ? CASES : CASES.filter((c) => c.category === filter)),
    [filter]
  )
  const works = useMemo(
    () => (filter === 'cases' ? WORKS : WORKS.filter((w) => w.category === filter)),
    [filter]
  )

  return (
    <Screen>
      <PageTitle title="Галерея" subtitle="Кейсы с разбором и работы в портрете 1024×1280" />

      <div className="px-5 mb-5">
        <ChipGroup
          chips={FILTERS}
          activeId={filter}
          onChange={(id) => {
            hapticFeedback('selection')
            setFilter(id)
          }}
        />
      </div>

      {filter === 'cases' ? (
        /* ── Кейсы: большие прямоугольники с разбором ── */
        <div className="px-5 flex flex-col gap-5">
          {caseItems.map((c, i) => (
            <Reveal key={c.id} delay={Math.min(i, 2) * 0.05}>
              <TiltCard maxTilt={3}>
                <CaseCard
                  item={c}
                  onClick={() => openCase(c.id)}
                  featured
                  animated={i === 0}
                  className="w-full"
                />
              </TiltCard>
            </Reveal>
          ))}
        </div>
      ) : works.length > 0 ? (
        /* ── Работы: сетка 1024×1280, клик — лайтбокс ── */
        <motion.div
          key={filter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-5 grid grid-cols-2 gap-3"
        >
          {works.map((w, i) => (
            <motion.button
              key={w.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (i % 2) * 0.06, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => {
                hapticFeedback('selection')
                setLightbox(w)
              }}
              className="group relative rounded-2xl overflow-hidden border border-line text-left aspect-[4/5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-bright/60"
            >
              <div className="absolute inset-0" style={{ background: w.fallback }} aria-hidden />
              <img
                src={w.src}
                alt={w.title}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
              />
              <div
                className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-abyss/85 to-transparent"
                aria-hidden
              />
              <p className="absolute inset-x-0 bottom-0 px-3 pb-2.5 text-[12px] font-medium text-ink/90 truncate">
                {w.title}
              </p>
            </motion.button>
          ))}
        </motion.div>
      ) : (
        <EmptyState
          icon={FolderOpen}
          title="В этой категории пока пусто"
          hint="Посмотри другие разделы или закажи первым."
        />
      )}

      {/* ── Лайтбокс работы: картинка + минимум ── */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-abyss/[0.96] backdrop-blur-sm flex flex-col items-center justify-center p-5"
            role="dialog"
            aria-modal="true"
            aria-label={lightbox.title}
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 10 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-[340px]"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-linex shadow-raise"
                style={{ background: lightbox.fallback }}
              >
                <img
                  src={lightbox.src}
                  alt={lightbox.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <button
                  onClick={() => setLightbox(null)}
                  aria-label="Закрыть"
                  className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-abyss/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-ink/90 active:scale-95 transition-transform"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex items-center justify-between gap-3 mt-3.5">
                <div className="min-w-0">
                  <p className="font-display text-[15px] font-semibold text-ink truncate">
                    {lightbox.title}
                  </p>
                  <p className="text-xs text-dim">{lightbox.category} · 1024×1280</p>
                </div>
                <button
                  onClick={() => {
                    setLightbox(null)
                    updateDraft({})
                    pushOverlay('order-create', { step: '0' })
                  }}
                  className="shrink-0 inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-accent/[0.13] border border-accent/35 text-accent-bright text-sm font-medium active:scale-95 transition-transform"
                >
                  Хочу так
                  <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Screen>
  )
}
