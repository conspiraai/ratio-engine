type MetricCardProps = {
  label: string;
  value: string;
  note: string;
};

export default function MetricCard({ label, value, note }: MetricCardProps) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
        {label}
      </p>
      <p className="mt-4 text-3xl font-semibold text-[var(--fg)]">{value}</p>
      <p className="mt-2 text-sm text-[var(--muted)]">{note}</p>
    </div>
  );
}
