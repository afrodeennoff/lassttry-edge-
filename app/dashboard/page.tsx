export default function DashboardPage() {
  const cards = [
    { title: "Net PnL", value: "$12,480" },
    { title: "Win Rate", value: "58.2%" },
    { title: "Avg RR", value: "1.47" },
    { title: "Webhook Health", value: "Healthy" }
  ];

  return (
    <div className="space-y-4">
      <header className="rounded-2xl border border-[var(--border)] bg-white p-5">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-slate-600">Widgetized overview with persisted desktop/mobile layouts and version-safe updates.</p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article key={card.title} className="rounded-2xl border border-[var(--border)] bg-white p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">{card.title}</p>
            <p className="mt-2 text-2xl font-bold">{card.value}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
