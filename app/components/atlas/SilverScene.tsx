"use client";

import { useMemo, useRef } from "react";
import { OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { PlaneGeometry } from "three";
import type { Mesh } from "three";
import AtlasSceneFrame from "@/app/components/atlas/AtlasSceneFrame";
import type { RatioEntry } from "@/app/lib/atlas/ratios";

const SILVER_RATIO = 1 + Math.SQRT2;

function SilverWaveField() {
  const meshRef = useRef<Mesh>(null);
  const geometry = useMemo(
    () => new PlaneGeometry(4.4, 4.4, 90, 90),
    [],
  );

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const position = geometry.attributes.position;
    for (let i = 0; i < position.count; i += 1) {
      const x = position.getX(i);
      const y = position.getY(i);
      const waveA = Math.sin(x * SILVER_RATIO * 0.8 + time * 0.9);
      const waveB = Math.cos(y * SILVER_RATIO * 0.55 - time * 0.75);
      position.setZ(i, (waveA + waveB) * 0.12);
    }
    position.needsUpdate = true;
    geometry.computeVertexNormals();
  });

  return (
    <mesh ref={meshRef} geometry={geometry} rotation={[-Math.PI / 2.4, 0, 0]}>
      <meshStandardMaterial
        color="#d7d7d7"
        roughness={0.45}
        metalness={0.4}
        wireframe
        transparent
        opacity={0.65}
      />
    </mesh>
  );
}

export default function SilverScene({ entry }: { entry: RatioEntry }) {
  return (
    <AtlasSceneFrame
      label="Silver ratio interference field"
      className="min-h-[360px]"
      cameraPosition={[0, 1.6, 4.4]}
      overlay={
        <div className="pointer-events-auto absolute left-5 top-5 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-xs text-[var(--muted)] backdrop-blur">
          <p className="font-semibold uppercase tracking-[0.3em] text-[var(--fg)]">
            Silver Ratio
          </p>
          <p>δs ≈ {entry.value}</p>
        </div>
      }
    >
      <color attach="background" args={["#050505"]} />
      <fog attach="fog" args={["#050505", 4.5, 10]} />
      <ambientLight intensity={0.65} />
      <directionalLight position={[3, 5, 2]} intensity={0.8} />
      <pointLight position={[-3, -3, -4]} intensity={0.35} />
      <SilverWaveField />
      <OrbitControls
        enablePan={false}
        minDistance={3}
        maxDistance={7}
        maxPolarAngle={Math.PI * 0.62}
      />
    </AtlasSceneFrame>
  );
}
