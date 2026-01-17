"use client";

import { useCallback, useMemo } from "react";
import ThreeSceneCanvas from "@/app/components/ThreeSceneCanvas";
import type { RatioEntry } from "@/app/lib/atlas/ratios";
import {
  createScene as createSilverScene,
  type SilverAtlasSceneOptions,
} from "@/app/lib/three/scenes/silver-atlas";
import type { CreateSceneParams } from "@/app/lib/three/types";

export default function SilverScene({ entry }: { entry: RatioEntry }) {
  const settings =
    entry.visualSpec.sceneId === "silver-spiral"
      ? entry.visualSpec.settings
      : {
          rectangleAspect: 2.414213562373095,
          spiralTurns: 3.2,
          depth: 0.6,
        };

  const sceneOptions = useMemo<SilverAtlasSceneOptions>(
    () => ({
      rectangleAspect: settings.rectangleAspect,
      spiralTurns: settings.spiralTurns,
      depth: settings.depth,
    }),
    [settings],
  );

  const createScene = useCallback(
    (sceneParams: CreateSceneParams) => createSilverScene(sceneParams, sceneOptions),
    [sceneOptions],
  );

  return (
    <ThreeSceneCanvas
      createScene={createScene}
      label="Silver ratio spiral visualization"
      className="min-h-[360px]"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="pointer-events-auto absolute left-5 top-5 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-xs text-[var(--muted)] backdrop-blur">
          <p className="font-semibold uppercase tracking-[0.3em] text-[var(--fg)]">
            Silver Ratio
          </p>
          <p>δs ≈ 2.414213562…</p>
        </div>
      </div>
    </ThreeSceneCanvas>
  );
}
