# Digital Wardrobe

A production-quality multi-page web app to manage your wardrobe: sign up, add items with images and metadata, browse and filter, and view details in a side sheet.

## Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS + CSS variables (light/dark theme)
- **Database:** SQLite + Prisma
- **State:** Zustand (auth, wardrobe, filters, toasts)
- **Animations:** Framer Motion
- **Auth:** Cookie-based JWT sessions

## Requirements

- **Node.js** >= 18.17.0 (recommend 20.x LTS)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Environment

Copy `.env.example` to `.env` (or use the default `.env` already present):

```bash
cp .env.example .env
```

Required:

- `DATABASE_URL` — SQLite path, e.g. `file:./dev.db`
- `SESSION_SECRET` — Min 32 characters for JWT signing

### 3. Database

Create the SQLite DB and run migrations:

```bash
npx prisma migrate dev --name init
```

Seed the database with a demo user and 50 wardrobe items (placeholder images from Picsum):

```bash
npm run db:seed
```

### 4. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo account

After seeding:

- **Email:** `demo@wardrobe.app`
- **Password:** `demo1234`

## Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run migrations |
| `npm run db:seed` | Seed DB (demo user + 50 items) |
| `npm run db:studio` | Open Prisma Studio |

## Project structure

```
app/
  page.tsx              # Landing
  auth/page.tsx         # Sign up / Log in
  app/
    layout.tsx          # Protected app shell (header, toasts)
    page.tsx            # Wardrobe grid + filters
    add/page.tsx        # Add item form
    profile/page.tsx    # Profile + theme + logout
  api/
    auth/signup, login, logout
    me
    wardrobe (GET list, POST create)
    wardrobe/[id] (GET, DELETE)
components/
  ThemeProvider.tsx
  ui/                   # Button, Input, Select, Card, Sheet, etc.
lib/
  db.ts, auth.ts, cn.ts
stores/
  useAuthStore, useWardrobeStore, useFilterStore, useToastStore
prisma/
  schema.prisma
  seed.ts
```

## Features

- **Auth:** Sign up, log in, cookie session, `/api/me` bootstrap
- **Wardrobe:** List with server-side filter/sort/pagination; add item; view in right-hand sheet; delete
- **Filters:** Type, color, size, cost range, purchase date range; debounced search
- **Theme:** Light/dark with CSS variables and toggle
- **UI:** Internal component library (Button, Input, Select, MultiSelect, Card, Sheet, Badge, Tabs, Toast, etc.)
- **Animations:** Page and list motion, sheet open/close, card hover
