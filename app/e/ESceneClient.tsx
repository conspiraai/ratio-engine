"use client";

import { useCallback, useState } from "react";
import RenderQualitySelect from "@/app/components/RenderQualitySelect";
import SceneControlsPanel from "@/app/components/SceneControlsPanel";
import ThreeSceneCanvas from "@/app/components/ThreeSceneCanvas";
import {
  createScene as createEScene,
  defaultParams,
  paramSchema,
  type ESceneParams,
} from "@/app/lib/three/scenes/e";
import type { CreateSceneParams, RenderQuality, SceneParamValue } from "@/app/lib/three/types";

export default function ESceneClient() {
  const [params, setParams] = useState<ESceneParams>(defaultParams);
  const [renderQuality, setRenderQuality] =
    useState<RenderQuality>("medium");

  const createScene = useCallback(
    (sceneParams: CreateSceneParams) => createEScene(sceneParams, params),
    [params],
  );

  const handleChange = (id: string, value: SceneParamValue) => {
    setParams((prev) => ({ ...prev, [id]: value } as ESceneParams));
  };

  return (
    <div className="grid gap-6">
      <ThreeSceneCanvas
        createScene={createScene}
        renderQuality={renderQuality}
        label="Exponential compounding curve"
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
