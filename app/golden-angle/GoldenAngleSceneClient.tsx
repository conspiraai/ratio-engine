"use client";

import { useCallback, useState } from "react";
import RenderQualitySelect from "@/app/components/RenderQualitySelect";
import SceneControlsPanel from "@/app/components/SceneControlsPanel";
import ThreeSceneCanvas from "@/app/components/ThreeSceneCanvas";
import {
  createScene as createGoldenAngleScene,
  defaultParams,
  paramSchema,
  type GoldenAngleSceneParams,
} from "@/app/lib/three/scenes/golden-angle";
import type {
  CreateSceneParams,
  RenderQuality,
  SceneParamValue,
} from "@/app/lib/three/types";

export default function GoldenAngleSceneClient() {
  const [params, setParams] = useState<GoldenAngleSceneParams>(defaultParams);
  const [renderQuality, setRenderQuality] = useState<RenderQuality>("medium");

  const createScene = useCallback(
    (sceneParams: CreateSceneParams) =>
      createGoldenAngleScene(sceneParams, params),
    [params],
  );

  const handleChange = (id: string, value: SceneParamValue) => {
    setParams((prev) => ({ ...prev, [id]: value } as GoldenAngleSceneParams));
  };

  return (
    <div className="grid gap-6">
      <ThreeSceneCanvas
        createScene={createScene}
        renderQuality={renderQuality}
        label="Golden angle instrument"
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
