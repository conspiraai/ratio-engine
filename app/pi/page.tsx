import PiSceneClient from "@/app/pi/PiSceneClient";

export default function PiPage() {
  return (
    <div className="min-h-screen px-6 py-20 text-[var(--fg)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--muted)]">
            π / Circle Constant
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Polygonal approximations and the unwrapped circumference.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-[var(--muted)]">
            π lives in the ratio between a circle’s circumference and diameter.
            This scene layers polygonal proxies, a ribbon unwrapping the arc,
            and interference rings for depth.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
          <PiSceneClient />
          <div className="grid gap-6">
            <div className="glass-card rounded-2xl p-6 text-sm text-[var(--muted)]">
              <h2 className="text-base font-semibold text-[var(--fg)]">
                Math Notes
              </h2>
              <p className="mt-3 leading-6">
                As polygon sides increase, the perimeter approaches the circle,
                mirroring how π is computed via limits. The ribbon maps arc
                length to a straight line of the same length.
              </p>
            </div>
            <div className="glass-card rounded-2xl p-6 text-sm text-[var(--muted)]">
              <h2 className="text-base font-semibold text-[var(--fg)]">
                Interaction
              </h2>
              <p className="mt-3 leading-6">
                Use the side count to watch convergence and toggle unwrapping
                to compare the circumference against a straight measure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
