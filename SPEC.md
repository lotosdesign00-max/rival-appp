# Rival Space — SPEC.md

## 1. Concept & Vision

**Anchor: Retro-Futuristic** — dark command center, mission control aesthetic, ignition orange as the single action color.

Not "another dark UI" — a cockpit. Every element earns its place. One orange action per screen. The feeling: "I'm entering a controlled operations environment, not a website."

**Differentiator:** Glowing ignition borders on active elements (Cybernetic Bento Grid inspiration). Subtle CRT scanline texture on splash. Orange as "signal/action", never decorative.

---

## 2. Design Tokens

### Colors
```
--bg-primary:     #0A0B0F   // Deep Space Black — all screen backgrounds
--bg-card:        #15171D   // Void Gray — cards, inputs
--bg-divider:     #22242C   // Faint Line — borders, dividers
--text-primary:   #F2F2F0   // Off White — headings, primary text
--text-secondary: #8A8D96   // Dim Gray — labels, secondary text
--accent-orange:  #FF5A1F   // Ignition Orange — CTA, active tabs, progress
--accent-blue:    #3E8EFF   // Signal Blue — status "in progress", links
--success:        #3ED598   // Success green — confirmations only
--glow-orange:    rgba(255, 90, 31, 0.4) // For box-shadow glows
```

### Typography
- **Display/Headings:** Space Grotesk (geometric sans, slightly technical)
- **Body:** Inter (readable, neutral)
- **Mono (technical elements):** JetBrains Mono
- **Fallback:** system-ui, sans-serif

### Spacing
- Base unit: 4px
- Card padding: 16px (4 units)
- Section gap: 24px (6 units)
- Screen padding: 16px horizontal

### Border Radius
- Cards: 12px
- Buttons: 8px
- Chips/tags: 6px
- Inputs: 8px

### Shadows
- Cards: none (flat design, borders instead)
- Glow effect on accent: `0 0 20px var(--glow-orange)` on orange elements

---

## 3. Component Inventory (21st.dev)

| Component | ID | Source | Usage |
|-----------|-----|--------|-------|
| Cybernetic Bento Grid | 6014 | dhileepkumargm | Home hero layout, Gallery grid |
| Bottom Nav Bar | 8343 | arunachalam0606 | Tab bar (Home/Gallery/Signal/Profile) |
| Tubelight Navbar | 1432 | ayushmxxn | Top header with glow effect |
| Linear Carousel | 20150 | animbits | Star Map style selection (Horizontal scroll) |
| Reshaped Progress | 17922 | larsen66/reshaped | Step indicator for Signal flow |
| Glass Card | 5588 | molecule-lab-rushil | Gallery item cards |
| Interactive Empty State | 22301 | remcostoeten | Dark empty states |
| Dashboard Sidebar | 14941 | arunjdass | Command Deck admin panel |

---

## 4. Screen Architecture

### Navigation
- **Client-facing:** Bottom Tab Bar with 4 tabs
  - Главная (Home icon)
  - Галерея (Grid icon)
  - Сигнал (Send icon)
  - Профиль (User icon)
- **Admin:** Separate route `/command-deck`, NOT in tab bar

### Screen Flow
```
Splash → Home ←→ Gallery ←→ Signal (3 steps)
                  ←→ Profile
                  ←→ Command Deck (admin only)
```

### Screens

#### 4.1 Splash
- Black screen, logo center
- Ignition animation: dot → orange line/ripple
- Auto-transition to Home after 2s

#### 4.2 Home (Главная)
- Header: "Rival Design · на связи" (Tubelight style)
- Hero card: featured work (Cybernetic Bento Grid layout)
- CTA: "Отправить сигнал" — orange, full-width
- Horizontal strip: "Последние работы" (3-4 items, carousel)

#### 4.3 Gallery (Галерея)
- Filter chips: Все / Аватар / Баннер / Превью
- 2-column grid (Cybernetic or standard bento)
- Tap → fullscreen preview + "Хочу похожее" CTA

#### 4.4 Signal (Сигнал) — 3-step flow
**Step 1 — Mission Control:**
- Progress bar (orange, Reshaped indicator)
- One question per screen, large text
- 4-5 questions total

**Step 2 — Star Map:**
- Horizontal carousel of style cards (Linear Carousel)
- Selected = orange border glow
- Style options: Гоночный / Минимал / Неон / Тёмный люкс

**Step 3 — Signal Sent:**
- Green checkmark / success animation
- "Сигнал получен. Свяжемся в течение X"
- "Вернуться на базу" button

#### 4.5 Profile (Профиль)
- Active order card (blue status)
- Order history list
- Balance/bonuses section
- Settings (notifications, language, support)

#### 4.6 Command Deck (Админка)
- Sidebar navigation (Dashboard Sidebar)
- Signal queue: priority list of orders
- Status management: Новый → В работе → Отправлено
- Quick actions per signal

---

## 5. Technical Stack

- **Framework:** Vite + React 18 + TypeScript
- **Styling:** Tailwind CSS v4 + CSS variables for tokens
- **Components:** shadcn/ui (base) + custom themed components
- **Animation:** Framer Motion (for carousel, transitions)
- **Icons:** Lucide React (consistent, clean)
- **Telegram SDK:** @twa-dev/sdk (Telegram Mini App)

### Project Structure
```
src/
├── components/
│   ├── ui/              # shadcn components
│   ├── layout/          # TabBar, Header, Screen wrappers
│   ├── screens/         # Home, Gallery, Signal, Profile, CommandDeck
│   └── widgets/         # HeroCard, StyleCard, OrderCard, etc.
├── hooks/               # useTelegram, useTheme
├── lib/                 # utils, constants
├── styles/              # globals.css with CSS variables
└── App.tsx
```

---

## 6. Implementation Notes

1. **One orange action per screen** — never place two orange CTAs together
2. **Glow on interaction** — orange elements get `box-shadow` glow on hover/focus
3. **No decorative elements** — every icon/text has semantic purpose
4. **Space Grotesk for headings** — Inter for body, JetBrains Mono for technical labels
5. **Splash → Home**: 2s auto-transition, no skip button (it's part of the experience)
6. **Telegram Mini App**: Use `useExpand()` for fullscreen, `HapticFeedback` on interactions
7. **Command Deck**: Separate route `/command-deck`, requires some form of auth check (can be simple for now)
