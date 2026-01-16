import FibonacciSceneClient from "@/app/fibonacci/FibonacciSceneClient";

export default function FibonacciPage() {
  return (
    <div className="min-h-screen px-6 py-20 text-[var(--fg)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--muted)]">
            Fibonacci Sequence
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Discrete growth that turns into spirals.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-[var(--muted)]">
            The Fibonacci sequence drives natural growth patterns. Switch
            between lattice points, rectangle recursion, and spiral motion to
            see the sequence spatially.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
          <FibonacciSceneClient />
          <div className="grid gap-6">
            <div className="glass-card rounded-2xl p-6 text-sm text-[var(--muted)]">
              <h2 className="text-base font-semibold text-[var(--fg)]">
                Math Notes
              </h2>
              <p className="mt-3 leading-6">
                Each term is the sum of its two predecessors, giving rise to
                self-similar rectangles and spirals. Scaling by successive
                terms approximates the golden ratio.
              </p>
            </div>
            <div className="glass-card rounded-2xl p-6 text-sm text-[var(--muted)]">
              <h2 className="text-base font-semibold text-[var(--fg)]">
                Interaction
              </h2>
              <p className="mt-3 leading-6">
                Increase the term count to watch the spiral refine, or switch
                modes to compare lattice, spiral, and rectangle recursion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
