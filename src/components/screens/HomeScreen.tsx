import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Screen } from '@/components/layout/Screen'
import { SectionHeader } from '@/components/ui/misc'
import { BrandMark } from '@/components/widgets/BrandMark'
import { CosmicOrb } from '@/components/widgets/CosmicOrb'
import { Meteors, OrbitCTA, Reveal, TiltCard } from '@/components/widgets/interactive'
import { CaseCardMini, ReviewCard } from '@/components/widgets/cards'
import { InfiniteRow } from '@/components/widgets/InfiniteRow'
import { CASES, SERVICES, STUDIO_STATUS } from '@/lib/data'
import { useStore } from '@/lib/store'

export function HomeScreen() {
  const { setGalleryTab, openCase, setTab, pushOverlay, updateDraft } = useStore()

  const featured = CASES[0]
  const recent = useMemo(() => CASES.slice(1, 7), [])
  const reviews = useMemo(() => CASES.filter((c) => c.review), [])
  const topServices = useMemo(() => SERVICES.slice(0, 5), [])

  const orderService = (serviceId: string) => {
    updateDraft({ serviceId })
    pushOverlay('order-create', { step: '0' })
  }

  return (
    <Screen aurora>
      {/* Cosmic signature behind the header */}
      <CosmicOrb size={200} className="absolute -top-12 -right-16 opacity-70" />

      <div className="relative">
        {/* Studio header */}
        <motion.header
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="px-5 pt-3 pb-5"
        >
          <div className="flex items-center gap-2">
            <BrandMark size={22} />
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-dim">
              Rival Design
            </span>
          </div>
          <h1 className="font-display text-[24px] leading-tight font-semibold text-ink mt-2 tracking-[-0.01em]">
            Дизайн-студия
            <span className="text-accent-bright"> на связи</span>
          </h1>
          <p className="text-xs text-dim mt-1.5 flex items-center gap-2">
            <span className="relative flex w-1.5 h-1.5">
              <span className="absolute inline-flex w-full h-full rounded-full bg-ok opacity-60 animate-ping" />
              <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-ok" />
            </span>
            {STUDIO_STATUS.responseTime} · {STUDIO_STATUS.load}
          </p>
        </motion.header>

        {/* Primary CTA with orbiting satellites */}
        <Reveal className="px-5 mb-6">
          <OrbitCTA onClick={() => pushOverlay('order-create')}>
            <span className="shine block relative overflow-hidden bg-gradient-to-br from-accent to-[#4f46e5] rounded-2xl p-5 text-left transition-transform duration-200 active:scale-[0.985] shadow-[0_8px_24px_rgba(99,102,241,0.25)]">
              <Meteors number={6} />
              <span className="relative flex items-center justify-between gap-3">
                <span className="block">
                  <span className="block font-display text-lg font-semibold text-white">
                    Заказать проект
                  </span>
                  <span className="block text-[13px] text-white/70 mt-0.5">
                    Бриф за 2 минуты, ответ ~2 часа
                  </span>
                </span>
                <span className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                  <ArrowRight size={19} className="text-white" />
                </span>
              </span>
            </span>
          </OrbitCTA>
        </Reveal>

        {/* Популярные услуги (Компактный аккуратный микро-блок) */}
        <Reveal className="mb-6">
          <div className="px-5">
            <SectionHeader
              title="Популярные услуги"
              action="Все услуги"
              onAction={() => pushOverlay('order-create')}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto px-5 no-scrollbar pb-1">
            {topServices.map((s) => (
              <button
                key={s.id}
                onClick={() => orderService(s.id)}
                className="min-w-[110px] px-3.5 py-2 rounded-xl bg-surface/50 border border-line/60 text-left hover:bg-surface hover:border-linex transition-all duration-200 active:scale-[0.97] group shrink-0 backdrop-blur-xs"
              >
                <p className="text-xs font-medium text-ink group-hover:text-accent-bright transition-colors truncate">
                  {s.title}
                </p>
                <p className="text-[11px] font-mono text-mute mt-0.5">
                  от {s.priceFrom.toLocaleString('ru-RU')} ₽
                </p>
              </button>
            ))}
          </div>
        </Reveal>

        {/* Лучший кейс (Featured card) */}
        {featured && (
          <Reveal className="px-5 mb-7">
            <SectionHeader
              title="Лучший кейс"
              action="Больше кейсов"
              onAction={() => {
                setGalleryTab('cases')
                setTab('gallery')
              }}
            />
            <TiltCard onClick={() => openCase(featured.id)}>
              <div className="relative overflow-hidden rounded-2xl bg-surface border border-line p-3 cursor-pointer group">
                <div className="aspect-[16/9] rounded-xl overflow-hidden bg-raise relative">
                  <img
                    src={featured.images[0]}
                    alt={featured.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-void/80 via-transparent to-transparent" />
                </div>
                <div className="mt-3 px-1 pb-1">
                  <h3 className="font-display text-base font-semibold text-ink group-hover:text-accent-bright transition-colors">
                    {featured.title}
                  </h3>
                  <p className="text-xs text-mute mt-0.5">
                    {featured.category} · {featured.style}
                  </p>
                </div>
              </div>
            </TiltCard>
          </Reveal>
        )}

        {/* Последние работы (Бегущая строка ВЛЕВО) */}
        <Reveal className="mb-7">
          <div className="px-5">
            <SectionHeader
              title="Последние работы"
              action="Смотреть все"
              onAction={() => {
                setGalleryTab('cases')
                setTab('gallery')
              }}
            />
          </div>
          <InfiniteRow direction="left" duration={36}>
            {recent.map((c) => (
              <CaseCardMini key={c.id} item={c} onClick={() => openCase(c.id)} />
            ))}
          </InfiniteRow>
        </Reveal>

        {/* Отзывы (Бегущая строка ВПРАВО) */}
        {reviews.length > 0 && (
          <Reveal className="mb-8">
            <div className="px-5">
              <SectionHeader title="Отзывы" />
            </div>
            <InfiniteRow direction="right" duration={40}>
              {reviews.map((c) => (
                <ReviewCard
                  key={c.id}
                  text={c.review!.text}
                  author={c.review!.author}
                  tg={c.review!.tg}
                />
              ))}
            </InfiniteRow>
          </Reveal>
        )}
      </div>
    </Screen>
  )
}
