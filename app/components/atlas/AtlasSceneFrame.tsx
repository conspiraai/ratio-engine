"use client";

import type { ReactNode } from "react";
import { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";

type AtlasSceneFrameProps = {
  children: ReactNode;
  overlay?: ReactNode;
  className?: string;
  label?: string;
  cameraPosition?: [number, number, number];
};

export default function AtlasSceneFrame({
  children,
  overlay,
  className,
  label = "Ratio Atlas scene",
  cameraPosition = [0, 0, 5],
}: AtlasSceneFrameProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      aria-label={label}
      className={`glass-card glass-card--featured relative h-[360px] w-full overflow-hidden rounded-2xl md:h-[520px] ${
        className ?? ""
      }`}
    >
      <Canvas
        className="atlas-canvas h-full w-full"
        eventSource={containerRef}
        eventPrefix="client"
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.6]}
        camera={{ position: cameraPosition, fov: 45 }}
      >
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
      {overlay ? (
        <div className="pointer-events-none absolute inset-0">{overlay}</div>
      ) : null}
    </div>
  );
}
