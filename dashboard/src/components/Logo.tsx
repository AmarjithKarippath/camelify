export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        aria-hidden="true"
        className="grid h-10 w-10 place-items-center rounded-xl border-2 border-ink-heading bg-primary-soft"
      >
        <span className="text-base font-extrabold leading-none">
          <span className="text-ink-heading">c</span>
          <span className="text-primary">m</span>
        </span>
      </div>
      <span className="text-lg font-bold text-ink-heading">Camelify</span>
    </div>
  );
}
