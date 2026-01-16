import type { Camera, Scene, WebGLRenderer } from "three";

export type CreateSceneParams = {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  dpr: number;
  isMobile: boolean;
};

export type CreateSceneResult = {
  scene: Scene;
  camera: Camera;
  renderer: WebGLRenderer;
  update: (dt: number) => void;
  dispose: () => void;
};

export type CreateScene = (params: CreateSceneParams) => CreateSceneResult;
