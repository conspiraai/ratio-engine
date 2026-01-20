"use client";

import { useEffect, useRef } from "react";
import { PHI } from "@/lib/engine/constants";
import { useSynchronicity } from "@/lib/engine/SynchronicityProvider";

const GOLD = "#ffd700";

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export default function SynchronicityCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef({
    timeBasedRatio: PHI,
    fibSequence: [1, 1],
    primes: [],
    pointer: { x: 0.5, y: 0.5 },
    scrollRatio: 0,
    getPrimeIndexedEvent: (_index: number) => null as number | null,
  });
  const synchronicity = useSynchronicity();

  useEffect(() => {
    stateRef.current = {
      timeBasedRatio: synchronicity.timeBasedRatio,
      fibSequence: synchronicity.fibSequence,
      primes: synchronicity.primes,
      pointer: synchronicity.pointer,
      scrollRatio: synchronicity.scrollRatio,
      getPrimeIndexedEvent: synchronicity.getPrimeIndexedEvent,
    };
  }, [synchronicity]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    let frameId = 0;

    const resize = () => {
      const { innerWidth, innerHeight, devicePixelRatio } = window;
      const dpr = Math.max(1, devicePixelRatio || 1);
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      canvas.style.width = `${innerWidth}px`;
      canvas.style.height = `${innerHeight}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const render = () => {
      const { clientWidth: width, clientHeight: height } = canvas;
      const now = performance.now() / 1000;
      const {
        timeBasedRatio,
        fibSequence,
        primes,
        pointer,
        scrollRatio,
        getPrimeIndexedEvent,
      } = stateRef.current;

      context.clearRect(0, 0, width, height);

      const gradient = context.createRadialGradient(
        width * 0.5,
        height * 0.45,
        0,
        width * 0.5,
        height * 0.45,
        Math.max(width, height) * 0.75,
      );
      gradient.addColorStop(0, "rgba(20, 16, 10, 0.6)");
      gradient.addColorStop(0.45, "rgba(5, 5, 9, 0.85)");
      gradient.addColorStop(1, "rgba(3, 3, 6, 0.98)");
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);

      const centerX = width * 0.5 + (pointer.x - 0.5) * width * 0.18;
      const centerY = height * 0.5 + (pointer.y - 0.5) * height * 0.16;
      const maxRadius = Math.min(width, height) * 0.48;
      const spiralScale = Math.min(width, height) * 0.0045 * (0.7 + scrollRatio * 0.6);

      context.save();
      context.strokeStyle = "rgba(255, 215, 120, 0.55)";
      context.lineWidth = 1;
      context.beginPath();
      for (let i = 0; i < 200; i += 1) {
        const angle = i * 0.33 + now * 0.25 + scrollRatio * 2.4;
        const radius = spiralScale * Math.pow(PHI, i / 18) / timeBasedRatio;
        if (radius > maxRadius) {
          break;
        }
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        if (i === 0) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }
      }
      context.stroke();
      context.restore();

      const fibSlice = fibSequence.slice(0, 10);
      fibSlice.forEach((value, index) => {
        const orbit = (value / fibSlice[fibSlice.length - 1]) * maxRadius * 0.6;
        const angle = now * 0.4 + index * PHI;
        const isPrimeIndex = primes.includes(index + 1);
        const pulse = isPrimeIndex ? 1.2 + Math.sin(now * 2.2 + index) * 0.2 : 1;
        const radius = clamp(orbit * pulse, 12, maxRadius);
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        context.beginPath();
        context.fillStyle = isPrimeIndex ? "rgba(255, 215, 0, 0.7)" : "rgba(255, 255, 255, 0.5)";
        context.arc(x, y, 2.2 + index * 0.35, 0, Math.PI * 2);
        context.fill();
      });

      context.save();
      context.strokeStyle = "rgba(255, 215, 0, 0.25)";
      primes.slice(0, 12).forEach((prime, index) => {
        const primeValue = getPrimeIndexedEvent(index) ?? prime;
        const radius = clamp(
          (primeValue / fibSequence[fibSequence.length - 1]) * maxRadius * 1.1,
          20,
          maxRadius,
        );
        context.beginPath();
        context.setLineDash([3, 8]);
        context.lineWidth = 0.8;
        context.arc(centerX, centerY, radius, 0, Math.PI * 2);
        context.stroke();
      });
      context.restore();

      const glowRadius = Math.min(width, height) * 0.12;
      context.beginPath();
      context.fillStyle = "rgba(255, 215, 0, 0.12)";
      context.arc(centerX, centerY, glowRadius, 0, Math.PI * 2);
      context.fill();

      context.beginPath();
      context.fillStyle = GOLD;
      context.arc(centerX, centerY, 3, 0, Math.PI * 2);
      context.fill();

      frameId = window.requestAnimationFrame(render);
    };

    resize();
    frameId = window.requestAnimationFrame(render);
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div className="absolute inset-0">
      <canvas ref={canvasRef} className="ratio-canvas" aria-hidden="true" />
    </div>
  );
}
