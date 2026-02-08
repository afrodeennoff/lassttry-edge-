export default function OnboardingPage() {
  return (
    <main className="app-shell min-h-screen px-6 py-10">
      <div className="mx-auto max-w-3xl rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold">Onboarding</h1>
        <ol className="mt-4 grid gap-3 text-sm text-slate-700">
          <li>1. Create your first account and base currency.</li>
          <li>2. Connect imports (Tradovate, Rithmic, IBKR PDF, or CSV adapters).</li>
          <li>3. Configure team/business roles and invite members.</li>
          <li>4. Choose Whop plan and verify webhook processing.</li>
        </ol>
        <div className="mt-6 flex flex-wrap gap-3">
          <a className="rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white" href="/dashboard/import">Go to Imports</a>
          <a className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-semibold" href="/dashboard/billing">Go to Billing</a>
        </div>
      </div>
    </main>
  );
}
