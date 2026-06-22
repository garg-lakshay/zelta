# Zelta — Trading Behaviour Analytics

A full-stack trading analytics platform that scores traders on **Performance**, **Risk**, and **Behaviour** — not just profit.

Built for prop firm traders who want to understand *why* they win or lose.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL (Neon) |
| ORM | Prisma 7 |
| Auth | JWT (jsonwebtoken + jose) |
| State | Zustand |
| Charts | Recharts |
| Styling | Tailwind CSS |
| Icons | Lucide React |

---

## Features

- **CSV Upload** — Upload trading history from Zerodha, Groww, Angel, or any generic CSV
- **Performance Analytics** — Win rate, profit factor, expectancy, streaks, equity curve
- **Risk Analytics** — Max drawdown, Sharpe ratio, Calmar ratio, sector concentration
- **Behaviour Scoring** — Overtrading, discipline, emotional control, consistency
- **Master Score** — A single composite score (0–100) with grade and trader personality
- **Dashboard** — Live charts, metric cards, and score breakdowns

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/garg-lakshay/zelta.git
cd zelta
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root:

```env
DATABASE_URL="your_neon_postgres_connection_string"
JWT_SECRET="your_strong_random_secret"
```

Generate a JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. Run database migrations

```bash
npx prisma migrate dev --name init
```

### 5. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login and register pages
│   ├── (dashboard)/     # Dashboard layout and page
│   └── api/             # Auth, upload, and dashboard API routes
├── components/
│   ├── charts/          # Recharts wrappers
│   └── shared/          # Spinner, empty state, error message
├── features/
│   ├── dashboard/       # Score ring, metric cards, insight cards
│   └── upload/          # CSV upload card with drag-and-drop
├── hooks/               # useAuth, useDashboard, useUpload
├── lib/                 # Prisma client, auth middleware, utils
├── services/            # API client, analytics calculation engine
├── store/               # Zustand auth store
└── types/               # Shared TypeScript interfaces
```

---

## Sample CSV

A sample trading CSV is included at `public/sample-trades.csv`. Download it from the upload screen to test the platform.

**Required columns:**
```
date, symbol, sector, quantity, entry_price, exit_price, pnl
```

---

## Score Breakdown

| Score | What it measures |
|---|---|
| Performance Score | Win rate, profit factor, expectancy, streaks |
| Risk Score | Drawdown, Sharpe ratio, position sizing, concentration |
| Behaviour Score | Overtrading, discipline, emotional trading, consistency |
| **Master Score** | Weighted composite of all three |

**Grades:** Elite Trader (90+) · Advanced Trader (75+) · Developing Trader (60+) · Inconsistent Trader (40+) · High Risk Trader (<40)
