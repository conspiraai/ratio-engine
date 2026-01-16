export default function FibonacciPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16">
      <div className="space-y-6">
        <p className="text-xs uppercase tracking-[0.4em] text-white/50">
          Fibonacci Sequence
        </p>
        <h1 className="text-4xl font-semibold text-white sm:text-5xl">
          1, 1, 2, 3, 5, 8…
        </h1>
        <p className="text-white/70">
          The Fibonacci sequence builds by adding the two previous numbers to get
          the next. As the sequence grows, consecutive ratios converge toward the
          golden ratio.
        </p>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-[1.2fr_1fr]">
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white">What it is</h2>
          <p className="mt-3 text-sm text-white/60">
            A recursive sequence defined by F(n) = F(n-1) + F(n-2), starting with
            1 and 1. It models cumulative growth where each step builds on the
            last two.
          </p>
        </section>
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white">Why it matters</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-white/60">
            <li>Explains spiral phyllotaxis in plants and shells.</li>
            <li>Serves as a bridge between discrete growth and φ.</li>
            <li>Provides a simple model for iterative systems.</li>
          </ul>
        </section>
      </div>
      <div className="mt-10 rounded-2xl border border-dashed border-white/30 bg-white/5 p-10 text-center text-sm uppercase tracking-[0.3em] text-white/50">
        Interactive 3D visualization coming next
      </div>
    </div>
  );
}
