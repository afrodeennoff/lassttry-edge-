export default function BillingPage() {
  return (
    <div className="space-y-4">
      <header className="rounded-2xl border border-[var(--border)] bg-white p-5">
        <h1 className="text-2xl font-bold">Billing (Whop)</h1>
        <p className="text-sm text-slate-600">Provider abstraction with Whop checkout, team checkout, webhook verification, idempotency, and ledger storage.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-[var(--border)] bg-white p-5">
          <h2 className="font-semibold">Checkout</h2>
          <code className="mt-2 block rounded bg-slate-100 p-2 text-xs">POST /api/whop/checkout</code>
        </article>
        <article className="rounded-2xl border border-[var(--border)] bg-white p-5">
          <h2 className="font-semibold">Team Checkout</h2>
          <code className="mt-2 block rounded bg-slate-100 p-2 text-xs">POST /api/whop/checkout-team</code>
        </article>
      </div>
    </div>
  );
}
