import ESceneClient from "@/app/e/ESceneClient";

export default function EPage() {
  return (
    <div className="min-h-screen px-6 py-20 text-[var(--fg)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--muted)]">
            e / Euler&apos;s Number
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Continuous compounding in glass and motion.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-[var(--muted)]">
            Euler&apos;s number defines exponential growth, decay, and natural
            logarithms. This scene morphs between exp and ln curves while
            particles flow along the gradient.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
          <ESceneClient />
          <div className="grid gap-6">
            <div className="glass-card rounded-2xl p-6 text-sm text-[var(--muted)]">
              <h2 className="text-base font-semibold text-[var(--fg)]">
                Math Notes
              </h2>
              <p className="mt-3 leading-6">
                Continuous compounding grows by a factor of e over a unit
                interval. Morphing toward logarithms shows how exp and ln are
                inverse maps on the same axis.
              </p>
            </div>
            <div className="glass-card rounded-2xl p-6 text-sm text-[var(--muted)]">
              <h2 className="text-base font-semibold text-[var(--fg)]">
                Interaction
              </h2>
              <p className="mt-3 leading-6">
                Adjust the morph to shift from explosive growth to compressed
                logs. Increase particle flow to accentuate the rate of change.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
