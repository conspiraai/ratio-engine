"use client";

import type { RenderQuality } from "@/app/lib/three/types";

type RenderQualitySelectProps = {
  value: RenderQuality;
  onChange: (value: RenderQuality) => void;
};

export default function RenderQualitySelect({
  value,
  onChange,
}: RenderQualitySelectProps) {
  return (
    <label className="flex flex-col gap-2 md:col-span-2">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
        Render Quality
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as RenderQuality)}
        className="rounded-xl border border-[var(--border)] bg-[color:rgba(255,255,255,0.04)] px-3 py-2 text-sm text-[var(--fg)]"
      >
        <option value="low">Low — focus on performance</option>
        <option value="medium">Medium — balanced</option>
        <option value="high">High — maximum detail</option>
      </select>
    </label>
  );
}
