"use client";

import { useMemo } from "react";
import { Instance, Instances, OrbitControls } from "@react-three/drei";
import AtlasSceneFrame from "@/app/components/atlas/AtlasSceneFrame";
import type { RatioEntry } from "@/app/lib/atlas/ratios";

const buildHexLattice = (count: number, layerCount: number, spacing: number) => {
  const points: Array<[number, number, number]> = [];
  const layers = layerCount;
  for (let z = 0; z < layers; z += 1) {
    const depth = (z - (layers - 1) / 2) * spacing * 0.55;
    for (let x = -count; x <= count; x += 1) {
      for (let y = -count; y <= count; y += 1) {
        const offset = (y % 2) * (spacing / 2);
        points.push([
          x * spacing + offset,
          y * spacing * 0.86,
          depth,
        ]);
      }
    }
  }
  return points;
};

export default function Sqrt3Scene({ entry }: { entry: RatioEntry }) {
  const settings =
    entry.visualSpec.sceneId === "sqrt3-lattice"
      ? entry.visualSpec.settings
      : { cubeSize: 1.7, depth: 0.7, nodeCount: 8 };

  const points = useMemo(
    () => buildHexLattice(3, settings.nodeCount, settings.cubeSize * 0.25),
    [settings],
  );

  return (
    <AtlasSceneFrame
      label="Root three lattice"
      className="min-h-[360px]"
      cameraPosition={[0.2, 0.6, 4.6]}
      overlay={
        <div className="pointer-events-auto absolute left-5 top-5 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-xs text-[var(--muted)] backdrop-blur">
          <p className="font-semibold uppercase tracking-[0.3em] text-[var(--fg)]">
            Root Three Lattice
          </p>
          <p>√3 ≈ {entry.value}</p>
        </div>
      }
    >
      <color attach="background" args={["#050505"]} />
      <fog attach="fog" args={["#050505", 4.5, 10]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 2]} intensity={0.9} />
      <pointLight position={[-3, -2, -4]} intensity={0.35} />
      <group rotation={[-Math.PI / 8, 0.4, 0]}>
        <Instances limit={points.length}>
          <sphereGeometry args={[0.08, 24, 24]} />
          <meshStandardMaterial
            color="#ededed"
            roughness={0.3}
            metalness={0.65}
            emissive="#0e0e10"
          />
          {points.map((point) => (
            <Instance key={point.join("-")} position={point} />
          ))}
        </Instances>
      </group>
      <OrbitControls
        enablePan={false}
        minDistance={3}
        maxDistance={7}
        maxPolarAngle={Math.PI * 0.65}
      />
    </AtlasSceneFrame>
  );
}
