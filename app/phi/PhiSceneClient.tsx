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
      <div className="glass-card grid gap-4 rounded-2xl p-5 text-sm text-[var(--muted)] md:grid-cols-[2fr_repeat(2,1fr)]">
        <label className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
            Recursion Depth
          </span>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={3}
              max={10}
              value={recursionDepth}
              onChange={(event) => setRecursionDepth(Number(event.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[color:var(--border)]"
            />
            <span className="w-8 text-right text-base text-[var(--fg)]">
              {recursionDepth}
            </span>
          </div>
        </label>
        <button
          type="button"
          onClick={() => setParticlesEnabled((value) => !value)}
          aria-pressed={particlesEnabled}
          data-active={particlesEnabled}
          className="toggle-button flex items-center justify-between px-4 py-3 text-left font-medium"
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
          data-active={autoDrift}
          className="toggle-button flex items-center justify-between px-4 py-3 text-left font-medium"
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
