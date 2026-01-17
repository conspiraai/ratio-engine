"use client";

import { useEffect, useRef } from "react";
import { ENGINE_COLORS } from "@/lib/engine/constants";
import { createPhiSpiral } from "@/lib/engine/phiSpiral";

export default function ThreePhiScene() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const THREE = (window as unknown as { THREE?: any }).THREE;
    if (!THREE) {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.domElement.style.pointerEvents = "none";
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.inset = "0";
    renderer.domElement.style.zIndex = "0";
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight.position.set(5, 6, 4);
    scene.add(directionalLight);

    const group = new THREE.Group();
    scene.add(group);

    const spiralPoints = createPhiSpiral().map(
      (point) => new THREE.Vector3(point.x, point.y, point.z),
    );

    const spiralGeometry = new THREE.BufferGeometry().setFromPoints(spiralPoints);
    const spiralMaterial = new THREE.LineBasicMaterial({
      color: ENGINE_COLORS.spiral,
      transparent: true,
      opacity: 0.85,
    });
    const spiralLine = new THREE.Line(spiralGeometry, spiralMaterial);
    group.add(spiralLine);

    const pointGeometry = new THREE.BufferGeometry().setFromPoints(spiralPoints);
    const pointMaterial = new THREE.PointsMaterial({
      color: ENGINE_COLORS.accent,
      size: 0.05,
    });
    const pointCloud = new THREE.Points(pointGeometry, pointMaterial);
    group.add(pointCloud);

    const coreGeometry = new THREE.IcosahedronGeometry(1.1, 1);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: ENGINE_COLORS.core,
      emissive: "#0f0f10",
      roughness: 0.35,
      metalness: 0.65,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    group.add(coreMesh);

    const ringGeometry = new THREE.TorusGeometry(2.4, 0.06, 16, 120);
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: ENGINE_COLORS.ring,
      emissive: "#1a1a1a",
      roughness: 0.35,
      metalness: 0.5,
    });
    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    ringMesh.rotation.x = Math.PI / 2;
    group.add(ringMesh);

    const clock = new THREE.Clock();
    let animationFrame = 0;

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      group.rotation.y = elapsed * 0.2;
      group.rotation.x = elapsed * 0.15;
      coreMesh.scale.setScalar(1 + Math.sin(elapsed * 2) * 0.05);
      ringMesh.rotation.z = elapsed * 0.4;
      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(animate);
    };

    const handleResize = () => {
      const { clientWidth, clientHeight } = container;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
    };

    handleResize();
    animate();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.cancelAnimationFrame(animationFrame);
      ringGeometry.dispose();
      ringMaterial.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      pointGeometry.dispose();
      pointMaterial.dispose();
      spiralGeometry.dispose();
      spiralMaterial.dispose();
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="glass-card glass-card--featured pointer-events-none relative h-[360px] w-full overflow-hidden rounded-3xl"
    >
      <div className="chip absolute left-5 top-5 z-10 rounded-full px-4 py-1 text-xs tracking-[0.3em]">
        Phi Visualization v2
      </div>
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12)_0%,transparent_55%)]" />
    </div>
  );
}
