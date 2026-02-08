export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="app-shell min-h-screen px-4 py-6 sm:px-6">
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-[220px_1fr]">
        <aside className="rounded-2xl border border-[var(--border)] bg-white p-4">
          <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--brand-strong)]">Aegis Console</h2>
          <nav className="mt-3 grid gap-2 text-sm">
            <a href="/dashboard">Overview</a>
            <a href="/dashboard/import">Imports</a>
            <a href="/dashboard/journal">Journal</a>
            <a href="/dashboard/analytics">Analytics</a>
            <a href="/dashboard/ai">AI</a>
            <a href="/dashboard/team">Team</a>
            <a href="/dashboard/billing">Billing</a>
            <a href="/dashboard/settings">Settings</a>
          </nav>
        </aside>
        <section>{children}</section>
      </div>
    </main>
  );
}
