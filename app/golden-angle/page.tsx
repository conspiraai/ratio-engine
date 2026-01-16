export default function GoldenAnglePage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16">
      <div className="space-y-6">
        <p className="text-xs uppercase tracking-[0.4em] text-white/50">
          Golden Angle
        </p>
        <h1 className="text-4xl font-semibold text-white sm:text-5xl">
          ≈ 137.5°
        </h1>
        <p className="text-white/70">
          The golden angle is the rotation that divides a circle according to the
          golden ratio. It distributes elements evenly around a center point.
        </p>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-[1.2fr_1fr]">
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white">What it is</h2>
          <p className="mt-3 text-sm text-white/60">
            Calculated as 360° × (1 - 1/φ), the golden angle is about 137.5°. It
            maximizes spacing in radial growth patterns.
          </p>
        </section>
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white">Why it matters</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-white/60">
            <li>Explains spiral seed patterns in sunflowers and pinecones.</li>
            <li>Optimizes packing efficiency around a stem or axis.</li>
            <li>Shows how φ informs angular distribution in nature.</li>
          </ul>
        </section>
      </div>
      <div className="mt-10 rounded-2xl border border-dashed border-white/30 bg-white/5 p-10 text-center text-sm uppercase tracking-[0.3em] text-white/50">
        Interactive 3D visualization coming next
      </div>
    </div>
  );
}
