export function Progress({ step, total }: { step: number; total: number }) {
  const pct = Math.min(100, Math.round((step / total) * 100));
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 rounded-full bg-card overflow-hidden">
        <div
          className="h-full bg-primary transition-[width] duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-ink-muted">
        {step} / {total}
      </span>
    </div>
  );
}
