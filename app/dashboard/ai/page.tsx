export default function AIPage() {
  const endpoints = [
    "/api/ai/chat",
    "/api/ai/editor",
    "/api/ai/search/date",
    "/api/ai/transcribe",
    "/api/ai/mappings",
    "/api/ai/format-trades",
    "/api/ai/support",
    "/api/ai/weekly-summary"
  ];

  return (
    <div className="space-y-4">
      <header className="rounded-2xl border border-[var(--border)] bg-white p-5">
        <h1 className="text-2xl font-bold">AI Workbench</h1>
        <p className="text-sm text-slate-600">Tool-enabled chat, journal editing, support triage, and weekly analysis generation.</p>
      </header>
      <ul className="grid gap-2 rounded-2xl border border-[var(--border)] bg-white p-5 text-sm">
        {endpoints.map((path) => (
          <li key={path} className="rounded border border-[var(--border)] bg-[var(--muted)] px-3 py-2 font-mono text-xs">{path}</li>
        ))}
      </ul>
    </div>
  );
}
