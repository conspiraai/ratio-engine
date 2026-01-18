export type RatioReference = {
  label: string;
  url: string;
};

type RatioSection = {
  title: string;
  body: string;
  bullets?: string[];
};

type PhiVisualSpec = {
  sceneId: "phi-harmonic-lattice";
  settings: {
    rectangleAspect: number;
    spiralTurns: number;
    depth: number;
    nodeCount: number;
    nodeScale: number;
  };
};

type SilverVisualSpec = {
  sceneId: "silver-spiral";
  settings: {
    rectangleAspect: number;
    spiralTurns: number;
    depth: number;
  };
};

type Sqrt2VisualSpec = {
  sceneId: "sqrt2-diagonal";
  settings: {
    squareSize: number;
    depth: number;
    layerCount: number;
  };
};

type Sqrt3VisualSpec = {
  sceneId: "sqrt3-lattice";
  settings: {
    cubeSize: number;
    depth: number;
    nodeCount: number;
  };
};

type PiVisualSpec = {
  sceneId: "pi-orbit";
  settings: {
    radius: number;
    arcTurns: number;
    markerCount: number;
  };
};

type FifthVisualSpec = {
  sceneId: "perfect-fifth";
  settings: {
    baseRadius: number;
    ratioA: number;
    ratioB: number;
    markerCount: number;
  };
};

type RatioVisualSpec =
  | PhiVisualSpec
  | SilverVisualSpec
  | Sqrt2VisualSpec
  | Sqrt3VisualSpec
  | PiVisualSpec
  | FifthVisualSpec;

export type RatioEntry = {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  symbol: string;
  value: string;
  exactForm: string;
  categories: string[];
  summary: string;
  sections: RatioSection[];
  references: RatioReference[];
  visualSpec: RatioVisualSpec;
};

