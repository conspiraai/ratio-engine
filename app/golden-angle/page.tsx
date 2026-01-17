import GoldenAngleSceneClient from "@/app/golden-angle/GoldenAngleSceneClient";

export default function GoldenAnglePage() {
  return (
    <div className="min-h-screen px-6 py-20 text-[var(--fg)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--muted)]">
            Golden Angle
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            A gap that never repeats.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-[var(--muted)]">
            The golden angle partitions a circle into a persistent offset. This
            instrument renders the 137.5° arc, rotating spokes, and optional
            phyllotaxis packing to show how the gap stays open.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
          <GoldenAngleSceneClient />
          <div className="grid gap-6">
            <div className="glass-card rounded-2xl p-6 text-sm text-[var(--muted)]">
              <h2 className="text-base font-semibold text-[var(--fg)]">
                Math Notes
              </h2>
              <p className="mt-3 leading-6">
                The golden angle divides a circle by the inverse of φ, leaving
                a 137.5° arc that never aligns with full rotations.
              </p>
            </div>
            <div className="glass-card rounded-2xl p-6 text-sm text-[var(--muted)]">
              <h2 className="text-base font-semibold text-[var(--fg)]">
                Interaction
              </h2>
              <p className="mt-3 leading-6">
                Increase the spoke count to watch the non-repeating spacing and
                toggle phyllotaxis to see the packing it generates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
