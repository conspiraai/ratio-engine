import * as THREE from "three";

import type { CreateSceneParams, CreateSceneResult } from "@/app/lib/three/types";
import { disposeObject } from "@/app/lib/three/utils";

export type SilverAtlasSceneOptions = {
  rectangleAspect: number;
  spiralTurns: number;
  depth: number;
};

const buildSpiralLine = (
  maxRadius: number,
  turns: number,
  ratio: number,
  depth: number,
) => {
  const maxTheta = Math.max(Math.PI, turns * Math.PI * 2);
  const baseRadius = maxRadius / Math.pow(ratio, maxTheta / (Math.PI / 2));
  const points: THREE.Vector3[] = [];
  const steps = Math.floor(200 * turns);

  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const theta = t * maxTheta;
    const radius = baseRadius * Math.pow(ratio, theta / (Math.PI / 2));
    points.push(
      new THREE.Vector3(
        Math.cos(theta) * radius,
        Math.sin(theta) * radius,
        (t - 0.5) * depth,
      ),
    );
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({
    color: 0xf6f2ee,
    transparent: true,
    opacity: 0.65,
  });

  return new THREE.Line(geometry, material);
};

export const createScene = (
  params: CreateSceneParams,
  options: SilverAtlasSceneOptions,
): CreateSceneResult => {
  const { canvas, width, height, dpr, isMobile } = params;
  const { rectangleAspect, spiralTurns, depth } = options;

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
  let cameraDistance = 6.2;
  camera.position.set(0, 0, cameraDistance);

  const root = new THREE.Group();
  scene.add(root);

  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  const key = new THREE.DirectionalLight(0xffffff, 0.9);
  key.position.set(4, 5, 4);
  const rim = new THREE.DirectionalLight(0xffffff, 0.35);
  rim.position.set(-4, -2, 5);
  const prism = new THREE.PointLight(0xfff1e2, 0.35, 12);
  prism.position.set(1.5, -3, 4);
  scene.add(ambient, key, rim, prism);

  const baseHeight = isMobile ? 1.7 : 2.1;
  const baseWidth = baseHeight * rectangleAspect;
  const frames = new THREE.Group();
  let rectWidth = baseWidth;
  let rectHeight = baseHeight;
  let offsetX = 0;
  let offsetY = 0;

  for (let i = 0; i < 4; i += 1) {
    const rectGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-rectWidth / 2 + offsetX, -rectHeight / 2 + offsetY, i * 0.08),
      new THREE.Vector3(rectWidth / 2 + offsetX, -rectHeight / 2 + offsetY, i * 0.08),
      new THREE.Vector3(rectWidth / 2 + offsetX, rectHeight / 2 + offsetY, i * 0.08),
      new THREE.Vector3(-rectWidth / 2 + offsetX, rectHeight / 2 + offsetY, i * 0.08),
    ]);
    const rectMaterial = new THREE.LineBasicMaterial({
      color: 0xf8f3ef,
      transparent: true,
      opacity: 0.55,
    });
    frames.add(new THREE.LineLoop(rectGeometry, rectMaterial));

    rectWidth /= rectangleAspect;
    rectHeight /= rectangleAspect;
    offsetX += (i % 2 === 0 ? rectWidth * 0.25 : -rectWidth * 0.18);
    offsetY += (i % 2 === 0 ? rectHeight * 0.18 : -rectHeight * 0.22);
  }
  root.add(frames);

  const spiral = buildSpiralLine(baseHeight * 0.95, spiralTurns, rectangleAspect, depth);
  spiral.position.z = 0.04;
  root.add(spiral);

  const paneGeometry = new THREE.PlaneGeometry(baseWidth * 1.05, baseHeight * 1.05);
  const paneMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x0b0b0d,
    roughness: 0.2,
    metalness: 0.2,
    transmission: 0.6,
    transparent: true,
    opacity: 0.3,
    clearcoat: 0.8,
    clearcoatRoughness: 0.15,
  });
  const pane = new THREE.Mesh(paneGeometry, paneMaterial);
  pane.position.z = -0.18;
  root.add(pane);

  const rotationTarget = new THREE.Vector2(0.15, -0.2);
  const rotationCurrent = new THREE.Vector2(0.15, -0.2);
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

    camera.position.set(0, 0, cameraDistance);
    camera.lookAt(0, 0, 0);

    frames.rotation.z = prefersReducedMotion ? 0 : Math.sin(elapsed * 0.3) * 0.05;

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
