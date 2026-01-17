import * as THREE from "three";

import type {
  CreateSceneParams,
  CreateSceneResult,
  SceneSchema,
} from "@/app/lib/three/types";
import { disposeObject } from "@/app/lib/three/utils";

export type FibonacciSceneParams = {
  morph: number;
  terms: number;
};

export const defaultParams: FibonacciSceneParams = {
  morph: 0.45,
  terms: 12,
};

export const paramSchema: SceneSchema = [
  {
    type: "range",
    id: "morph",
    label: "Morph",
    min: 0,
    max: 1,
    step: 0.02,
    formatValue: (value) => value.toFixed(2),
  },
  {
    type: "range",
    id: "terms",
    label: "Terms",
    min: 6,
    max: 16,
    step: 1,
    formatValue: (value) => Math.round(value).toString(),
  },
];

const GOLDEN_ANGLE = THREE.MathUtils.degToRad(137.507764);

export const buildFibonacci = (terms: number) => {
  const sequence = [1, 1];
  while (sequence.length < terms) {
    const length = sequence.length;
    sequence.push(sequence[length - 1] + sequence[length - 2]);
  }
  return sequence;
};

const buildTimelinePositions = (
  sequence: number[],
  spacing: number,
  heightScale: number,
) => {
  const count = sequence.length;
  const positions = new Float32Array(count * 3);
  const maxValue = Math.max(...sequence);
  for (let i = 0; i < count; i += 1) {
    const t = count === 1 ? 0 : i / (count - 1);
    const x = (t - 0.5) * spacing * (count - 1);
    const y = ((sequence[i] / maxValue) - 0.5) * heightScale;
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = 0;
  }
  return positions;
};

const buildSpiralPositions = (
  sequence: number[],
  radiusScale: number,
) => {
  const count = sequence.length;
  const positions = new Float32Array(count * 3);
  const maxValue = Math.max(...sequence);
  for (let i = 0; i < count; i += 1) {
    const value = sequence[i];
    const radius = Math.sqrt(value / maxValue) * radiusScale;
    const angle = i * GOLDEN_ANGLE;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = Math.sin(angle) * radius;
    positions[i * 3 + 2] = (i / Math.max(1, count - 1)) * 0.45;
  }
  return positions;
};

export const createScene = (
  params: CreateSceneParams,
  options: FibonacciSceneParams,
): CreateSceneResult => {
  const { canvas, width, height, dpr, isMobile, detailLevel } = params;
  const { morph, terms } = options;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

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
  camera.position.set(0, 0.2, 7);

  const group = new THREE.Group();
  scene.add(group);

  const ambient = new THREE.AmbientLight(0xffffff, 0.35);
  const key = new THREE.DirectionalLight(0xf4f4f4, 0.9);
  key.position.set(4, 5, 6);
  const rim = new THREE.PointLight(0xdedede, 0.6, 12);
  rim.position.set(-4, -2, 4);
  scene.add(ambient, key, rim);

  const sequence = buildFibonacci(Math.max(4, Math.floor(terms * detailLevel)));
  const spacing = isMobile ? 0.24 : 0.28;
  const heightScale = isMobile ? 0.9 : 1.2;
  const radiusScale = isMobile ? 1.6 : 2.1;

  const timelinePositions = buildTimelinePositions(sequence, spacing, heightScale);
  const spiralPositions = buildSpiralPositions(sequence, radiusScale);

  const pointGeometry = new THREE.BufferGeometry();
  const morphPositions = new Float32Array(sequence.length * 3);
  pointGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(morphPositions, 3),
  );
  const pointsMaterial = new THREE.PointsMaterial({
    color: 0xf5f5f5,
    size: isMobile ? 0.045 : 0.04,
    opacity: 0.75,
    transparent: true,
    depthWrite: false,
  });
  const points = new THREE.Points(pointGeometry, pointsMaterial);
  group.add(points);

  const lineGeometry = new THREE.BufferGeometry();
  const linePositions = new Float32Array(sequence.length * 3);
  lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
  const line = new THREE.Line(
    lineGeometry,
    new THREE.LineBasicMaterial({ color: 0xaaaaaa, transparent: true, opacity: 0.4 }),
  );
  group.add(line);

  const highlightGeometry = new THREE.BufferGeometry();
  const highlightPosition = new Float32Array(3);
  highlightGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(highlightPosition, 3),
  );
  const highlight = new THREE.Points(
    highlightGeometry,
    new THREE.PointsMaterial({
      color: 0xbfd4ff,
      size: isMobile ? 0.08 : 0.075,
      opacity: 0.95,
      transparent: true,
      depthWrite: false,
    }),
  );
  group.add(highlight);

  let elapsed = 0;
  const update = (delta: number) => {
    if (!prefersReducedMotion) {
      elapsed += delta;
    }
    const morphT = THREE.MathUtils.clamp(morph, 0, 1);
    for (let i = 0; i < sequence.length; i += 1) {
      const idx = i * 3;
      morphPositions[idx] = THREE.MathUtils.lerp(
        timelinePositions[idx],
        spiralPositions[idx],
        morphT,
      );
      morphPositions[idx + 1] = THREE.MathUtils.lerp(
        timelinePositions[idx + 1],
        spiralPositions[idx + 1],
        morphT,
      );
      morphPositions[idx + 2] = THREE.MathUtils.lerp(
        timelinePositions[idx + 2],
        spiralPositions[idx + 2],
        morphT,
      );
      linePositions[idx] = morphPositions[idx];
      linePositions[idx + 1] = morphPositions[idx + 1];
      linePositions[idx + 2] = morphPositions[idx + 2];
    }
    pointGeometry.attributes.position.needsUpdate = true;
    lineGeometry.attributes.position.needsUpdate = true;

    const focusIndex = Math.min(
      sequence.length - 1,
      Math.round(morphT * (sequence.length - 1)),
    );
    highlightPosition[0] = morphPositions[focusIndex * 3];
    highlightPosition[1] = morphPositions[focusIndex * 3 + 1];
    highlightPosition[2] = morphPositions[focusIndex * 3 + 2];
    highlightGeometry.attributes.position.needsUpdate = true;

    group.rotation.y = prefersReducedMotion ? 0 : Math.sin(elapsed * 0.2) * 0.08;
    group.rotation.x = prefersReducedMotion ? 0 : Math.cos(elapsed * 0.18) * 0.05;
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
