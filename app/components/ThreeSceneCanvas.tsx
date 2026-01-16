"use client";

import { useEffect, useRef } from "react";
import type { CreateScene } from "@/app/lib/three/types";
import { clampDpr } from "@/app/lib/three/utils";

type ThreeSceneCanvasProps = {
  createScene: CreateScene;
  className?: string;
};

const getCanvasSize = (element: HTMLElement) => {
  const { width, height } = element.getBoundingClientRect();
  return {
    width: Math.max(1, Math.floor(width)),
    height: Math.max(1, Math.floor(height)),
  };
};

export default function ThreeSceneCanvas({
  createScene,
  className,
}: ThreeSceneCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) {
      return undefined;
    }

    let animationFrameId = 0;
    let lastTime = performance.now();
    let active = true;

    const { width, height } = getCanvasSize(container);
    const isMobile = width < 768;
    const dpr = clampDpr(window.devicePixelRatio || 1, isMobile);
    let sceneState = createScene({
      canvas,
      width,
      height,
      dpr,
      isMobile,
    });

    const handleResize = () => {
      if (!container || !active) {
        return;
      }
      const nextSize = getCanvasSize(container);
      const nextIsMobile = nextSize.width < 768;
      const nextDpr = clampDpr(window.devicePixelRatio || 1, nextIsMobile);
      sceneState.renderer.setPixelRatio(nextDpr);
      sceneState.renderer.setSize(nextSize.width, nextSize.height, false);
      const camera = sceneState.camera as {
        aspect?: number;
        updateProjectionMatrix?: () => void;
      };
      if (typeof camera.aspect === "number") {
        camera.aspect = nextSize.width / nextSize.height;
        camera.updateProjectionMatrix?.();
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    const tick = (time: number) => {
      if (!active) {
        return;
      }
      const delta = Math.min(0.05, (time - lastTime) / 1000);
      lastTime = time;
      sceneState.update(delta);
      animationFrameId = window.requestAnimationFrame(tick);
    };

    animationFrameId = window.requestAnimationFrame(tick);

    return () => {
      active = false;
      window.cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      sceneState.dispose();
    };
  }, [createScene]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black/60 shadow-[0_0_40px_rgba(15,23,42,0.35)] ${className ?? ""}`}
    >
      <canvas
        ref={canvasRef}
        className="h-[360px] w-full touch-none md:h-[520px]"
        aria-label="Golden ratio visualization"
      />
    </div>
  );
}
