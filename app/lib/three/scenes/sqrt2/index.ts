import * as THREE from "three";

import type {
  CreateSceneParams,
  CreateSceneResult,
  SceneSchema,
} from "@/app/lib/three/types";
import { disposeObject } from "@/app/lib/three/utils";

export type Sqrt2SceneParams = {
  mode: "proof" | "aesthetic";
  foldAmount: number;
};

export const defaultParams: Sqrt2SceneParams = {
  mode: "proof",
  foldAmount: 0.6,
};

export const paramSchema: SceneSchema = [
  {
    type: "select",
    id: "mode",
    label: "Mode",
    options: [
      { value: "proof", label: "Geometry Proof" },
      { value: "aesthetic", label: "Aesthetic" },
    ],
  },
  {
    type: "range",
    id: "foldAmount",
    label: "Fold / Scale",
    min: 0,
    max: 1,
    step: 0.02,
    formatValue: (value) => value.toFixed(2),
  },
];

const buildRoot2Frames = (
  width: number,
  height: number,
  depth: number,
  zSpacing: number,
) => {
  const group = new THREE.Group();
  const material = new THREE.LineBasicMaterial({
    color: 0xe5e5e5,
    transparent: true,
    opacity: 0.5,
  });

  for (let i = 0; i < depth; i += 1) {
    const scale = 1 / Math.pow(Math.SQRT2, i);
    const w = width * scale;
    const h = height * scale;
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-w / 2, -h / 2, -i * zSpacing),
      new THREE.Vector3(w / 2, -h / 2, -i * zSpacing),
      new THREE.Vector3(w / 2, h / 2, -i * zSpacing),
      new THREE.Vector3(-w / 2, h / 2, -i * zSpacing),
    ]);
    group.add(new THREE.LineLoop(geometry, material));
  }

  return group;
};

export const createScene = (
  params: CreateSceneParams,
  options: Sqrt2SceneParams,
): CreateSceneResult => {
  const { canvas, width, height, dpr, isMobile, detailLevel } = params;
  const { mode, foldAmount } = options;

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

  const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 50);
  camera.position.set(0, 0.25, 6);

  const group = new THREE.Group();
  scene.add(group);

  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  const key = new THREE.DirectionalLight(0xf4f4f4, 0.9);
  key.position.set(4, 5, 6);
  const rim = new THREE.PointLight(0xdcdcdc, 0.6, 12);
  rim.position.set(-4, -2, 4);
  scene.add(ambient, key, rim);

  const baseHeight = isMobile ? 1.6 : 2.1;
  const baseWidth = baseHeight * Math.SQRT2;

  const frameGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-baseWidth / 2, -baseHeight / 2, 0),
    new THREE.Vector3(baseWidth / 2, -baseHeight / 2, 0),
    new THREE.Vector3(baseWidth / 2, baseHeight / 2, 0),
    new THREE.Vector3(-baseWidth / 2, baseHeight / 2, 0),
  ]);
  const frame = new THREE.LineLoop(
    frameGeometry,
    new THREE.LineBasicMaterial({ color: 0xf2f2f2, opacity: 0.8, transparent: true }),
  );
  group.add(frame);

  const squareGeometry = new THREE.PlaneGeometry(baseHeight, baseHeight);
  const squareMaterial = new THREE.MeshStandardMaterial({
    color: 0x101013,
    roughness: 0.35,
    metalness: 0.35,
    transparent: true,
    opacity: 0.55,
    side: THREE.DoubleSide,
  });
  const transformGroup = new THREE.Group();
  const baseSquare = new THREE.Mesh(squareGeometry, squareMaterial);
  transformGroup.add(baseSquare);

  const squareFrame = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-baseHeight / 2, -baseHeight / 2, 0.03),
      new THREE.Vector3(baseHeight / 2, -baseHeight / 2, 0.03),
      new THREE.Vector3(baseHeight / 2, baseHeight / 2, 0.03),
      new THREE.Vector3(-baseHeight / 2, baseHeight / 2, 0.03),
    ]),
    new THREE.LineBasicMaterial({ color: 0xaaaaaa, opacity: 0.6, transparent: true }),
  );
  transformGroup.add(squareFrame);

  const diagonalGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-baseHeight / 2, -baseHeight / 2, 0.08),
    new THREE.Vector3(baseHeight / 2, baseHeight / 2, 0.08),
  ]);
  const diagonal = new THREE.Line(
    diagonalGeometry,
    new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.7, transparent: true }),
  );
  transformGroup.add(diagonal);
  group.add(transformGroup);

  const depth = mode === "proof" ? 4 : 7;
  const frameDepth = Math.max(2, Math.floor(depth * detailLevel));
  const frameStack = buildRoot2Frames(baseWidth, baseHeight, frameDepth, 0.12);
  frameStack.position.z = -0.4;
  frameStack.position.y = 0.05;
  group.add(frameStack);

  let elapsed = 0;
  const update = (delta: number) => {
    if (!prefersReducedMotion) {
      elapsed += delta;
    }
    const speed = mode === "proof" ? 0.2 : 0.6;
    const motion = prefersReducedMotion ? 0 : elapsed * speed;

    transformGroup.scale.x = THREE.MathUtils.lerp(1, Math.SQRT2, foldAmount);
    transformGroup.rotation.y = THREE.MathUtils.lerp(0, Math.PI / 10, foldAmount);
    transformGroup.rotation.z = THREE.MathUtils.lerp(0, -Math.PI / 16, foldAmount);

    group.rotation.y = Math.sin(motion) * (mode === "proof" ? 0.06 : 0.12);
    group.rotation.x = Math.cos(motion * 0.8) * (mode === "proof" ? 0.04 : 0.08);

    renderer.render(scene, camera);
  };

  const dispose = () => {
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
