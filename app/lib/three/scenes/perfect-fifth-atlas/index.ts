import * as THREE from "three";

import type { CreateSceneParams, CreateSceneResult } from "@/app/lib/three/types";
import { disposeObject } from "@/app/lib/three/utils";

export type PerfectFifthAtlasSceneOptions = {
  baseRadius: number;
  ratioA: number;
  ratioB: number;
  markerCount: number;
};

export const createScene = (
  params: CreateSceneParams,
  options: PerfectFifthAtlasSceneOptions,
): CreateSceneResult => {
  const { canvas, width, height, dpr, isMobile } = params;
  const { baseRadius, ratioA, ratioB, markerCount } = options;

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
  key.position.set(4, 6, 4);
  const rim = new THREE.DirectionalLight(0xffffff, 0.35);
  rim.position.set(-4, -2, 4);
  const prism = new THREE.PointLight(0xfff1e2, 0.35, 12);
  prism.position.set(2, -3, 4);
  scene.add(ambient, key, rim, prism);

  const ratio = ratioA / ratioB;
  const outerRadius = baseRadius * ratio;

  const ringMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xf8f2ee,
    metalness: 0.2,
    roughness: 0.15,
    transmission: 0.5,
    transparent: true,
    opacity: 0.8,
    clearcoat: 0.8,
    clearcoatRoughness: 0.1,
  });

  const innerRing = new THREE.Mesh(
    new THREE.TorusGeometry(baseRadius, 0.03, 18, 120),
    ringMaterial,
  );
  const outerRing = new THREE.Mesh(
    new THREE.TorusGeometry(outerRadius, 0.02, 18, 140),
    ringMaterial,
  );
  outerRing.rotation.x = Math.PI / 2;
  root.add(innerRing, outerRing);

  const markers = new THREE.Group();
  const markerGeometry = new THREE.SphereGeometry(0.05, 18, 18);
  const markerMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xf2f2f2,
    metalness: 0.2,
    roughness: 0.2,
    transmission: 0.4,
    transparent: true,
    opacity: 0.85,
    clearcoat: 0.7,
    clearcoatRoughness: 0.15,
  });

  for (let i = 0; i < markerCount; i += 1) {
    const angle = (i / markerCount) * Math.PI * 2;
    const marker = new THREE.Mesh(markerGeometry, markerMaterial);
    marker.position.set(
      Math.cos(angle) * outerRadius,
      Math.sin(angle) * outerRadius,
      0.1,
    );
    markers.add(marker);
  }
  root.add(markers);

  const bridgeGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(baseRadius, 0, 0),
    new THREE.Vector3(outerRadius, 0, 0),
  ]);
  const bridgeMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.6,
  });
  root.add(new THREE.Line(bridgeGeometry, bridgeMaterial));

  const paneGeometry = new THREE.PlaneGeometry(outerRadius * 2.4, outerRadius * 2.4);
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

  const rotationTarget = new THREE.Vector2(0.15, -0.25);
  const rotationCurrent = new THREE.Vector2(0.15, -0.25);
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

    if (!prefersReducedMotion) {
      outerRing.rotation.z = elapsed * 0.12;
      markers.rotation.z = elapsed * 0.2;
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
