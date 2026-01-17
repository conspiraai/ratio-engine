"use client";

import { useMemo, useRef } from "react";
import { Line, OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import AtlasSceneFrame from "@/app/components/atlas/AtlasSceneFrame";
import type { RatioEntry } from "@/app/lib/atlas/ratios";

const buildLissajous = (
  ratioA: number,
  ratioB: number,
  radius: number,
) => {
  const points = 300;
  return Array.from({ length: points + 1 }, (_, index) => {
    const t = (index / points) * Math.PI * 2;
    const x = Math.sin(t * ratioA) * radius;
    const y = Math.sin(t * ratioB + Math.PI / 2) * radius;
    const z = Math.sin(t * 0.5) * radius * 0.35;
    return [x, y, z] as [number, number, number];
  });
};

export default function PerfectFifthScene({ entry }: { entry: RatioEntry }) {
  const settings =
    entry.visualSpec.sceneId === "perfect-fifth"
      ? entry.visualSpec.settings
      : { baseRadius: 1.4, ratioA: 3, ratioB: 2, markerCount: 16 };

  const curvePoints = useMemo(
    () => buildLissajous(settings.ratioA, settings.ratioB, settings.baseRadius),
    [settings],
  );

  const markers = useMemo(() => {
    return Array.from({ length: settings.markerCount }, (_, index) => {
      const t = (index / settings.markerCount) * Math.PI * 2;
      const x = Math.sin(t * settings.ratioA) * settings.baseRadius;
      const y = Math.sin(t * settings.ratioB + Math.PI / 2) *
        settings.baseRadius;
      const z = Math.sin(t * 0.5) * settings.baseRadius * 0.35;
      return [x, y, z] as [number, number, number];
    });
  }, [settings]);

  const groupRef = useRef<Group>(null);
  useFrame((_, delta) => {
    if (!groupRef.current) {
      return;
    }
    groupRef.current.rotation.y += delta * 0.2;
    groupRef.current.rotation.x += delta * 0.08;
  });

  return (
    <AtlasSceneFrame
      label="Perfect fifth harmonic curve"
      className="min-h-[360px]"
      cameraPosition={[0, 0.4, 4.6]}
      overlay={
        <div className="pointer-events-auto absolute left-5 top-5 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-xs text-[var(--muted)] backdrop-blur">
          <p className="font-semibold uppercase tracking-[0.3em] text-[var(--fg)]">
            Perfect Fifth
          </p>
          <p>3 : 2 harmonic ratio</p>
        </div>
      }
    >
      <color attach="background" args={["#050505"]} />
      <fog attach="fog" args={["#050505", 4.5, 10]} />
      <ambientLight intensity={0.65} />
      <directionalLight position={[4, 5, 3]} intensity={0.85} />
      <pointLight position={[-3, -3, -4]} intensity={0.35} />
      <group ref={groupRef}>
        <Line
          points={curvePoints}
          color="#ececec"
          lineWidth={1}
          transparent
          opacity={0.7}
        />
        {markers.map((marker) => (
          <mesh key={marker.join("-")} position={marker}>
            <sphereGeometry args={[0.07, 22, 22]} />
            <meshStandardMaterial
              color="#dcdcdc"
              roughness={0.25}
              metalness={0.7}
            />
          </mesh>
        ))}
      </group>
      <OrbitControls
        enablePan={false}
        minDistance={2.6}
        maxDistance={7}
        maxPolarAngle={Math.PI * 0.62}
      />
    </AtlasSceneFrame>
  );
}
