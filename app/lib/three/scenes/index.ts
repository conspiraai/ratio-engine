import type { SceneDefinition } from "@/app/lib/three/types";
import {
  createScene as createPhiScene,
  defaultParams as phiDefaults,
  paramSchema as phiSchema,
  type PhiSceneParams,
} from "@/app/lib/three/scenes/phi";
import {
  createScene as createSqrt2Scene,
  defaultParams as sqrt2Defaults,
  paramSchema as sqrt2Schema,
  type Sqrt2SceneParams,
} from "@/app/lib/three/scenes/sqrt2";
import {
  createScene as createPiScene,
  defaultParams as piDefaults,
  paramSchema as piSchema,
  type PiSceneParams,
} from "@/app/lib/three/scenes/pi";
import {
  createScene as createEScene,
  defaultParams as eDefaults,
  paramSchema as eSchema,
  type ESceneParams,
} from "@/app/lib/three/scenes/e";
import {
  createScene as createFibonacciScene,
  defaultParams as fibonacciDefaults,
  paramSchema as fibonacciSchema,
  type FibonacciSceneParams,
} from "@/app/lib/three/scenes/fibonacci";

export const sceneRegistry = {
  phi: {
    id: "phi",
    title: "Phi",
    description: "Phyllotaxis spiral and golden rectangle recursion.",
    createScene: createPhiScene,
    defaultParams: phiDefaults,
    schema: phiSchema,
  } satisfies SceneDefinition<PhiSceneParams>,
  sqrt2: {
    id: "sqrt2",
    title: "√2",
    description: "Root-2 rectangle tiling with folding proof.",
    createScene: createSqrt2Scene,
    defaultParams: sqrt2Defaults,
    schema: sqrt2Schema,
  } satisfies SceneDefinition<Sqrt2SceneParams>,
  pi: {
    id: "pi",
    title: "π",
    description: "Polygonal approximation with circumference unwrapping.",
    createScene: createPiScene,
    defaultParams: piDefaults,
    schema: piSchema,
  } satisfies SceneDefinition<PiSceneParams>,
  e: {
    id: "e",
    title: "e",
    description: "Continuous compounding morphing into logarithmic compression.",
    createScene: createEScene,
    defaultParams: eDefaults,
    schema: eSchema,
  } satisfies SceneDefinition<ESceneParams>,
  fibonacci: {
    id: "fibonacci",
    title: "Fibonacci",
    description: "Discrete sequence unfolding into spiral and rectangles.",
    createScene: createFibonacciScene,
    defaultParams: fibonacciDefaults,
    schema: fibonacciSchema,
  } satisfies SceneDefinition<FibonacciSceneParams>,
};

export type SceneRegistryKey = keyof typeof sceneRegistry;
