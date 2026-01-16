import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-10 px-6 py-20">
      <div className="max-w-3xl space-y-6">
        <p className="text-xs uppercase tracking-[0.4em] text-white/50">
          Ratio Engine v1
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          The Ratio Engine
        </h1>
        <p className="text-lg text-white/70">
          Exploring the mathematical ratios that shape nature, growth, and
          harmony.
        </p>
        <p className="text-base leading-relaxed text-white/60">
          Ratio Engine is a guided atlas of the constants that quietly steer
          structure in the natural and designed world. Each ratio is introduced
          with clear context today, then expanded with interactive visuals in the
          next phase.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/ratios"
            className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-slate-900 transition hover:bg-white/90"
          >
            Explore Ratios
          </Link>
          <div className="rounded-full border border-white/20 px-6 py-3 text-xs uppercase tracking-[0.3em] text-white/50">
            Sci-fi minimal
          </div>
        </div>
      </div>
      <div className="grid w-full gap-4 rounded-3xl border border-white/10 bg-white/5 p-8 text-sm text-white/60 sm:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">
            Focus
          </p>
          <p className="mt-3 text-base text-white/80">
            Ratios, constants, and structural patterns.
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">
            Phase
          </p>
          <p className="mt-3 text-base text-white/80">
            Foundation & navigation scaffolding.
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">
            Next
          </p>
          <p className="mt-3 text-base text-white/80">
            Interactive 3D Ratio Engine visualizations.
          </p>
        </div>
      </div>
    </div>
  );
}
