import * as THREE from "three";

import type { CreateSceneParams, CreateSceneResult, SceneSchema } from "@/app/lib/three/types";
import { disposeObject } from "@/app/lib/three/utils";

export type PhiSceneParams = {
  pointCount: number;
  radialScale: number;
  overlayEnabled: boolean;
  drift: boolean;
};

export const defaultParams: PhiSceneParams = {
  pointCount: 640,
  radialScale: 1,
  overlayEnabled: true,
  drift: true,
};

export const paramSchema: SceneSchema = [
  {
    type: "range",
    id: "pointCount",
    label: "Point Count",
    min: 200,
    max: 1400,
    step: 20,
    formatValue: (value) => Math.round(value).toString(),
  },
  {
    type: "range",
    id: "radialScale",
    label: "Radial Scale",
    min: 0.6,
    max: 1.6,
    step: 0.05,
    formatValue: (value) => value.toFixed(2),
  },
  {
    type: "toggle",
    id: "overlayEnabled",
    label: "Golden Frames",
  },
  {
    type: "toggle",
    id: "drift",
    label: "Drift Mode",
  },
];

const GOLDEN_ANGLE = THREE.MathUtils.degToRad(137.507764);
const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;

const buildPhyllotaxis = (
  count: number,
  radius: number,
  radialScale: number,
) => {
  const positions = new Float32Array(count * 3);
  const maxIndex = Math.max(1, count - 1);
  for (let i = 0; i < count; i += 1) {
    const t = i / maxIndex;
    const angle = i * GOLDEN_ANGLE;
    const r = radius * radialScale * Math.sqrt(t);
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = Math.sin(t * Math.PI) * 0.18;
  }
  return positions;
};

const createGoldenFrames = (width: number, height: number, depth: number) => {
  const group = new THREE.Group();
  let frameWidth = width;
  let frameHeight = height;
  let offsetX = 0;
  let offsetY = 0;
  let direction = 0;

  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0xececec,
    transparent: true,
    opacity: 0.45,
  });

  for (let i = 0; i < depth; i += 1) {
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(
        offsetX - frameWidth / 2,
        offsetY - frameHeight / 2,
        i * 0.06,
      ),
      new THREE.Vector3(
        offsetX + frameWidth / 2,
        offsetY - frameHeight / 2,
        i * 0.06,
      ),
      new THREE.Vector3(
        offsetX + frameWidth / 2,
        offsetY + frameHeight / 2,
        i * 0.06,
      ),
      new THREE.Vector3(
        offsetX - frameWidth / 2,
        offsetY + frameHeight / 2,
        i * 0.06,
      ),
    ]);
    const frame = new THREE.LineLoop(geometry, lineMaterial);
    group.add(frame);

    const squareSize = Math.min(frameWidth, frameHeight);
    if (direction === 0) {
      offsetX += (frameWidth - squareSize) / 2;
      frameWidth -= squareSize;
    } else if (direction === 1) {
      offsetY += (frameHeight - squareSize) / 2;
      frameHeight -= squareSize;
    } else if (direction === 2) {
      offsetX -= (frameWidth - squareSize) / 2;
      frameWidth -= squareSize;
    } else {
      offsetY -= (frameHeight - squareSize) / 2;
      frameHeight -= squareSize;
    }
    direction = (direction + 1) % 4;
  }

  return group;
};

export const createScene = (
  params: CreateSceneParams,
  options: PhiSceneParams,
): CreateSceneResult => {
  const { canvas, width, height, dpr, isMobile, detailLevel } = params;
  const { pointCount, radialScale, overlayEnabled, drift } = options;

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
  camera.position.set(0, 0, 6.4);

  const group = new THREE.Group();
  scene.add(group);

  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  const key = new THREE.PointLight(0xf5f5f5, 0.9, 15);
  key.position.set(4, 4, 6);
  const rim = new THREE.PointLight(0xe1e1e1, 0.6, 12);
  rim.position.set(-4, -3, 4);
  scene.add(ambient, key, rim);

  const baseHeight = isMobile ? 1.8 : 2.2;
  const baseWidth = baseHeight * GOLDEN_RATIO;

  const phyllotaxisGeometry = new THREE.BufferGeometry();
  const effectiveCount = Math.max(120, Math.floor(pointCount * detailLevel));
  phyllotaxisGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
      buildPhyllotaxis(effectiveCount, baseHeight * 1.2, radialScale),
      3,
    ),
  );
  const phyllotaxisMaterial = new THREE.PointsMaterial({
    color: 0xf2f2f2,
    size: isMobile ? 0.035 : 0.04,
    opacity: 0.7,
    transparent: true,
    depthWrite: false,
  });
  const points = new THREE.Points(phyllotaxisGeometry, phyllotaxisMaterial);
  group.add(points);

  const frameGroup = createGoldenFrames(baseWidth, baseHeight, 7);
  frameGroup.visible = overlayEnabled;
  group.add(frameGroup);

  const paneGeometry = new THREE.PlaneGeometry(baseWidth * 1.02, baseHeight * 1.02);
  const paneMaterial = new THREE.MeshStandardMaterial({
    color: 0x0f0f12,
    metalness: 0.6,
    roughness: 0.35,
    transparent: true,
    opacity: 0.4,
  });
  const pane = new THREE.Mesh(paneGeometry, paneMaterial);
  pane.position.z = -0.14;
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

  canvas.addEventListener("pointermove", handlePointerMove);
  canvas.addEventListener("pointerdown", handlePointerMove);
  canvas.addEventListener("pointerleave", handlePointerLeave);

  let elapsed = 0;
  const update = (delta: number) => {
    elapsed += delta;
    const driftX = drift ? Math.sin(elapsed * 0.2) * 0.08 : 0;
    const driftY = drift ? Math.cos(elapsed * 0.24) * 0.06 : 0;
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
    if (drift) {
      group.scale.setScalar(1 + Math.sin(elapsed * 0.35) * 0.015);
    }
    renderer.render(scene, camera);
  };

  const dispose = () => {
    canvas.removeEventListener("pointermove", handlePointerMove);
    canvas.removeEventListener("pointerdown", handlePointerMove);
    canvas.removeEventListener("pointerleave", handlePointerLeave);
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
