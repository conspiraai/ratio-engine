import * as THREE from "three";

import type { CreateSceneParams, CreateSceneResult } from "@/app/lib/three/types";
import { disposeObject } from "@/app/lib/three/utils";

const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;

export type PhiAtlasSceneOptions = {
  rectangleAspect: number;
  spiralTurns: number;
  depth: number;
  nodeCount: number;
  nodeScale: number;
  showNodes: boolean;
  showRectangle: boolean;
};

type NodeDatum = {
  mesh: THREE.Mesh;
  radius: number;
  speed: number;
  phase: number;
};

const buildFibonacci = (count: number) => {
  const values = [1, 1];
  while (values.length < count) {
    const next = values[values.length - 1] + values[values.length - 2];
    values.push(next);
  }
  return values.slice(0, count);
};

const buildSpiralLine = (
  maxRadius: number,
  turns: number,
  depth: number,
) => {
  const maxTheta = Math.max(Math.PI * 1.5, turns * Math.PI * 2);
  const baseRadius =
    maxRadius / Math.pow(GOLDEN_RATIO, maxTheta / (Math.PI / 2));
  const points: THREE.Vector3[] = [];
  const steps = Math.floor(220 * turns);

  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const theta = t * maxTheta;
    const radius = baseRadius * Math.pow(GOLDEN_RATIO, theta / (Math.PI / 2));
    const x = Math.cos(theta) * radius;
    const y = Math.sin(theta) * radius;
    const z = (t - 0.5) * depth;
    points.push(new THREE.Vector3(x, y, z));
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({
    color: 0xf7f2eb,
    transparent: true,
    opacity: 0.7,
  });

  return new THREE.Line(geometry, material);
};

