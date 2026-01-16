"use client";

import { useCallback, useState } from "react";
import RenderQualitySelect from "@/app/components/RenderQualitySelect";
import SceneControlsPanel from "@/app/components/SceneControlsPanel";
import ThreeSceneCanvas from "@/app/components/ThreeSceneCanvas";
import {
  createScene as createSqrt2Scene,
  defaultParams,
  paramSchema,
  type Sqrt2SceneParams,
} from "@/app/lib/three/scenes/sqrt2";
import type { CreateSceneParams, RenderQuality, SceneParamValue } from "@/app/lib/three/types";

export default function Sqrt2SceneClient() {
  const [params, setParams] = useState<Sqrt2SceneParams>(defaultParams);
  const [renderQuality, setRenderQuality] =
    useState<RenderQuality>("medium");

  const createScene = useCallback(
    (sceneParams: CreateSceneParams) => createSqrt2Scene(sceneParams, params),
    [params],
  );

  const handleChange = (id: string, value: SceneParamValue) => {
    setParams((prev) => ({ ...prev, [id]: value } as Sqrt2SceneParams));
  };

  return (
    <div className="grid gap-6">
      <ThreeSceneCanvas
        createScene={createScene}
        renderQuality={renderQuality}
        label="Root-2 rectangle tiling"
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
