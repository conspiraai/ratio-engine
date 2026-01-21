"use client";

import { useMemo } from "react";
import { PHI, primeIndexed } from "@/lib/engine/synchronicity";
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
  const { phiRatio, fibSequence, primes, pointer, scrollRatio } =
    useSynchronicityEngine();

  const primeFibs = useMemo(
    () => primeIndexed(fibSequence, primes),
    [fibSequence, primes],
  );

  const ratioShift = value ? value / PHI : 0;
  const phase = (pointer.x + pointer.y) / 2;
  const primeGaps = useMemo(
    () =>
      primes
        .slice(0, 6)
        .map((prime, index, list) =>
          index === list.length - 1
            ? null
            : `${prime}→${list[index + 1]}(+${list[index + 1] - prime})`,
        )
        .filter((gap): gap is string => gap !== null),
    [primes],
  );

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-center justify-between text-[0.65rem] uppercase tracking-[0.36em] text-[var(--muted)]">
        <span>Synchronicities</span>
        <span>{slug.replace(/-/g, " ")}</span>
      </div>
      <div className="mt-4 grid gap-4 text-sm text-[var(--fg)] md:grid-cols-2">
        <div>
          <p className="text-[0.6rem] uppercase tracking-[0.32em] text-[var(--muted)]">
            Phi Constant
          </p>
          <p className="mt-2 text-lg font-semibold">{formatValue(PHI, 6)}</p>
        </div>
        <div>
          <p className="text-[0.6rem] uppercase tracking-[0.32em] text-[var(--muted)]">
            Phi Modulation
          </p>
          <p className="mt-2 text-lg font-semibold">
            {formatValue(phiRatio, 6)}
          </p>
        </div>
        <div>
          <p className="text-[0.6rem] uppercase tracking-[0.32em] text-[var(--muted)]">
            Ratio Shift
          </p>
          <p className="mt-2 text-lg font-semibold">{formatValue(ratioShift)}</p>
        </div>
        <div>
          <p className="text-[0.6rem] uppercase tracking-[0.32em] text-[var(--muted)]">
            Phase / Depth
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
            φ{formatValue(phase, 3)} · d{formatValue(scrollRatio, 2)}
          </p>
        </div>
        <div>
          <p className="text-[0.6rem] uppercase tracking-[0.32em] text-[var(--muted)]">
            Fibonacci Gate
          </p>
          <div className="mt-2 flex flex-wrap gap-2 text-[0.65rem] uppercase tracking-[0.3em] text-[var(--muted)]">
            {fibSequence.map((entry, index) => {
              const isPrimeIndex = primes.includes(index + 1);
              return (
                <span
                  key={`${entry}-${index}`}
                  className={isPrimeIndex ? "text-[var(--fg)]" : ""}
                >
                  {entry}
                </span>
              );
            })}
          </div>
        </div>
        <div>
          <p className="text-[0.6rem] uppercase tracking-[0.32em] text-[var(--muted)]">
            Prime Index
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
            {primeFibs.join(" · ")}
          </p>
        </div>
        <div>
          <p className="text-[0.6rem] uppercase tracking-[0.32em] text-[var(--muted)]">
            Prime Gaps
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
            {primeGaps.join(" · ")}
          </p>
        </div>
      </div>
    </section>
  );
}
