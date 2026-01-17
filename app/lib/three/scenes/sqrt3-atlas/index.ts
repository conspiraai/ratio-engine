import * as THREE from "three";

import type { CreateSceneParams, CreateSceneResult } from "@/app/lib/three/types";
import { disposeObject } from "@/app/lib/three/utils";

export type Sqrt3AtlasSceneOptions = {
  cubeSize: number;
  depth: number;
  nodeCount: number;
};

export const createScene = (
  params: CreateSceneParams,
  options: Sqrt3AtlasSceneOptions,
): CreateSceneResult => {
  const { canvas, width, height, dpr, isMobile } = params;
  const { cubeSize, depth, nodeCount } = options;

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

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
  let cameraDistance = 6.4;
  camera.position.set(0, 0, cameraDistance);

  const root = new THREE.Group();
  scene.add(root);

  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  const key = new THREE.DirectionalLight(0xffffff, 0.9);
  key.position.set(4, 6, 4);
  const rim = new THREE.DirectionalLight(0xffffff, 0.35);
  rim.position.set(-4, -2, 4);
  const prism = new THREE.PointLight(0xfff1e2, 0.3, 12);
  prism.position.set(2, -3, 4);
  scene.add(ambient, key, rim, prism);

  const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
  const cubeEdges = new THREE.EdgesGeometry(cubeGeometry);
  const cubeMaterial = new THREE.LineBasicMaterial({
    color: 0xf7f3ef,
    transparent: true,
    opacity: 0.6,
  });
  const cube = new THREE.LineSegments(cubeEdges, cubeMaterial);
  root.add(cube);

  const diagonalGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-cubeSize / 2, -cubeSize / 2, -cubeSize / 2),
    new THREE.Vector3(cubeSize / 2, cubeSize / 2, cubeSize / 2),
  ]);
  const diagonalMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.8,
  });
  const diagonal = new THREE.Line(diagonalGeometry, diagonalMaterial);
  root.add(diagonal);

  const triangleGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, cubeSize * 0.58, depth * 0.5),
    new THREE.Vector3(-cubeSize * 0.5, -cubeSize * 0.3, depth * 0.5),
    new THREE.Vector3(cubeSize * 0.5, -cubeSize * 0.3, depth * 0.5),
  ]);
  const triangleMaterial = new THREE.LineBasicMaterial({
    color: 0xf2ede8,
    transparent: true,
    opacity: 0.5,
  });
  const triangle = new THREE.LineLoop(triangleGeometry, triangleMaterial);
  root.add(triangle);

  const nodeMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xf2f2f2,
    metalness: 0.2,
    roughness: 0.15,
    transmission: 0.45,
    transparent: true,
    opacity: 0.85,
    clearcoat: 0.8,
    clearcoatRoughness: 0.1,
  });
  const nodes = new THREE.Group();
  for (let i = 0; i < nodeCount; i += 1) {
    const angle = (i / nodeCount) * Math.PI * 2;
    const radius = cubeSize * 0.62;
    const geometry = new THREE.SphereGeometry(0.06, 18, 18);
    const mesh = new THREE.Mesh(geometry, nodeMaterial);
    mesh.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0.3);
    nodes.add(mesh);
  }
  root.add(nodes);

  const paneGeometry = new THREE.PlaneGeometry(cubeSize * 1.2, cubeSize * 1.2);
  const paneMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x0b0b0d,
    roughness: 0.2,
    metalness: 0.2,
    transmission: 0.55,
    transparent: true,
    opacity: 0.25,
    clearcoat: 0.8,
    clearcoatRoughness: 0.15,
  });
  const pane = new THREE.Mesh(paneGeometry, paneMaterial);
  pane.position.z = -0.3;
  root.add(pane);

  const rotationTarget = new THREE.Vector2(0.2, -0.25);
  const rotationCurrent = new THREE.Vector2(0.2, -0.25);
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
      rotationTarget.y += (current.x - previous.x) * 0.005;
      rotationTarget.x += (current.y - previous.y) * 0.005;
    }

    if (activePointers.size === 2) {
      const points = Array.from(activePointers.values());
      const distance = Math.hypot(
        points[0].x - points[1].x,
        points[0].y - points[1].y,
      );
      if (lastPinchDistance > 0) {
        cameraDistance = THREE.MathUtils.clamp(cameraDistance + (lastPinchDistance - distance) * 0.01, 4, 9);
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
      rotationTarget.x + (prefersReducedMotion ? 0 : Math.sin(elapsed * 0.2) * 0.04),
      0.08,
    );
    rotationCurrent.y = THREE.MathUtils.lerp(
      rotationCurrent.y,
      rotationTarget.y + (prefersReducedMotion ? 0 : Math.cos(elapsed * 0.15) * 0.03),
      0.08,
    );
    root.rotation.x = rotationCurrent.x;
    root.rotation.y = rotationCurrent.y;

    if (!prefersReducedMotion) {
      nodes.rotation.z = elapsed * 0.15;
    }

    camera.position.set(0, 0, cameraDistance);
    camera.lookAt(0, 0, 0);

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

  return { scene, camera, renderer, update, dispose };
};
