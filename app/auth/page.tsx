export default function AuthPage() {
  return (
    <main className="app-shell min-h-screen px-6 py-10">
      <div className="mx-auto max-w-xl rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold">Authentication</h1>
        <p className="mt-2 text-sm text-slate-600">Use your SSO provider or magic link. During local development, pass `x-user-id` header to API requests.</p>
        <form className="mt-6 grid gap-3">
          <label className="text-sm font-semibold" htmlFor="email">Email</label>
          <input id="email" className="rounded-lg border border-[var(--border)] px-3 py-2" type="email" placeholder="trader@example.com" />
          <button type="button" className="mt-2 rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white">Send Magic Link</button>
        </form>
      </div>
    </main>
  );
}
