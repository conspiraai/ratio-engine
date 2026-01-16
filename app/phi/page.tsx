import PhiSceneClient from "@/app/phi/PhiSceneClient";

export default function PhiPage() {
  return (
    <div className="min-h-screen bg-[#05060b] px-6 py-20 text-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        <div className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-amber-200/70">
            Phi / Golden Ratio
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            The golden ratio, animated in light and line.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-white/70">
            Phi appears in geometry, growth patterns, and music theory. This
            visualization turns the golden rectangle recursion into a living
            structure—equal parts calm, precise, and luminous.
          </p>
        </div>

        <PhiSceneClient />

        <div className="grid gap-6 text-sm text-white/70 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-base font-semibold text-white">Geometry</h2>
            <p className="mt-3 leading-6">
              Each subdivision honors phi proportions, layering squares and
              rectangles to reveal harmonic balance.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-base font-semibold text-white">Motion</h2>
            <p className="mt-3 leading-6">
              A slow camera drift and responsive parallax keep the construct
              alive without distracting from the math.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
