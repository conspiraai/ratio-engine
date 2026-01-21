import RatioSignalPanel from "@/components/RatioSignalPanel";
import { PHI } from "@/lib/engine/synchronicity";

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
          <RatioSignalPanel
            label="Phi Signal"
            ratio={PHI}
            note="Phi spirals through recursive growth. The signal traces a logarithmic curl anchored in the golden rectangle."
          />
          <div className="grid gap-6">
            <div className="glass-card rounded-2xl p-6 text-sm text-[var(--muted)]">
              <h2 className="text-base font-semibold text-[var(--fg)]">
                Math Notes
              </h2>
              <p className="mt-3 leading-6">
                Phi solves x² = x + 1. Its ratios stabilize across recursive
                sequences, forming a natural limit inside spirals and pentagons.
              </p>
            </div>
            <div className="glass-card rounded-2xl p-6 text-sm text-[var(--muted)]">
              <h2 className="text-base font-semibold text-[var(--fg)]">
                Interaction
              </h2>
              <p className="mt-3 leading-6">
                The canvas reacts to time, shifting orbit radius and spiral
                cadence to suggest harmonic drift.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
