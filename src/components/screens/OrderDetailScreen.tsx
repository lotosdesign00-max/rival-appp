import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Check, LifeBuoy } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Sheet } from '@/components/ui/Sheet'
import { Input } from '@/components/ui/Input'
import { OrderStatusPill } from '@/components/widgets/cards'
import { toast } from '@/components/ui/Toast'
import { cn } from '@/lib/utils'
import { useStore } from '@/lib/store'
import { useTelegram } from '@/hooks/useTelegram'
import { SERVICES } from '@/lib/data'
import { payments, PAYMENTS_MODE } from '@/lib/payments'
import { CountUp } from '@/components/widgets/interactive'
import { BrandMark } from '@/components/widgets/BrandMark'

const STEPS = [
  { key: 'new', label: 'Заявка' },
  { key: 'progress', label: 'В работе' },
  { key: 'review', label: 'Согласование' },
  { key: 'done', label: 'Готово' },
] as const

export function OrderDetailScreen({ orderId }: { orderId: string }) {
  const { state, popOverlay, payOrder, cancelOrder, topUp } = useStore()
  const { hapticFeedback } = useTelegram()
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [topUpOpen, setTopUpOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [paySuccess, setPaySuccess] = useState(false)

  const order = state.orders.find((o) => o.id === orderId)
  if (!order) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center gap-3 px-5">
        <BrandMark size={34} />
        <p className="text-sm text-mute">Этот заказ потерялся в космосе.</p>
      </div>
    )
  }

  const service = SERVICES.find((s) => s.id === order.serviceId)
  const stepIndex = STEPS.findIndex((s) => s.key === order.status)
  const topUpValue = parseInt(amount.replace(/\D/g, ''), 10) || 0
  const missing = Math.max(0, order.price - state.balance)
  const [paying, setPaying] = useState(false)

  const handlePay = async () => {
    setPaying(true)
    const invoice = await payments.createInvoice(order)
    setPaying(false)

    // real provider: send the user to the hosted payment page
    if (invoice.mode === 'redirect' && invoice.url) {
      window.open(invoice.url, '_blank')
      toast('Счёт открыт — оплатите и вернитесь')
      return
    }

    // sandbox: settle against the local balance
    if (payOrder(order.id)) {
      hapticFeedback('notification')
      setPaySuccess(true)
    } else {
      setAmount(String(missing))
      setTopUpOpen(true)
    }
  }

  return (
    <div className="relative min-h-dvh bg-void">
      <div className="pt-[max(10px,env(safe-area-inset-top))] pb-[calc(40px+env(safe-area-inset-bottom,0px))]">
        {/* Header */}
        <header className="flex items-center gap-2 px-4 py-3">
          <button
            onClick={() => {
              hapticFeedback('impact')
              popOverlay()
            }}
            aria-label="Назад"
            className="w-10 h-10 rounded-full flex items-center justify-center text-mute hover:text-ink active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-bright/60"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-display text-[17px] font-semibold text-ink">Заказ</h1>
          <span className="ml-auto text-xs font-mono text-dim">{order.id}</span>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="px-5"
        >
          {/* Title + status */}
          <div className="flex items-start justify-between gap-3 mb-1.5">
            <h2 className="font-display text-[22px] leading-tight font-semibold text-ink tracking-[-0.01em]">
              {order.title}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <OrderStatusPill status={order.status} />
            <span className="text-xs text-dim">
              {service?.title} · {order.createdAt ? new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short' }).format(order.createdAt) : ''}
            </span>
          </div>

          {/* Timeline */}
          {order.status !== 'cancelled' && (
            <div className="mt-6 bg-surface border border-line rounded-2xl p-4">
              <div className="flex items-center">
                {STEPS.map((step, i) => {
                  return (
                    <div key={step.key} className={cn('flex items-center', i < STEPS.length - 1 && 'flex-1')}>
                      <div className="flex flex-col items-center gap-1.5">
                        <span
                          className={cn(
                            'w-6 h-6 rounded-full border flex items-center justify-center transition-all',
                            i < stepIndex
                              ? 'bg-accent border-accent'
                              : i === stepIndex
                                ? 'border-accent bg-accent/[0.15] step-pulse'
                                : 'border-line'
                          )}
                        >
                          {i < stepIndex ? (
                            <Check size={12} strokeWidth={3} className="text-white" />
                          ) : i === stepIndex ? (
                            <span className="w-2 h-2 rounded-full bg-accent-bright" />
                          ) : null}
                        </span>
                        <span
                          className={cn(
                            'text-[10px] whitespace-nowrap',
                            i <= stepIndex ? 'text-mute' : 'text-dim/60'
                          )}
                        >
                          {step.label}
                        </span>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div
                          className={cn(
                            'flex-1 mx-1.5 -mt-4 border-t border-dashed',
                            i < stepIndex ? 'border-accent/70' : 'border-line'
                          )}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
              {order.status === 'review' && (
                <p className="text-xs text-mute mt-4 leading-relaxed">
                  Студия ждёт вашего согласования. Два круга правок входят в смету.
                </p>
              )}
            </div>
          )}

          {/* Brief */}
          <section className="mt-6">
            <h3 className="font-display text-[15px] font-semibold text-ink mb-3">Бриф</h3>
            <div className="bg-surface border border-line rounded-2xl divide-y divide-line/60 overflow-hidden">
              <div className="px-4 py-3.5">
                <p className="text-sm text-ink leading-relaxed whitespace-pre-wrap">{order.brief}</p>
              </div>
              {order.refs && (
                <div className="px-4 py-3 flex items-center gap-2">
                  <span className="text-xs text-dim w-20 shrink-0">Референсы</span>
                  <span className="text-sm text-mute truncate">{order.refs}</span>
                </div>
              )}
              {order.style && (
                <div className="px-4 py-3 flex items-center gap-2">
                  <span className="text-xs text-dim w-20 shrink-0">Стиль</span>
                  <span className="text-sm text-mute">{order.style}</span>
                </div>
              )}
              {order.budget && (
                <div className="px-4 py-3 flex items-center gap-2">
                  <span className="text-xs text-dim w-20 shrink-0">Бюджет</span>
                  <span className="text-sm text-mute">{order.budget}</span>
                </div>
              )}
              {order.deadline && (
                <div className="px-4 py-3 flex items-center gap-2">
                  <span className="text-xs text-dim w-20 shrink-0">Срок</span>
                  <span className="text-sm text-mute">{order.deadline}</span>
                </div>
              )}
            </div>
          </section>

          {/* Payment */}
          <div className="mt-6 bg-surface border border-line rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-dim mb-1">
                Смета{PAYMENTS_MODE === 'demo' && !order.paid ? ' · сэндбокс' : ''}
              </p>
              <p className="font-display text-xl font-semibold text-ink">
                <CountUp value={order.price} /> ₽
              </p>
            </div>
            {order.paid ? (
              <motion.span
                key="paid"
                initial={{ scale: 1.25, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 420, damping: 18 }}
                className="text-xs text-ok"
              >
                Оплачено
              </motion.span>
            ) : order.status === 'cancelled' ? (
              <span className="text-xs text-dim">Отменён</span>
            ) : (
              <Button size="sm" disabled={paying} onClick={handlePay}>
                {paying ? (
                  <span className="inline-flex items-center gap-1">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="typing-dot w-1 h-1 rounded-full bg-white/90"
                        style={{ animationDelay: `${i * 0.18}s` }}
                      />
                    ))}
                    Оплата…
                  </span>
                ) : (
                  'Оплатить'
                )}
              </Button>
            )}
          </div>

          {/* Actions */}
          {order.status === 'new' && (
            <button
              onClick={() => setConfirmCancel(true)}
              className="mt-6 mx-auto flex items-center gap-2 text-[13px] text-dim hover:text-err transition-colors py-2"
            >
              Отменить заказ
            </button>
          )}

          <a
            href="https://t.me/rivalspace"
            target="_blank"
            rel="noreferrer"
            className="mt-4 w-full flex items-center justify-center gap-2 text-[13px] text-dim hover:text-mute transition-colors py-2"
          >
            <LifeBuoy size={14} />
            Вопрос по заказу — в поддержку
          </a>
        </motion.div>
      </div>

      {/* Top-up sheet */}
      <AnimatePresence>
        {topUpOpen && (
          <Sheet open={topUpOpen} onClose={() => setTopUpOpen(false)} title="Пополнить баланс">
            <p className="text-sm text-mute -mt-1 mb-4">
              Не хватает {missing.toLocaleString('ru-RU')} ₽ для оплаты заказа.
            </p>
            <Input
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))}
              placeholder="Сумма в рублях"
              aria-label="Сумма пополнения"
            />
            <Button
              size="lg"
              className="w-full mt-4"
              disabled={topUpValue <= 0}
              onClick={() => {
                topUp(topUpValue)
                hapticFeedback('notification')
                setTopUpOpen(false)
                toast(`Баланс пополнен на ${topUpValue.toLocaleString('ru-RU')} ₽`)
              }}
            >
              Пополнить
            </Button>
          </Sheet>
        )}
      </AnimatePresence>

      {/* Payment success */}
      <AnimatePresence>
        {paySuccess && (
          <Sheet open={paySuccess} onClose={() => setPaySuccess(false)}>
            <div className="flex flex-col items-center text-center pt-2 pb-1">
              <motion.svg
                width="72"
                height="72"
                viewBox="0 0 72 72"
                fill="none"
                initial="hidden"
                animate="show"
                aria-hidden
              >
                <motion.circle
                  cx="36"
                  cy="36"
                  r="32"
                  stroke="rgba(52,211,153,.45)"
                  strokeWidth="2.5"
                  variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1 } }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                />
                <motion.path
                  d="M23 37l9 9 17-19"
                  stroke="#34D399"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1 } }}
                  transition={{ duration: 0.45, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                />
              </motion.svg>

              <h2 className="font-display text-xl font-semibold text-ink mt-4">Оплачено</h2>
              <p className="font-display text-2xl font-semibold text-ok tnum mt-1">
                {order.price.toLocaleString('ru-RU')} ₽
              </p>
              <p className="text-sm text-mute mt-2 max-w-[260px]">
                Заказ «{order.title}» передан студии. Статус увидишь здесь и в уведомлениях.
              </p>

              <Button size="lg" className="w-full mt-6" onClick={() => setPaySuccess(false)}>
                Отлично
              </Button>
            </div>
          </Sheet>
        )}
      </AnimatePresence>

      {/* Cancel confirm */}
      <AnimatePresence>
        {confirmCancel && (
          <Sheet open={confirmCancel} onClose={() => setConfirmCancel(false)} title="Отменить заказ?">
            <p className="text-sm text-mute -mt-1 mb-5">
              Заявка «{order.title}» ещё не в работе — отменить можно без последствий.
            </p>
            <div className="flex gap-2.5">
              <Button variant="secondary" className="flex-1" onClick={() => setConfirmCancel(false)}>
                Вернуться
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                onClick={() => {
                  cancelOrder(order.id)
                  setConfirmCancel(false)
                  popOverlay()
                  toast('Заказ отменён')
                }}
              >
                Отменить
              </Button>
            </div>
          </Sheet>
        )}
      </AnimatePresence>
    </div>
  )
}
