import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowUp, Compass, Eraser, FileText, Palette, Wallet } from 'lucide-react'
import { MessageBubble } from '@/components/widgets/MessageBubble'
import { BrandMark } from '@/components/widgets/BrandMark'
import { Starfield } from '@/components/widgets/Starfield'
import { cn } from '@/lib/utils'
import { useStore } from '@/lib/store'
import { AI_STARTERS, generateReply } from '@/lib/rivalAI'

const STARTER_ICONS = { file: FileText, compass: Compass, wallet: Wallet, palette: Palette }

const STARTER_HINTS: Record<string, string> = {
  file: 'черновик брифа по пунктам',
  compass: 'подберу услугу под задачу',
  wallet: 'честные вилки студии',
  palette: 'палитра, шрифты, композиция',
}

export function AIScreen() {
  const { state, aiContext, aiReturnTo, popOverlay, sendMessage, appendToMessage, finishMessage, clearChat } = useStore()
  const [draft, setDraft] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const messages = state.chat
  const pending = messages.find((m) => m.pending && m.role === 'rival')
  const showStarters = messages.length <= 1

  // ── Reveal pending reply progressively (resume-safe under StrictMode) ──
  useEffect(() => {
    if (!pending) return
    const idx = messages.indexOf(pending)
    const userMsg = messages
      .slice(0, idx)
      .reverse()
      .find((m) => m.role === 'user')

    const full = generateReply(userMsg?.text ?? '', pending.contextLabel)
    let revealed = pending.text

    if (revealed.length >= full.length) {
      finishMessage(pending.id, full)
      return
    }

    const timer = window.setInterval(() => {
      const step = 2 + Math.floor(Math.random() * 3)
      const next = full.slice(revealed.length, revealed.length + step)
      if (!next) {
        window.clearInterval(timer)
        finishMessage(pending.id, full)
        return
      }
      revealed += next
      appendToMessage(pending.id, next)
      if (revealed.length >= full.length) {
        window.clearInterval(timer)
        finishMessage(pending.id, full)
      }
    }, 18)

    return () => window.clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending?.id])

  // ── Keep the latest message in view ──
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages.length, messages[messages.length - 1]?.text])

  const handleSend = () => {
    if (!draft.trim()) return
    sendMessage(draft)
    setDraft('')
  }

  return (
    <div className="relative h-dvh overflow-hidden">
      <div className="aurora" aria-hidden />
      <Starfield density={0.7} />
      <div className="relative flex flex-col h-full">
        {/* Header */}
        <header className="shrink-0 flex items-center gap-3 px-5 pt-[max(14px,env(safe-area-inset-top))] pb-3 border-b border-line/50">
          <button
            onClick={popOverlay}
            aria-label="Назад"
            className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-mute hover:text-ink active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-bright/60"
          >
            <ArrowLeft size={19} />
          </button>
          <span className="orb-float inline-flex">
            <BrandMark size={28} />
          </span>
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-[17px] font-semibold text-ink leading-tight">Rival AI</h1>
            <p className="text-[11px] text-dim">ассистент студии: ТЗ, услуги, дизайн</p>
          </div>
          {state.chat.length > 1 && (
            <button
              onClick={clearChat}
              aria-label="Очистить чат"
              className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-dim hover:text-ink active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-bright/60"
            >
              <Eraser size={17} />
            </button>
          )}
        </header>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
          <div className="px-5 py-5 space-y-5 max-w-md mx-auto">
            {messages.map((m) => (
              <MessageBubble key={m.id} msg={m} />
            ))}

            {/* thinking indicator while the reply has no text yet */}
            {pending && !pending.text && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-2.5"
                aria-label="Rival печатает"
              >
                <BrandMark size={22} />
                <span className="inline-flex items-center gap-1 h-8 px-3.5 bg-surface border border-line rounded-2xl rounded-tl-md">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="typing-dot w-1.5 h-1.5 rounded-full bg-accent-bright/80"
                      style={{ animationDelay: `${i * 0.18}s` }}
                    />
                  ))}
                </span>
              </motion.div>
            )}

            {showStarters && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.3 }}
                className="space-y-2 pt-3"
              >
                {AI_STARTERS.map(({ icon, label, prompt }) => {
                  const Icon = STARTER_ICONS[icon as keyof typeof STARTER_ICONS]
                  return (
                    <button
                      key={label}
                      onClick={() => sendMessage(prompt)}
                      className="w-full flex items-center gap-3 bg-surface/80 backdrop-blur-sm border border-line rounded-xl p-3.5 text-left active:scale-[0.98] hover:border-linex transition-all duration-200"
                    >
                      <span className="shrink-0 w-9 h-9 rounded-lg bg-accent/[0.12] border border-accent/25 flex items-center justify-center">
                        <Icon size={16} className="text-accent-bright" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-medium text-ink">{label}</span>
                        <span className="block text-xs text-dim mt-0.5 truncate">
                          {STARTER_HINTS[icon]}
                        </span>
                      </span>
                    </button>
                  )
                })}
              </motion.div>
            )}
          </div>
        </div>

        {/* Composer */}
        <div className="shrink-0 bg-gradient-to-t from-void via-void to-transparent">
          <div className="max-w-md mx-auto px-4 pb-[calc(20px+env(safe-area-inset-bottom,0px))]">
            {aiReturnTo && (
              <button
                onClick={popOverlay}
                className="mb-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/[0.12] border border-accent/35 text-[12px] text-accent-bright active:scale-95 transition-transform"
              >
                Вернуться к оформлению заказа
              </button>
            )}
            {aiContext && (
              <div className="mb-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/[0.10] border border-accent/25 text-[11px] text-accent-bright max-w-full">
                <span className="truncate">контекст: {aiContext.label}</span>
              </div>
            )}
            <div className="flex items-end gap-2">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                rows={1}
                placeholder="Спроси о дизайне…"
                aria-label="Сообщение для Rival AI"
                className="flex-1 resize-none bg-surface border border-line rounded-2xl px-4 py-3 text-[15px] text-ink placeholder:text-dim focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20 transition-all max-h-32"
              />
              <button
                onClick={handleSend}
                disabled={!draft.trim()}
                aria-label="Отправить"
                className={cn(
                  'shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200',
                  draft.trim()
                    ? 'bg-accent text-white shadow-glow-sm active:scale-90'
                    : 'bg-surface border border-line text-dim'
                )}
              >
                <ArrowUp size={19} strokeWidth={2.4} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
