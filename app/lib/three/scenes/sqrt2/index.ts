import * as THREE from "three";

import type { CreateSceneParams, CreateSceneResult, SceneSchema } from "@/app/lib/three/types";
import { disposeObject } from "@/app/lib/three/utils";

export type Sqrt2SceneParams = {
  depth: number;
  foldAmount: number;
  animateSplit: boolean;
};

export const defaultParams: Sqrt2SceneParams = {
  depth: 6,
  foldAmount: 0.6,
  animateSplit: true,
};

export const paramSchema: SceneSchema = [
  {
    type: "range",
    id: "depth",
    label: "Subdivision Depth",
    min: 2,
    max: 10,
    step: 1,
    formatValue: (value) => Math.round(value).toString(),
  },
  {
    type: "range",
    id: "foldAmount",
    label: "Paper Fold",
    min: 0,
    max: 1,
    step: 0.02,
    formatValue: (value) => value.toFixed(2),
  },
  {
    type: "toggle",
    id: "animateSplit",
    label: "Animate Splits",
  },
];

const buildSubdivisionLines = (width: number, height: number, depth: number) => {
  const positions: number[] = [];
  let x = -width / 2;
  let y = -height / 2;
  let w = width;
  let h = height;

  for (let i = 0; i < depth; i += 1) {
    const size = Math.min(w, h);
    if (size <= 0) {
      break;
    }
    if (w > h) {
      const splitX = x + size;
      positions.push(splitX, y, 0, splitX, y + h, 0);
      x += size;
      w -= size;
    } else {
      const splitY = y + size;
      positions.push(x, splitY, 0, x + w, splitY, 0);
      y += size;
      h -= size;
    }
  }
  return positions;
};

export const createScene = (
  params: CreateSceneParams,
  options: Sqrt2SceneParams,
): CreateSceneResult => {
  const { canvas, width, height, dpr, isMobile, detailLevel } = params;
  const { depth, foldAmount, animateSplit } = options;

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
  camera.position.set(0, 0.4, 5.8);

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

  const subdivisionGeometry = new THREE.BufferGeometry();
  subdivisionGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(
      buildSubdivisionLines(
        baseWidth,
        baseHeight,
        Math.max(2, Math.floor(depth * detailLevel)),
      ),
      3,
    ),
  );
  const subdivisionMaterial = new THREE.LineBasicMaterial({
    color: 0x8c8c8c,
    transparent: true,
    opacity: 0.5,
  });
  const subdivisions = new THREE.LineSegments(subdivisionGeometry, subdivisionMaterial);
  group.add(subdivisions);

  const squareSize = baseHeight;
  const squareGeometry = new THREE.PlaneGeometry(squareSize, squareSize);
  const squareMaterial = new THREE.MeshStandardMaterial({
    color: 0x101013,
    roughness: 0.45,
    metalness: 0.3,
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide,
  });
  const baseSquare = new THREE.Mesh(squareGeometry, squareMaterial);
  baseSquare.position.x = -baseWidth / 2 + squareSize / 2;
  baseSquare.position.z = 0.05;
  group.add(baseSquare);

  const foldPivot = new THREE.Group();
  foldPivot.position.x = -baseWidth / 2 + squareSize;
  group.add(foldPivot);

  const foldSquare = new THREE.Mesh(squareGeometry, squareMaterial.clone());
  foldSquare.position.x = -squareSize / 2;
  foldSquare.position.z = 0.08;
  foldPivot.add(foldSquare);

  const diagonalGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(
      -baseWidth / 2,
      -squareSize / 2,
      0.12,
    ),
    new THREE.Vector3(
      -baseWidth / 2 + squareSize,
      squareSize / 2,
      0.12,
    ),
  ]);
  const diagonal = new THREE.Line(
    diagonalGeometry,
    new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.6, transparent: true }),
  );
  group.add(diagonal);

  let elapsed = 0;
  const totalSegments = subdivisionGeometry.getAttribute("position").count;
  const update = (delta: number) => {
    elapsed += delta;
    const progress = animateSplit
      ? Math.sin(elapsed * 0.6) * 0.5 + 0.5
      : 1;
    const drawCount = Math.max(2, Math.floor(totalSegments * progress));
    subdivisionGeometry.setDrawRange(0, drawCount);

    foldPivot.rotation.y = THREE.MathUtils.lerp(0, Math.PI / 4, foldAmount);
    foldPivot.rotation.z = THREE.MathUtils.lerp(0, -Math.PI / 10, foldAmount);

    group.rotation.y = Math.sin(elapsed * 0.2) * 0.08;
    group.rotation.x = Math.cos(elapsed * 0.16) * 0.04;

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
