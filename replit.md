# Workspace

## Overview

KEROPROMO — SaaS web portal (Brazilian Portuguese) for individual entrepreneurs managing WhatsApp offer groups as affiliates of Shopee, Temu, Amazon, and Mercado Livre. Built as a pnpm workspace monorepo using TypeScript.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite + Tailwind CSS v4
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Auth**: bcrypt (password hashing) + jsonwebtoken (JWT signing); access tokens 15min, refresh tokens 7 days stored in `refresh_tokens` table
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **UI Library**: shadcn/ui components
- **Icons**: Lucide React
- **Routing**: wouter
- **Data Fetching**: TanStack React Query (generated hooks from Orval)
- **Charts**: Recharts
- **Forms**: react-hook-form
- **Brand Color**: #25D366 (WhatsApp green)
- **Payments**: Stripe (via Replit native connector — `connection:conn_stripe_01KM1F8JM5T7T2VEK0QR62XD9W`)

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server (port 8080)
│   └── keropromo/          # React + Vite frontend (slug: keropromo, previewPath: /)
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (seed-admin, seed-dev, seed-products)
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## Frontend Architecture (artifacts/keropromo)

### Pages & Routing
- **Public**: Landing (`/` — single page with anchors #como-funciona, #planos, #faq), Login (`/login`), Register (`/cadastro`); `/precos` and `/faq` redirect to landing with anchor
- **Entrepreneur** (`/dashboard/*`): Dashboard, Catalogo, Grupos, Agendamentos, Historico, Carteira, Comissoes, Colaboradores, Configuracoes
- **Admin** (`/admin/*`): Dashboard, Ofertas, Marketplaces, Empreendedores, Comissoes, Saques, Assinaturas
- **Collaborator** (`/collaborator/*`): Dashboard, Grupos, Historico

### Key Components
- `components/layout/PublicLayout.tsx` — header/footer for public pages
- `components/layout/DashboardLayout.tsx` — sidebar/mobile nav for authenticated pages; auto-detects role from URL path
- `components/ui/` — shadcn/ui components
- `hooks/use-auth.ts` — auth hook with token-based login, role detection, route protection (stores JWT in localStorage)
- `hooks/use-toast.ts` — toast notifications
- `lib/utils.ts` — includes `getMarketplaceColor()` for marketplace-specific colors

### Vite Config
- Proxy: `/api` → `http://localhost:8080` (API server)
- Path alias: `@/` → `src/`

## API Server (artifacts/api-server)

All routes under `/api` prefix.

### Routes
- `auth.ts` — login, register, getMe, logout; on register: creates Stripe customer + subscription with 10-day trial
- `offers.ts` — CRUD offers
- `groups.ts` — WhatsApp groups (name, niche, token only — no contacts stored)
- `schedules.ts` — scheduled sends
- `sendHistory.ts` — send history records
- `wallet.ts` — digital wallet with Pix withdrawals
- `commissions.ts` — affiliate commissions
- `collaborators.ts` — collaborator management
- `plans.ts` — subscription plans (Starter R$9.90, Pro R$29.90, Business R$99.90); GET /subscription, PUT /subscription
- `billing.ts` — Stripe billing: GET /billing/stripe-key (public), GET /billing/subscription, POST /billing/portal (Customer Portal), POST /billing/setup-intent
- `featured.ts` — featured offer of the week
- `admin.ts` — admin dashboard metrics
- `entrepreneur.ts` — entrepreneur dashboard/metrics/financial
- `shortLinks.ts` — short URL generation + public redirect at /s/:code

### Stripe Integration
- Uses Replit native connector (`stripe` connector) — credentials fetched dynamically via `stripeClient.ts`
- `stripeClient.ts` — `getUncachableStripeClient()`, `getStripePublishableKey()`, `getStripeSync()`
- `webhookHandlers.ts` — processes Stripe webhooks via `stripe-replit-sync`
- Webhook endpoint: `POST /api/stripe/webhook` (registered BEFORE express.json() with express.raw())
- Stripe schema synced into `stripe.*` PostgreSQL schema via `stripe-replit-sync`
- Stripe products in account: KERO PROMO Starter (`prod_UAnmdPgYaPkYHI`), Pro (`prod_UAnm1TJXv1RKoo`), Business (`prod_UAnmuVv4cGgmr8`)
- Prices (BRL, recurring monthly) have `planId` metadata (1/2/3) for mapping to DB plans
- `scripts/src/seed-products.ts` — creates/idempotently updates Stripe products+prices
- `requireActiveSubscription` middleware in `middlewares/subscription.ts` — blocks canceled/past_due/unpaid with 402

### Middlewares
- `auth.ts` — `requireAuth` (JWT Bearer), `requireRole(role)`
- `subscription.ts` — `requireActiveSubscription` (checks subscriptionStatus)

### Startup (index.ts)
- Server starts immediately (non-blocking)
- `initStripe()` runs async in background: runMigrations → getStripeSync → findOrCreateManagedWebhook → syncBackfill

## Database Schema (lib/db)

Tables: users, marketplaces, offers, groups, schedules, send_history, wallets, commissions, withdrawals, plans, collaborators, featured_offers, refresh_tokens, short_links

### users table fields (key)
- `subscription_status` text default "trialing"
- `stripe_customer_id` text
- `stripe_subscription_id` text
- `stripe_price_id` text
- `plan_id` integer (FK to plans)
- `status` text default "trial"
- `trial_ends_at` timestamp

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references.

- **Always typecheck from the root** — `pnpm run typecheck`
- **`emitDeclarationOnly`** — only `.d.ts` files during typecheck
- **Project references** — packages list dependencies in `references` array

## Root Scripts

- `pnpm run build` — typecheck + recursive build
- `pnpm run typecheck` — `tsc --build --emitDeclarationOnly`

## Key Design Decisions

- All UI text is in Brazilian Portuguese (pt-BR)
- KEROPROMO does NOT store WhatsApp contacts/members — only group name, niche, and connection token
- WhatsApp integration (Z-API/Evolution API) is mocked/placeholder
- Marketplace APIs are mocked with realistic sample data
- Plans: Starter (1 group, 30 sends/mo), Pro (3 groups, 150 sends/mo, 2 collab), Business (unlimited)
- 3 user roles: admin, entrepreneur, collaborator
- Pix withdrawals are manually processed by the KEROPROMO team
- Commission confirmation takes ~35 days from marketplace
- Stripe integration uses Replit native connector (NOT manual env vars); connector ID: `connection:conn_stripe_01KM1F8JM5T7T2VEK0QR62XD9W`
- Stripe Customer Portal requires activation at: https://dashboard.stripe.com/test/settings/billing/portal

## Admin Credentials
- Email: `eduardo@oversaas.net` / Password: `123456@7`

## Pending Configuration
- Stripe Customer Portal must be activated at dashboard.stripe.com/test/settings/billing/portal before the "Gerenciar Assinatura" button works
