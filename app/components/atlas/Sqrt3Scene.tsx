"use client";

import { useCallback, useMemo } from "react";
import ThreeSceneCanvas from "@/app/components/ThreeSceneCanvas";
import type { RatioEntry } from "@/app/lib/atlas/ratios";
import {
  createScene as createSqrt3Scene,
  type Sqrt3AtlasSceneOptions,
} from "@/app/lib/three/scenes/sqrt3-atlas";
import type { CreateSceneParams } from "@/app/lib/three/types";

export default function Sqrt3Scene({ entry }: { entry: RatioEntry }) {
  const settings =
    entry.visualSpec.sceneId === "sqrt3-lattice"
      ? entry.visualSpec.settings
      : {
          cubeSize: 1.7,
          depth: 0.7,
          nodeCount: 8,
        };

  const sceneOptions = useMemo<Sqrt3AtlasSceneOptions>(
    () => ({
      cubeSize: settings.cubeSize,
      depth: settings.depth,
      nodeCount: settings.nodeCount,
    }),
    [settings],
  );

  const createScene = useCallback(
    (sceneParams: CreateSceneParams) => createSqrt3Scene(sceneParams, sceneOptions),
    [sceneOptions],
  );

  return (
    <ThreeSceneCanvas
      createScene={createScene}
      label="Root three lattice visualization"
      className="min-h-[360px]"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="pointer-events-auto absolute left-5 top-5 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-xs text-[var(--muted)] backdrop-blur">
          <p className="font-semibold uppercase tracking-[0.3em] text-[var(--fg)]">
            Root Three
          </p>
          <p>√3 ≈ 1.732050808…</p>
        </div>
      </div>
    </ThreeSceneCanvas>
  );
}
