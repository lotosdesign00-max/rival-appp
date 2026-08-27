import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Send } from 'lucide-react'
import { CaseCover } from '@/components/widgets/cards'
import { BrandMark } from '@/components/widgets/BrandMark'
import { TracingBeam } from '@/components/widgets/TracingBeam'
import { ComparisonSlider } from '@/components/widgets/ComparisonSlider'
import { Meteors } from '@/components/widgets/interactive'
import { cn } from '@/lib/utils'
import { useStore } from '@/lib/store'
import { useTelegram } from '@/hooks/useTelegram'
import { CASES } from '@/lib/data'

export function CaseDetailScreen({ caseId }: { caseId: string }) {
  const { setTab, popOverlay, pushOverlay, updateDraft } = useStore()
  const { hapticFeedback } = useTelegram()

  // beam track scrolls with the overlay container
  const beamContainer = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    beamContainer.current = document.querySelector('.overlay-scroll')
  }, [])

  const item = CASES.find((c) => c.id === caseId)
  if (!item) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center gap-3 px-5">
        <BrandMark size={34} />
        <p className="text-sm text-mute">Этот кейс потерялся в космосе.</p>
      </div>
    )
  }

  const orderSimilar = () => {
    hapticFeedback('impact')
    if (item.serviceId) updateDraft({ serviceId: item.serviceId })
    pushOverlay('order-create', { step: '0' })
  }

  return (
    <div className="relative min-h-dvh bg-void">
      {/* Hero = До/После */}
      <div className="relative">
        <ComparisonSlider
          className="aspect-[16/10] rounded-none border-0"
          beforeLabel="До"
          afterLabel="После"
          before={
            /* та же композиция в светлой теме */
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(150deg, #F4F6FB 0%, #DCE3F0 60%, #C9D2E4 100%)' }}
            >
              <img
                src={item.images[0]}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: 'brightness(1.5) saturate(0.72) contrast(0.9)' }}
              />
              <div className="absolute inset-0 bg-white/25" />
            </div>
          }
          after={
            /* и в тёмной (космической) */
            <div className="absolute inset-0" style={{ background: item.fallbacks[0] }}>
              <img
                src={item.images[0]}
                alt={`${item.title} — тёмная версия`}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/35 to-transparent" />
            </div>
          }
        />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-void to-transparent pointer-events-none" />
        <button
          onClick={() => {
            hapticFeedback('impact')
            popOverlay()
          }}
          aria-label="Назад"
          className="absolute top-[max(14px,env(safe-area-inset-top))] left-4 w-10 h-10 rounded-full bg-abyss/50 backdrop-blur-md border border-line/60 flex items-center justify-center text-ink active:scale-95 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-bright/60"
        >
          <ArrowLeft size={19} />
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="pb-[calc(40px+env(safe-area-inset-bottom,0px))] -mt-2 relative"
      >
        <TracingBeam className="pl-8 pr-5">
        <div className="flex items-start justify-between gap-3">
          <h1 className="font-display text-[24px] leading-tight font-semibold text-ink tracking-[-0.01em]">
            {item.title}
          </h1>
        </div>
        <p className="text-sm text-dim mt-1.5">
          {item.category} · {item.style}
        </p>

        <p className="text-[15px] leading-relaxed text-mute mt-4">{item.description}</p>

        {/* Result */}
        <div className="mt-5 bg-surface border border-line rounded-2xl p-4">
          <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-dim mb-1.5">
            Результат
          </p>
          <p className="text-sm text-ink leading-relaxed">{item.result}</p>
        </div>

        {/* Review — tweet-style */}
        {item.review && (
          <figure className="mt-4 bg-surface border border-line rounded-2xl p-4">
            <div className="flex items-center gap-2.5 mb-2.5">
              <button
                onClick={() => setTab('profile')}
                className="flex items-center gap-2.5 min-w-0 flex-1 text-left rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-bright/60"
              >
                <span className="shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-accent/50 to-lavender/40 flex items-center justify-center font-display text-sm font-semibold text-white">
                  {item.review.author.slice(0, 1)}
                </span>
                <span className="min-w-0">
                  <span className="flex items-center gap-1 text-sm font-semibold text-ink truncate">
                    {item.review.author}
                    <span
                      className="shrink-0 w-[15px] h-[15px] rounded-full bg-[#229ED9] flex items-center justify-center"
                      title={`@${item.review.tg}`}
                    >
                      <Send size={9} strokeWidth={3} className="text-white -ml-px" />
                    </span>
                  </span>
                  <span className="block text-xs text-dim truncate">@{item.review.tg}</span>
                </span>
              </button>
              <a
                href={`https://t.me/${item.review.tg}`}
                target="_blank"
                rel="noreferrer"
                aria-label={`Telegram ${item.review.author}`}
                className="shrink-0 w-8 h-8 rounded-full bg-[#229ED9]/[0.14] hover:bg-[#229ED9]/[0.24] flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#229ED9]/60"
              >
                <Send size={14} className="text-[#229ED9]" />
              </a>
            </div>
            <blockquote className="text-[14px] leading-relaxed text-ink/90">
              {item.review.text}
            </blockquote>
          </figure>
        )}

        {/* Gallery */}
        {item.images.length > 1 && (
          <section className="mt-6" aria-label="Галерея кейса">
            <h2 className="font-display text-[15px] font-semibold text-ink mb-3">Галерея</h2>
            <div className="flex gap-2.5 overflow-x-auto no-scrollbar -mx-5 px-5 pb-1 snap-x">
              {item.images.map((_, i) => (
                <div
                  key={i}
                  className="relative shrink-0 w-[240px] aspect-[4/3] rounded-xl overflow-hidden border border-line snap-start"
                >
                  <CaseCover images={item.images} fallbacks={item.fallbacks} index={i} className="absolute inset-0" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <button
          onClick={orderSimilar}
          className={cn(
            'mt-7 w-full h-[52px] rounded-xl bg-accent text-white font-medium text-base relative overflow-hidden',
            'shadow-[0_1px_3px_rgba(0,0,0,.4),inset_0_1px_0_rgba(255,255,255,.12)]',
            'active:scale-[0.97] transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-bright/60'
          )}
        >
          <Meteors number={6} />
          Хочу похожее
        </button>
        </TracingBeam>
      </motion.div>
    </div>
  )
}
