export function Divider({ label }: { label: string }) {
  return (
    <div className="my-5 flex items-center gap-3" aria-hidden="true">
      <span className="h-px flex-1 bg-black/10" />
      <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
        {label}
      </span>
      <span className="h-px flex-1 bg-black/10" />
    </div>
  );
}
