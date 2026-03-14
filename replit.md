# Workspace

## Overview

KERO PROMO (formerly PEGAPROMO) — SaaS web portal (Brazilian Portuguese) for individual entrepreneurs managing WhatsApp offer groups as affiliates of Shopee, Temu, Amazon, and Mercado Livre. Built as a pnpm workspace monorepo using TypeScript.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite + Tailwind CSS v4
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
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

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server (port 8080)
│   └── pegapromo/          # React + Vite frontend (slug: pegapromo, previewPath: /)
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## Frontend Architecture (artifacts/pegapromo)

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

All routes under `/api` prefix. Mock data for demo purposes.

### Routes
- `auth.ts` — login, register, getMe, logout (token-based sessions via Bearer header; mock users by role based on email)
- `offers.ts` — CRUD offers with 8 mock products across 4 marketplaces
- `groups.ts` — WhatsApp groups (name, niche, token only — no contacts stored)
- `schedules.ts` — scheduled sends
- `sendHistory.ts` — send history records
- `wallet.ts` — digital wallet with Pix withdrawals
- `commissions.ts` — affiliate commissions
- `collaborators.ts` — collaborator management
- `plans.ts` — subscription plans (Starter R$9.90, Pro R$29.90, Business R$99.90)
- `featured.ts` — featured offer of the week
- `admin.ts` — admin dashboard metrics
- `entrepreneur.ts` — entrepreneur dashboard/metrics/financial

## Database Schema (lib/db)

Tables: users, marketplaces, offers, groups, schedules, send_history, wallets, commissions, withdrawals, plans, collaborators, featured_offers

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
- PEGAPROMO does NOT store WhatsApp contacts/members — only group name, niche, and connection token
- WhatsApp integration (Z-API/Evolution API) is mocked/placeholder
- Stripe payments are mocked/placeholder
- Marketplace APIs are mocked with realistic sample data
- Plans: Starter (1 group, 30 sends/mo), Pro (3 groups, 150 sends/mo, 2 collab), Business (unlimited)
- 3 user roles: admin, entrepreneur, collaborator
- Pix withdrawals are manually processed by the PEGAPROMO team
- Commission confirmation takes ~35 days from marketplace
