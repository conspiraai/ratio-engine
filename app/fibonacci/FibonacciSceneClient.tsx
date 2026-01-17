"use client";

import { useCallback, useMemo, useState } from "react";
import RenderQualitySelect from "@/app/components/RenderQualitySelect";
import SceneControlsPanel from "@/app/components/SceneControlsPanel";
import ThreeSceneCanvas from "@/app/components/ThreeSceneCanvas";
import {
  buildFibonacci,
  createScene as createFibonacciScene,
  defaultParams,
  paramSchema,
  type FibonacciSceneParams,
} from "@/app/lib/three/scenes/fibonacci";
import type {
  CreateSceneParams,
  RenderQuality,
  SceneParamValue,
} from "@/app/lib/three/types";

const MAX_SEQUENCE_DISPLAY = 10;

export default function FibonacciSceneClient() {
  const [params, setParams] = useState<FibonacciSceneParams>(defaultParams);
  const [renderQuality, setRenderQuality] =
    useState<RenderQuality>("medium");

  const createScene = useCallback(
    (sceneParams: CreateSceneParams) => createFibonacciScene(sceneParams, params),
    [params],
  );

  const handleChange = (id: string, value: SceneParamValue) => {
    setParams((prev) => ({ ...prev, [id]: value } as FibonacciSceneParams));
  };

  const sequence = useMemo(
    () => buildFibonacci(Math.max(4, Math.round(params.terms))),
    [params.terms],
  );
  const focusIndex = Math.min(
    sequence.length - 1,
    Math.round(params.morph * (sequence.length - 1)),
  );
  const displaySequence = sequence.slice(0, MAX_SEQUENCE_DISPLAY);

  return (
    <div className="grid gap-6">
      <ThreeSceneCanvas
        createScene={createScene}
        renderQuality={renderQuality}
        label="Fibonacci sequence morph"
      >
        <div className="pointer-events-none absolute left-4 top-4 max-w-[240px] rounded-xl border border-[var(--border)] bg-[color:rgba(4,4,6,0.55)] px-4 py-3 text-xs text-[var(--muted)] backdrop-blur">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em]">
            Sequence
          </p>
          <div className="mt-2 flex flex-wrap gap-2 text-sm">
            {displaySequence.map((value, index) => {
              const isActive = index === focusIndex;
              return (
                <span
                  key={`${value}-${index}`}
                  className={
                    isActive
                      ? "rounded-lg bg-[color:rgba(191,212,255,0.16)] px-2 py-1 text-[var(--fg)]"
                      : "px-2 py-1"
                  }
                >
                  {value}
                </span>
              );
            })}
            {sequence.length > MAX_SEQUENCE_DISPLAY ? (
              <span className="px-1 text-[var(--muted)]">…</span>
            ) : null}
          </div>
          <p className="mt-2 text-[11px] uppercase tracking-[0.2em]">
            Focus F{focusIndex + 1}: {sequence[focusIndex]}
          </p>
        </div>
      </ThreeSceneCanvas>
      <SceneControlsPanel
        schema={paramSchema}
        values={params}
        onChange={handleChange}
      >
        <RenderQualitySelect value={renderQuality} onChange={setRenderQuality} />
      </SceneControlsPanel>
    </div>
  );
}
