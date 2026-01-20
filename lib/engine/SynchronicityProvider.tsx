"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { PHI } from "./constants";

type PointerState = {
  x: number;
  y: number;
};

type SynchronicityContextValue = {
  timeBasedRatio: number;
  fibSequence: number[];
  primes: number[];
  pointer: PointerState;
  scrollRatio: number;
  getPrimeIndexedEvent: (index: number) => number | null;
};

const SynchronicityContext = createContext<SynchronicityContextValue | null>(null);

const buildFibonacci = (length: number) => {
  const sequence = [1, 1];
  while (sequence.length < length) {
    sequence.push(sequence.at(-1)! + sequence.at(-2)!);
  }
  return sequence;
};

const sievePrimes = (limit: number) => {
  const isPrime = Array.from({ length: limit + 1 }, () => true);
  isPrime[0] = false;
  isPrime[1] = false;
  for (let i = 2; i * i <= limit; i += 1) {
    if (isPrime[i]) {
      for (let j = i * i; j <= limit; j += i) {
        isPrime[j] = false;
      }
    }
  }
  return isPrime.flatMap((prime, index) => (prime ? index : []));
};

export function SynchronicityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [timeBasedRatio, setTimeBasedRatio] = useState(PHI);
  const [fibSequence] = useState(() => buildFibonacci(24));
  const [primes, setPrimes] = useState<number[]>([]);
  const [pointer, setPointer] = useState<PointerState>({ x: 0.5, y: 0.5 });
  const [scrollRatio, setScrollRatio] = useState(0);

  useEffect(() => {
    setPrimes(sievePrimes(Math.max(89, fibSequence.length * 6)));
  }, [fibSequence.length]);

  useEffect(() => {
    let frameId = 0;
    const tick = () => {
      const seconds = Date.now() / 1000;
      const wave = (Math.sin(seconds / PHI) + 1) / 2;
      const ratio = Math.pow(PHI, 0.4 + wave * 0.6);
      setTimeBasedRatio(ratio);
      frameId = window.requestAnimationFrame(tick);
    };
    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const x = event.clientX / window.innerWidth;
      const y = event.clientY / window.innerHeight;
      setPointer({ x: Number.isFinite(x) ? x : 0.5, y: Number.isFinite(y) ? y : 0.5 });
    };

    const handlePointerLeave = () => {
      setPointer({ x: 0.5, y: 0.5 });
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      setScrollRatio(window.scrollY / maxScroll);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getPrimeIndexedEvent = useCallback(
    (index: number) => {
      const primeIndexed = primes
        .filter((prime) => prime <= fibSequence.length)
        .map((prime) => fibSequence[prime - 1]);
      if (primeIndexed.length === 0) {
        return null;
      }
      const normalized = ((index % primeIndexed.length) + primeIndexed.length) % primeIndexed.length;
      return primeIndexed[normalized];
    },
    [fibSequence, primes],
  );

  const value = useMemo(
    () => ({
      timeBasedRatio,
      fibSequence,
      primes,
      pointer,
      scrollRatio,
      getPrimeIndexedEvent,
    }),
    [timeBasedRatio, fibSequence, primes, pointer, scrollRatio, getPrimeIndexedEvent],
  );

  return (
    <SynchronicityContext.Provider value={value}>
      {children}
    </SynchronicityContext.Provider>
  );
}

export const useSynchronicity = () => {
  const context = useContext(SynchronicityContext);
  if (!context) {
    throw new Error("useSynchronicity must be used within SynchronicityProvider");
  }
  return context;
};
