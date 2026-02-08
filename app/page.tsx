import { getCopy } from "@/lib/i18n";

const features = [
  "AI chat, editor, summary, support triage",
  "Trading journal with MAE/MFE and risk analytics",
  "Teams, businesses, organizations, and role controls",
  "Whop checkout + webhook idempotency and entitlement sync",
  "Audit logs, admin reporting, and cron-based reliability jobs"
] as const;

export default async function Home() {
  const { t, lang } = await getCopy();

  return (
    <main className="app-shell min-h-screen text-slate-900">
      <section className="mx-auto max-w-6xl px-6 py-10 sm:py-14">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/90 px-4 py-3 backdrop-blur">
          <div className="text-sm font-bold tracking-wide text-[var(--brand-strong)]">Aegis Journal</div>
          <nav className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
            <a href="/" className="hover:text-[var(--brand-strong)]">{t.nav.product}</a>
            <a href="/auth" className="hover:text-[var(--brand-strong)]">{t.nav.auth}</a>
            <a href="/onboarding" className="hover:text-[var(--brand-strong)]">{t.nav.onboarding}</a>
            <a href="/dashboard" className="hover:text-[var(--brand-strong)]">{t.nav.dashboard}</a>
            <a href="/admin" className="hover:text-[var(--brand-strong)]">{t.nav.admin}</a>
          </nav>
        </header>

        <p className="mb-4 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-700">
          {lang === "fr" ? "Pret pour lancement" : "Launch-ready"}
        </p>
        <h1 className="max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
          {t.heroTitle}
        </h1>
        <p className="mt-6 max-w-3xl text-lg text-slate-700">{t.heroSubtitle}</p>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {features.map((feature) => (
            <article key={feature} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-[var(--brand-strong)]">Capability</h2>
              <p className="mt-2 text-slate-700">{feature}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <a href="/dashboard" className="rounded-xl bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--brand-strong)]">
            {t.ctaPrimary}
          </a>
          <a href="/onboarding" className="rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-[var(--muted)]">
            {t.ctaSecondary}
          </a>
          <a href="/api/health" className="rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-[var(--muted)]">
            API Health
          </a>
        </div>
      </section>
    </main>
  );
}
