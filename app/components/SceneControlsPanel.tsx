"use client";

import type { ReactNode } from "react";
import type { SceneControl, SceneParamValue } from "@/app/lib/three/types";

type SceneControlsPanelProps = {
  title?: string;
  schema: SceneControl[];
  values: Record<string, SceneParamValue>;
  onChange: (id: string, value: SceneParamValue) => void;
  children?: ReactNode;
};

const formatValue = (control: SceneControl, value: SceneParamValue) => {
  if (control.type !== "range" || typeof value !== "number") {
    return String(value);
  }
  return control.formatValue ? control.formatValue(value) : value.toFixed(2);
};

export default function SceneControlsPanel({
  title = "Controls",
  schema,
  values,
  onChange,
  children,
}: SceneControlsPanelProps) {
  return (
    <div className="glass-card grid gap-4 rounded-2xl p-5 text-sm text-[var(--muted)]">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--muted)]">
          {title}
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {schema.map((control) => {
          const value = values[control.id];
          if (control.type === "range" && typeof value === "number") {
            return (
              <label key={control.id} className="flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
                  {control.label}
                </span>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={control.min}
                    max={control.max}
                    step={control.step ?? 1}
                    value={value}
                    onChange={(event) =>
                      onChange(control.id, Number(event.target.value))
                    }
                    className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[color:var(--border)]"
                  />
                  <span className="w-12 text-right text-base text-[var(--fg)]">
                    {formatValue(control, value)}
                  </span>
                </div>
              </label>
            );
          }

          if (control.type === "toggle" && typeof value === "boolean") {
            return (
              <button
                key={control.id}
                type="button"
                onClick={() => onChange(control.id, !value)}
                aria-pressed={value}
                data-active={value}
                className="toggle-button flex items-center justify-between px-4 py-3 text-left font-medium"
              >
                <span>{control.label}</span>
                <span className="text-xs uppercase tracking-[0.2em]">
                  {value ? "On" : "Off"}
                </span>
              </button>
            );
          }

          if (control.type === "select" && typeof value === "string") {
            return (
              <label key={control.id} className="flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
                  {control.label}
                </span>
                <select
                  value={value}
                  onChange={(event) => onChange(control.id, event.target.value)}
                  className="rounded-xl border border-[var(--border)] bg-[color:rgba(255,255,255,0.04)] px-3 py-2 text-sm text-[var(--fg)]"
                >
                  {control.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            );
          }

          return null;
        })}
      </div>
      {children ? (
        <div className="grid gap-4 md:grid-cols-2">{children}</div>
      ) : null}
    </div>
  );
}
