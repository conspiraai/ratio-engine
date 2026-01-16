import { PHI, TAU } from "./constants";

export type SpiralPoint = {
  x: number;
  y: number;
  z: number;
};

export const createPhiSpiral = (
  count = 240,
  radius = 0.75,
  height = 4.8,
): SpiralPoint[] => {
  const points: SpiralPoint[] = [];

  for (let index = 0; index < count; index += 1) {
    const t = index / Math.max(count - 1, 1);
    const angle = t * TAU * 3.5;
    const growth = Math.pow(PHI, t * 2) / PHI;
    const spiralRadius = radius * growth;
    const y = (t - 0.5) * height;

    points.push({
      x: Math.cos(angle) * spiralRadius,
      y,
      z: Math.sin(angle) * spiralRadius,
    });
  }

  return points;
};
