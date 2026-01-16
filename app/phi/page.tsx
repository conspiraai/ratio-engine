export default function PhiPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16">
      <div className="space-y-6">
        <p className="text-xs uppercase tracking-[0.4em] text-white/50">
          Golden Ratio
        </p>
        <h1 className="text-4xl font-semibold text-white sm:text-5xl">
          φ ≈ 1.618
        </h1>
        <p className="text-white/70">
          The golden ratio is a proportion where the whole relates to the larger
          part as the larger part relates to the smaller. It emerges in growth
          patterns, architecture, and composition when balance feels natural.
        </p>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-[1.2fr_1fr]">
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white">What it is</h2>
          <p className="mt-3 text-sm text-white/60">
            The ratio φ (phi) equals roughly 1.618 and is defined by the equation
            (a + b) / a = a / b. It often appears as an ideal relationship between
            parts of a whole.
          </p>
        </section>
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white">Why it matters</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-white/60">
            <li>Guides natural growth patterns like shells and spirals.</li>
            <li>Supports visual harmony in design and architecture.</li>
            <li>Connects to the Fibonacci sequence as a limiting ratio.</li>
          </ul>
        </section>
      </div>
      <div className="mt-10 rounded-2xl border border-dashed border-white/30 bg-white/5 p-10 text-center text-sm uppercase tracking-[0.3em] text-white/50">
        Interactive 3D visualization coming next
      </div>
    </div>
  );
}
