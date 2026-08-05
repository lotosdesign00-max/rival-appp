const fs = require('fs');

let content = fs.readFileSync('server.ts', 'utf8');

const imports = `import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import axios from "axios";
import Stripe from "stripe";`;

content = content.replace(/import express from "express";[\s\S]*?import axios from "axios";/, imports);

const paymentEndpoints = `
  // Payments Endpoints
  app.post("/api/payments/card", async (req, res) => {
    try {
      const { amount } = req.body;
      const stripeKey = process.env.STRIPE_SECRET_KEY;
      if (!stripeKey) return res.status(500).json({ error: 'STRIPE_SECRET_KEY is not configured' });
      
      const stripe = new Stripe(stripeKey);
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: { name: 'Rival Space Balance Deposit' },
              unit_amount: Math.round(amount * 100),
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: req.headers.origin + '/?payment_success=true',
        cancel_url: req.headers.origin + '/?payment_cancel=true',
      });
      
      res.json({ url: session.url });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/payments/crypto", async (req, res) => {
    try {
      const { amount } = req.body;
      const apiKey = process.env.COINBASE_COMMERCE_API_KEY;
      if (!apiKey) return res.status(500).json({ error: 'COINBASE_COMMERCE_API_KEY is not configured' });

      const response = await axios.post('https://api.commerce.coinbase.com/charges', {
        name: 'Rival Space Balance Deposit',
        description: 'Deposit funds to Rival Space',
        pricing_type: 'fixed_price',
        local_price: {
          amount: amount.toString(),
          currency: 'USD'
        }
      }, {
        headers: {
          'X-CC-Api-Key': apiKey,
          'X-CC-Version': '2018-03-22'
        }
      });
      
      res.json({ url: response.data.data.hosted_url });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.response?.data?.error?.message || err.message });
    }
  });

  app.post("/api/payments/stars", async (req, res) => {
    try {
      const { amount } = req.body;
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      if (!botToken) return res.status(500).json({ error: 'TELEGRAM_BOT_TOKEN is not configured' });

      // Note: In a real app, Stars are XTR currency. The amount is in Stars (not USD).
      // Let's assume 1 USD = 50 Stars for simplicity, or just use the amount directly.
      const starsAmount = Math.max(1, Math.round(amount * 50)); 

      const response = await axios.post(\`https://api.telegram.org/bot\${botToken}/createInvoiceLink\`, {
        title: 'Balance Deposit',
        description: 'Deposit funds to Rival Space',
        payload: 'deposit_' + Date.now(),
        provider_token: '', // Empty for stars
        currency: 'XTR',
        prices: [{ label: 'Deposit', amount: starsAmount }]
      });

      if (response.data.ok) {
        res.json({ url: response.data.result });
      } else {
        res.status(500).json({ error: response.data.description });
      }
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.response?.data?.description || err.message });
    }
  });
`;

content = content.replace('// Vite middleware for development', paymentEndpoints + '\n  // Vite middleware for development');

fs.writeFileSync('server.ts', content);
console.log('Server updated');
