import Link from "next/link";
import SynchronicityField from "@/components/SynchronicityField";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden text-[var(--fg)]">
      <SynchronicityField />
      <main className="pointer-events-auto relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-16 lg:px-8">
        <header className="flex items-center justify-between text-[0.7rem] uppercase tracking-[0.45em] text-[var(--muted)]">
          <span>Ratio Engine</span>
          <nav className="flex items-center gap-3">
            <Link
              href="/atlas"
              className="atlas-badge rounded-full px-4 py-2 text-[0.6rem]"
            >
              Atlas
            </Link>
            <Link
              href="/atlas/phi"
              className="rounded-full border border-white/10 px-4 py-2 text-[0.6rem] text-[var(--muted)] transition hover:text-[var(--fg)]"
            >
              Diagnostics
            </Link>
          </nav>
        </header>
        <section className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-8">
            <div className="chip inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs tracking-[0.35em]">
              FIELD NODE / v3
            </div>
            <div className="space-y-6">
              <h1 className="text-4xl font-semibold leading-tight text-[var(--fg)] sm:text-5xl">
                Ratio Engine monitors the quiet harmonics behind motion.
              </h1>
              <p className="text-lg text-[var(--muted)]">
                A cryptic interface for observing emergent sequences, phase drift,
                and prime-indexed resonance without revealing the source.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/atlas/phi" className="btn-primary px-6 py-3 text-sm">
                Initiate field read
              </Link>
              <Link href="/atlas" className="btn-secondary px-6 py-3 text-sm">
                Enter atlas
              </Link>
            </div>
          </div>
          <div className="glass-card rounded-3xl border border-white/10 p-6 text-[0.7rem] uppercase tracking-[0.4em] text-[var(--muted)]">
            <p>Signal lattice online.</p>
            <p className="mt-4 text-2xl font-semibold text-[var(--fg)]">
              φ / π / √2 / √3
            </p>
            <p className="mt-3 text-xs text-[var(--muted)]">
              Residual cycles stabilize when sequences converge.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
