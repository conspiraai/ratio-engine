"use client";

import dynamic from "next/dynamic";
import { getRatioBySlug } from "@/app/lib/atlas/ratios";

const PhiScene = dynamic(() => import("@/app/components/atlas/PhiScene"), {
  ssr: false,
});
const PiScene = dynamic(() => import("@/app/components/atlas/PiScene"), {
  ssr: false,
});
const PerfectFifthScene = dynamic(
  () => import("@/app/components/atlas/PerfectFifthScene"),
  { ssr: false },
);
const SilverScene = dynamic(() => import("@/app/components/atlas/SilverScene"), {
  ssr: false,
});
const Sqrt2Scene = dynamic(() => import("@/app/components/atlas/Sqrt2Scene"), {
  ssr: false,
});
const Sqrt3Scene = dynamic(() => import("@/app/components/atlas/Sqrt3Scene"), {
  ssr: false,
});

type AtlasSceneClientProps = {
  slug: string;
};

export default function AtlasSceneClient({ slug }: AtlasSceneClientProps) {
  const entry = getRatioBySlug(slug);

  if (!entry) {
    return null;
  }

  switch (entry.visualSpec.sceneId) {
    case "phi-harmonic-lattice":
      return <PhiScene entry={entry} />;
    case "silver-spiral":
      return <SilverScene entry={entry} />;
    case "sqrt2-diagonal":
      return <Sqrt2Scene entry={entry} />;
    case "sqrt3-lattice":
      return <Sqrt3Scene entry={entry} />;
    case "pi-orbit":
      return <PiScene entry={entry} />;
    case "perfect-fifth":
      return <PerfectFifthScene entry={entry} />;
    default:
      return null;
  }
}
