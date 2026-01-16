export default function PiPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16">
      <div className="space-y-6">
        <p className="text-xs uppercase tracking-[0.4em] text-white/50">
          Pi
        </p>
        <h1 className="text-4xl font-semibold text-white sm:text-5xl">
          π ≈ 3.14159
        </h1>
        <p className="text-white/70">
          Pi is the constant that relates a circle&apos;s circumference to its
          diameter. It anchors circular geometry across physics, engineering, and
          computation.
        </p>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-[1.2fr_1fr]">
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white">What it is</h2>
          <p className="mt-3 text-sm text-white/60">
            π is an irrational constant equal to circumference ÷ diameter. Its
            digits never repeat, yet it reliably describes every circle.
          </p>
        </section>
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white">Why it matters</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-white/60">
            <li>Defines circular motion and wave behavior.</li>
            <li>Enables calculations for area, volume, and rotation.</li>
            <li>Connects geometry to trigonometry and calculus.</li>
          </ul>
        </section>
      </div>
      <div className="mt-10 rounded-2xl border border-dashed border-white/30 bg-white/5 p-10 text-center text-sm uppercase tracking-[0.3em] text-white/50">
        Interactive 3D visualization coming next
      </div>
    </div>
  );
}
