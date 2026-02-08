export default function TeamPage() {
  return (
    <div className="space-y-4">
      <header className="rounded-2xl border border-[var(--border)] bg-white p-5">
        <h1 className="text-2xl font-bold">Collaboration</h1>
        <p className="text-sm text-slate-600">Teams, businesses, organizations, invitations, roles, and team analytics.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-[var(--border)] bg-white p-5">
          <h2 className="font-semibold">Team APIs</h2>
          <code className="mt-2 block rounded bg-slate-100 p-2 text-xs">POST /api/teams/invite, /api/teams/accept-invitation</code>
        </article>
        <article className="rounded-2xl border border-[var(--border)] bg-white p-5">
          <h2 className="font-semibold">Business/Org APIs</h2>
          <code className="mt-2 block rounded bg-slate-100 p-2 text-xs">POST /api/business/invite, /api/organizations/invite</code>
        </article>
      </div>
    </div>
  );
}
