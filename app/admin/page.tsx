export default function AdminPage() {
  return (
    <main className="app-shell min-h-screen px-6 py-10">
      <div className="mx-auto max-w-5xl space-y-4">
        <header className="rounded-2xl border border-[var(--border)] bg-white p-6">
          <h1 className="text-3xl font-bold">Admin Control</h1>
          <p className="text-sm text-slate-600">Subscription reporting, weekly recap generation, newsletter operations, and incident-ready governance.</p>
        </header>
        <section className="grid gap-4 sm:grid-cols-2">
          <article className="rounded-2xl border border-[var(--border)] bg-white p-5">
            <h2 className="font-semibold">Reporting</h2>
            <code className="mt-2 block rounded bg-slate-100 p-2 text-xs">GET /api/admin/reports?teamId=...</code>
          </article>
          <article className="rounded-2xl border border-[var(--border)] bg-white p-5">
            <h2 className="font-semibold">Comms</h2>
            <code className="mt-2 block rounded bg-slate-100 p-2 text-xs">POST /api/email/newsletter/send, /api/email/welcome</code>
          </article>
        </section>
      </div>
    </main>
  );
}
