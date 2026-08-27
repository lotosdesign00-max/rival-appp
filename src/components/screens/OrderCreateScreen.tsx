import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Check, Clock, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { Chip } from '@/components/ui/Chip'
import { Starfield } from '@/components/widgets/Starfield'
import { Meteors } from '@/components/widgets/interactive'
import { CountUp } from '@/components/widgets/interactive'
import { cn } from '@/lib/utils'
import { toast } from '@/components/ui/Toast'
import { useTelegram } from '@/hooks/useTelegram'
import { useStore } from '@/lib/store'
import { SERVICES } from '@/lib/data'

const BUDGETS = ['До 3 000 ₽', '3 000–8 000 ₽', '8 000–20 000 ₽', '20 000 ₽+']
const DEADLINES = ['1 день', '2–3 дня', 'До недели', '1–2 недели']
const STYLES = ['Минимал', 'Тёмный люкс', 'Неон', 'Космос', 'Ретро', 'Гранж']

const STEP_TITLES = ['Что делаем?', 'Расскажи о задаче', 'Бюджет и срок']

// ── Service artwork: mini icon + big stage composition ──

const SERVICE_ART: Record<
  string,
  { grad: string; glow: string; mini: React.ReactNode; stage: React.ReactNode }
> = {
  avatar: {
    grad: 'from-[#3B3F8F] to-[#141A38]',
    glow: 'rgba(129,140,248,.35)',
    mini: (
      <svg viewBox="0 0 40 40" className="w-full h-full" aria-hidden>
        <circle cx="20" cy="15" r="7" fill="rgba(241,242,248,.85)" />
        <path d="M8 34c2-7 6.5-10 12-10s10 3 12 10" fill="rgba(241,242,248,.55)" />
      </svg>
    ),
    stage: (
      <svg viewBox="0 0 160 160" className="w-full h-full" aria-hidden>
        <circle cx="80" cy="62" r="26" fill="rgba(241,242,248,.9)" />
        <path d="M34 138c8-24 25-34 46-34s38 10 46 34z" fill="rgba(241,242,248,.6)" />
        <circle cx="132" cy="38" r="4" fill="#E11D48" />
        <circle cx="24" cy="96" r="2.5" fill="rgba(167,139,250,.9)" />
      </svg>
    ),
  },
  banner: {
    grad: 'from-[#1F4E7A] to-[#0E1B33]',
    glow: 'rgba(125,211,252,.3)',
    mini: (
      <svg viewBox="0 0 40 40" className="w-full h-full" aria-hidden>
        <rect x="5" y="13" width="30" height="14" rx="2" fill="rgba(241,242,248,.2)" />
        <rect x="8" y="17" width="14" height="2.5" rx="1" fill="rgba(241,242,248,.85)" />
        <rect x="8" y="21.5" width="9" height="2" rx="1" fill="rgba(241,242,248,.5)" />
      </svg>
    ),
    stage: (
      <svg viewBox="0 0 160 160" className="w-full h-full" aria-hidden>
        <rect x="18" y="52" width="124" height="56" rx="8" fill="rgba(241,242,248,.14)" />
        <rect x="30" y="68" width="56" height="7" rx="3.5" fill="rgba(241,242,248,.9)" />
        <rect x="30" y="82" width="38" height="5" rx="2.5" fill="rgba(241,242,248,.5)" />
        <rect x="112" y="66" width="18" height="26" rx="4" fill="rgba(125,211,252,.55)" />
        <circle cx="138" cy="42" r="3.5" fill="#E11D48" />
      </svg>
    ),
  },
  preview: {
    grad: 'from-[#4C3E85] to-[#181438]',
    glow: 'rgba(167,139,250,.32)',
    mini: (
      <svg viewBox="0 0 40 40" className="w-full h-full" aria-hidden>
        <rect x="6" y="10" width="28" height="20" rx="3" fill="rgba(241,242,248,.18)" />
        <path d="M17 16l9 4-9 4z" fill="rgba(241,242,248,.9)" />
      </svg>
    ),
    stage: (
      <svg viewBox="0 0 160 160" className="w-full h-full" aria-hidden>
        <rect x="24" y="40" width="112" height="80" rx="12" fill="rgba(241,242,248,.14)" />
        <path d="M70 66l34 20-34 20z" fill="rgba(241,242,248,.92)" />
        <circle cx="132" cy="34" r="4" fill="#E11D48" />
        <circle cx="28" cy="130" r="2.5" fill="rgba(125,211,252,.9)" />
      </svg>
    ),
  },
  logo: {
    grad: 'from-[#2E3350] to-[#10142A]',
    glow: 'rgba(167,139,250,.3)',
    mini: (
      <svg viewBox="0 0 40 40" className="w-full h-full" aria-hidden>
        <path d="M20 7l11 6.5v13L20 33 9 26.5v-13z" fill="none" stroke="rgba(167,139,250,.9)" strokeWidth="2" />
        <circle cx="20" cy="20" r="3.5" fill="rgba(241,242,248,.9)" />
      </svg>
    ),
    stage: (
      <svg viewBox="0 0 160 160" className="w-full h-full" aria-hidden>
        <path
          d="M80 28l45 26v52l-45 26-45-26V54z"
          fill="none"
          stroke="rgba(167,139,250,.85)"
          strokeWidth="3"
        />
        <circle cx="80" cy="80" r="14" fill="rgba(241,242,248,.92)" />
        <circle cx="136" cy="46" r="4.5" fill="#E11D48" />
        <circle cx="24" cy="118" r="2.5" fill="rgba(125,211,252,.9)" />
      </svg>
    ),
  },
  identity: {
    grad: 'from-[#6E2B44] to-[#241019]',
    glow: 'rgba(251,113,133,.28)',
    mini: (
      <svg viewBox="0 0 40 40" className="w-full h-full" aria-hidden>
        <rect x="6" y="12" width="9" height="16" rx="2" fill="rgba(129,140,248,.85)" />
        <rect x="17" y="12" width="9" height="16" rx="2" fill="rgba(167,139,250,.6)" />
        <rect x="28" y="12" width="6" height="16" rx="2" fill="rgba(125,211,252,.5)" />
      </svg>
    ),
    stage: (
      <svg viewBox="0 0 160 160" className="w-full h-full" aria-hidden>
        <rect x="22" y="46" width="34" height="68" rx="8" fill="rgba(129,140,248,.9)" />
        <rect x="63" y="46" width="34" height="68" rx="8" fill="rgba(167,139,250,.65)" />
        <rect x="104" y="46" width="22" height="68" rx="8" fill="rgba(125,211,252,.55)" />
        <circle cx="138" cy="36" r="4" fill="#E11D48" />
      </svg>
    ),
  },
  cover: {
    grad: 'from-[#3E2F6E] to-[#140F2E]',
    glow: 'rgba(167,139,250,.35)',
    mini: (
      <svg viewBox="0 0 40 40" className="w-full h-full" aria-hidden>
        <circle cx="20" cy="20" r="13" fill="none" stroke="rgba(241,242,248,.35)" strokeWidth="1.5" />
        <circle cx="20" cy="20" r="4" fill="rgba(167,139,250,.95)" />
        <circle cx="31" cy="13" r="1.6" fill="#E11D48" />
      </svg>
    ),
    stage: (
      <svg viewBox="0 0 160 160" className="w-full h-full orb-ring-spin" style={{ transformOrigin: '80px 80px' }} aria-hidden>
        <circle cx="80" cy="80" r="52" fill="none" stroke="rgba(241,242,248,.3)" strokeWidth="1.5" />
        <circle cx="80" cy="80" r="20" fill="rgba(167,139,250,.95)" />
        <ellipse cx="80" cy="80" rx="66" ry="18" transform="rotate(-20 80 80)" fill="none" stroke="rgba(125,211,252,.5)" strokeWidth="1.5" />
        <circle cx="140" cy="52" r="5" fill="#E11D48" />
      </svg>
    ),
  },
}

