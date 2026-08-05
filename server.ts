import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  
  // 1. Stripe Payment for Card
  app.post('/api/payments/card', async (req, res) => {
    try {
      const { amount } = req.body;
      
      // Since Stripe key isn't provided, we simulate the Stripe Checkout URL.
      // We route to Stripe's real homepage just to show the redirect works.
      const sessionUrl = `https://stripe.com/payments?mock_amount=${amount}`;
      
      res.json({ url: sessionUrl });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 2. Crypto Payment via Coinbase Commerce
  app.post('/api/payments/crypto', async (req, res) => {
    try {
      const { amount } = req.body;
      
      // Simulate Coinbase Commerce checkout redirect
      const sessionUrl = `https://commerce.coinbase.com/?mock_amount=${amount}`;
      
      res.json({ url: sessionUrl });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 3. Telegram Stars Payment
  app.post('/api/payments/stars', async (req, res) => {
    try {
      const { amount } = req.body;
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      
      if (!botToken) {
         // Mock URL if no token
         throw new Error("TELEGRAM_BOT_TOKEN is not configured");
      }

      const invoicePayload = {
        title: 'Top Up Balance',
        description: `Deposit $${amount} via Telegram Stars`,
        payload: `deposit_${Date.now()}`,
        currency: 'XTR', // XTR is the currency code for Telegram Stars
        prices: [{ label: 'Stars', amount: amount * 100 }] // Assuming 1 Star = $0.01 for this example
      };

      const response = await fetch(`https://api.telegram.org/bot${botToken}/createInvoiceLink`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoicePayload)
      });

      const data = await response.json();
      if (data.ok) {
        res.json({ url: data.result });
      } else {
        throw new Error(data.description || 'Failed to create invoice link');
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
