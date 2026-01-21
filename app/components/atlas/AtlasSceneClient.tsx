"use client";

import { useEffect, useRef } from "react";
import { getRatioBySlug } from "@/app/lib/atlas/ratios";
import { parseRatioValue } from "@/app/lib/atlas/synchronicities";

type AtlasSceneClientProps = {
  slug: string;
};

export default function AtlasSceneClient({ slug }: AtlasSceneClientProps) {
  const entry = getRatioBySlug(slug);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef(0);

  if (!entry) {
    return null;
  }

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
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const ratioValue = parseRatioValue(entry.value);
    const settings = entry.visualSpec.settings;
    const detail =
      "nodeCount" in settings
        ? settings.nodeCount
        : "markerCount" in settings
          ? settings.markerCount
          : "layerCount" in settings
            ? settings.layerCount
            : 12;
    const turns =
      "spiralTurns" in settings
        ? settings.spiralTurns
        : "arcTurns" in settings
          ? settings.arcTurns
          : 4;

    const draw = (now: number) => {
      const { width, height } = canvas.getBoundingClientRect();
      const t = now / 1000;
      const base = Math.min(width, height) * 0.28;
      const centerX = width * 0.5;
      const centerY = height * 0.5;

      context.clearRect(0, 0, width, height);
      context.beginPath();
      for (let i = 0; i <= 200; i += 1) {
        const progress = i / 200;
        const angle =
          progress * Math.PI * turns + t * 0.4 + ratioValue * 0.2;
        const radius =
          base * progress * (0.7 + (ratioValue % 1) * 0.3) +
          Math.sin(t + progress * 6) * 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        if (i === 0) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }
      }
      context.strokeStyle = "rgba(215, 187, 132, 0.35)";
      context.lineWidth = 1.1;
      context.stroke();

      for (let i = 0; i < detail; i += 1) {
        const angle = (i / detail) * Math.PI * 2 + t * 0.25;
        const radius = base * 0.25 + (i / detail) * base * 0.9;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        context.beginPath();
        context.arc(x, y, 2 + i * 0.12, 0, Math.PI * 2);
        context.fillStyle = "rgba(255, 255, 255, 0.65)";
        context.fill();
      }

      context.beginPath();
      context.arc(
        centerX,
        centerY,
        base * 0.45 + Math.cos(t * 0.6) * 6,
        0,
        Math.PI * 2,
      );
      context.strokeStyle = "rgba(255, 255, 255, 0.15)";
      context.lineWidth = 1;
      context.stroke();

      frameRef.current = window.requestAnimationFrame(draw);
    };

    resize();
    frameRef.current = window.requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(frameRef.current);
    };
  }, [entry]);

  return (
    <div className="glass-card relative h-[360px] w-full overflow-hidden rounded-3xl border border-white/10">
      <canvas ref={canvasRef} className="h-full w-full" />
      <div className="absolute left-5 top-5 rounded-full border border-white/10 px-4 py-2 text-[0.6rem] uppercase tracking-[0.32em] text-[var(--muted)]">
        {entry.title} Field
      </div>
    </div>
  );
}
