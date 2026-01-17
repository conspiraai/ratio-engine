"use client";

import { useCallback, useMemo, useState } from "react";
import ThreeSceneCanvas from "@/app/components/ThreeSceneCanvas";
import type { RatioEntry } from "@/app/lib/atlas/ratios";
import {
  createScene as createPhiScene,
  type PhiAtlasSceneOptions,
} from "@/app/lib/three/scenes/phi-atlas";
import type { CreateSceneParams } from "@/app/lib/three/types";

const formatPhi = (approx: string) => `φ ≈ ${approx}`;

type PhiSceneProps = {
  entry: RatioEntry;
};

export default function PhiScene({ entry }: PhiSceneProps) {
  const [showNodes, setShowNodes] = useState(true);
  const [showRectangle, setShowRectangle] = useState(true);

  const settings =
    entry.visualSpec.sceneId === "phi-harmonic-lattice"
      ? entry.visualSpec.settings
      : {
          rectangleAspect: 1.618033988749895,
          spiralTurns: 4.25,
          depth: 0.7,
          nodeCount: 7,
          nodeScale: 0.07,
        };

  const sceneOptions = useMemo<PhiAtlasSceneOptions>(
    () => ({
      rectangleAspect: settings.rectangleAspect,
      spiralTurns: settings.spiralTurns,
      depth: settings.depth,
      nodeCount: settings.nodeCount,
      nodeScale: settings.nodeScale,
      showNodes,
      showRectangle,
    }),
    [settings, showNodes, showRectangle],
  );

  const createScene = useCallback(
    (sceneParams: CreateSceneParams) => createPhiScene(sceneParams, sceneOptions),
    [sceneOptions],
  );

  return (
    <ThreeSceneCanvas
      createScene={createScene}
      label="Phi harmonic lattice visualization"
      className="min-h-[360px]"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="pointer-events-auto absolute left-5 top-5 space-y-3 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-xs text-[var(--muted)] backdrop-blur">
          <p className="font-semibold uppercase tracking-[0.3em] text-[var(--fg)]">
            Phi Harmonic Lattice
          </p>
          <p>{formatPhi(entry.approx)}</p>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              className="toggle-button px-3 py-1.5 text-left text-[0.7rem] uppercase tracking-[0.28em]"
              data-active={showNodes}
              onClick={() => setShowNodes((value) => !value)}
            >
              Show Fibonacci nodes
            </button>
            <button
              type="button"
              className="toggle-button px-3 py-1.5 text-left text-[0.7rem] uppercase tracking-[0.28em]"
              data-active={showRectangle}
              onClick={() => setShowRectangle((value) => !value)}
            >
              Show golden rectangle
            </button>
          </div>
        </div>
      </div>
    </ThreeSceneCanvas>
  );
}
