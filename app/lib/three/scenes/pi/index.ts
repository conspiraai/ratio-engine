import * as THREE from "three";

import type {
  CreateSceneParams,
  CreateSceneResult,
  SceneSchema,
} from "@/app/lib/three/types";
import { disposeObject } from "@/app/lib/three/utils";

export type PiSceneParams = {
  sides: number;
  unwrapEnabled: boolean;
  ringIntensity: number;
};

export const defaultParams: PiSceneParams = {
  sides: 24,
  unwrapEnabled: true,
  ringIntensity: 0.6,
};

export const paramSchema: SceneSchema = [
  {
    type: "range",
    id: "sides",
    label: "Polygon Sides",
    min: 3,
    max: 200,
    step: 1,
    formatValue: (value) => Math.round(value).toString(),
  },
  {
    type: "toggle",
    id: "unwrapEnabled",
    label: "Unwrap Ribbon",
  },
  {
    type: "range",
    id: "ringIntensity",
    label: "Interference",
    min: 0,
    max: 1,
    step: 0.05,
    formatValue: (value) => value.toFixed(2),
  },
];

const buildPolygonPoints = (sides: number, radius: number) => {
  const points: THREE.Vector3[] = [];
  const step = (Math.PI * 2) / sides;
  for (let i = 0; i <= sides; i += 1) {
    const angle = i * step;
    points.push(
      new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0),
    );
  }
  return points;
};

const buildArcPoints = (
  radius: number,
  startAngle: number,
  endAngle: number,
  segments: number,
) => {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments;
    const angle = THREE.MathUtils.lerp(startAngle, endAngle, t);
    points.push(
      new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0),
    );
  }
  return points;
};

export const createScene = (
  params: CreateSceneParams,
  options: PiSceneParams,
): CreateSceneResult => {
  const { canvas, width, height, dpr, isMobile, detailLevel } = params;
  const { sides, unwrapEnabled, ringIntensity } = options;

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

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 60);
  camera.position.set(0, 0, 6.2);

  const group = new THREE.Group();
  scene.add(group);

  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  const key = new THREE.DirectionalLight(0xf8f8f8, 0.9);
  key.position.set(4, 5, 6);
  const rim = new THREE.PointLight(0xdfdfdf, 0.7, 12);
  rim.position.set(-4, -2, 4);
  scene.add(ambient, key, rim);

  const radius = isMobile ? 1.35 : 1.8;
  const circleSegments = Math.max(64, Math.floor(160 * detailLevel));
  const circleGeometry = new THREE.BufferGeometry().setFromPoints(
    buildArcPoints(radius, 0, Math.PI * 2, circleSegments),
  );
  const circle = new THREE.Line(
    circleGeometry,
    new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
    }),
  );
  group.add(circle);

  const polygonGeometry = new THREE.BufferGeometry().setFromPoints(
    buildPolygonPoints(Math.max(3, Math.floor(sides)), radius),
  );
  const polygon = new THREE.Line(
    polygonGeometry,
    new THREE.LineBasicMaterial({
      color: 0xf4f4f4,
      transparent: true,
      opacity: 0.85,
    }),
  );
  group.add(polygon);

  const circumference = Math.PI * 2 * radius;
  const ribbonGeometry = new THREE.PlaneGeometry(circumference, 0.28, 1, 1);
  const ribbonMaterial = new THREE.MeshStandardMaterial({
    color: 0x0f0f12,
    metalness: 0.45,
    roughness: 0.25,
    transparent: true,
    opacity: 0.6,
  });
  const ribbon = new THREE.Mesh(ribbonGeometry, ribbonMaterial);
  ribbon.position.y = -2.1;
  ribbon.visible = unwrapEnabled;
  group.add(ribbon);

  const ribbonEdgeGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-circumference / 2, 0, 0.02),
    new THREE.Vector3(circumference / 2, 0, 0.02),
  ]);
  const ribbonEdge = new THREE.Line(
    ribbonEdgeGeometry,
    new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.55, transparent: true }),
  );
  ribbon.add(ribbonEdge);

  const ringGeometry = new THREE.RingGeometry(
    radius * 0.65,
    radius * 1.05,
    Math.max(48, Math.floor(96 * detailLevel)),
  );
  const ringMaterial = new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
      uTime: { value: 0 },
      uIntensity: { value: ringIntensity },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uIntensity;
      varying vec2 vUv;
      void main() {
        float ring = sin((vUv.x + vUv.y) * 28.0 + uTime * 1.2);
        float glow = smoothstep(0.2, 0.9, abs(ring));
        float alpha = (0.1 + glow * 0.2) * uIntensity;
        gl_FragColor = vec4(vec3(0.92), alpha);
      }
    `,
  });
  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  ring.position.z = -0.2;
  ring.visible = ringIntensity > 0.02;
  group.add(ring);

  let elapsed = 0;
  const update = (delta: number) => {
    if (!prefersReducedMotion) {
      elapsed += delta;
    }
    ringMaterial.uniforms.uTime.value = elapsed;
    ringMaterial.uniforms.uIntensity.value = ringIntensity;
    ring.visible = ringIntensity > 0.02;

    ribbon.visible = unwrapEnabled;
    if (unwrapEnabled) {
      ribbon.scale.x = prefersReducedMotion ? 1 : 0.96 + Math.sin(elapsed * 0.4) * 0.02;
      ribbonEdge.visible = true;
    }

    polygon.rotation.z = prefersReducedMotion ? 0 : elapsed * 0.05;
    group.rotation.x = prefersReducedMotion ? 0 : Math.sin(elapsed * 0.2) * 0.05;
    group.rotation.y = prefersReducedMotion ? 0 : Math.cos(elapsed * 0.24) * 0.05;

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
