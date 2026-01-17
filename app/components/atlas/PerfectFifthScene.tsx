"use client";

import { useCallback, useMemo } from "react";
import ThreeSceneCanvas from "@/app/components/ThreeSceneCanvas";
import type { RatioEntry } from "@/app/lib/atlas/ratios";
import {
  createScene as createPerfectFifthScene,
  type PerfectFifthAtlasSceneOptions,
} from "@/app/lib/three/scenes/perfect-fifth-atlas";
import type { CreateSceneParams } from "@/app/lib/three/types";

export default function PerfectFifthScene({ entry }: { entry: RatioEntry }) {
  const settings =
    entry.visualSpec.sceneId === "perfect-fifth"
      ? entry.visualSpec.settings
      : {
          baseRadius: 1.4,
          ratioA: 3,
          ratioB: 2,
          markerCount: 16,
        };

  const sceneOptions = useMemo<PerfectFifthAtlasSceneOptions>(
    () => ({
      baseRadius: settings.baseRadius,
      ratioA: settings.ratioA,
      ratioB: settings.ratioB,
      markerCount: settings.markerCount,
    }),
    [settings],
  );

  const createScene = useCallback(
    (sceneParams: CreateSceneParams) =>
      createPerfectFifthScene(sceneParams, sceneOptions),
    [sceneOptions],
  );

  return (
    <ThreeSceneCanvas
      createScene={createScene}
      label="Perfect fifth ratio visualization"
      className="min-h-[360px]"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="pointer-events-auto absolute left-5 top-5 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-xs text-[var(--muted)] backdrop-blur">
          <p className="font-semibold uppercase tracking-[0.3em] text-[var(--fg)]">
            Perfect Fifth
          </p>
          <p>3:2 harmonic interval</p>
        </div>
      </div>
    </ThreeSceneCanvas>
  );
}
