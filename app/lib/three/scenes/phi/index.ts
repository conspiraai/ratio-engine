import * as THREE from "three";

import type {
  CreateSceneParams,
  CreateSceneResult,
  SceneSchema,
} from "@/app/lib/three/types";
import { disposeObject } from "@/app/lib/three/utils";

export type PhiSceneParams = {
  pointCount: number;
  radialScale: number;
  seedJitter: number;
  recursionDepth: number;
  drift: boolean;
};

export const defaultParams: PhiSceneParams = {
  pointCount: 780,
  radialScale: 1,
  seedJitter: 0.12,
  recursionDepth: 8,
  drift: true,
};

export const paramSchema: SceneSchema = [
  {
    type: "range",
    id: "pointCount",
    label: "Point Count",
    min: 260,
    max: 1600,
    step: 20,
    formatValue: (value) => Math.round(value).toString(),
  },
  {
    type: "range",
    id: "radialScale",
    label: "Spread",
    min: 0.7,
    max: 1.5,
    step: 0.05,
    formatValue: (value) => value.toFixed(2),
  },
  {
    type: "range",
    id: "seedJitter",
    label: "Seed Jitter",
    min: 0,
    max: 0.35,
    step: 0.02,
    formatValue: (value) => value.toFixed(2),
  },
  {
    type: "range",
    id: "recursionDepth",
    label: "Recursion Depth",
    min: 6,
    max: 10,
    step: 1,
    formatValue: (value) => Math.round(value).toString(),
  },
  {
    type: "toggle",
    id: "drift",
    label: "Drift Mode",
  },
];

const GOLDEN_ANGLE = THREE.MathUtils.degToRad(137.507764);
const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;

const seededJitter = (index: number) => {
  const value = Math.sin(index * 12.9898) * 43758.5453;
  return (value - Math.floor(value)) * 2 - 1;
};

const buildPhyllotaxis = (
  count: number,
  radius: number,
  radialScale: number,
  jitter: number,
) => {
  const positions = new Float32Array(count * 3);
  const maxIndex = Math.max(1, count - 1);
  for (let i = 0; i < count; i += 1) {
    const t = i / maxIndex;
    const angle = i * GOLDEN_ANGLE;
    const r = radius * radialScale * Math.sqrt(t);
    const noise = seededJitter(i) * jitter;
    const x = Math.cos(angle + noise) * r;
    const y = Math.sin(angle + noise) * r;
    positions[i * 3] = x + noise * 0.12;
    positions[i * 3 + 1] = y - noise * 0.08;
    positions[i * 3 + 2] = Math.sin(t * Math.PI) * 0.2 + noise * 0.05;
  }
  return positions;
};

type GoldenFrameResult = {
  frameGroup: THREE.Group;
  spiralLine: THREE.Line;
};

const buildGoldenFrames = (
  width: number,
  height: number,
  depth: number,
  zSpacing: number,
): GoldenFrameResult => {
  const group = new THREE.Group();
  const points: THREE.Vector3[] = [];
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0xf2f2f2,
    transparent: true,
    opacity: 0.5,
  });

  let rect = {
    x: -width / 2,
    y: -height / 2,
    w: width,
    h: height,
  };
  let direction = 0;

  for (let i = 0; i < depth; i += 1) {
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(rect.x, rect.y, i * zSpacing),
      new THREE.Vector3(rect.x + rect.w, rect.y, i * zSpacing),
      new THREE.Vector3(rect.x + rect.w, rect.y + rect.h, i * zSpacing),
      new THREE.Vector3(rect.x, rect.y + rect.h, i * zSpacing),
    ]);
    const frame = new THREE.LineLoop(geometry, lineMaterial);
    group.add(frame);

    const size = Math.min(rect.w, rect.h);
    const square = { x: rect.x, y: rect.y, size };
    if (direction === 0) {
      square.x = rect.x + rect.w - size;
      square.y = rect.y;
      rect.w -= size;
    } else if (direction === 1) {
      square.x = rect.x;
      square.y = rect.y + rect.h - size;
      rect.h -= size;
    } else if (direction === 2) {
      square.x = rect.x;
      square.y = rect.y;
      rect.x += size;
      rect.w -= size;
    } else {
      square.x = rect.x;
      square.y = rect.y;
      rect.y += size;
      rect.h -= size;
    }

    const arcCenter = new THREE.Vector2(0, 0);
    let startAngle = 0;
    let endAngle = 0;
    if (direction === 0) {
      arcCenter.set(square.x + square.size, square.y);
      startAngle = Math.PI / 2;
      endAngle = Math.PI;
    } else if (direction === 1) {
      arcCenter.set(square.x + square.size, square.y + square.size);
      startAngle = Math.PI;
      endAngle = Math.PI * 1.5;
    } else if (direction === 2) {
      arcCenter.set(square.x, square.y + square.size);
      startAngle = Math.PI * 1.5;
      endAngle = Math.PI * 2;
    } else {
      arcCenter.set(square.x, square.y);
      startAngle = 0;
      endAngle = Math.PI / 2;
    }

    const steps = 32;
    for (let s = 0; s <= steps; s += 1) {
      const t = s / steps;
      const angle = THREE.MathUtils.lerp(startAngle, endAngle, t);
      points.push(
        new THREE.Vector3(
          arcCenter.x + Math.cos(angle) * square.size,
          arcCenter.y + Math.sin(angle) * square.size,
          i * zSpacing + 0.02,
        ),
      );
    }

    direction = (direction + 1) % 4;
  }

  const spiralGeometry = new THREE.BufferGeometry().setFromPoints(points);
  const spiral = new THREE.Line(
    spiralGeometry,
    new THREE.LineBasicMaterial({
      color: 0xbfd4ff,
      transparent: true,
      opacity: 0.65,
    }),
  );

  return { frameGroup: group, spiralLine: spiral };
};

