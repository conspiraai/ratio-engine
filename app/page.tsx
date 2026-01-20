import Link from "next/link";
import SynchronicityCanvas from "@/components/SynchronicityCanvas";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden text-[var(--fg)]">
      <SynchronicityCanvas />
      <div className="relative z-10 flex min-h-screen flex-col justify-between px-6 py-8 lg:px-10">
        <header className="flex items-center justify-between text-xs uppercase tracking-[0.45em] text-[var(--muted)]">
          <span>Ratio Engine</span>
          <div className="flex items-center gap-3 text-[0.6rem]">
            <Link href="/atlas" className="sigil-link">
              Atlas
            </Link>
            <Link href="/atlas/phi" className="sigil-link">
              Phi
            </Link>
          </div>
        </header>

        <main className="max-w-xl space-y-6">
          <p className="text-[0.65rem] uppercase tracking-[0.5em] text-[var(--accent)]">
            Threshold / φ
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-[var(--fg)] sm:text-5xl">
            The ratios listen back.
          </h1>
          <p className="text-base leading-7 text-[var(--muted)]">
            Time folds into sequence. Prime pulses skim the surface. Move slowly,
            and the field reorganizes itself around you.
          </p>
          <div className="flex flex-wrap gap-3 text-[0.65rem] uppercase tracking-[0.35em] text-[var(--muted)]">
            <span className="sigil-chip">Hover</span>
            <span className="sigil-chip">Scroll</span>
            <span className="sigil-chip">Wait</span>
          </div>
        </main>

        <footer className="flex items-center justify-between text-[0.6rem] uppercase tracking-[0.4em] text-[var(--muted)]">
          <span>Field session 00.φ</span>
          <span>Prime-indexed drift active</span>
        </footer>
      </div>
    </div>
  );
}
