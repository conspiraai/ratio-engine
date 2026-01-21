"use client";

import { useMemo } from "react";
import {
  PHI,
  fibonacciSequence,
  primeIndexed,
  primeSieve,
  timeBasedRatio,
} from "@/lib/engine/synchronicity";
import { useSynchronicityEngine } from "@/app/lib/hooks/useSynchronicityEngine";

type SynchronicityPanelProps = {
  value: number;
  slug: string;
};

const formatValue = (value: number, digits = 6) =>
  Number.isFinite(value) ? value.toFixed(digits) : "—";

export default function SynchronicityPanel({
  value,
  slug,
}: SynchronicityPanelProps) {
  const { time } = useSynchronicityEngine();

  const fibSequence = useMemo(() => fibonacciSequence(9), []);
  const primes = useMemo(() => primeSieve(29), []);
  const primeFibs = useMemo(
    () => primeIndexed(fibSequence, primes),
    [fibSequence, primes],
  );

  const drift = useMemo(() => timeBasedRatio(time / 1000), [time]);
  const ratioShift = value ? value / PHI : 0;

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-center justify-between text-[0.65rem] uppercase tracking-[0.36em] text-[var(--muted)]">
        <span>Synchronicities</span>
        <span>{slug.replace(/-/g, " ")}</span>
      </div>
      <div className="mt-4 grid gap-4 text-sm text-[var(--fg)] md:grid-cols-2">
        <div>
          <p className="text-[0.6rem] uppercase tracking-[0.32em] text-[var(--muted)]">
            Phi Drift
          </p>
          <p className="mt-2 text-lg font-semibold">{formatValue(drift)}</p>
        </div>
        <div>
          <p className="text-[0.6rem] uppercase tracking-[0.32em] text-[var(--muted)]">
            Ratio Shift
          </p>
          <p className="mt-2 text-lg font-semibold">{formatValue(ratioShift)}</p>
        </div>
        <div>
          <p className="text-[0.6rem] uppercase tracking-[0.32em] text-[var(--muted)]">
            Fibonacci Gate
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
            {fibSequence.join(" · ")}
          </p>
        </div>
        <div>
          <p className="text-[0.6rem] uppercase tracking-[0.32em] text-[var(--muted)]">
            Prime Index
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
            {primeFibs.join(" · ")}
          </p>
        </div>
      </div>
    </section>
  );
}