export const createScene = (
  params: CreateSceneParams,
  options: PhiSceneParams,
): CreateSceneResult => {
  const { canvas, width, height, dpr, isMobile, detailLevel } = params;
  const { pointCount, radialScale, seedJitter, recursionDepth, drift } = options;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#050505");
  scene.fog = new THREE.Fog("#050505", 6, 16);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !isMobile,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(dpr);
  renderer.setSize(width, height, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 60);
  camera.position.set(0, 0.1, 6.4);

  const group = new THREE.Group();
  scene.add(group);

  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  const key = new THREE.PointLight(0xf5f5f5, 0.9, 15);
  key.position.set(4, 4, 6);
  const rim = new THREE.PointLight(0xbfd4ff, 0.6, 12);
  rim.position.set(-4, -3, 4);
  scene.add(ambient, key, rim);

  const baseHeight = isMobile ? 1.8 : 2.3;
  const baseWidth = baseHeight * GOLDEN_RATIO;

  const phyllotaxisGeometry = new THREE.BufferGeometry();
  const effectiveCount = Math.max(120, Math.floor(pointCount * detailLevel));
  phyllotaxisGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
      buildPhyllotaxis(
        effectiveCount,
        baseHeight * 1.2,
        radialScale,
        seedJitter,
      ),
      3,
    ),
  );
  const phyllotaxisMaterial = new THREE.PointsMaterial({
    color: 0xf4f4f4,
    size: isMobile ? 0.032 : 0.038,
    opacity: 0.75,
    transparent: true,
    depthWrite: false,
  });
  const points = new THREE.Points(phyllotaxisGeometry, phyllotaxisMaterial);
  points.position.z = 0.08;
  group.add(points);

  const zSpacing = 0.08;
  let currentDepth = recursionDepth;
  let frameGroup = buildGoldenFrames(baseWidth, baseHeight, currentDepth, zSpacing);
  group.add(frameGroup.frameGroup, frameGroup.spiralLine);

  const paneGeometry = new THREE.PlaneGeometry(baseWidth * 1.05, baseHeight * 1.05);
  const paneMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x0b0b0e,
    metalness: 0.2,
    roughness: 0.15,
    transmission: 0.6,
    transparent: true,
    opacity: 0.35,
    clearcoat: 0.8,
    clearcoatRoughness: 0.2,
  });
  const pane = new THREE.Mesh(paneGeometry, paneMaterial);
  pane.position.z = -0.18;
  group.add(pane);

  const pointerTarget = new THREE.Vector2(0, 0);
  const rotation = new THREE.Vector2(0, 0);

  const handlePointerMove = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    pointerTarget.set(x, y);
  };
  const handlePointerLeave = () => {
    pointerTarget.set(0, 0);
  };

  const rebuildFrames = (depth: number) => {
    group.remove(frameGroup.frameGroup, frameGroup.spiralLine);
    disposeObject(frameGroup.frameGroup);
    disposeObject(frameGroup.spiralLine);
    frameGroup = buildGoldenFrames(baseWidth, baseHeight, depth, zSpacing);
    group.add(frameGroup.frameGroup, frameGroup.spiralLine);
  };

  const handleWheel = (event: WheelEvent) => {
    event.preventDefault();
    const nextDepth = THREE.MathUtils.clamp(
      currentDepth + (event.deltaY > 0 ? -1 : 1),
      6,
      10,
    );
    if (nextDepth !== currentDepth) {
      currentDepth = nextDepth;
      rebuildFrames(currentDepth);
    }
  };

  canvas.addEventListener("pointermove", handlePointerMove);
  canvas.addEventListener("pointerdown", handlePointerMove);
  canvas.addEventListener("pointerleave", handlePointerLeave);
  canvas.addEventListener("wheel", handleWheel, { passive: false });

  let elapsed = 0;
  const update = (delta: number) => {
    if (!prefersReducedMotion) {
      elapsed += delta;
    }
    const driftX = !prefersReducedMotion && drift ? Math.sin(elapsed * 0.2) * 0.08 : 0;
    const driftY = !prefersReducedMotion && drift ? Math.cos(elapsed * 0.24) * 0.06 : 0;
    rotation.x = THREE.MathUtils.lerp(
      rotation.x,
      pointerTarget.y * 0.25 + driftY,
      0.05,
    );
    rotation.y = THREE.MathUtils.lerp(
      rotation.y,
      pointerTarget.x * 0.28 + driftX,
      0.05,
    );
    group.rotation.x = rotation.x;
    group.rotation.y = rotation.y;
    if (!prefersReducedMotion && drift) {
      group.scale.setScalar(1 + Math.sin(elapsed * 0.35) * 0.015);
    }
    renderer.render(scene, camera);
  };

  const dispose = () => {
    canvas.removeEventListener("pointermove", handlePointerMove);
    canvas.removeEventListener("pointerdown", handlePointerMove);
    canvas.removeEventListener("pointerleave", handlePointerLeave);
    canvas.removeEventListener("wheel", handleWheel);
    disposeObject(group);
    scene.clear();
    renderer.dispose();
  };

  return {
    scene,
    camera,
    renderer,
    update,
    dispose,
  };
};
