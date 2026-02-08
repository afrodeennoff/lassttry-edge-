# Architecture Decision Record

1. Clean-room implementation only; no code reuse from CC-BY-NC repos.
2. Modular monolith with strict service boundaries and typed contracts.
3. Billing provider abstraction with Stripe/Whop runtime switch.
4. Webhooks processed through idempotency table and persisted event log.
5. Tenant isolation enforced at service layer for user/team/business/org scopes.
6. Security baseline: strict headers, input validation, rate limits, audit logs.
7. Operations baseline: structured logs, metrics hooks, DR and rollback runbooks.
