"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  PHI,
  primeIndexed,
  timeBasedRatio,
} from "@/lib/engine/synchronicity";
import { useSynchronicityEngine } from "@/app/lib/hooks/useSynchronicityEngine";

const formatValue = (value: number, digits = 4) =>
  Number.isFinite(value) ? value.toFixed(digits) : "—";

type CanvasSize = {
  width: number;
  height: number;
  dpr: number;
};

export default function SynchronicityField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const sizeRef = useRef<CanvasSize>({ width: 0, height: 0, dpr: 1 });
  const { time, phiRatio, fibSequence, primes, pointer, scrollRatio } =
    useSynchronicityEngine();

  const primeFibs = useMemo(
    () => primeIndexed(fibSequence, primes).slice(0, 6),
    [fibSequence, primes],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }
    contextRef.current = context;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      sizeRef.current = { width: rect.width, height: rect.height, dpr };
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const context = contextRef.current;
    if (!context) {
      return;
    }

    const { width, height, dpr } = sizeRef.current;
    if (!width || !height) {
      return;
    }

    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, width, height);

    const t = time / 1000;
    const centerX = width * (0.5 + (pointer.x - 0.5) * 0.08);
    const centerY = height * (0.5 + (pointer.y - 0.5) * 0.08);
    const base = Math.min(width, height) * 0.22;

    const spiralTurns = 220;
    context.beginPath();
    for (let index = 0; index <= spiralTurns; index += 1) {
      const ratio = index / spiralTurns;
      const angle = ratio * Math.PI * 8 + t * 0.45 + scrollRatio * 0.8;
      const radius =
        base * ratio * (0.7 + 0.3 * (phiRatio / PHI)) * (1 + ratio * 0.2);
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      if (index === 0) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }
    }
    context.strokeStyle = "rgba(215, 187, 132, 0.35)";
    context.lineWidth = 1;
    context.stroke();

    const fibMax = fibSequence[fibSequence.length - 1] ?? 1;
    fibSequence.slice(0, 8).forEach((fib, index) => {
      const orbit =
        base * 0.35 +
        (fib / fibMax) * base * 0.9 +
        Math.sin(t * 0.6 + index) * 4;
      const angle =
        t * 0.35 + (index / fibSequence.length) * Math.PI * 2 + scrollRatio;
      const x = centerX + Math.cos(angle) * orbit;
      const y = centerY + Math.sin(angle) * orbit;
      const size = 2.2 + index * 0.4;
      context.beginPath();
      context.arc(x, y, size, 0, Math.PI * 2);
      context.fillStyle = "rgba(255, 255, 255, 0.7)";
      context.fill();
    });

    primes.slice(0, 12).forEach((prime, index) => {
      const pulse = Math.sin(t * 1.4 + prime) * 0.5 + 0.5;
      const radius = base * 0.2 + (prime / primes[primes.length - 1]) * base;
      const alpha = 0.08 + pulse * 0.25;
      context.beginPath();
      context.arc(
        centerX,
        centerY,
        radius + Math.sin(t + index) * 4,
        0,
        Math.PI * 2,
      );
      context.strokeStyle = `rgba(215, 187, 132, ${alpha})`;
      context.lineWidth = 1;
      context.stroke();
    });

    primeFibs.forEach((primeFib, index) => {
      const ratio = primeFib / (fibMax || 1);
      const radius = base * 0.3 + ratio * base * 1.1;
      const angle = t * 0.5 + index * 1.2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      context.beginPath();
      context.arc(x, y, 3.4 + ratio * 2.5, 0, Math.PI * 2);
      context.fillStyle = "rgba(215, 187, 132, 0.7)";
      context.fill();
    });
  }, [fibSequence, phiRatio, pointer, primeFibs, primes, scrollRatio, time]);

  const driftRatio = useMemo(
    () => timeBasedRatio(time / 1000) / PHI,
    [time],
  );

  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      <canvas ref={canvasRef} className="h-full w-full" />
      <div className="absolute left-6 top-6 flex flex-col gap-2 text-xs uppercase tracking-[0.4em] text-[var(--muted)]">
        <span>Synchronicity Field</span>
        <span>Φ Drift {formatValue(driftRatio, 5)}</span>
        <span>Pulse {formatValue(phiRatio, 6)}</span>
      </div>
      <div className="absolute bottom-6 right-6 text-right text-[0.65rem] uppercase tracking-[0.38em] text-[var(--muted)]">
        <p>Prime Nodes {primeFibs.join(" · ")}</p>
        <p>Scroll Ratio {formatValue(scrollRatio, 3)}</p>
      </div>
    </div>
  );
}
