export default function JournalPage() {
  return (
    <div className="space-y-4">
      <header className="rounded-2xl border border-[var(--border)] bg-white p-5">
        <h1 className="text-2xl font-bold">Trading Journal</h1>
        <p className="text-sm text-slate-600">Track trades, orders, payouts, tags, moods, and notes with strict account ownership checks.</p>
      </header>
      <section className="rounded-2xl border border-[var(--border)] bg-white p-5">
        <p className="text-sm">Create and manage entries using the APIs:</p>
        <code className="mt-2 block rounded bg-slate-100 p-2 text-xs">POST /api/trades, /api/orders, /api/payouts, /api/moods, /api/tags</code>
      </section>
    </div>
  );
}
