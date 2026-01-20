"use client";

import { SynchronicityProvider } from "@/lib/engine/SynchronicityProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <SynchronicityProvider>{children}</SynchronicityProvider>;
}
