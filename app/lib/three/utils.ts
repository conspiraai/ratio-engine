import type { Material, Object3D } from "three";

export const clampDpr = (dpr: number, isMobile: boolean) => {
  const cap = isMobile ? 1.25 : 1.5;
  return Math.min(dpr, cap);
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
