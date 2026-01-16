import * as THREE from "three";

import type { CreateSceneParams, CreateSceneResult, SceneSchema } from "@/app/lib/three/types";
import { disposeObject } from "@/app/lib/three/utils";

export type ESceneParams = {
  morph: number;
  flowSpeed: number;
  particleCount: number;
};

export const defaultParams: ESceneParams = {
  morph: 0.45,
  flowSpeed: 0.7,
  particleCount: 140,
};

export const paramSchema: SceneSchema = [
  {
    type: "range",
    id: "morph",
    label: "Exp / Log Morph",
    min: 0,
    max: 1,
    step: 0.02,
    formatValue: (value) => value.toFixed(2),
  },
  {
    type: "range",
    id: "flowSpeed",
    label: "Particle Flow",
    min: 0.2,
    max: 1.4,
    step: 0.05,
    formatValue: (value) => value.toFixed(2),
  },
  {
    type: "range",
    id: "particleCount",
    label: "Particle Count",
    min: 60,
    max: 240,
    step: 10,
    formatValue: (value) => Math.round(value).toString(),
  },
];

const buildCurvePoints = (morph: number, count: number) => {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= count; i += 1) {
    const t = i / count;
    const x = THREE.MathUtils.lerp(-1.5, 1.5, t);
    const exp = Math.exp(x);
    const log = Math.log(x + 2.1);
    const y = THREE.MathUtils.lerp(exp, log, morph);
    points.push(new THREE.Vector3(x * 1.1, (y - 1.2) * 0.9, 0));
  }
  return points;
};

export const createScene = (
  params: CreateSceneParams,
  options: ESceneParams,
): CreateSceneResult => {
  const { canvas, width, height, dpr, isMobile, detailLevel } = params;
  const { morph, flowSpeed, particleCount } = options;

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

  const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 60);
  camera.position.set(0, 0, 6.4);

  const group = new THREE.Group();
  scene.add(group);

  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  const key = new THREE.DirectionalLight(0xf6f6f6, 0.9);
  key.position.set(4, 5, 6);
  const rim = new THREE.PointLight(0xdedede, 0.6, 12);
  rim.position.set(-4, -2, 4);
  scene.add(ambient, key, rim);

  const curvePoints = buildCurvePoints(morph, Math.floor(120 * detailLevel));
  const curve = new THREE.CatmullRomCurve3(curvePoints);

  const lineGeometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
  const line = new THREE.Line(
    lineGeometry,
    new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.7, transparent: true }),
  );
  group.add(line);

  const tubeGeometry = new THREE.TubeGeometry(curve, Math.floor(80 * detailLevel), 0.05, 12, false);
  const tubeMaterial = new THREE.MeshStandardMaterial({
    color: 0x111114,
    roughness: 0.3,
    metalness: 0.6,
    transparent: true,
    opacity: 0.5,
  });
  const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
  tube.position.z = -0.2;
  group.add(tube);

  const particleCountAdjusted = Math.max(30, Math.floor(particleCount * detailLevel));
  const particleGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCountAdjusted * 3);
  const progress = new Float32Array(particleCountAdjusted);
  for (let i = 0; i < particleCountAdjusted; i += 1) {
    progress[i] = i / particleCountAdjusted;
  }
  particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const particleMaterial = new THREE.PointsMaterial({
    color: 0xf4f4f4,
    size: isMobile ? 0.05 : 0.04,
    transparent: true,
    opacity: 0.8,
    depthWrite: false,
  });
  const particles = new THREE.Points(particleGeometry, particleMaterial);
  group.add(particles);

  let elapsed = 0;
  const update = (delta: number) => {
    elapsed += delta;
    const speed = flowSpeed * 0.12;
    for (let i = 0; i < particleCountAdjusted; i += 1) {
      progress[i] = (progress[i] + delta * speed) % 1;
      const point = curve.getPointAt(progress[i]);
      positions[i * 3] = point.x;
      positions[i * 3 + 1] = point.y + Math.sin(elapsed + i) * 0.05;
      positions[i * 3 + 2] = 0.15 + Math.cos(elapsed * 0.7 + i) * 0.06;
    }
    particleGeometry.attributes.position.needsUpdate = true;

    group.rotation.y = Math.sin(elapsed * 0.2) * 0.08;
    group.rotation.x = Math.cos(elapsed * 0.18) * 0.05;
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
