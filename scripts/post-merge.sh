#!/bin/bash
set -e
pnpm install --frozen-lockfile
pnpm --filter @workspace/db exec drizzle-kit push
pnpm --filter @workspace/db exec tsc -p tsconfig.json
pnpm --filter @workspace/scripts run seed-admin
