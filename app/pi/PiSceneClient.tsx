"use client";

import { useCallback, useState } from "react";
import RenderQualitySelect from "@/app/components/RenderQualitySelect";
import SceneControlsPanel from "@/app/components/SceneControlsPanel";
import ThreeSceneCanvas from "@/app/components/ThreeSceneCanvas";
import {
  createScene as createPiScene,
  defaultParams,
  paramSchema,
  type PiSceneParams,
} from "@/app/lib/three/scenes/pi";
import type { CreateSceneParams, RenderQuality, SceneParamValue } from "@/app/lib/three/types";

export default function PiSceneClient() {
  const [params, setParams] = useState<PiSceneParams>(defaultParams);
  const [renderQuality, setRenderQuality] =
    useState<RenderQuality>("medium");

  const createScene = useCallback(
    (sceneParams: CreateSceneParams) => createPiScene(sceneParams, params),
    [params],
  );

  const handleChange = (id: string, value: SceneParamValue) => {
    setParams((prev) => ({ ...prev, [id]: value } as PiSceneParams));
  };

  return (
    <div className="grid gap-6">
      <ThreeSceneCanvas
        createScene={createScene}
        renderQuality={renderQuality}
        label="Pi polygon approximation"
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
