import PhiSceneClient from "@/app/phi/PhiSceneClient";

export default function PhiPage() {
  return (
    <div className="min-h-screen px-6 py-20 text-[var(--fg)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--muted)]">
            Phi / Golden Ratio
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Phi as a living atlas of growth.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-[var(--muted)]">
            The golden ratio governs spirals in nature and harmonic proportion
            in design. Here it becomes a phyllotaxis field with golden rectangle
            recursion, rendered as a glassy, luminous artifact.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
          <PhiSceneClient />
          <div className="grid gap-6">
            <div className="glass-card rounded-2xl p-6 text-sm text-[var(--muted)]">
              <h2 className="text-base font-semibold text-[var(--fg)]">
                Math Notes
              </h2>
              <p className="mt-3 leading-6">
                Points follow the golden angle (~137.507764°), distributing
                evenly without radial alignment. The frame stack traces a golden
                rectangle recursion, revealing the φ proportion in layered
                space.
              </p>
            </div>
            <div className="glass-card rounded-2xl p-6 text-sm text-[var(--muted)]">
              <h2 className="text-base font-semibold text-[var(--fg)]">
                Interaction
              </h2>
              <p className="mt-3 leading-6">
                Increase density to reveal the sunflower-like packing. Adjust
                recursion depth with the slider or scroll wheel to deepen the
                golden frame stack.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
