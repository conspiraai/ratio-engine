import FeatureCard from "@/components/FeatureCard";
import MetricCard from "@/components/MetricCard";
import ThreePhiScene from "@/components/ThreePhiScene";

const features = [
  {
    title: "Ratio inference",
    description:
      "Track emergent patterns across datasets with harmonic convergence and phi-weighted sampling.",
    icon: "φ",
  },
  {
    title: "Signal choreography",
    description:
      "Blend multi-modal feeds into a coherent resonance map using v2 engine synchronization.",
    icon: "✦",
  },
  {
    title: "Scenario synthesis",
    description:
      "Preview the impact of ratio shifts with adaptive simulations and time-scaled projections.",
    icon: "△",
  },
];

const metrics = [
  {
    label: "Phi drift",
    value: "0.618",
    note: "Golden ratio alignment across concurrent layers.",
  },
  {
    label: "Signal variance",
    value: "±2.3%",
    note: "Stabilized entropy with predictive balancing.",
  },
  {
    label: "Event horizon",
    value: "64ms",
    note: "Real-time feedback loop for responsive tuning.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-16 lg:px-8">
        <section className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.25em] text-slate-200">
              Ratio Engine v2
            </div>
            <div className="space-y-6">
              <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
                Harmonize systems with phi-driven intelligence.
              </h1>
              <p className="text-lg text-slate-300">
                Ratio Engine turns complex streams into an intuitive orchestration
                layer—balancing growth, decay, and resonance in a single
                visualization pipeline.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <button className="rounded-full bg-sky-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_25px_rgba(56,189,248,0.5)] transition hover:bg-sky-300">
                Launch diagnostic
              </button>
              <button className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/80 transition hover:border-white/40 hover:text-white">
                View engine logs
              </button>
            </div>
          </div>
          <ThreePhiScene />
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {metrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </section>
      </main>
    </div>
  );
}
