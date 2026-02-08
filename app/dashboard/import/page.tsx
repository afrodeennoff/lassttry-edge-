const providers = ["Tradovate", "Rithmic", "IBKR PDF", "NinjaTrader", "ATAS", "FTMO", "Topstep", "Tradezella", "Quantower", "Manual", "ETP", "Thor"];

export default function ImportPage() {
  return (
    <div className="space-y-4">
      <header className="rounded-2xl border border-[var(--border)] bg-white p-5">
        <h1 className="text-2xl font-bold">Imports & Sync</h1>
        <p className="text-sm text-slate-600">Adapter registry with AI mapping and normalization for unknown formats.</p>
      </header>
      <div className="rounded-2xl border border-[var(--border)] bg-white p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--brand-strong)]">Providers</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {providers.map((name) => (
            <span key={name} className="rounded-full border border-[var(--border)] bg-[var(--muted)] px-3 py-1 text-xs font-semibold">{name}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
