import type { ReactNode } from "react";

type FeatureCardProps = {
  title: string;
  description: string;
  icon: ReactNode;
};

export default function FeatureCard({
  title,
  description,
  icon,
}: FeatureCardProps) {
  return (
    <div className="glass-card flex flex-col gap-4 rounded-2xl p-6">
      <div className="icon-frame flex h-12 w-12 items-center justify-center rounded-2xl text-2xl text-[var(--fg)]">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-[var(--fg)]">{title}</h3>
        <p className="mt-2 text-sm text-[var(--muted)]">{description}</p>
      </div>
    </div>
  );
}
