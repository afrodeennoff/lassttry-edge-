# AGENTS.md

## Purpose
This document provides operating instructions for engineering agents working on Qunt Edge.
Apply these rules when implementing, reviewing, or shipping changes in this repository.

## Product Context
- Qunt Edge is a trading analytics platform for futures and prop-firm workflows.
- Core domains: trade ingestion, analytics dashboards, journaling, AI analysis, teams, and billing.
- Primary risk areas: financial data correctness, import integrity, auth/security boundaries, and payment webhook handling.

## App Explanation (Engineering View)
- Runtime model: Next.js App Router with mixed server/client components and API routes in `app/api`.
- Data flow: broker/file ingestion -> normalization/storage -> dashboard/query surfaces -> journaling/review -> AI-assisted analysis.
- Core UX surfaces:
  - Dashboard (`app/[locale]/dashboard`): widgets, charts, summaries, and performance exploration.
  - Data/import flows: broker sync and file import pipelines with mapping/validation.
  - Teams/admin/billing areas: access control, account/org settings, and payment lifecycle handling.
- Integration points: Supabase (auth/storage), Prisma/Postgres (data), OpenAI (analysis helpers), Whop (payments/webhooks).
- Localization: i18n via locale files and localized routes.

## Tech Stack
- Framework: Next.js App Router (`app/`)
- Language: TypeScript (strict)
- UI: React 19, Tailwind, Radix
- Data: Prisma + PostgreSQL (Supabase)
- Auth/Storage: Supabase
- AI: OpenAI integrations
- Payments: Whop webhooks and plan configs
- Testing: Vitest

## Repo Map
- `app/`: routes, layouts, API handlers
- `components/`: UI and feature components
- `server/`: server-side business logic and services
- `lib/`: utilities and shared helpers
- `store/`: Zustand stores
- `prisma/`: schema and db utilities
- `scripts/`: build/sync/ops scripts

## Operating Principles
- Prefer minimal, targeted changes over broad refactors.
- Preserve existing architecture and naming conventions.
- Keep business logic out of client components when possible.
- Do not silently change behavior in trading math, imports, or billing flows.
- If assumptions are required, document them in PR/commit notes.

## Safety-Critical Areas

### Trading and Analytics
- Treat PnL, fees, size, and time normalization as correctness-critical.
- Avoid rounding changes unless explicitly requested and validated.
- Keep timezone handling explicit and consistent.

### Imports and Parsing
- Maintain backward compatibility for CSV/PDF and broker mappings.
- Fail clearly on malformed data; do not hide parse errors.
- Preserve idempotency where imports can be retried.

### Auth and Permissions
- Enforce user/team scoping on all data access paths.
- Never expose service-role secrets to the client.
- Validate API authorization, not only UI-level checks.

### Payments and Webhooks
- Keep webhook handlers deterministic and idempotent.
- Verify signature/secret checks are preserved.
- Ensure plan ID changes remain synchronized with config and env docs.

## Change Workflow
1. Read relevant files and existing patterns before editing.
2. Implement the smallest coherent fix.
3. Run validation commands for impacted scope.
4. Confirm no obvious regressions in critical paths.
5. Summarize behavior changes and residual risks.

## Validation Commands
Use npm scripts already defined in this repo:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Additional targeted commands:

```bash
npm run test:payment
npm run test:coverage
```

## Coding Rules
- Prefer server-side validation for any user-provided data.
- Add or update types before adding runtime workarounds.
- Avoid `any` unless unavoidable and justified.
- Keep functions focused; extract helpers for repeated logic.
- Use clear error messages with enough diagnostic context.
- Add comments only for non-obvious decisions.

## API and Data Contracts
- Do not break existing response shapes without migration strategy.
- Treat persisted data schema changes as explicit migrations.
- For new fields, define defaults and nullability intentionally.
- Validate external payloads at boundaries.

## Performance Expectations
- Avoid unnecessary client re-renders and heavy synchronous work.
- Keep bundle impact in mind for shared UI modules.
- Prefer pagination/chunking for potentially large datasets.

## Observability and Debuggability
- Preserve useful logs around imports, sync, and webhook processing.
- Avoid logging sensitive data (tokens, secrets, PII-heavy payloads).
- Include contextual identifiers (user/team/import/job IDs) when safe.

## Definition of Done
A change is done when:
- Behavior is implemented and matches requested scope.
- Lint/type/tests for impacted areas pass.
- Critical paths (imports, analytics correctness, auth, payments) remain intact.
- Notes include what changed, why, and any follow-up work.

## Non-Goals for Routine Tasks
- Large design overhauls unrelated to request.
- Cross-cutting refactors without measurable benefit.
- Dependency upgrades unless required to complete the task.

## Escalation Guidance
Escalate to a human reviewer when:
- Financial calculations produce ambiguous results.
- Broker payload changes require domain interpretation.
- Security/auth edge cases are uncertain.
- Payment lifecycle events conflict or duplicate unexpectedly.

## Recent Changes (Last 20 Commits)
1. `0698a70` (2026-02-08): Added bulk Tradovate sync translations in `locales/en.ts` and `locales/fr.ts`.
2. `f0b751c` (2026-02-08): Updated Tradovate sync API route and sync context (`app/api/tradovate/sync/route.ts`, `context/tradovate-sync-context.tsx`).
3. `420e951` (2026-02-08): Handled Prisma `P3005` by baselining migrations in CI build path (`scripts/sync-stack.mjs`).
4. `6a10979` (2026-02-08): Fixed client crash and integrated DB sync into build flow (`app/layout.tsx`, `package.json`, `scripts/sync-stack.mjs`).
5. `803a85f` (2026-02-08): Updated dashboard "chart-the-future" panel.
6. `d682678` (2026-02-08): Updated dashboard and API components, including import and thor store route paths.
7. `1694ca1` (2026-02-08): Broad dashboard-area updates across behavior, billing, data, reports, settings, strategies, and teams dashboard routes.
8. `4e02294` (2026-02-08): Removed unused files/components and cleanup across home/dashboard/API/server/config artifacts.
9. `bc03704` (2026-02-08): Updated home page component set and sidebar-related UI files.
10. `9630591` (2026-02-08): Reverted home page sidebar changes in `HomeContent`.
11. `83e7aef` (2026-02-08): Updated home hero metrics and messaging.
12. `4e216b3` (2026-02-08): Added dashboard chart and revised widget/sidebar integration, including widget registry/types.
13. `0aa0889` (2026-02-08): Unified widget shell styling and dashboard UI updates.
14. `2568eb5` (2026-02-08): Reduced dashboard widget grid gap in widget canvas.
15. `e98800d` (2026-02-08): Optimized widget loading via lazy split and fixed mobile summary behavior.
16. `9fd4304` (2026-02-08): Documentation updates plus related dashboard summary adjustments.
17. `3cf798c` (2026-02-08): Refreshed data provider context.
18. `09dba7b` (2026-02-08): Updated French terms localization.
19. `2476e6b` (2026-02-08): Updated English terms localization.
20. `a8219ae` (2026-02-08): Updated `README.md`.
