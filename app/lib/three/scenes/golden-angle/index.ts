import * as THREE from "three";

import type {
  CreateSceneParams,
  CreateSceneResult,
  SceneSchema,
} from "@/app/lib/three/types";
import { disposeObject } from "@/app/lib/three/utils";

export type GoldenAngleSceneParams = {
  spokeCount: number;
  showPhyllotaxis: boolean;
};

export const defaultParams: GoldenAngleSceneParams = {
  spokeCount: 90,
  showPhyllotaxis: true,
};

export const paramSchema: SceneSchema = [
  {
    type: "range",
    id: "spokeCount",
    label: "Spokes",
    min: 30,
    max: 180,
    step: 5,
    formatValue: (value) => Math.round(value).toString(),
  },
  {
    type: "toggle",
    id: "showPhyllotaxis",
    label: "Phyllotaxis",
  },
];

const GOLDEN_ANGLE = THREE.MathUtils.degToRad(137.507764);

const buildArc = (
  radius: number,
  startAngle: number,
  endAngle: number,
  segments: number,
  z = 0,
) => {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments;
    const angle = THREE.MathUtils.lerp(startAngle, endAngle, t);
    points.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, z));
  }
  return points;
};

const buildSpokes = (count: number, innerRadius: number, outerRadius: number) => {
  const positions = new Float32Array(count * 6);
  for (let i = 0; i < count; i += 1) {
    const angle = i * GOLDEN_ANGLE;
    const xInner = Math.cos(angle) * innerRadius;
    const yInner = Math.sin(angle) * innerRadius;
    const xOuter = Math.cos(angle) * outerRadius;
    const yOuter = Math.sin(angle) * outerRadius;
    positions[i * 6] = xInner;
    positions[i * 6 + 1] = yInner;
    positions[i * 6 + 2] = 0;
    positions[i * 6 + 3] = xOuter;
    positions[i * 6 + 4] = yOuter;
    positions[i * 6 + 5] = 0.1;
  }
  return positions;
};

const buildPhyllotaxis = (count: number, radius: number) => {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    const t = i / Math.max(1, count - 1);
    const angle = i * GOLDEN_ANGLE;
    const r = radius * Math.sqrt(t);
    positions[i * 3] = Math.cos(angle) * r;
    positions[i * 3 + 1] = Math.sin(angle) * r;
    positions[i * 3 + 2] = -0.2 + t * 0.4;
  }
  return positions;
};

export const createScene = (
  params: CreateSceneParams,
  options: GoldenAngleSceneParams,
): CreateSceneResult => {
  const { canvas, width, height, dpr, isMobile, detailLevel } = params;
  const { spokeCount, showPhyllotaxis } = options;

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

  const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 60);
  camera.position.set(0, 0, 6);

  const group = new THREE.Group();
  scene.add(group);

  const ambient = new THREE.AmbientLight(0xffffff, 0.35);
  const key = new THREE.DirectionalLight(0xf5f5f5, 0.9);
  key.position.set(4, 5, 6);
  const rim = new THREE.PointLight(0xbfd4ff, 0.6, 12);
  rim.position.set(-4, -2, 4);
  scene.add(ambient, key, rim);

  const radius = isMobile ? 1.6 : 2.1;
  const arcSegments = Math.max(60, Math.floor(140 * detailLevel));
  const gapArc = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(
      buildArc(radius * 1.02, 0, GOLDEN_ANGLE, Math.floor(arcSegments * 0.4), 0.08),
    ),
    new THREE.LineBasicMaterial({ color: 0xbfd4ff, transparent: true, opacity: 0.85 }),
  );
  const ringArc = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(
      buildArc(radius, GOLDEN_ANGLE, Math.PI * 2, arcSegments, 0),
    ),
    new THREE.LineBasicMaterial({ color: 0xf2f2f2, transparent: true, opacity: 0.4 }),
  );
  group.add(gapArc, ringArc);

  const spokesGeometry = new THREE.BufferGeometry();
  spokesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
      buildSpokes(Math.max(12, Math.floor(spokeCount * detailLevel)), radius * 0.2, radius),
      3,
    ),
  );
  const spokes = new THREE.LineSegments(
    spokesGeometry,
    new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 }),
  );
  group.add(spokes);

  const phyllotaxisGeometry = new THREE.BufferGeometry();
  phyllotaxisGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
      buildPhyllotaxis(Math.max(120, Math.floor(320 * detailLevel)), radius * 0.9),
      3,
    ),
  );
  const phyllotaxis = new THREE.Points(
    phyllotaxisGeometry,
    new THREE.PointsMaterial({
      color: 0xf4f4f4,
      size: isMobile ? 0.03 : 0.035,
      opacity: 0.65,
      transparent: true,
      depthWrite: false,
    }),
  );
  phyllotaxis.visible = showPhyllotaxis;
  group.add(phyllotaxis);

  let elapsed = 0;
  const update = (delta: number) => {
    if (!prefersReducedMotion) {
      elapsed += delta;
    }
    phyllotaxis.visible = showPhyllotaxis;
    spokes.rotation.z = prefersReducedMotion ? 0 : elapsed * 0.3;
    ringArc.rotation.z = prefersReducedMotion ? 0 : elapsed * 0.06;
    gapArc.rotation.z = prefersReducedMotion ? 0 : elapsed * 0.06;

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
