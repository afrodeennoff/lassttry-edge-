import { notFound } from "next/navigation";

async function getShared(slug: string) {
  const base = process.env.APP_URL ?? "http://localhost:3000";
  const res = await fetch(`${base}/api/shared/${slug}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json() as Promise<{ shared: { payload: unknown; viewCount: number; expiresAt: string | null } }>;
}

export default async function SharedPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getShared(slug);
  if (!data) return notFound();

  return (
    <main className="app-shell min-h-screen px-6 py-10">
      <div className="mx-auto max-w-4xl rounded-2xl border border-[var(--border)] bg-white p-6">
        <h1 className="text-2xl font-bold">Shared View</h1>
        <p className="mt-1 text-xs text-slate-500">slug: {slug}</p>
        <pre className="mt-4 overflow-auto rounded-xl bg-slate-100 p-4 text-xs">{JSON.stringify(data.shared.payload, null, 2)}</pre>
        <p className="mt-3 text-sm text-slate-600">Views: {data.shared.viewCount}</p>
      </div>
    </main>
  );
}
