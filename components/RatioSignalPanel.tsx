"use client";

import { useEffect, useRef } from "react";
import { PHI } from "@/lib/engine/synchronicity";

type RatioSignalPanelProps = {
  label: string;
  ratio: number;
  note?: string;
};

type CanvasSize = {
  width: number;
  height: number;
  dpr: number;
};

const formatValue = (value: number) =>
  Number.isFinite(value) ? value.toFixed(6) : "—";

export default function RatioSignalPanel({
  label,
  ratio,
  note,
}: RatioSignalPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sizeRef = useRef<CanvasSize>({ width: 0, height: 0, dpr: 1 });
  const timeRef = useRef(0);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      sizeRef.current = { width: rect.width, height: rect.height, dpr };
    };

    const draw = (now: number) => {
      timeRef.current = now;
      const { width, height, dpr } = sizeRef.current;
      if (width && height) {
        context.setTransform(dpr, 0, 0, dpr, 0, 0);
        context.clearRect(0, 0, width, height);
        const t = now / 1000;
        const centerX = width * 0.5;
        const centerY = height * 0.5;
        const base = Math.min(width, height) * 0.24;
        const drift = ratio / PHI;

        context.beginPath();
        for (let i = 0; i <= 180; i += 1) {
          const progress = i / 180;
          const angle = progress * Math.PI * 6 + t * 0.4 + drift;
          const radius = base * progress * (0.8 + 0.2 * drift);
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;
          if (i === 0) {
            context.moveTo(x, y);
          } else {
            context.lineTo(x, y);
          }
        }
        context.strokeStyle = "rgba(215, 187, 132, 0.4)";
        context.lineWidth = 1.2;
        context.stroke();

        context.beginPath();
        context.arc(
          centerX,
          centerY,
          base * 0.4 + Math.sin(t + drift) * 8,
          0,
          Math.PI * 2,
        );
        context.strokeStyle = "rgba(255, 255, 255, 0.2)";
        context.lineWidth = 1;
        context.stroke();

        context.beginPath();
        context.arc(
          centerX,
          centerY,
          base * 0.8 + Math.cos(t * 0.7 + drift) * 10,
          0,
          Math.PI * 2,
        );
        context.strokeStyle = "rgba(215, 187, 132, 0.25)";
        context.lineWidth = 1;
        context.stroke();
      }

      frameRef.current = window.requestAnimationFrame(draw);
    };

    resize();
    frameRef.current = window.requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(frameRef.current);
    };
  }, [ratio]);

  return (
    <div className="glass-card rounded-2xl border border-white/10 p-6">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.32em] text-[var(--muted)]">
        <span>{label}</span>
        <span>{formatValue(ratio)}</span>
      </div>
      <div className="mt-4 h-64 w-full overflow-hidden rounded-2xl border border-white/10 bg-black/40">
        <canvas ref={canvasRef} className="h-full w-full" />
      </div>
      {note ? (
        <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{note}</p>
      ) : null}
    </div>
  );
}
