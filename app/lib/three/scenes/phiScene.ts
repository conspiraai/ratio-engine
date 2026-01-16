import * as THREE from "three";

import type { CreateSceneParams, CreateSceneResult } from "@/app/lib/three/types";
import { disposeObject } from "@/app/lib/three/utils";

export type PhiSceneOptions = {
  recursionDepth: number;
  particlesEnabled: boolean;
  autoDrift: boolean;
};

const defaultOptions: PhiSceneOptions = {
  recursionDepth: 6,
  particlesEnabled: true,
  autoDrift: true,
};

const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;

const createFramePoints = (width: number, height: number) => {
  const halfWidth = width / 2;
  const halfHeight = height / 2;
  return [
    new THREE.Vector3(-halfWidth, -halfHeight, 0),
    new THREE.Vector3(halfWidth, -halfHeight, 0),
    new THREE.Vector3(halfWidth, halfHeight, 0),
    new THREE.Vector3(-halfWidth, halfHeight, 0),
  ];
};

const buildSubdivisionLines = (
  width: number,
  height: number,
  depth: number,
) => {
  const positions: number[] = [];
  let x = -width / 2;
  let y = -height / 2;
  let w = width;
  let h = height;
  let direction = 0;

  for (let i = 0; i < depth; i += 1) {
    const size = Math.min(w, h);
    if (size <= 0) {
      break;
    }

    if (direction === 0) {
      const splitX = x + size;
      positions.push(splitX, y, 0, splitX, y + h, 0);
      x += size;
      w -= size;
    } else if (direction === 1) {
      const splitY = y + size;
      positions.push(x, splitY, 0, x + w, splitY, 0);
      y += size;
      h -= size;
    } else if (direction === 2) {
      const splitX = x + (w - size);
      positions.push(splitX, y, 0, splitX, y + h, 0);
      w -= size;
    } else {
      const splitY = y + (h - size);
      positions.push(x, splitY, 0, x + w, splitY, 0);
      h -= size;
    }

    direction = (direction + 1) % 4;
  }

  return positions;
};

const buildSpiralPoints = (width: number, height: number, depth: number) => {
  const maxRadius = Math.min(width, height) * 0.5;
  const thetaMax = (depth + 1) * (Math.PI / 2);
  const a = maxRadius / Math.pow(GOLDEN_RATIO, (2 * thetaMax) / Math.PI);
  const steps = depth * 30;
  const points: THREE.Vector3[] = [];
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (let i = 0; i <= steps; i += 1) {
    const theta = (i / steps) * thetaMax;
    const radius = a * Math.pow(GOLDEN_RATIO, (2 * theta) / Math.PI);
    const x = radius * Math.cos(theta);
    const y = radius * Math.sin(theta);
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
    points.push(new THREE.Vector3(x, y, 0.02));
  }

  const offsetX = (minX + maxX) / 2;
  const offsetY = (minY + maxY) / 2;
  return points.map((point) =>
    new THREE.Vector3(point.x - offsetX, point.y - offsetY, point.z),
  );
};

const createHudTicks = (width: number, height: number) => {
  const offset = 0.12;
  const tick = 0.25;
  const halfWidth = width / 2 + offset;
  const halfHeight = height / 2 + offset;
  return [
    -halfWidth,
    halfHeight,
    0,
    -halfWidth + tick,
    halfHeight,
    0,
    -halfWidth,
    halfHeight,
    0,
    -halfWidth,
    halfHeight - tick,
    0,
    halfWidth,
    halfHeight,
    0,
    halfWidth - tick,
    halfHeight,
    0,
    halfWidth,
    halfHeight,
    0,
    halfWidth,
    halfHeight - tick,
    0,
    -halfWidth,
    -halfHeight,
    0,
    -halfWidth + tick,
    -halfHeight,
    0,
    -halfWidth,
    -halfHeight,
    0,
    -halfWidth,
    -halfHeight + tick,
    0,
    halfWidth,
    -halfHeight,
    0,
    halfWidth - tick,
    -halfHeight,
    0,
    halfWidth,
    -halfHeight,
    0,
    halfWidth,
    -halfHeight + tick,
    0,
  ];
};

const createParticles = (count: number) => {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    const idx = i * 3;
    positions[idx] = (Math.random() - 0.5) * 8;
    positions[idx + 1] = (Math.random() - 0.5) * 5;
    positions[idx + 2] = (Math.random() - 0.5) * 2;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    color: 0xe5e5e5,
    size: 0.02,
    transparent: true,
    opacity: 0.4,
    depthWrite: false,
  });
  return new THREE.Points(geometry, material);
};

