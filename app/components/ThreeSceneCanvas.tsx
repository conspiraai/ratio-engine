"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import type { CreateScene } from "@/app/lib/three/types";
import type { RenderQuality } from "@/app/lib/three/types";
import { clampDpr, getRenderQualitySettings } from "@/app/lib/three/utils";

type ThreeSceneCanvasProps = {
  createScene: CreateScene;
  className?: string;
  renderQuality?: RenderQuality;
  label?: string;
  children?: ReactNode;
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
  renderQuality = "medium",
  label = "Ratio visualization",
  children,
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
    let isVisible = document.visibilityState !== "hidden";

    const { width, height } = getCanvasSize(container);
    const isMobile = width < 768;
    const qualitySettings = getRenderQualitySettings(renderQuality, isMobile);
    const dpr = clampDpr(window.devicePixelRatio || 1, qualitySettings.dprCap);
    let sceneState = createScene({
      canvas,
      width,
      height,
      dpr,
      isMobile,
      renderQuality,
      detailLevel: qualitySettings.detailScale,
    });

    const handleResize = () => {
      if (!container || !active) {
        return;
      }
      const nextSize = getCanvasSize(container);
      const nextIsMobile = nextSize.width < 768;
      const nextQuality = getRenderQualitySettings(renderQuality, nextIsMobile);
      const nextDpr = clampDpr(window.devicePixelRatio || 1, nextQuality.dprCap);
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
      if (!active || !isVisible) {
        return;
      }
      const delta = Math.min(0.05, (time - lastTime) / 1000);
      lastTime = time;
      sceneState.update(delta);
      animationFrameId = window.requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (!active || !isVisible) {
        return;
      }
      lastTime = performance.now();
      animationFrameId = window.requestAnimationFrame(tick);
    };

    const stopLoop = () => {
      window.cancelAnimationFrame(animationFrameId);
    };

    const handleVisibility = () => {
      isVisible = document.visibilityState !== "hidden";
      if (isVisible) {
        startLoop();
      } else {
        stopLoop();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    startLoop();

    return () => {
      active = false;
      stopLoop();
      document.removeEventListener("visibilitychange", handleVisibility);
      resizeObserver.disconnect();
      sceneState.dispose();
    };
  }, [createScene, renderQuality]);

  return (
    <div
      ref={containerRef}
      className={`glass-card glass-card--featured relative w-full overflow-hidden rounded-2xl ${className ?? ""}`}
    >
      <canvas
        ref={canvasRef}
        className="h-[360px] w-full touch-none md:h-[520px]"
        aria-label={label}
      />
      {children}
    </div>
  );
}
