"use client";

import { useCallback, useMemo } from "react";
import ThreeSceneCanvas from "@/app/components/ThreeSceneCanvas";
import type { RatioEntry } from "@/app/lib/atlas/ratios";
import {
  createScene as createSqrt2Scene,
  type Sqrt2AtlasSceneOptions,
} from "@/app/lib/three/scenes/sqrt2-atlas";
import type { CreateSceneParams } from "@/app/lib/three/types";

export default function Sqrt2Scene({ entry }: { entry: RatioEntry }) {
  const settings =
    entry.visualSpec.sceneId === "sqrt2-diagonal"
      ? entry.visualSpec.settings
      : {
          squareSize: 1.8,
          depth: 0.65,
          layerCount: 5,
        };

  const sceneOptions = useMemo<Sqrt2AtlasSceneOptions>(
    () => ({
      squareSize: settings.squareSize,
      depth: settings.depth,
      layerCount: settings.layerCount,
    }),
    [settings],
  );

  const createScene = useCallback(
    (sceneParams: CreateSceneParams) => createSqrt2Scene(sceneParams, sceneOptions),
    [sceneOptions],
  );

  return (
    <ThreeSceneCanvas
      createScene={createScene}
      label="Root two diagonal visualization"
      className="min-h-[360px]"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="pointer-events-auto absolute left-5 top-5 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-xs text-[var(--muted)] backdrop-blur">
          <p className="font-semibold uppercase tracking-[0.3em] text-[var(--fg)]">
            Root Two
          </p>
          <p>√2 ≈ 1.414213562…</p>
        </div>
      </div>
    </ThreeSceneCanvas>
  );
}
