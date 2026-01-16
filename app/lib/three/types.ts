import type { Camera, Scene, WebGLRenderer } from "three";

export type RenderQuality = "low" | "medium" | "high";

export type CreateSceneParams = {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  dpr: number;
  isMobile: boolean;
  renderQuality: RenderQuality;
  detailLevel: number;
};

export type CreateSceneResult = {
  scene: Scene;
  camera: Camera;
  renderer: WebGLRenderer;
  update: (dt: number) => void;
  dispose: () => void;
};

export type CreateScene = (params: CreateSceneParams) => CreateSceneResult;

export type SceneParamValue = number | boolean | string;

export type SceneControlOption = {
  value: string;
  label: string;
};

export type SceneControl =
  | {
      type: "range";
      id: string;
      label: string;
      min: number;
      max: number;
      step?: number;
      formatValue?: (value: number) => string;
    }
  | {
      type: "toggle";
      id: string;
      label: string;
    }
  | {
      type: "select";
      id: string;
      label: string;
      options: SceneControlOption[];
    };

export type SceneSchema = SceneControl[];

export type SceneDefinition<TParams extends Record<string, SceneParamValue>> = {
  id: string;
  title: string;
  description: string;
  createScene: (params: CreateSceneParams, options: TParams) => CreateSceneResult;
  defaultParams: TParams;
  schema: SceneSchema;
};
