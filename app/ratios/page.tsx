import Link from "next/link";

const ratios = [
  {
    name: "Golden Ratio",
    value: "φ ≈ 1.618",
    description: "The proportion found in growth patterns and visual harmony.",
    href: "/phi",
  },
  {
    name: "Fibonacci Sequence",
    value: "1, 1, 2, 3, 5...",
    description: "A recursive sequence that approaches the golden ratio.",
    href: "/fibonacci",
  },
  {
    name: "Golden Angle",
    value: "≈ 137.5°",
    description: "The rotation that packs leaves and seeds efficiently.",
    href: "/golden-angle",
  },
  {
    name: "√2 (Root-2)",
    value: "≈ 1.414",
    description: "The diagonal ratio that scales squares and rectangles.",
    href: "/sqrt-2",
  },
  {
    name: "π (Pi)",
    value: "≈ 3.14159",
    description: "The constant that links circles to their diameter.",
    href: "/pi",
  },
];

export default function RatiosPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-16">
      <div className="max-w-3xl space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-white/50">
          Ratio Index
        </p>
        <h1 className="text-3xl font-semibold text-white sm:text-4xl">
          Explore the ratios
        </h1>
        <p className="text-white/60">
          Each module below introduces a defining ratio and links to a dedicated
          deep dive.
        </p>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {ratios.map((ratio) => (
          <Link
            key={ratio.name}
            href={ratio.href}
            className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-white/30 hover:bg-white/10"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                {ratio.name}
              </h2>
              <span className="text-sm text-white/60">{ratio.value}</span>
            </div>
            <p className="mt-3 text-sm text-white/60">
              {ratio.description}
            </p>
            <span className="mt-6 inline-flex text-xs uppercase tracking-[0.3em] text-white/40 group-hover:text-white/70">
              View ratio →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
