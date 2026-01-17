import Sqrt2SceneClient from "@/app/sqrt-2/Sqrt2SceneClient";

export default function SqrtTwoPage() {
  return (
    <div className="min-h-screen px-6 py-20 text-[var(--fg)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--muted)]">
            √2 / Root-2 Ratio
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            The diagonal that defines the root-2 rectangle.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-[var(--muted)]">
            Root-2 rectangles scale by their diagonal, a system used in ISO
            paper sizes. This scene animates a folding square and recursive
            tiling to keep the geometry tactile and legible.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
          <Sqrt2SceneClient />
          <div className="grid gap-6">
            <div className="glass-card rounded-2xl p-6 text-sm text-[var(--muted)]">
              <h2 className="text-base font-semibold text-[var(--fg)]">
                Math Notes
              </h2>
              <p className="mt-3 leading-6">
                A unit square’s diagonal measures √2, forming the long side of a
                root-2 rectangle. Recursive frames show how the ratio repeats
                under scaling.
              </p>
            </div>
            <div className="glass-card rounded-2xl p-6 text-sm text-[var(--muted)]">
              <h2 className="text-base font-semibold text-[var(--fg)]">
                Interaction
              </h2>
              <p className="mt-3 leading-6">
                Switch between proof and aesthetic modes for slower or faster
                pacing, and adjust the fold to map the square into √2.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