export const createPhiScene = (
  params: CreateSceneParams,
  options: PhiSceneOptions = defaultOptions,
): CreateSceneResult => {
  const { canvas, width, height, dpr, isMobile } = params;
  const { recursionDepth, particlesEnabled, autoDrift } = options;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#050505");
  scene.fog = new THREE.Fog("#050505", 5, 16);

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
  camera.position.set(0, 0, 6);

  const group = new THREE.Group();
  scene.add(group);

  const ambientLight = new THREE.AmbientLight(0x6f6f6f, 0.6);
  const keyLight = new THREE.DirectionalLight(0xf2f2f2, 1.1);
  keyLight.position.set(4, 4, 6);
  const rimLight = new THREE.PointLight(0xdedede, 0.5, 10);
  rimLight.position.set(-4, -2, 4);
  scene.add(ambientLight, keyLight, rimLight);

  const baseHeight = isMobile ? 1.9 : 2.2;
  const baseWidth = baseHeight * GOLDEN_RATIO;

  const frameGeometry = new THREE.BufferGeometry().setFromPoints(
    createFramePoints(baseWidth, baseHeight),
  );
  const frameMaterial = new THREE.LineBasicMaterial({
    color: 0xf0f0f0,
    transparent: true,
    opacity: 0.85,
  });
  const frame = new THREE.LineLoop(frameGeometry, frameMaterial);
  group.add(frame);

  const subdivisionGeometry = new THREE.BufferGeometry();
  subdivisionGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(
      buildSubdivisionLines(baseWidth, baseHeight, recursionDepth),
      3,
    ),
  );
  const subdivisionMaterial = new THREE.LineBasicMaterial({
    color: 0x8a8a8a,
    transparent: true,
    opacity: 0.4,
  });
  const subdivisions = new THREE.LineSegments(
    subdivisionGeometry,
    subdivisionMaterial,
  );
  group.add(subdivisions);

  const spiralCurve = new THREE.CatmullRomCurve3(
    buildSpiralPoints(baseWidth, baseHeight, recursionDepth),
  );
  const spiralGeometry = new THREE.BufferGeometry().setFromPoints(
    spiralCurve.getPoints(isMobile ? 80 : 140),
  );
  const spiralMaterial = new THREE.LineBasicMaterial({
    color: 0xf4f4f4,
    transparent: true,
    opacity: 0.9,
  });
  const spiral = new THREE.Line(spiralGeometry, spiralMaterial);
  group.add(spiral);

  const rimGeometry = new THREE.BoxGeometry(baseWidth, baseHeight, 0.05);
  const rimMaterial = new THREE.MeshStandardMaterial({
    color: 0x0f0f10,
    metalness: 0.7,
    roughness: 0.25,
    emissive: 0xffffff,
    emissiveIntensity: 0.2,
    transparent: true,
    opacity: 0.55,
  });
  const rimMesh = new THREE.Mesh(rimGeometry, rimMaterial);
  rimMesh.position.z = -0.04;
  group.add(rimMesh);

  const hudGeometry = new THREE.BufferGeometry();
  hudGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(
      createHudTicks(baseWidth, baseHeight),
      3,
    ),
  );
  const hudMaterial = new THREE.LineBasicMaterial({
    color: 0x5f5f5f,
    transparent: true,
    opacity: 0.5,
  });
  const hud = new THREE.LineSegments(hudGeometry, hudMaterial);
  group.add(hud);

  let particles: THREE.Points | null = null;
  if (particlesEnabled) {
    particles = createParticles(isMobile ? 320 : 640);
    group.add(particles);
  }

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
    const driftX = autoDrift ? Math.sin(elapsed * 0.3) * 0.08 : 0;
    const driftY = autoDrift ? Math.cos(elapsed * 0.25) * 0.06 : 0;
    const targetX = pointerTarget.y * 0.25 + driftY;
    const targetY = pointerTarget.x * 0.3 + driftX;
    rotation.x = THREE.MathUtils.lerp(rotation.x, targetX, 0.06);
    rotation.y = THREE.MathUtils.lerp(rotation.y, targetY, 0.06);
    group.rotation.x = rotation.x;
    group.rotation.y = rotation.y;

    if (autoDrift) {
      camera.position.x = Math.sin(elapsed * 0.2) * 0.25;
      camera.position.y = Math.cos(elapsed * 0.22) * 0.18;
    }
    camera.lookAt(0, 0, 0);

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
