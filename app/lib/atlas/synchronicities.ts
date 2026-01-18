export type SynchronicityConvergent = {
  p: number;
  q: number;
  approx: number;
  error: number;
};

export type SynchronicityNeighbor = {
  p: number;
  q: number;
  approx: number;
  delta: number;
};

export type SynchronicityTransform = {
  label: string;
  value: number;
  hint: string;
};

export type SynchronicityData = {
  continuedFractionTerms: number[];
  convergents: SynchronicityConvergent[];
  harmonicNeighbors: SynchronicityNeighbor[];
  transforms: SynchronicityTransform[];
  note?: string;
};

const SYNCHRONICITY_NOTES: Record<string, string> = {
  phi: "FIBONACCI TRACE: successive ratios spiral toward lockstep.",
  "silver-ratio": "PELL RESONANCE: quadratic echoes in the Pell lattice.",
  "sqrt-2": "DIAGONAL KEY: square roots align the unit grid.",
  "sqrt-3": "HEX LATTICE: triangular spacing resolves into √3.",
  pi: "CIRCLE SIGNAL: curvature encodes an infinite harmonic sweep.",
  "perfect-fifth": "OVERTONE LOCK: the 3rd harmonic rides the 2nd.",
};

export const parseRatioValue = (value: string) => {
  const sanitized = value.replace(/[^\d.-]/g, "");
  const parsed = Number.parseFloat(sanitized);
  return Number.isFinite(parsed) ? parsed : 0;
};

const continuedFractionTerms = (value: number, limit = 6) => {
  const terms: number[] = [];
  let current = value;

  for (let index = 0; index < limit; index += 1) {
    const term = Math.floor(current);
    terms.push(term);
    const remainder = current - term;
    if (Math.abs(remainder) < 1e-12) {
      break;
    }
    current = 1 / remainder;
  }

  return terms;
};

const convergentsFromTerms = (
  terms: number[],
  maxTerms = 6,
): SynchronicityConvergent[] => {
  const result: SynchronicityConvergent[] = [];
  let p0 = 1;
  let p1 = terms[0] ?? 0;
  let q0 = 0;
  let q1 = 1;

  if (terms.length === 0) {
    return result;
  }

  result.push({
    p: p1,
    q: q1,
    approx: p1 / q1,
    error: 0,
  });

  for (let index = 1; index < Math.min(terms.length, maxTerms); index += 1) {
    const term = terms[index];
    const p = term * p1 + p0;
    const q = term * q1 + q0;
    const approx = p / q;
    result.push({ p, q, approx, error: 0 });
    p0 = p1;
    p1 = p;
    q0 = q1;
    q1 = q;
  }

  return result;
};

const harmonicNeighbors = (
  value: number,
  maxDenominator = 12,
  limit = 6,
): SynchronicityNeighbor[] => {
  const neighbors: SynchronicityNeighbor[] = [];

  for (let q = 1; q <= maxDenominator; q += 1) {
    const p = Math.max(1, Math.round(value * q));
    const approx = p / q;
    const delta = Math.abs(approx - value);
    neighbors.push({ p, q, approx, delta });
  }

  return neighbors
    .sort((a, b) => a.delta - b.delta)
    .slice(0, limit);
};

const transformCatalog = (value: number): SynchronicityTransform[] => [
  {
    label: "RECIPROCAL",
    value: 1 / value,
    hint: "inverse mirror",
  },
  {
    label: "SQUARE",
    value: value ** 2,
    hint: "area resonance",
  },
  {
    label: "ROOT",
    value: Math.sqrt(value),
    hint: "scale backshift",
  },
  {
    label: "CUBE",
    value: value ** 3,
    hint: "volume pulse",
  },
];

export const buildSynchronicities = (
  value: number,
  slug: string,
): SynchronicityData => {
  const terms = continuedFractionTerms(value, 6);
  const convergents = convergentsFromTerms(terms, 6).map((item) => ({
    ...item,
    error: Math.abs(item.approx - value),
  }));

  return {
    continuedFractionTerms: terms,
    convergents,
    harmonicNeighbors: harmonicNeighbors(value, 12, 6),
    transforms: transformCatalog(value),
    note: SYNCHRONICITY_NOTES[slug],
  };
};
