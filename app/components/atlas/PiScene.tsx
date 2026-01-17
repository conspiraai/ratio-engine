"use client";

import { useMemo, useRef } from "react";
import { Line, OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import AtlasSceneFrame from "@/app/components/atlas/AtlasSceneFrame";
import type { RatioEntry } from "@/app/lib/atlas/ratios";

const buildArcPoints = (radius: number, turns: number) => {
  const segments = 240;
  const maxTheta = Math.PI * 2 * turns;
  return Array.from({ length: segments + 1 }, (_, index) => {
    const t = (index / segments) * maxTheta;
    return [Math.cos(t) * radius, Math.sin(t) * radius, 0] as [
      number,
      number,
      number,
    ];
  });
};

export default function PiScene({ entry }: { entry: RatioEntry }) {
  const settings =
    entry.visualSpec.sceneId === "pi-orbit"
      ? entry.visualSpec.settings
      : { radius: 1.8, arcTurns: 2.3, markerCount: 40 };

  const markers = useMemo(() => {
    return Array.from({ length: settings.markerCount }, (_, index) => {
      const t = (index / settings.markerCount) * Math.PI * 2 * settings.arcTurns;
      return [
        Math.cos(t) * settings.radius,
        Math.sin(t) * settings.radius,
        Math.sin(t * 0.5) * 0.25,
      ] as [number, number, number];
    });
  }, [settings]);

  const arcPoints = useMemo(
    () => buildArcPoints(settings.radius * 1.02, settings.arcTurns),
    [settings],
  );

  const groupRef = useRef<Group>(null);
  useFrame((state, delta) => {
    if (!groupRef.current) {
      return;
    }
    groupRef.current.rotation.z += delta * 0.18;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.12;
  });

  return (
    <AtlasSceneFrame
      label="Pi orbital harmonics"
      className="min-h-[360px]"
      cameraPosition={[0, 0.2, 4.6]}
      overlay={
        <div className="pointer-events-auto absolute left-5 top-5 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-xs text-[var(--muted)] backdrop-blur">
          <p className="font-semibold uppercase tracking-[0.3em] text-[var(--fg)]">
            Pi Orbitals
          </p>
          <p>π ≈ {entry.value}</p>
        </div>
      }
    >
      <color attach="background" args={["#050505"]} />
      <fog attach="fog" args={["#050505", 4.5, 10]} />
      <ambientLight intensity={0.65} />
      <directionalLight position={[4, 6, 3]} intensity={0.8} />
      <pointLight position={[-3, -3, -4]} intensity={0.35} />
      <group ref={groupRef}>
        <Line
          points={arcPoints}
          color="#ececec"
          lineWidth={1}
          transparent
          opacity={0.6}
        />
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[settings.radius, 0.05, 20, 160]} />
          <meshStandardMaterial
            color="#cfcfcf"
            roughness={0.35}
            metalness={0.65}
          />
        </mesh>
        {markers.map((marker) => (
          <mesh key={marker.join("-")} position={marker}>
            <sphereGeometry args={[0.06, 20, 20]} />
            <meshStandardMaterial
              color="#e8e8e8"
              roughness={0.25}
              metalness={0.75}
            />
          </mesh>
        ))}
      </group>
      <OrbitControls
        enablePan={false}
        minDistance={2.8}
        maxDistance={7}
        maxPolarAngle={Math.PI * 0.62}
      />
    </AtlasSceneFrame>
  );
}
