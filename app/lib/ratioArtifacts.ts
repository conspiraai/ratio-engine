const PHI = (1 + Math.sqrt(5)) / 2;

export type RatioArtifact = {
  id: string;
  title: string;
  description: string;
  href: string;
  metricLabel: string;
  metricValue: string;
};

export const ratioArtifacts: RatioArtifact[] = [
  {
    id: "phi",
    title: "Phi",
    description: "Golden ratio for growth and proportion.",
    href: "/phi",
    metricLabel: "φ",
    metricValue: PHI.toFixed(6),
  },
  {
    id: "sqrt2",
    title: "√2",
    description: "Root-2 rectangle and diagonal scaling.",
    href: "/sqrt-2",
    metricLabel: "√2",
    metricValue: Math.SQRT2.toFixed(6),
  },
  {
    id: "pi",
    title: "π",
    description: "Circumference to diameter constant.",
    href: "/pi",
    metricLabel: "π",
    metricValue: Math.PI.toFixed(6),
  },
  {
    id: "e",
    title: "e",
    description: "Euler’s number for continuous growth.",
    href: "/e",
    metricLabel: "e",
    metricValue: Math.E.toFixed(6),
  },
  {
    id: "fibonacci",
    title: "Fibonacci",
    description: "Sequence that shapes spirals and lattices.",
    href: "/fibonacci",
    metricLabel: "F₁₀",
    metricValue: "55",
  },
];
