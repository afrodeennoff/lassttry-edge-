# Combined Parity Matrix (Clean-Room)

## Route-level
- Marketing, auth, onboarding, dashboard, import, analytics, team/business/org pages
- Billing management pages with provider abstraction
- Shared/public slug analytics views

## API-level
- Trading: accounts/trades/payouts/orders/groups/tags/mood/notifications
- Imports: tradovate, rithmic, IBKR OCR/extract/FIFO, adapter registry for all providers
- AI: chat/editor/date-search/transcription/mapping/support triage/weekly summary
- Billing: checkout/team-checkout/webhooks/subscriptions/admin reports
- Admin: newsletter/welcome/unsubscribe/recap/reporting

## Model-level
- Full trading entities + layout version history + collaboration graph
- Billing ledger: subscriptions, transactions, invoices, refunds, processed webhooks
- Operations: audit logs, usage metrics, sync jobs, import jobs

## Service-level
- Thin handlers, domain services, provider adapters, tenancy guards, webhook worker

## Webhook event-level
- Stripe: checkout/session/subscription/invoice/payment events
- Whop: membership/payment/invoice lifecycle events
- Shared: signature verification, idempotency lock, event persistence, retry-safe processing

## Integration/provider-level
- Stripe and Whop through single billing contract
- Tradovate, Rithmic, IBKR pipeline, ETP, Thor, file adapters
- OpenAI + email + object storage integration points
