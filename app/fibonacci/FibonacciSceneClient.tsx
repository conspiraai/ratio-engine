"use client";

import { useCallback, useState } from "react";
import RenderQualitySelect from "@/app/components/RenderQualitySelect";
import SceneControlsPanel from "@/app/components/SceneControlsPanel";
import ThreeSceneCanvas from "@/app/components/ThreeSceneCanvas";
import {
  createScene as createFibonacciScene,
  defaultParams,
  paramSchema,
  type FibonacciSceneParams,
} from "@/app/lib/three/scenes/fibonacci";
import type { CreateSceneParams, RenderQuality, SceneParamValue } from "@/app/lib/three/types";

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

  return (
    <div className="grid gap-6">
      <ThreeSceneCanvas
        createScene={createScene}
        renderQuality={renderQuality}
        label="Fibonacci sequence modes"
      />
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
