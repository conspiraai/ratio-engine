"use client";

import { useCallback, useState } from "react";
import ThreeSceneCanvas from "@/app/components/ThreeSceneCanvas";
import { createPhiScene } from "@/app/lib/three/scenes/phiScene";
import type { CreateSceneParams } from "@/app/lib/three/types";

export default function PhiSceneClient() {
  const [recursionDepth, setRecursionDepth] = useState(6);
  const [particlesEnabled, setParticlesEnabled] = useState(true);
  const [autoDrift, setAutoDrift] = useState(true);

  const createScene = useCallback(
    (params: CreateSceneParams) =>
      createPhiScene(params, {
        recursionDepth,
        particlesEnabled,
        autoDrift,
      }),
    [recursionDepth, particlesEnabled, autoDrift],
  );

  return (
    <div className="mt-10 flex flex-col gap-6">
      <ThreeSceneCanvas createScene={createScene} />
      <div className="grid gap-4 rounded-2xl border border-white/10 bg-black/50 p-5 text-sm text-white/80 md:grid-cols-[2fr_repeat(2,1fr)]">
        <label className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            Recursion Depth
          </span>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={3}
              max={10}
              value={recursionDepth}
              onChange={(event) => setRecursionDepth(Number(event.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/20"
            />
            <span className="w-8 text-right text-base text-white">
              {recursionDepth}
            </span>
          </div>
        </label>
        <button
          type="button"
          onClick={() => setParticlesEnabled((value) => !value)}
          aria-pressed={particlesEnabled}
          className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left font-medium transition ${
            particlesEnabled
              ? "border-amber-200/40 bg-white/10 text-white"
              : "border-white/10 bg-white/5 text-white/60"
          }`}
        >
          <span>Particles</span>
          <span className="text-xs uppercase tracking-[0.2em]">
            {particlesEnabled ? "On" : "Off"}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setAutoDrift((value) => !value)}
          aria-pressed={autoDrift}
          className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left font-medium transition ${
            autoDrift
              ? "border-amber-200/40 bg-white/10 text-white"
              : "border-white/10 bg-white/5 text-white/60"
          }`}
        >
          <span>Auto Drift</span>
          <span className="text-xs uppercase tracking-[0.2em]">
            {autoDrift ? "On" : "Off"}
          </span>
        </button>
      </div>
    </div>
  );
}
