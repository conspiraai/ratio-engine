"use client";

import { useMemo, useRef, useState } from "react";
import { Line, OrbitControls, Sparkles } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { MathUtils } from "three";
import AtlasSceneFrame from "@/app/components/atlas/AtlasSceneFrame";
import type { RatioEntry } from "@/app/lib/atlas/ratios";

const PHI = (1 + Math.sqrt(5)) / 2;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

const formatPhi = (value: string) => `φ ≈ ${value}`;

type PhiSceneProps = {
  entry: RatioEntry;
};

type PhiSettings = {
  rectangleAspect: number;
  spiralTurns: number;
  depth: number;
  nodeCount: number;
  nodeScale: number;
};

const buildSpiralPoints = (settings: PhiSettings) => {
  const segments = 240;
  const maxTheta = Math.PI * 2 * settings.spiralTurns;
  const endRadius = Math.pow(PHI, maxTheta / (Math.PI / 2)) * 0.12;
  const scale = 2.2 / endRadius;

  return Array.from({ length: segments + 1 }, (_, index) => {
    const t = (index / segments) * maxTheta;
    const radius = Math.pow(PHI, t / (Math.PI / 2)) * 0.12 * scale;
    const y = (index / segments - 0.5) * settings.depth * 2.2;
    return [Math.cos(t) * radius, y, Math.sin(t) * radius] as [
      number,
      number,
      number,
    ];
  });
};

const buildNodePositions = (settings: PhiSettings) => {
  const baseRadius = 0.42;
  const nodes = Array.from({ length: settings.nodeCount }, (_, index) => {
    const radius = baseRadius * Math.pow(PHI, index * 0.32);
    const angle = index * GOLDEN_ANGLE;
    const y = (index / settings.nodeCount - 0.5) * settings.depth * 1.6;
    return [Math.cos(angle) * radius, y, Math.sin(angle) * radius] as [
      number,
      number,
      number,
    ];
  });

  const maxRadius = Math.max(...nodes.map((node) => Math.hypot(node[0], node[2])));
  const scale = 1.9 / maxRadius;
  return nodes.map(([x, y, z]) => [x * scale, y, z * scale] as [
    number,
    number,
    number,
  ]);
};

function PhiLattice({
  settings,
  showSpiral,
  showNodes,
  enableMotion,
}: {
  settings: PhiSettings;
  showSpiral: boolean;
  showNodes: boolean;
  enableMotion: boolean;
}) {
  const groupRef = useRef<Group>(null);
  const spiralPoints = useMemo(() => buildSpiralPoints(settings), [settings]);
  const nodePositions = useMemo(() => buildNodePositions(settings), [settings]);

  useFrame((state, delta) => {
    if (!groupRef.current || !enableMotion) {
      return;
    }
    groupRef.current.rotation.y += delta * 0.28;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.35) * 0.18;
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.9) * 0.06;
    groupRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 1.4) * 0.02);
  });

  return (
    <group ref={groupRef}>
      {showSpiral ? (
        <Line
          points={spiralPoints}
          color="#f3f2f0"
          lineWidth={1}
          opacity={0.7}
          transparent
        />
      ) : null}
      <mesh>
        <icosahedronGeometry args={[0.65, 2]} />
        <meshStandardMaterial
          color="#ececec"
          roughness={0.25}
          metalness={0.75}
          emissive="#101012"
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.7, 0.04, 22, 140]} />
        <meshStandardMaterial
          color="#b8b8b8"
          roughness={0.4}
          metalness={0.65}
        />
      </mesh>
      {showNodes
        ? nodePositions.map((position, index) => (
            <mesh key={position.join("-")}
              position={position}
              scale={settings.nodeScale * MathUtils.lerp(0.9, 1.3, index / nodePositions.length)}
            >
              <sphereGeometry args={[0.35, 32, 32]} />
              <meshStandardMaterial
                color="#d9d9d9"
                roughness={0.35}
                metalness={0.7}
                emissive="#101010"
              />
            </mesh>
          ))
        : null}
      <Sparkles
        count={36}
        size={1.4}
        speed={0.35}
        opacity={0.25}
        color="#ffffff"
        scale={[3.2, 2.2, 3.2]}
      />
    </group>
  );
}

export default function PhiScene({ entry }: PhiSceneProps) {
  const [showSpiral, setShowSpiral] = useState(true);
  const [showNodes, setShowNodes] = useState(true);
  const [enableMotion, setEnableMotion] = useState(true);

  const settings: PhiSettings =
    entry.visualSpec.sceneId === "phi-harmonic-lattice"
      ? entry.visualSpec.settings
      : {
          rectangleAspect: 1.618033988749895,
          spiralTurns: 4.25,
          depth: 0.7,
          nodeCount: 7,
          nodeScale: 0.07,
        };

  return (
    <AtlasSceneFrame
      label="Phi harmonic lattice visualization"
      className="min-h-[360px]"
      cameraPosition={[0, 0.2, 4.8]}
      overlay={
        <div className="pointer-events-auto absolute left-5 top-5 space-y-3 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-xs text-[var(--muted)] backdrop-blur">
          <p className="font-semibold uppercase tracking-[0.3em] text-[var(--fg)]">
            Phi Harmonic Lattice
          </p>
          <p>{formatPhi(entry.value)}</p>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              className="toggle-button px-3 py-1.5 text-left text-[0.7rem] uppercase tracking-[0.28em]"
              data-active={showSpiral}
              onClick={() => setShowSpiral((value) => !value)}
            >
              Spiral
            </button>
            <button
              type="button"
              className="toggle-button px-3 py-1.5 text-left text-[0.7rem] uppercase tracking-[0.28em]"
              data-active={showNodes}
              onClick={() => setShowNodes((value) => !value)}
            >
              Nodes
            </button>
            <button
              type="button"
              className="toggle-button px-3 py-1.5 text-left text-[0.7rem] uppercase tracking-[0.28em]"
              data-active={enableMotion}
              onClick={() => setEnableMotion((value) => !value)}
            >
              Motion
            </button>
          </div>
        </div>
      }
    >
      <color attach="background" args={["#050505"]} />
      <fog attach="fog" args={["#050505", 4, 10]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 4]} intensity={0.85} />
      <pointLight position={[-4, -2, -3]} intensity={0.4} color="#ffffff" />
      <PhiLattice
        settings={settings}
        showSpiral={showSpiral}
        showNodes={showNodes}
        enableMotion={enableMotion}
      />
      <OrbitControls
        enablePan={false}
        minDistance={2.4}
        maxDistance={7}
        maxPolarAngle={Math.PI * 0.62}
      />
    </AtlasSceneFrame>
  );
}
