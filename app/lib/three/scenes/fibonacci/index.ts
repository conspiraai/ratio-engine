import * as THREE from "three";

import type { CreateSceneParams, CreateSceneResult, SceneSchema } from "@/app/lib/three/types";
import { disposeObject } from "@/app/lib/three/utils";

export type FibonacciSceneParams = {
  mode: "lattice" | "spiral" | "rectangles";
  terms: number;
  spiralTightness: number;
};

export const defaultParams: FibonacciSceneParams = {
  mode: "spiral",
  terms: 8,
  spiralTightness: 0.75,
};

export const paramSchema: SceneSchema = [
  {
    type: "select",
    id: "mode",
    label: "Mode",
    options: [
      { value: "lattice", label: "Lattice" },
      { value: "spiral", label: "Spiral" },
      { value: "rectangles", label: "Rectangles" },
    ],
  },
  {
    type: "range",
    id: "terms",
    label: "Terms",
    min: 4,
    max: 12,
    step: 1,
    formatValue: (value) => Math.round(value).toString(),
  },
  {
    type: "range",
    id: "spiralTightness",
    label: "Spiral Tightness",
    min: 0.4,
    max: 1.2,
    step: 0.05,
    formatValue: (value) => value.toFixed(2),
  },
];

const buildFibonacci = (terms: number) => {
  const sequence = [1, 1];
  while (sequence.length < terms) {
    const length = sequence.length;
    sequence.push(sequence[length - 1] + sequence[length - 2]);
  }
  return sequence;
};

const buildRectangleFrames = (terms: number, scale: number) => {
  const sequence = buildFibonacci(terms);
  const positions: number[] = [];
  let x = 0;
  let y = 0;
  let direction = 0;

  for (let i = 0; i < sequence.length; i += 1) {
    const size = sequence[i] * scale;
    const halfSize = size / 2;
    const centerX = x + (direction === 0 ? halfSize : direction === 2 ? -halfSize : 0);
    const centerY = y + (direction === 1 ? halfSize : direction === 3 ? -halfSize : 0);
    const left = centerX - halfSize;
    const right = centerX + halfSize;
    const bottom = centerY - halfSize;
    const top = centerY + halfSize;
    positions.push(
      left,
      bottom,
      0,
      right,
      bottom,
      0,
      right,
      bottom,
      0,
      right,
      top,
      0,
      right,
      top,
      0,
      left,
      top,
      0,
      left,
      top,
      0,
      left,
      bottom,
      0,
    );

    if (direction === 0) {
      x += size;
    } else if (direction === 1) {
      y += size;
    } else if (direction === 2) {
      x -= size;
    } else {
      y -= size;
    }
    direction = (direction + 1) % 4;
  }
  return new Float32Array(positions);
};

const buildSpiral = (terms: number, scale: number, tightness: number) => {
  const sequence = buildFibonacci(terms);
  const points: THREE.Vector3[] = [];
  let angle = 0;
  for (let i = 0; i < sequence.length; i += 1) {
    const radius = sequence[i] * scale * tightness;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    points.push(new THREE.Vector3(x, y, 0));
    angle += Math.PI / 2;
  }
  return points;
};

const buildLattice = (size: number, spacing: number) => {
  const positions: number[] = [];
  for (let x = -size; x <= size; x += 1) {
    for (let y = -size; y <= size; y += 1) {
      positions.push(x * spacing, y * spacing, 0);
    }
  }
  return new Float32Array(positions);
};

export const createScene = (
  params: CreateSceneParams,
  options: FibonacciSceneParams,
): CreateSceneResult => {
  const { canvas, width, height, dpr, isMobile, detailLevel } = params;
  const { mode, terms, spiralTightness } = options;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#050505");
  scene.fog = new THREE.Fog("#050505", 6, 18);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !isMobile,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(dpr);
  renderer.setSize(width, height, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 80);
  camera.position.set(0, 0, 7);

  const group = new THREE.Group();
  scene.add(group);

  const ambient = new THREE.AmbientLight(0xffffff, 0.35);
  const key = new THREE.DirectionalLight(0xf4f4f4, 0.9);
  key.position.set(4, 5, 6);
  const rim = new THREE.PointLight(0xdedede, 0.6, 12);
  rim.position.set(-4, -2, 4);
  scene.add(ambient, key, rim);

  const scale = isMobile ? 0.13 : 0.16;

  const latticeGeometry = new THREE.BufferGeometry();
  latticeGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(buildLattice(6, scale * 1.3), 3),
  );
  const latticeMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: isMobile ? 0.03 : 0.025,
    opacity: 0.35,
    transparent: true,
    depthWrite: false,
  });
  const latticePoints = new THREE.Points(latticeGeometry, latticeMaterial);
  group.add(latticePoints);

  const spiralPoints = buildSpiral(
    Math.max(4, Math.floor(terms * detailLevel)),
    scale * 6,
    spiralTightness,
  );
  const spiralGeometry = new THREE.BufferGeometry().setFromPoints(spiralPoints);
  const spiralLine = new THREE.Line(
    spiralGeometry,
    new THREE.LineBasicMaterial({ color: 0xf5f5f5, transparent: true, opacity: 0.8 }),
  );
  group.add(spiralLine);

  const rectangleGeometry = new THREE.BufferGeometry();
  rectangleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
      buildRectangleFrames(
        Math.max(4, Math.floor(terms * detailLevel)),
        scale * 1.8,
      ),
      3,
    ),
  );
  const rectangleLine = new THREE.LineSegments(
    rectangleGeometry,
    new THREE.LineBasicMaterial({ color: 0xe5e5e5, transparent: true, opacity: 0.6 }),
  );
  group.add(rectangleLine);

  const updateVisibility = () => {
    latticePoints.visible = mode === "lattice";
    spiralLine.visible = mode === "spiral";
    rectangleLine.visible = mode === "rectangles";
  };
  updateVisibility();

  let elapsed = 0;
  const update = (delta: number) => {
    elapsed += delta;
    group.rotation.y = Math.sin(elapsed * 0.2) * 0.1;
    group.rotation.x = Math.cos(elapsed * 0.18) * 0.06;
    updateVisibility();
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