export const createScene = (
  params: CreateSceneParams,
  options: PhiAtlasSceneOptions,
): CreateSceneResult => {
  const { canvas, width, height, dpr, isMobile } = params;
  const {
    rectangleAspect,
    spiralTurns,
    depth,
    nodeCount,
    nodeScale,
    showNodes,
    showRectangle,
  } = options;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#050505");
  scene.fog = new THREE.Fog("#050505", 7, 18);

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
  let cameraDistance = 6.2;
  camera.position.set(0, 0, cameraDistance);

  const root = new THREE.Group();
  scene.add(root);

  const ambient = new THREE.AmbientLight(0xffffff, 0.35);
  const key = new THREE.DirectionalLight(0xffffff, 0.9);
  key.position.set(5, 6, 4);
  const rim = new THREE.DirectionalLight(0xffffff, 0.45);
  rim.position.set(-4, -3, 5);
  const prism = new THREE.PointLight(0xfff5e6, 0.4, 14);
  prism.position.set(2, -3, 4);
  scene.add(ambient, key, rim, prism);

  const starGeometry = new THREE.BufferGeometry();
  const starCount = 220;
  const starPositions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i += 1) {
    const radius = 6 + Math.random() * 6;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    starPositions[i * 3] = Math.sin(phi) * Math.cos(theta) * radius;
    starPositions[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * radius;
    starPositions[i * 3 + 2] = Math.cos(phi) * radius;
  }
  starGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(starPositions, 3),
  );
  const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: isMobile ? 0.012 : 0.015,
    transparent: true,
    opacity: 0.35,
    depthWrite: false,
  });
  const stars = new THREE.Points(starGeometry, starMaterial);
  root.add(stars);

  const baseHeight = isMobile ? 1.8 : 2.2;
  const baseWidth = baseHeight * rectangleAspect;

  const rectangleGroup = new THREE.Group();
  const rectGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-baseWidth / 2, -baseHeight / 2, 0),
    new THREE.Vector3(baseWidth / 2, -baseHeight / 2, 0),
    new THREE.Vector3(baseWidth / 2, baseHeight / 2, 0),
    new THREE.Vector3(-baseWidth / 2, baseHeight / 2, 0),
  ]);
  const rectMaterial = new THREE.LineBasicMaterial({
    color: 0xfaf7f2,
    transparent: true,
    opacity: 0.65,
  });
  const rectangle = new THREE.LineLoop(rectGeometry, rectMaterial);
  rectangleGroup.add(rectangle);

  const glowGeometry = new THREE.PlaneGeometry(baseWidth * 1.02, baseHeight * 1.02);
  const glowMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x0b0b0c,
    roughness: 0.2,
    metalness: 0.3,
    transmission: 0.6,
    transparent: true,
    opacity: 0.25,
    clearcoat: 0.8,
    clearcoatRoughness: 0.12,
  });
  const glowPane = new THREE.Mesh(glowGeometry, glowMaterial);
  glowPane.position.z = -0.08;
  rectangleGroup.add(glowPane);

  rectangleGroup.visible = showRectangle;
  root.add(rectangleGroup);

  const spiral = buildSpiralLine(baseHeight * 0.92, spiralTurns, depth);
  spiral.position.z = 0.05;
  root.add(spiral);

  const nodesGroup = new THREE.Group();
  const fibValues = buildFibonacci(Math.max(4, nodeCount));
  const maxFib = fibValues[fibValues.length - 1];
  const nodeMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xf1f1f1,
    metalness: 0.2,
    roughness: 0.15,
    transmission: 0.45,
    transparent: true,
    opacity: 0.85,
    clearcoat: 0.8,
    clearcoatRoughness: 0.1,
    emissive: new THREE.Color(0x0f0f0f),
    emissiveIntensity: 0.4,
  });
  const nodes: NodeDatum[] = fibValues.map((fib, index) => {
    const radius = (fib / maxFib) * baseHeight * 1.05;
    const geometry = new THREE.SphereGeometry(nodeScale, 24, 24);
    const mesh = new THREE.Mesh(geometry, nodeMaterial);
    nodesGroup.add(mesh);
    return {
      mesh,
      radius,
      speed: 0.25 + index * 0.05,
      phase: index * 0.8,
    };
  });
  nodesGroup.visible = showNodes;
  root.add(nodesGroup);

  const rotationTarget = new THREE.Vector2(0.2, -0.4);
  const rotationCurrent = new THREE.Vector2(0.2, -0.4);
  const activePointers = new Map<number, { x: number; y: number }>();
  let lastPinchDistance = 0;

  const setPointer = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    activePointers.set(event.pointerId, {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  const handlePointerDown = (event: PointerEvent) => {
    canvas.setPointerCapture(event.pointerId);
    setPointer(event);
  };

  const handlePointerMove = (event: PointerEvent) => {
    if (!activePointers.has(event.pointerId)) {
      return;
    }
    const previous = activePointers.get(event.pointerId);
    setPointer(event);
    const current = activePointers.get(event.pointerId);
    if (!previous || !current) {
      return;
    }

    if (activePointers.size === 1) {
      const deltaX = current.x - previous.x;
      const deltaY = current.y - previous.y;
      rotationTarget.y += deltaX * 0.005;
      rotationTarget.x += deltaY * 0.005;
      rotationTarget.x = THREE.MathUtils.clamp(rotationTarget.x, -0.9, 0.9);
    }

    if (activePointers.size === 2) {
      const points = Array.from(activePointers.values());
      const distance = Math.hypot(
        points[0].x - points[1].x,
        points[0].y - points[1].y,
      );
      if (lastPinchDistance > 0) {
        const delta = lastPinchDistance - distance;
        cameraDistance = THREE.MathUtils.clamp(cameraDistance + delta * 0.01, 4, 9);
      }
      lastPinchDistance = distance;
    }
  };

  const handlePointerUp = (event: PointerEvent) => {
    activePointers.delete(event.pointerId);
    if (activePointers.size < 2) {
      lastPinchDistance = 0;
    }
  };

  const handleWheel = (event: WheelEvent) => {
    event.preventDefault();
    cameraDistance = THREE.MathUtils.clamp(cameraDistance + event.deltaY * 0.002, 4, 9);
  };

  canvas.addEventListener("pointerdown", handlePointerDown);
  canvas.addEventListener("pointermove", handlePointerMove);
  canvas.addEventListener("pointerup", handlePointerUp);
  canvas.addEventListener("pointerleave", handlePointerUp);
  canvas.addEventListener("wheel", handleWheel, { passive: false });

  let elapsed = 0;
  const update = (delta: number) => {
    if (!prefersReducedMotion) {
      elapsed += delta;
    }

    rotationCurrent.x = THREE.MathUtils.lerp(
      rotationCurrent.x,
      rotationTarget.x + (prefersReducedMotion ? 0 : Math.sin(elapsed * 0.2) * 0.03),
      0.08,
    );
    rotationCurrent.y = THREE.MathUtils.lerp(
      rotationCurrent.y,
      rotationTarget.y + (prefersReducedMotion ? 0 : Math.cos(elapsed * 0.15) * 0.04),
      0.08,
    );
    root.rotation.x = rotationCurrent.x;
    root.rotation.y = rotationCurrent.y;

    camera.position.set(0, 0, cameraDistance);
    camera.lookAt(0, 0, 0);

    if (!prefersReducedMotion) {
      nodes.forEach((node, index) => {
        const angle = elapsed * node.speed + node.phase;
        const offset = Math.sin(elapsed * 0.5 + index) * 0.08;
        node.mesh.position.set(
          Math.cos(angle) * (node.radius + offset),
          Math.sin(angle) * (node.radius + offset),
          Math.sin(angle * 0.6) * 0.35,
        );
      });
    } else {
      nodes.forEach((node, index) => {
        const angle = node.phase + index * 0.3;
        node.mesh.position.set(
          Math.cos(angle) * node.radius,
          Math.sin(angle) * node.radius,
          Math.sin(angle * 0.6) * 0.2,
        );
      });
    }

    renderer.render(scene, camera);
  };

  const dispose = () => {
    canvas.removeEventListener("pointerdown", handlePointerDown);
    canvas.removeEventListener("pointermove", handlePointerMove);
    canvas.removeEventListener("pointerup", handlePointerUp);
    canvas.removeEventListener("pointerleave", handlePointerUp);
    canvas.removeEventListener("wheel", handleWheel);
    disposeObject(root);
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