const STYLE_SWATCHES: Record<string, string> = {
  'Минимал': 'linear-gradient(135deg, #E5E7F2, #9AA0BB)',
  'Тёмный люкс': 'linear-gradient(135deg, #2A2F4A, #0B0E19)',
  'Неон': 'linear-gradient(135deg, #22D3EE, #A78BFA)',
  'Космос': 'linear-gradient(135deg, #6366F1, #1E1B4B)',
  'Ретро': 'linear-gradient(135deg, #FB923C, #E11D48)',
  'Гранж': 'linear-gradient(135deg, #444963, #17192A)',
}

/** Segmented option track: tap a zone, the thumb springs to it */
function OptionTrack({
  label,
  value,
  options,
  shortLabels,
  onPick,
  warn,
}: {
  label: string
  value: string | null
  options: string[]
  shortLabels: string[]
  onPick: (v: string | null) => void
  warn?: string
}) {
  const idx = value ? options.indexOf(value) : -1

  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <p className="text-xs text-dim">{label}</p>
        <AnimatePresence mode="wait">
          <motion.span
            key={value ?? 'none'}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className={`text-sm font-medium ${warn ? 'text-warn' : 'text-accent-bright'}`}
          >
            {value ?? 'не выбрано'}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="relative">
        {/* track */}
        <div className="h-2 rounded-full bg-surface border border-line/60 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-accent to-lavender"
            animate={{ width: idx >= 0 ? `${((idx + 1) / options.length) * 100}%` : '0%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          />
        </div>

        {/* thumb */}
        {idx >= 0 && (
          <motion.span
            className="absolute top-1/2 w-[18px] h-[18px] rounded-full bg-ink border-[3px] border-void shadow-card pointer-events-none"
            style={{ translateX: '-50%', translateY: '-50%' }}
            animate={{ left: `${((idx + 0.5) / options.length) * 100}%` }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          />
        )}

        {/* generous touch zones */}
        <div
          className="absolute inset-0 -inset-y-3 grid"
          style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}
        >
          {options.map((o) => (
            <button
              key={o}
              aria-label={o}
              aria-pressed={value === o}
              onClick={() => onPick(value === o ? null : o)}
              className="focus-visible:outline-none focus-visible:bg-white/[0.04]"
            />
          ))}
        </div>
      </div>

      <div
        className="mt-2 grid"
        style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}
      >
        {shortLabels.map((sl) => (
          <span key={sl} className="text-[10px] text-dim/80 text-center">
            {sl}
          </span>
        ))}
      </div>

      {warn && (
        <motion.p
          initial={{ opacity: 0, y: -3 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[11px] text-warn mt-2.5"
        >
          {warn}
        </motion.p>
      )}
    </div>
  )
}

export function OrderCreateScreen() {
  const { state, updateDraft, submitOrder, popOverlay, openOrder, openAi } = useStore()
  const { hapticFeedback } = useTelegram()
  const draft = state.draft

  const [step, setStepState] = useState(draft.step ?? 0)
  const [dir, setDir] = useState(1)

  const setStep = (n: number) => {
    setStepState(n)
    updateDraft({ step: n })
  }

  const service = SERVICES.find((s) => s.id === draft.serviceId)
  const canNext = step === 0 ? !!draft.serviceId : step === 1 ? draft.brief.trim().length >= 10 : true
  const readiness = Math.min(
    100,
    Math.round((Math.min(draft.brief.trim().length, 200) / 200) * 80 + (draft.refs.trim() ? 20 : 0))
  )
  const estimate = service
    ? Math.round((service.priceFrom * (draft.deadline === '1 день' ? 1.5 : 1)) / 100) * 100
    : 0

  const go = (delta: number) => {
    hapticFeedback('selection')
    setDir(delta)
    setStep(Math.min(2, Math.max(0, step + delta)))
  }

  const submit = () => {
    if (!draft.serviceId) return
    hapticFeedback('notification')
    const id = submitOrder(draft.serviceId)
    toast('Заказ отправлен')
    popOverlay()
    openOrder(id)
  }

  const askAi = () => {
    openAi(
      {
        label: 'Бриф заказа',
        prompt: `Помоги сформулировать бриф: ${draft.brief.trim() || 'проект без описания'}`,
      },
      'order-create'
    )
  }

  // витрина: показываем выбранную услугу или первую как «витрину»
  const showcase = SERVICES.find((s) => s.id === draft.serviceId) ?? SERVICES[0]
  const showcaseArt = SERVICE_ART[showcase.id]

  return (
    <div className="relative min-h-dvh bg-void flex flex-col">
      {/* Header */}
      <header className="px-4 pt-[max(14px,env(safe-area-inset-top))] pb-3">
        <div className="flex items-center gap-2 mb-5">
          <button
            onClick={() => (step === 0 ? popOverlay() : go(-1))}
            aria-label={step === 0 ? 'Закрыть' : 'Назад'}
            className="w-10 h-10 rounded-full flex items-center justify-center text-mute hover:text-ink active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-bright/60"
          >
            <ArrowLeft size={20} />
          </button>
          <span className="text-xs font-mono uppercase tracking-[0.18em] text-dim">
            Новый заказ
          </span>
          {service && (
            <span className="ml-auto text-xs text-accent-bright">{service.title}</span>
          )}
        </div>
        <div className="h-[3px] rounded-full bg-surface overflow-hidden mx-1">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-accent to-lavender"
            animate={{ width: `${((step + 1) / 3) * 100}%` }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </header>

      {/* Steps */}
      <div className="flex-1 flex flex-col px-5 pt-6 pb-[max(20px,env(safe-area-inset-bottom))]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 32 * dir }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -32 * dir }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 flex flex-col"
          >
            <h1 className="font-display text-[26px] leading-tight font-semibold text-ink tracking-[-0.01em] mb-6">
              {STEP_TITLES[step]}
            </h1>

            {step === 0 && (
              <div className="flex-1 flex flex-col min-h-0">
                {/* ── Showcase stage ── */}
                <div
                  className={`relative aspect-[5/4] rounded-3xl overflow-hidden border bg-gradient-to-br grain transition-colors duration-500 ${
                    draft.serviceId ? 'border-accent/50 shadow-glow-md' : 'border-line'
                  }`}
                  style={{ ['--glow' as string]: showcaseArt.glow }}
                >
                  <div
                    className="absolute inset-0 transition-opacity duration-500"
                    style={{ background: `radial-gradient(90% 70% at 50% 30%, ${showcaseArt.glow}, transparent 70%)` }}
                    aria-hidden
                  />
                  <Starfield density={0.5} />

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={showcase.id}
                      initial={{ opacity: 0, scale: 0.82, y: 14 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.92, y: -10 }}
                      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="w-[62%] max-w-[210px] orb-float drop-shadow-[0_12px_32px_rgba(0,0,0,.45)]">
                        {showcaseArt.stage}
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* price tag */}
                  <motion.div
                    key={`price-${showcase.id}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12 }}
                    className="absolute bottom-3 left-3 right-3 flex items-center justify-between"
                  >
                    <span className="px-2.5 py-1 rounded-full bg-abyss/60 backdrop-blur-sm border border-white/10 text-[11px] text-ink/90 inline-flex items-center gap-1">
                      <Clock size={10} />
                      {showcase.days}
                    </span>
                    <span className="tnum px-2.5 py-1 rounded-full bg-abyss/60 backdrop-blur-sm border border-white/10 text-[13px] font-medium text-accent-bright">
                      от {showcase.priceFrom.toLocaleString('ru-RU')} ₽
                    </span>
                  </motion.div>

                  {/* selection badge */}
                  <AnimatePresence>
                    {draft.serviceId === showcase.id && (
                      <motion.span
                        initial={{ scale: 0, rotate: -30 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                        className="absolute top-3 right-3 w-7 h-7 rounded-full bg-accent flex items-center justify-center shadow-glow-sm"
                      >
                        <Check size={15} strokeWidth={3.5} className="text-white" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                {/* details */}
                <div className="min-h-[64px] pt-3.5">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={showcase.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.22 }}
                    >
                      <p className="font-display text-[17px] font-semibold text-ink">
                        {showcase.title}
                        {draft.serviceId === showcase.id && (
                          <span className="ml-2 text-xs text-accent-bright font-body font-normal">
                            выбрано
                          </span>
                        )}
                      </p>
                      <p className="text-[13px] text-mute leading-snug mt-1">{showcase.description}</p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* ── Thumbnails rail ── */}
                <div className="mt-auto -mx-5 px-5 pt-2">
                  <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 pt-1">
                    {SERVICES.map((s) => {
                      const active = draft.serviceId === s.id
                      const art = SERVICE_ART[s.id]
                      return (
                        <button
                          key={s.id}
                          onClick={() => {
                            updateDraft({ serviceId: s.id })
                            hapticFeedback('selection')
                          }}
                          aria-pressed={active}
                          aria-label={s.title}
                          className="shrink-0 flex flex-col items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-bright/60 rounded-xl p-1"
                        >
                          <motion.span
                            animate={{ scale: active ? 1.08 : 1 }}
                            transition={{ type: 'spring', stiffness: 420, damping: 20 }}
                            className={`block w-[58px] h-[58px] rounded-2xl bg-gradient-to-br border overflow-hidden transition-colors duration-200 ${
                              active
                                ? 'border-accent shadow-glow-md'
                                : 'border-line opacity-80 hover:opacity-100'
                            }`}
                          >
                            {art.mini}
                          </motion.span>
                          <span
                            className={cn(
                              'text-[10px] leading-none',
                              active ? 'text-accent-bright font-medium' : 'text-dim'
                            )}
                          >
                            {s.title}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="flex-1 flex flex-col">
                <Textarea
                  autoFocus
                  value={draft.brief}
                  onChange={(e) => updateDraft({ brief: e.target.value })}
                  placeholder="Что нужно сделать, для чего, для кого? Первая строка станет названием заказа."
                  className="min-h-[130px]"
                  aria-label="Описание задачи"
                />
                <Input
                  value={draft.refs}
                  onChange={(e) => updateDraft({ refs: e.target.value })}
                  placeholder="Ссылки на референсы (необязательно)"
                  className="mt-3"
                  aria-label="Референсы"
                />
                <button
                  onClick={askAi}
                  className="mt-3 self-start inline-flex items-center gap-1.5 text-[13px] text-accent-bright/90 hover:text-accent-bright py-1 transition-colors"
                >
                  <Sparkles size={14} />
                  Сформулировать с Rival AI
                </button>
                <p className="text-xs text-dim mt-1">
                  Черновик сохранится, AI откроется рядом.
                </p>

                {draft.brief.trim().length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-[3px] rounded-full bg-line overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-accent to-lavender"
                          animate={{ width: `${readiness}%` }}
                          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </div>
                      <span className={`text-[11px] ${readiness >= 100 ? 'text-ok' : 'text-dim'}`}>
                        {readiness >= 100 ? 'Бриф готов' : `${readiness}%`}
                      </span>
                    </div>
                    <p className="text-[11px] text-dim mt-1.5">
                      {readiness >= 100
                        ? 'Rival получит всё, что нужно. Можно отправлять.'
                        : 'Опишите задачу подробнее — так студия попадёт точнее.'}
                    </p>
                  </motion.div>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="flex-1 flex flex-col gap-7">
                <OptionTrack
                  label="Бюджет"
                  value={draft.budget}
                  options={BUDGETS}
                  shortLabels={['до 3к', '3–8к', '8–20к', '20к+']}
                  onPick={(v) => {
                    hapticFeedback('selection')
                    updateDraft({ budget: v })
                  }}
                />

                <OptionTrack
                  label="Срок"
                  value={draft.deadline}
                  options={DEADLINES}
                  shortLabels={['1 день', '2–3 дня', 'неделя', '2 недели']}
                  warn={
                    draft.deadline === '1 день'
                      ? 'Срочно: надбавка 50% и только для простых задач.'
                      : undefined
                  }
                  onPick={(v) => {
                    hapticFeedback('selection')
                    updateDraft({ deadline: v })
                  }}
                />

                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <p className="text-xs text-dim">Настроение</p>
                    <AnimatePresence mode="wait">
                      {draft.style && (
                        <motion.span
                          key={draft.style}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="text-sm font-medium text-accent-bright"
                        >
                          {draft.style}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {STYLES.map((s) => (
                      <Chip
                        key={s}
                        active={draft.style === s}
                        onClick={() => {
                          hapticFeedback('selection')
                          updateDraft({ style: draft.style === s ? null : s })
                        }}
                      >
                        <span className="inline-flex items-center gap-1.5">
                          <span
                            className="w-3 h-3 rounded-full border border-white/20"
                            style={{ background: STYLE_SWATCHES[s] }}
                            aria-hidden
                          />
                          {s}
                        </span>
                      </Chip>
                    ))}
                  </div>

                  {/* mood preview strip */}
                  <AnimatePresence>
                    {draft.style && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div
                          className="mt-3 h-12 rounded-xl border border-line relative overflow-hidden grain"
                          style={{ background: STYLE_SWATCHES[draft.style] }}
                          aria-hidden
                        >
                          <div className="absolute inset-0 bg-abyss/30" />
                          <Starfield density={0.5} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* live estimate */}
                {service && (
                  <div className="mt-auto edge-shine bg-surface border border-line rounded-2xl p-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br border border-line overflow-hidden ${
                          SERVICE_ART[service.id].grad
                        }`}
                      >
                        {SERVICE_ART[service.id].mini}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-ink truncate">{service.title}</p>
                        <p className="text-[11px] text-dim truncate mt-0.5">
                          {draft.budget ?? 'бюджет —'} · {draft.deadline ?? 'срок —'}
                          {draft.style ? ` · ${draft.style}` : ''}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[10px] font-mono uppercase tracking-[0.14em] text-dim">
                          Итого от
                        </p>
                        <p className="font-display text-lg font-semibold text-accent-bright">
                          <CountUp value={estimate} /> ₽
                        </p>
                      </div>
                    </div>
                    <p className="text-[10px] text-dim mt-2.5">
                      Точную смету студия подтвердит в ответе.
                    </p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <Button
          size="lg"
          className="w-full mt-6 relative overflow-hidden"
          disabled={!canNext}
          onClick={() => (step === 2 ? submit() : go(1))}
        >
          {step === 2 && <Meteors number={6} />}
          {step === 2 ? 'Отправить заказ' : 'Далее'}
        </Button>
      </div>
    </div>
  )
}
