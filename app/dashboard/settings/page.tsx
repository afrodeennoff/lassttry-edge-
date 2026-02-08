export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <header className="rounded-2xl border border-[var(--border)] bg-white p-5">
        <h1 className="text-2xl font-bold">Security & Settings</h1>
        <p className="text-sm text-slate-600">Tenant isolation, secure headers, rate limits, and audit logging controls.</p>
      </header>
      <ul className="grid gap-2 rounded-2xl border border-[var(--border)] bg-white p-5 text-sm text-slate-700">
        <li>CSRF/CORS constraints configured in proxy and route handlers.</li>
        <li>Header hardening: frame deny, content-type no-sniff, referrer policy.</li>
        <li>Critical actions tracked in audit logs.</li>
      </ul>
    </div>
  );
}
