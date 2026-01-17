"use client";

import { useCallback, useMemo } from "react";
import ThreeSceneCanvas from "@/app/components/ThreeSceneCanvas";
import type { RatioEntry } from "@/app/lib/atlas/ratios";
import {
  createScene as createPiScene,
  type PiAtlasSceneOptions,
} from "@/app/lib/three/scenes/pi-atlas";
import type { CreateSceneParams } from "@/app/lib/three/types";

export default function PiScene({ entry }: { entry: RatioEntry }) {
  const settings =
    entry.visualSpec.sceneId === "pi-orbit"
      ? entry.visualSpec.settings
      : {
          radius: 1.8,
          arcTurns: 2.3,
          markerCount: 40,
        };

  const sceneOptions = useMemo<PiAtlasSceneOptions>(
    () => ({
      radius: settings.radius,
      arcTurns: settings.arcTurns,
      markerCount: settings.markerCount,
    }),
    [settings],
  );

  const createScene = useCallback(
    (sceneParams: CreateSceneParams) => createPiScene(sceneParams, sceneOptions),
    [sceneOptions],
  );

  return (
    <ThreeSceneCanvas
      createScene={createScene}
      label="Pi orbital visualization"
      className="min-h-[360px]"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="pointer-events-auto absolute left-5 top-5 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-xs text-[var(--muted)] backdrop-blur">
          <p className="font-semibold uppercase tracking-[0.3em] text-[var(--fg)]">
            Pi Orbit
          </p>
          <p>π ≈ 3.141592653…</p>
        </div>
      </div>
    </ThreeSceneCanvas>
  );
}
