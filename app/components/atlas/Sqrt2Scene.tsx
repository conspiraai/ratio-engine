"use client";

import { useMemo } from "react";
import { Line, OrbitControls } from "@react-three/drei";
import AtlasSceneFrame from "@/app/components/atlas/AtlasSceneFrame";
import type { RatioEntry } from "@/app/lib/atlas/ratios";

const buildGridLines = (size: number, layers: number) => {
  const half = size / 2;
  const step = size / (layers - 1);
  const lines: Array<{ points: [number, number, number][]; opacity: number }> = [];

  for (let i = 0; i < layers; i += 1) {
    const offset = -half + i * step;
    lines.push({
      points: [
        [-half, offset, 0],
        [half, offset, 0],
      ],
      opacity: i % 2 === 0 ? 0.5 : 0.25,
    });
    lines.push({
      points: [
        [offset, -half, 0],
        [offset, half, 0],
      ],
      opacity: i % 2 === 0 ? 0.5 : 0.25,
    });
  }

  lines.push({
    points: [
      [-half, -half, 0],
      [half, half, 0],
    ],
    opacity: 0.7,
  });
  lines.push({
    points: [
      [-half, half, 0],
      [half, -half, 0],
    ],
    opacity: 0.4,
  });

  return lines;
};

export default function Sqrt2Scene({ entry }: { entry: RatioEntry }) {
  const settings =
    entry.visualSpec.sceneId === "sqrt2-diagonal"
      ? entry.visualSpec.settings
      : { squareSize: 1.8, depth: 0.65, layerCount: 5 };

  const layers = useMemo(() => {
    const totalLayers = settings.layerCount;
    const depthStep = settings.depth / totalLayers;
    const baseLines = buildGridLines(settings.squareSize * 2, 6);
    return Array.from({ length: totalLayers }, (_, index) => {
      const z = (index - (totalLayers - 1) / 2) * depthStep;
      return {
        z,
        opacityScale: 1 - index / totalLayers * 0.4,
        lines: baseLines,
      };
    });
  }, [settings]);

  return (
    <AtlasSceneFrame
      label="Root two lattice"
      className="min-h-[360px]"
      cameraPosition={[0, 0.6, 4.4]}
      overlay={
        <div className="pointer-events-auto absolute left-5 top-5 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-xs text-[var(--muted)] backdrop-blur">
          <p className="font-semibold uppercase tracking-[0.3em] text-[var(--fg)]">
            Root Two Grid
          </p>
          <p>√2 ≈ {entry.value}</p>
        </div>
      }
    >
      <color attach="background" args={["#050505"]} />
      <fog attach="fog" args={["#050505", 4.5, 10]} />
      <ambientLight intensity={0.65} />
      <directionalLight position={[4, 6, 3]} intensity={0.85} />
      <group rotation={[-Math.PI / 5, 0.2, 0]}>
        {layers.map((layer) => (
          <group key={layer.z} position={[0, 0, layer.z]}>
            {layer.lines.map((line, index) => (
              <Line
                key={`${layer.z}-${index}`}
                points={line.points}
                color="#e6e6e6"
                transparent
                opacity={line.opacity * layer.opacityScale}
                lineWidth={1}
              />
            ))}
          </group>
        ))}
      </group>
      <OrbitControls
        enablePan={false}
        minDistance={2.8}
        maxDistance={7}
        maxPolarAngle={Math.PI * 0.65}
      />
    </AtlasSceneFrame>
  );
}
