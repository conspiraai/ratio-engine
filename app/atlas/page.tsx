import Link from "next/link";
import { RATIOS } from "@/app/lib/atlas/ratios";

export default function AtlasIndexPage() {
  return (
    <div className="min-h-screen px-6 py-16 text-[var(--fg)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="space-y-6">
          <div className="atlas-badge inline-flex items-center gap-2 rounded-full px-4 py-2 text-[0.7rem] uppercase tracking-[0.4em]">
            Ratio Atlas
          </div>
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            The Ratio Atlas
          </h1>
          <p className="max-w-2xl text-base leading-7 text-[var(--muted)]">
            A curated library of canonical ratios and their visual intelligences.
            Each entry pairs rigorous definition with a signature 3D lattice.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          {RATIOS.map((ratio) => (
            <Link
              key={ratio.id}
              href={`/atlas/${ratio.slug}`}
              className="glass-card group rounded-2xl border border-white/10 p-6 transition hover:border-white/20"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--muted)]">
                    {ratio.title}
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold">
                    {ratio.symbol}
                  </h2>
                  <p className="mt-2 text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                    {ratio.value}
                  </p>
                </div>
                <div className="atlas-badge rounded-full px-4 py-2 text-[0.65rem]">
                  Atlas Entry
                </div>
              </div>
              <p className="mt-4 text-sm uppercase tracking-[0.28em] text-[var(--muted)]">
                {ratio.tagline}
              </p>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                {ratio.summary}
              </p>
              <div className="mt-5 flex flex-wrap gap-2 text-[0.65rem] uppercase tracking-[0.24em] text-[var(--muted)]">
                {ratio.categories.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 px-3 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}
