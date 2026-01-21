"use client";

import { useEffect, useMemo, useState } from "react";
import {
  fibonacciSequence,
  primeSieve,
  timeBasedRatio,
} from "@/lib/engine/synchronicity";

type PointerState = {
  x: number;
  y: number;
};

type SynchronicityEngineState = {
  time: number;
  phiRatio: number;
  fibSequence: number[];
  primes: number[];
  pointer: PointerState;
  scrollRatio: number;
};

export const useSynchronicityEngine = (): SynchronicityEngineState => {
  const [time, setTime] = useState(0);
  const [pointer, setPointer] = useState<PointerState>({ x: 0.5, y: 0.5 });
  const [scrollRatio, setScrollRatio] = useState(0);

  const fibSequence = useMemo(() => fibonacciSequence(11), []);
  const primes = useMemo(() => primeSieve(47), []);

  useEffect(() => {
    let rafId = 0;
    const start = performance.now();

    const tick = (now: number) => {
      setTime(now - start);
      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    const updatePointer = (event: PointerEvent) => {
      const width = window.innerWidth || 1;
      const height = window.innerHeight || 1;
      setPointer({
        x: Math.min(1, Math.max(0, event.clientX / width)),
        y: Math.min(1, Math.max(0, event.clientY / height)),
      });
    };

    const updateScroll = () => {
      const height = document.body.scrollHeight - window.innerHeight;
      if (height <= 0) {
        setScrollRatio(0);
        return;
      }
      setScrollRatio(Math.min(1, Math.max(0, window.scrollY / height)));
    };

    window.addEventListener("pointermove", updatePointer, { passive: true });
    window.addEventListener("scroll", updateScroll, { passive: true });
    updateScroll();

    return () => {
      window.removeEventListener("pointermove", updatePointer);
      window.removeEventListener("scroll", updateScroll);
    };
  }, []);

  const phiRatio = useMemo(() => timeBasedRatio(time / 1000), [time]);

  return {
    time,
    phiRatio,
    fibSequence,
    primes,
    pointer,
    scrollRatio,
  };
};
