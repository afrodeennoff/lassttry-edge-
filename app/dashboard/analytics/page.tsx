export default function AnalyticsPage() {
  return (
    <div className="space-y-4">
      <header className="rounded-2xl border border-[var(--border)] bg-white p-5">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-slate-600">Global, account, instrument, and time-of-day performance with MAE/MFE and efficiency metrics.</p>
      </header>
      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-[var(--border)] bg-white p-5">
          <h2 className="font-semibold">Global Summary</h2>
          <code className="mt-2 block rounded bg-slate-100 p-2 text-xs">GET /api/analytics/global</code>
        </article>
        <article className="rounded-2xl border border-[var(--border)] bg-white p-5">
          <h2 className="font-semibold">Session Distribution</h2>
          <code className="mt-2 block rounded bg-slate-100 p-2 text-xs">GET /api/analytics/time-of-day</code>
        </article>
      </section>
    </div>
  );
}
