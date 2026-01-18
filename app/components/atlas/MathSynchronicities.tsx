"use client";

import { useEffect, useMemo, useState } from "react";
import {
  buildSynchronicities,
  SynchronicityConvergent,
  SynchronicityNeighbor,
  SynchronicityTransform,
} from "@/app/lib/atlas/synchronicities";

type MathSynchronicitiesProps = {
  value: number;
  slug: string;
  label?: string;
};

const hashSeed = (input: string) =>
  Array.from(input).reduce((acc, char) => acc + char.charCodeAt(0), 0);

const mulberry32 = (seed: number) => () => {
  let value = seed + 0x6d2b79f5;
  value = Math.imul(value ^ (value >>> 15), value | 1);
  value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
  return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
};

const formatValue = (value: number, digits = 6) => {
  if (!Number.isFinite(value)) {
    return "—";
  }
  if (Math.abs(value) < 1e-4) {
    return value.toExponential(2);
  }
  return value.toFixed(digits);
};

const renderConvergent = (
  convergent: SynchronicityConvergent,
  reveal: boolean,
) =>
  reveal
    ? `${convergent.p}/${convergent.q} = ${formatValue(
        convergent.approx,
        8,
      )} (Δ ${formatValue(convergent.error, 6)})`
    : `${convergent.p}/${convergent.q}`;

const renderNeighbor = (neighbor: SynchronicityNeighbor, reveal: boolean) =>
  reveal
    ? `${neighbor.p}/${neighbor.q} Δ ${formatValue(neighbor.delta, 6)}`
    : `${neighbor.p}/${neighbor.q}`;

const renderTransform = (
  transform: SynchronicityTransform,
  reveal: boolean,
) =>
  reveal
    ? `${transform.label}: ${formatValue(transform.value, 6)}`
    : transform.label;

export default function MathSynchronicities({
  value,
  slug,
  label = "Mathematical Synchronicities",
}: MathSynchronicitiesProps) {
  const [reveal, setReveal] = useState(false);
  const [scanActive, setScanActive] = useState(false);
  const [scanTick, setScanTick] = useState(0);

  const data = useMemo(() => buildSynchronicities(value, slug), [value, slug]);
  const seed = useMemo(() => hashSeed(slug), [slug]);

  useEffect(() => {
    if (!scanActive) {
      return;
    }

    setScanTick(0);
    let tick = 0;
    const interval = setInterval(() => {
      tick += 1;
      setScanTick(tick);
      if (tick >= 4) {
        setScanActive(false);
      }
    }, 2400);

    return () => clearInterval(interval);
  }, [scanActive, slug]);

  const scanFocus = useMemo(() => {
    const random = mulberry32(seed + scanTick * 101);
    return {
      convergent: Math.floor(random() * data.convergents.length),
      neighbor: Math.floor(random() * data.harmonicNeighbors.length),
      transform: Math.floor(random() * data.transforms.length),
    };
  }, [
    data.convergents.length,
    data.harmonicNeighbors.length,
    data.transforms.length,
    seed,
    scanTick,
  ]);

  const continuedFraction = data.continuedFractionTerms.length
    ? `[${data.continuedFractionTerms[0]}; ${data.continuedFractionTerms
        .slice(1)
        .join(", ")}]`
    : "—";

  return (
    <section
      id="synchronicities"
      className="glass-card rounded-2xl border border-white/10 p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-[var(--muted)]">
            SIGNAL FIELD
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-[var(--fg)]">
            {label}
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.3em]">
          <button
            type="button"
            onClick={() => setScanActive((prev) => !prev)}
            className="rounded-full border border-white/15 px-4 py-2 text-[0.65rem] text-[var(--muted)] transition hover:text-[var(--fg)]"
          >
            {scanActive ? "Scan: Active" : "Scan"}
          </button>
          <button
            type="button"
            onClick={() => setReveal((prev) => !prev)}
            className="rounded-full border border-white/15 px-4 py-2 text-[0.65rem] text-[var(--muted)] transition hover:text-[var(--fg)]"
          >
            {reveal ? "Hide" : "Reveal"}
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div className="rounded-xl border border-white/10 p-4">
            <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[var(--muted)]">
              CONTINUED FRACTION
            </p>
            <p className="mt-3 text-sm text-[var(--fg)]">{continuedFraction}</p>
          </div>
          <div className="rounded-xl border border-white/10 p-4">
            <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[var(--muted)]">
              CONVERGENT LOCK
            </p>
            <ul className="mt-3 space-y-2 text-xs uppercase tracking-[0.25em] text-[var(--muted)]">
              {data.convergents.map((convergent, index) => (
                <li
                  key={`${convergent.p}-${convergent.q}`}
                  className={`rounded-md border border-white/5 px-3 py-2 transition ${
                    scanActive && scanFocus.convergent === index
                      ? "border-white/30 text-[var(--fg)] animate-pulse"
                      : ""
                  }`}
                >
                  {renderConvergent(convergent, reveal)}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-white/10 p-4">
            <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[var(--muted)]">
              HARMONIC NEIGHBORS
            </p>
            <ul className="mt-3 grid grid-cols-2 gap-2 text-xs uppercase tracking-[0.25em] text-[var(--muted)]">
              {data.harmonicNeighbors.map((neighbor, index) => (
                <li
                  key={`${neighbor.p}-${neighbor.q}`}
                  className={`rounded-md border border-white/5 px-3 py-2 transition ${
                    scanActive && scanFocus.neighbor === index
                      ? "border-white/30 text-[var(--fg)] animate-pulse"
                      : ""
                  }`}
                >
                  {renderNeighbor(neighbor, reveal)}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-white/10 p-4">
            <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[var(--muted)]">
              POWER / ROOT ARRAY
            </p>
            <ul className="mt-3 space-y-2 text-xs uppercase tracking-[0.25em] text-[var(--muted)]">
              {data.transforms.map((transform, index) => (
                <li
                  key={transform.label}
                  className={`flex items-center justify-between gap-2 rounded-md border border-white/5 px-3 py-2 transition ${
                    scanActive && scanFocus.transform === index
                      ? "border-white/30 text-[var(--fg)] animate-pulse"
                      : ""
                  }`}
                >
                  <span>{renderTransform(transform, reveal)}</span>
                  <span className="text-[0.6rem] text-[var(--muted)]">
                    {transform.hint}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {data.note ? (
        <div className="mt-6 rounded-xl border border-white/10 px-4 py-3 text-[0.65rem] uppercase tracking-[0.36em] text-[var(--muted)]">
          {data.note}
        </div>
      ) : null}
    </section>
  );
}
