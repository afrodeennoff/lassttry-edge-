# Aegis Journal

Clean-room production SaaS app for AI trading journaling, analytics, collaboration, imports, and Whop billing.

## Stack
- Next.js 16 App Router + TypeScript
- PostgreSQL + Prisma
- Billing provider abstraction (`whop` default, `stripe` compatible)
- Zod validation and tenancy/security guards

## Quick start
1. `npm install`
2. Copy `.env.example` to `.env.local`
3. `npm run prisma:generate`
4. `npm run lint && npm run typecheck && npm run build`
5. `npm run dev`

## Docker
- `docker compose up --build`

## CI
- GitHub Actions workflow: `.github/workflows/ci.yml`

## Launch package
- `/Users/timon/Downloads/final try/final-product/docs/FINAL_LAUNCH_REPORT.md`
- `/Users/timon/Downloads/final try/final-product/docs/ADR.md`
- `/Users/timon/Downloads/final try/final-product/docs/OPERATIONS_RUNBOOK.md`
- `/Users/timon/Downloads/final try/final-product/docs/COMPLIANCE_NOTE.md`

## Compliance
This codebase is authored clean-room and does not directly reuse CC-BY-NC-4.0 source code.
