import type { Order } from './types'

/**
 * Payment provider abstraction.
 *
 * Today: DemoProvider — sandbox flow, clearly labelled in UI.
 * Release: set VITE_PAY_API and your server creates real invoices
 * (YooKassa / Stripe / Telegram Payments). See RELEASE.md.
 */

export interface InvoiceResult {
  mode: 'demo' | 'redirect'
  /** hosted payment page url when mode === 'redirect' */
  url?: string
  error?: string
}

export interface PaymentProvider {
  readonly name: 'demo' | 'rest'
  createInvoice(order: Order): Promise<InvoiceResult>
}

const demo: PaymentProvider = {
  name: 'demo',
  async createInvoice() {
    // Sandbox: the app settles the order against the local balance.
    // No real money moves until a provider is configured.
    return { mode: 'demo' }
  },
}

const rest: PaymentProvider = {
  name: 'rest',
  async createInvoice(order) {
    try {
      const res = await fetch(`${import.meta.env.VITE_PAY_API}/invoice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          amount: order.price,
          currency: 'RUB',
          description: `Rival Design · ${order.title}`,
        }),
      })
      if (!res.ok) return { mode: 'demo', error: `invoice ${res.status}` }
      const data = (await res.json()) as { url?: string }
      return data.url ? { mode: 'redirect', url: data.url } : { mode: 'demo', error: 'no url' }
    } catch (e) {
      return { mode: 'demo', error: e instanceof Error ? e.message : 'network' }
    }
  },
}

const payApi = (import.meta.env.VITE_PAY_API as string | undefined)?.replace(/\/$/, '')

export const payments: PaymentProvider = payApi ? rest : demo
export const PAYMENTS_MODE = payments.name
