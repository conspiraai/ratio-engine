import type { Material, Object3D } from "three";
import type { RenderQuality } from "@/app/lib/three/types";

export const clampDpr = (dpr: number, cap: number) => Math.min(dpr, cap);

export const getRenderQualitySettings = (
  renderQuality: RenderQuality,
  isMobile: boolean,
) => {
  const baseCap = isMobile ? 1.25 : 1.8;
  const dprScale =
    renderQuality === "low" ? 0.9 : renderQuality === "high" ? 1.2 : 1;
  const detailScale =
    renderQuality === "low" ? 0.75 : renderQuality === "high" ? 1.4 : 1;
  return {
    dprCap: baseCap * dprScale,
    detailScale,
  };
};

const disposeMaterial = (material: Material | Material[]) => {
  if (Array.isArray(material)) {
    material.forEach((entry) => entry.dispose());
    return;
  }
  material.dispose();
};

export const disposeObject = (object: Object3D) => {
  object.traverse((child) => {
    const mesh = child as Object3D & { geometry?: { dispose: () => void } };
    if (mesh.geometry) {
      mesh.geometry.dispose();
    }
    const materialHolder = child as Object3D & {
      material?: Material | Material[];
    };
    if (materialHolder.material) {
      disposeMaterial(materialHolder.material);
    }
  });
};
