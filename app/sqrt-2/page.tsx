export default function SqrtTwoPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16">
      <div className="space-y-6">
        <p className="text-xs uppercase tracking-[0.4em] text-white/50">
          Root-2 Ratio
        </p>
        <h1 className="text-4xl font-semibold text-white sm:text-5xl">
          √2 ≈ 1.414
        </h1>
        <p className="text-white/70">
          The root-2 ratio is the diagonal of a unit square. It defines a
          self-similar rectangle that scales cleanly while preserving aspect.
        </p>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-[1.2fr_1fr]">
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white">What it is</h2>
          <p className="mt-3 text-sm text-white/60">
            √2 emerges from the Pythagorean theorem when a square of side 1 has a
            diagonal of length √2. It defines the ISO paper size aspect ratio.
          </p>
        </section>
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white">Why it matters</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-white/60">
            <li>Maintains proportions when scaling rectangular formats.</li>
            <li>Supports modular layouts in design and architecture.</li>
            <li>Highlights geometric relationships in right triangles.</li>
          </ul>
        </section>
      </div>
      <div className="mt-10 rounded-2xl border border-dashed border-white/30 bg-white/5 p-10 text-center text-sm uppercase tracking-[0.3em] text-white/50">
        Interactive 3D visualization coming next
      </div>
    </div>
  );
}
