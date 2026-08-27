# Rival Space — Release Guide

Приложение сегодня полностью работает в **sandbox-режиме** (локальные данные,
демо-оплата). Ниже — что переключить, чтобы выйти в прод. Все точки интеграции
уже вшиты в код.

---

## 1. Переменные окружения

Создай `.env.production` (Vite):

```bash
# REST-бэкенд состояния (Supabase Edge / любой сервер). Пусто = localStorage.
VITE_API_URL=https://your-edge.function.supabase.co

# Платёжный шлюз: POST {VITE_PAY_API}/invoice → { url }. Пусто = демо-оплата.
VITE_PAY_API=https://your-api.example.com

# База видео-уроков (необязательно): подменяет хост sample-видео.
VITE_VIDEO_BASE=https://cdn.example.com/courses
```

## 2. Данные (backend.ts)

Адаптер `RestBackend` ожидает два эндпоинта:

- `GET  {VITE_API_URL}/state` → JSON состояния `AppState`
- `PUT  {VITE_API_URL}/state` ← JSON состояния

Авторизация: заголовок `X-Telegram-Init-Data` (raw initData из Telegram).
Бэкенд обязан проверить HMAC-SHA256 по алгоритму Telegram
(секрет = SHA256(bot_token)) — иначе любой может подделать запрос.

### Схема Supabase (минимум)

```sql
create table if not exists user_state (
  user_id   bigint primary key,        -- Telegram user id
  state     jsonb not null,
  updated_at timestamptz not null default now()
);
```

Edge Function `state`: GET → `select state`, PUT → `upsert`. Валидация initData
обязательна (пример в доках Telegram Web Apps, раздел «Validating data»).

## 3. Оплата (payments.ts)

`POST {VITE_PAY_API}/invoice` ← `{ orderId, amount, currency, description }`
→ `{ url }` — хостед-страница оплаты (YooKassa «Ссылка на оплату» / Stripe
Checkout Session).

YooKassa, шаги:
1. Магазин в личном кабинете ЮKassa, получить shopId + секретный ключ.
2. Серверный эндпоинт `/invoice`: `POST https://api.yookassa.ru/v3/payments`
   (Basic auth shopId:key), `confirmation: { type: "redirect", return_url }`,
   header `Idempotence-Key: orderId`.
3. Вернуть `response.confirmation.confirmation_url` как `url`.
4. Вебхук `payment.succeeded` → пометить заказ оплаченным на бэкенде
   (клиент обновит статус через `GET /state`).

До подключения ключей приложение честно показывает «Смета · сэндбокс» и
списывает внутренний баланс.

## 4. Видео курсов

Сейчас используются публичные sample-стримы Google (`gtv-videos-bucket`).
Залей свои mp4 на CDN и поменяй `videoUrl` в `src/lib/data.ts` (или подними
`VITE_VIDEO_BASE` и вынеси пути). Формат: H.264 mp4, до 720p — хватит для
мобильного трафика.

## 5. Telegram BotFather (чек-лист)

- [ ] /newapp → указать URL деплоя, загрузить иконку 640×360
- [ ] Description + About на русском
- [ ] Menu Button → `https://your-domain/`
- [ ] Web App → `https://your-domain/` (HTTPS обязателен)

## 6. Деплой

```bash
npm run build          # dist/
```

Любой статик-хостинг с HTTPS: Vercel / Netlify / Cloudflare Pages.
`index.html` уже подключает `telegram-web-app.js`.

## 7. Что остаётся демо (честный список)

- Баланс и «пополнение» — локальные, пока не подключён `/invoice` + вебхук.
- Заказы хранятся в user_state, не в таблице заказов — для реального потока
  заказов заведи таблицу `orders` и синхронизируй тем же Edge Function.
- Rival AI — офлайн-движок по правилам. Для LLM-ответов подключи любой API
  в `src/lib/rivalAI.ts` (одна функция `generateReply` — точка замены).
- Статусы заказов («в работе» и т.д.) меняет студия вручную на бэкенде.