export const RATIOS: RatioEntry[] = [
  {
    id: "phi",
    slug: "phi",
    title: "Phi",
    tagline: "Harmonic proportion guiding recursive growth.",
    symbol: "φ",
    value: "1.618033988…",
    exactForm: "(1 + √5) / 2",
    categories: ["irrational", "geometry", "growth", "design"],
    summary:
      "The golden ratio: a self-referential proportion where the whole relates to the larger part as the larger relates to the smaller.",
    sections: [
      {
        title: "Mathematical identity",
        body:
          "Phi (φ) is the positive solution to x² = x + 1, giving a ratio where adding 1 to the reciprocal returns the original value. It is irrational and algebraic of degree 2, so it cannot be expressed as a finite fraction or terminating decimal.",
        bullets: [
          "Definition: φ = (1 + √5) / 2 ≈ 1.618033988…",
          "Identity: φ² = φ + 1 and 1 / φ = φ − 1.",
          "Continued fraction: φ = 1 + 1/(1 + 1/(1 + …)).",
        ],
      },
      {
        title: "Fibonacci convergence",
        body:
          "Ratios of consecutive Fibonacci numbers converge to φ. As the sequence grows, Fₙ₊₁ / Fₙ approaches a stable value, making φ a limit of recursive growth patterns rather than an exact finite ratio.",
        bullets: [
          "Fibonacci: 1, 1, 2, 3, 5, 8, 13, …",
          "Limit: limₙ→∞ Fₙ₊₁ / Fₙ = φ.",
          "Closed form (Binet): Fₙ = (φⁿ − (1 − φ)ⁿ)/√5.",
        ],
      },
      {
        title: "Geometry and construction",
        body:
          "A golden rectangle has side ratio φ and can be subdivided into a square plus a smaller golden rectangle. Repeating this process yields a logarithmic spiral that approximates the golden spiral. In pentagons and pentagrams, diagonal-to-side ratios are φ, embedding the proportion into classical constructions.",
        bullets: [
          "Golden rectangle: remove a square and the remainder is similar to the original.",
          "Golden spiral: a logarithmic spiral that grows by φ every quarter turn.",
          "Pentagon/pentagram: diagonal / side = φ.",
        ],
      },
      {
        title: "Nature and biology (careful)",
        body:
          "Spiral phyllotaxis in plants often appears near the golden angle (~137.507764°), producing efficient packing without radial overlap. Many biological spirals and branching systems are modeled using φ-related approximations, but the ratio is not universal or deterministic.",
        bullets: [
          "Phyllotaxis: leaf and seed arrangements can approximate the golden angle.",
          "Shell and storm spirals often resemble logarithmic spirals, not necessarily exact φ spirals.",
          "Use φ as a descriptive model rather than a universal law.",
        ],
      },
      {
        title: "History, art, and modern design",
        body:
          "Euclid formalized the division in extreme and mean ratio. Renaissance artists and architects explored φ for proportion studies, and modern design culture adopted it as a heuristic for balanced layouts. Today φ is valued as a compositional guide, not a requirement.",
        bullets: [
          "Euclid, Elements Book VI: geometric definition of extreme and mean ratio.",
          "Renaissance interest in proportion, including Luca Pacioli's \"De divina proportione\".",
          "Modern usage spans typography, product design, and interface layout grids.",
        ],
      },
      {
        title: "Ratio key metaphor",
        body:
          "In the Ratio Atlas, φ operates like a harmonic index: a reference proportion used to tune growth, recurrence, and balance across systems. This is a metaphorical framing for design and analysis, not a scientific claim about causality.",
        bullets: [
          "Use φ as a ratio key for harmonizing scales and offsets.",
          "Treat it as a heuristic for compositional balance.",
          "Avoid overstating it as a universal constant of nature.",
        ],
      },
    ],
    references: [
      {
        label: "Wolfram MathWorld — Golden Ratio",
        url: "https://mathworld.wolfram.com/GoldenRatio.html",
      },
      {
        label: "Encyclopaedia Britannica — Golden Ratio",
        url: "https://www.britannica.com/science/golden-ratio",
      },
      {
        label: "OEIS A001622 — Fibonacci numbers",
        url: "https://oeis.org/A001622",
      },
      {
        label: "Euclid's Elements (Book VI)",
        url: "https://mathcs.clarku.edu/~djoyce/java/elements/bookVI/bookVI.html",
      },
      {
        label: "Khan Academy — The golden ratio",
        url: "https://www.khanacademy.org/math/geometry-home/geometry-lines/geometry-line-basics/a/the-golden-ratio",
      },
      {
        label: "Wolfram MathWorld — Phyllotaxis",
        url: "https://mathworld.wolfram.com/Phyllotaxis.html",
      },
      {
        label: "Pacioli, De divina proportione (LOC digital facsimile)",
        url: "https://www.loc.gov/item/07003412/",
      },
    ],
    visualSpec: {
      sceneId: "phi-harmonic-lattice",
      settings: {
        rectangleAspect: 1.618033988749895,
        spiralTurns: 4.25,
        depth: 0.7,
        nodeCount: 7,
        nodeScale: 0.07,
      },
    },
  },
  {
    id: "silver",
    slug: "silver-ratio",
    title: "Silver Ratio",
    tagline: "Root-two proportion for resilient, modular grids.",
    symbol: "δs",
    value: "2.414213562…",
    exactForm: "1 + √2",
    categories: ["irrational", "geometry", "design", "architecture"],
    summary:
      "The silver ratio complements φ, anchoring root-2 rectangles and modular architectures with a strong, calm proportion.",
    sections: [
      {
        title: "Mathematical definition",
        body:
          "The silver ratio δs is the positive solution to x = 2 + 1/x. It equals 1 + √2 and is irrational, arising naturally from root-2 rectangles and recursive partitioning.",
        bullets: [
          "δs = 1 + √2 ≈ 2.414213562…",
          "Identity: δs² = 2δs + 1.",
          "Continued fraction: δs = 2 + 1/(2 + 1/(2 + …)).",
        ],
      },
      {
        title: "Geometry and ratios",
        body:
          "Root-2 rectangles (such as ISO paper sizes) preserve proportion when halved, and their aspect ratio is √2. The silver ratio is the ratio of a root-2 rectangle's longer side to the square it contains.",
        bullets: [
          "Root-2 rectangle: sides in ratio √2.",
          "Divide a root-2 rectangle into two squares and a smaller root-2 rectangle; proportions repeat.",
        ],
      },
      {
        title: "Architectural context",
        body:
          "The silver ratio appears in modular grids and architectural systems favoring doubling and halving. It is often cited in Japanese and modernist design for its measured, resilient scale behavior.",
        bullets: [
          "ISO 216 paper sizes rely on √2 for consistent scaling.",
          "Modular panels and tiling systems benefit from root-2 splits.",
        ],
      },
      {
        title: "Applications and design",
        body:
          "Designers use the silver ratio as a counterweight to φ: it yields more grounded layouts and robust typography grids. It is particularly effective in layouts that need to scale across media without recomposition.",
        bullets: [
          "Typography grids with √2 scaling steps.",
          "Interface layouts with stable half-step scaling.",
        ],
      },
    ],
    references: [
      {
        label: "Wolfram MathWorld — Silver Ratio",
        url: "https://mathworld.wolfram.com/SilverRatio.html",
      },
      {
        label: "Britannica — Root-2 rectangle",
        url: "https://www.britannica.com/science/rectangle",
      },
      {
        label: "ISO 216 Paper Sizes",
        url: "https://www.iso.org/standard/36631.html",
      },
      {
        label: "MathWorld — Continued Fractions",
        url: "https://mathworld.wolfram.com/ContinuedFraction.html",
      },
      {
        label: "MathWorld — Root 2",
        url: "https://mathworld.wolfram.com/SquareRootof2.html",
      },
    ],
    visualSpec: {
      sceneId: "silver-spiral",
      settings: {
        rectangleAspect: 2.414213562373095,
        spiralTurns: 3.2,
        depth: 0.6,
      },
    },
  },
  {
    id: "sqrt2",
    slug: "sqrt-2",
    title: "Root Two",
    tagline: "Diagonal measure for scaling systems and grids.",
    symbol: "√2",
    value: "1.414213562…",
    exactForm: "√2",
    categories: ["irrational", "geometry", "measurement"],
    summary:
      "The diagonal of a unit square and the backbone of root-2 scaling systems used in measurement and design.",
    sections: [
      {
        title: "Mathematical definition",
        body:
          "√2 is the unique positive number whose square is 2. It is irrational, famously proven by contradiction in classical Greek mathematics.",
        bullets: [
          "Definition: √2 ≈ 1.414213562…",
          "Identity: (√2)² = 2.",
        ],
      },
      {
        title: "Geometry and measurement",
        body:
          "In a unit square, the diagonal length is √2 by the Pythagorean theorem. This gives a fundamental diagonal scaling that repeats across grids, tiles, and measurement systems.",
        bullets: [
          "Unit square diagonal: √(1² + 1²) = √2.",
          "Root-2 rectangles preserve ratio when folded or halved.",
        ],
      },
      {
        title: "History",
        body:
          "The irrationality of √2 is one of the earliest known proofs in number theory. Its discovery reshaped the understanding of ratios and magnitudes in ancient mathematics.",
        bullets: [
          "Attributed to the Pythagorean school.",
          "Key moment in the study of incommensurable lengths.",
        ],
      },
      {
        title: "Applications",
        body:
          "√2 is used in design grids, technical drawings, paper sizes, and diagonal measurements in architecture and engineering, offering clean doubling and halving across scales.",
        bullets: [
          "ISO paper: A-series uses √2 aspect ratio.",
          "Diagonal bracing and measurement scaling.",
        ],
      },
    ],
    references: [
      {
        label: "Wolfram MathWorld — Square Root of 2",
        url: "https://mathworld.wolfram.com/SquareRootof2.html",
      },
      {
        label: "Britannica — Irrational number",
        url: "https://www.britannica.com/science/irrational-number",
      },
      {
        label: "Khan Academy — Proof that √2 is irrational",
        url: "https://www.khanacademy.org/math/geometry/hs-geo-foundations/hs-geo-irrational-numbers/a/irrational-numbers",
      },
      {
        label: "ISO 216 Paper Sizes",
        url: "https://www.iso.org/standard/36631.html",
      },
      {
        label: "MathWorld — Pythagorean Theorem",
        url: "https://mathworld.wolfram.com/PythagoreanTheorem.html",
      },
    ],
    visualSpec: {
      sceneId: "sqrt2-diagonal",
      settings: {
        squareSize: 1.8,
        depth: 0.65,
        layerCount: 5,
      },
    },
  },
  {
    id: "sqrt3",
    slug: "sqrt-3",
    title: "Root Three",
    tagline: "Triangular lattice scale for spatial packing.",
    symbol: "√3",
    value: "1.732050808…",
    exactForm: "√3",
    categories: ["irrational", "geometry", "lattice"],
    summary:
      "The diagonal of a unit cube and the scale factor behind hexagonal and triangular lattices.",
    sections: [
      {
        title: "Mathematical definition",
        body:
          "√3 is the positive number whose square is 3. It is irrational and appears naturally in triangular and hexagonal geometry.",
        bullets: [
          "Definition: √3 ≈ 1.732050808…",
          "Identity: (√3)² = 3.",
        ],
      },
      {
        title: "Spatial geometry",
        body:
          "In a unit cube, the body diagonal has length √3. In an equilateral triangle of side 1, the height is √3/2, linking √3 to hexagonal packing and lattice geometry.",
        bullets: [
          "Unit cube diagonal: √(1² + 1² + 1²) = √3.",
          "Equilateral height: √3/2.",
        ],
      },
      {
        title: "Applications",
        body:
          "√3 appears in hexagonal tiling, crystal lattices, and engineering layouts where triangular grids maximize packing density and structural stability.",
        bullets: [
          "Hexagonal packing and honeycomb geometry.",
          "Triangular truss and lattice design.",
        ],
      },
      {
        title: "Historical context",
        body:
          "Classical geometry used √3 in constructions of equilateral triangles and hexagons, making it central to Euclidean polygon geometry and measurement.",
        bullets: [
          "Regular hexagon construction from a circle.",
          "Measurement of altitude in classical triangle geometry.",
        ],
      },
    ],
    references: [
      {
        label: "Wolfram MathWorld — Square Root of 3",
        url: "https://mathworld.wolfram.com/SquareRootof3.html",
      },
      {
        label: "MathWorld — Equilateral Triangle",
        url: "https://mathworld.wolfram.com/EquilateralTriangle.html",
      },
      {
        label: "MathWorld — Hexagonal Packing",
        url: "https://mathworld.wolfram.com/HexagonalPacking.html",
      },
      {
        label: "Britannica — Regular polygon",
        url: "https://www.britannica.com/science/polygon",
      },
      {
        label: "MathWorld — Cube",
        url: "https://mathworld.wolfram.com/Cube.html",
      },
    ],
    visualSpec: {
      sceneId: "sqrt3-lattice",
      settings: {
        cubeSize: 1.7,
        depth: 0.7,
        nodeCount: 8,
      },
    },
  },
  {
    id: "pi",
    slug: "pi",
    title: "Pi",
    tagline: "Circular constant shaping motion and waves.",
    symbol: "π",
    value: "3.141592653…",
    exactForm: "circumference / diameter",
    categories: ["transcendental", "geometry", "analysis"],
    summary:
      "The constant linking a circle's circumference to its diameter, anchoring periodic motion and wave geometry.",
    sections: [
      {
        title: "Mathematical definition",
        body:
          "π is the ratio of a circle's circumference to its diameter. It is irrational and transcendental, appearing throughout geometry, analysis, and signal processing.",
        bullets: [
          "Definition: π = C / d ≈ 3.141592653…",
          "Transcendental: not a root of any polynomial with rational coefficients.",
        ],
      },
      {
        title: "Geometry",
        body:
          "π governs the arc length of circles and the area of disks. It shapes rotations, orbits, and every geometry tied to radial symmetry.",
        bullets: [
          "Circumference: C = 2πr.",
          "Area: A = πr².",
        ],
      },
      {
        title: "History",
        body:
          "Ancient approximations of π appear in Babylonian and Greek mathematics. Archimedes' polygon method advanced precision, and modern computation refined its digits.",
        bullets: [
          "Archimedes used inscribed and circumscribed polygons.",
          "Symbols for π standardized in the 18th century.",
        ],
      },
      {
        title: "Applications",
        body:
          "π is essential in Fourier analysis, probability, physics, and signal processing, linking circular motion with oscillatory systems.",
        bullets: [
          "Wave equations and harmonic motion.",
          "Normal distribution constants.",
        ],
      },
    ],
    references: [
      {
        label: "Wolfram MathWorld — Pi",
        url: "https://mathworld.wolfram.com/Pi.html",
      },
      {
        label: "Britannica — Pi",
        url: "https://www.britannica.com/science/pi-mathematics",
      },
      {
        label: "MathWorld — Circle",
        url: "https://mathworld.wolfram.com/Circle.html",
      },
      {
        label: "Khan Academy — The number pi",
        url: "https://www.khanacademy.org/math/geometry-home/geometry-circles/geometry-circles-introduction/a/pi",
      },
      {
        label: "MathWorld — Fourier Series",
        url: "https://mathworld.wolfram.com/FourierSeries.html",
      },
    ],
    visualSpec: {
      sceneId: "pi-orbit",
      settings: {
        radius: 1.8,
        arcTurns: 2.3,
        markerCount: 40,
      },
    },
  },
  {
    id: "perfect-fifth",
    slug: "perfect-fifth",
    title: "Perfect Fifth",
    tagline: "Consonant 3:2 ratio for harmonic alignment.",
    symbol: "3:2",
    value: "1.5",
    exactForm: "3 / 2",
    categories: ["rational", "music", "architecture"],
    summary:
      "A foundational musical interval: a simple 3:2 ratio used in tuning systems and harmonic architecture.",
    sections: [
      {
        title: "Mathematical definition",
        body:
          "The perfect fifth is the ratio 3:2 between frequencies. It is a rational ratio that creates strong consonance in harmonic systems.",
        bullets: [
          "Ratio: 3 / 2 = 1.5.",
          "Overtone alignment: the 3rd harmonic aligns with the 2nd.",
        ],
      },
      {
        title: "Musical context",
        body:
          "The perfect fifth appears in just intonation and Pythagorean tuning, anchoring scales and chord structures. It is used to build the circle of fifths.",
        bullets: [
          "Just intonation emphasizes integer ratios.",
          "Circle of fifths organizes tonal relationships.",
        ],
      },
      {
        title: "Architectural analogies",
        body:
          "Architectural proportion systems sometimes borrow musical ratios to inform spacing and harmonic modules, using 3:2 as a stable interval between spans.",
        bullets: [
          "Ratio grids for column spacing.",
          "Acoustic scaling in hall design.",
        ],
      },
      {
        title: "Applications",
        body:
          "Beyond music, the ratio appears in signal processing, resonance modeling, and harmonic motion where integer relationships reduce beat complexity.",
        bullets: [
          "Harmonic alignment in wave synthesis.",
          "Resonant scaling between coupled oscillators.",
        ],
      },
    ],
    references: [
      {
        label: "Britannica — Musical interval",
        url: "https://www.britannica.com/art/interval-music",
      },
      {
        label: "Britannica — Pythagorean tuning",
        url: "https://www.britannica.com/art/Pythagorean-tuning",
      },
      {
        label: "MathWorld — Harmonic Series",
        url: "https://mathworld.wolfram.com/HarmonicSeries.html",
      },
      {
        label: "Khan Academy — Ratios",
        url: "https://www.khanacademy.org/math/pre-algebra/pre-algebra-ratios-rates/pre-algebra-ratios/a/ratios",
      },
      {
        label: "MIT OpenCourseWare — Sound and Music",
        url: "https://ocw.mit.edu/courses/21m-380-music-and-technology-sound-and-music-fall-2009/",
      },
    ],
    visualSpec: {
      sceneId: "perfect-fifth",
      settings: {
        baseRadius: 1.4,
        ratioA: 3,
        ratioB: 2,
        markerCount: 16,
      },
    },
  },
];

const SLUG_ALIASES: Record<string, string> = {
  "golden-ratio": "phi",
  golden: "phi",
  silver: "silver-ratio",
  silverratio: "silver-ratio",
  sqrt2: "sqrt-2",
  sqrt3: "sqrt-3",
  perfectfifth: "perfect-fifth",
};

export const normalizeRatioSlug = (slug: string) =>
  slug.toLowerCase().trim().replace(/[_\s]+/g, "-");

export const getRatioBySlug = (slug: string) => {
  const normalized = normalizeRatioSlug(slug);
  const canonical = SLUG_ALIASES[normalized] ?? normalized;
  return RATIOS.find((ratio) => ratio.slug === canonical);
};
