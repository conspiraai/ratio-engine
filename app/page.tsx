import Link from "next/link";
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
    <div className="relative min-h-screen text-[var(--fg)]">
      <main className="pointer-events-auto relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-16 lg:px-8">
        <header className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-[var(--muted)]">
          <span>Ratio Engine</span>
          <Link
            href="/atlas"
            className="atlas-badge rounded-full px-4 py-2 text-[0.65rem]"
          >
            Atlas
          </Link>
        </header>
        <section className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="relative z-10 space-y-8">
            <div className="chip inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs tracking-[0.25em]">
              Ratio Engine v2
            </div>
            <div className="space-y-6">
              <h1 className="text-4xl font-semibold leading-tight text-[var(--fg)] sm:text-5xl">
                Harmonize systems with phi-driven intelligence.
              </h1>
              <p className="text-lg text-[var(--muted)]">
                Ratio Engine turns complex streams into an intuitive orchestration
                layer—balancing growth, decay, and resonance in a single
                visualization pipeline.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <button className="btn-primary px-6 py-3 text-sm">
                Launch diagnostic
              </button>
              <button className="btn-secondary px-6 py-3 text-sm">
                View engine logs
              </button>
            </div>
          </div>
          <div className="relative z-0">
            <ThreePhiScene />
          </div>
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
