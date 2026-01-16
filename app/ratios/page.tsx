import Link from "next/link";
import { ratioArtifacts } from "@/app/lib/ratioArtifacts";

export default function RatiosPage() {
  return (
    <div className="min-h-screen px-6 py-20 text-[var(--fg)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--muted)]">
            Ratio Atlas
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Mathematical artifacts for design intelligence.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-[var(--muted)]">
            Step into a library of ratios rendered as glassy, mathematically
            faithful scenes. Each artifact links to an interactive atlas page
            with controls and notes.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {ratioArtifacts.map((artifact) => (
            <Link
              key={artifact.id}
              href={artifact.href}
              className="glass-card group flex h-full flex-col justify-between rounded-2xl p-6 transition duration-300 hover:-translate-y-1 hover:border-[var(--border2)]"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-[var(--fg)]">
                    {artifact.title}
                  </h2>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
                    View
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                  {artifact.description}
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-[var(--border)] pt-4 text-sm text-[var(--muted)]">
                <span className="uppercase tracking-[0.2em]">
                  {artifact.metricLabel}
                </span>
                <span className="text-base text-[var(--fg)]">
                  {artifact.metricValue}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
