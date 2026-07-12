import { LogoMark } from "./LogoMark";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoMark size={44} />
      <span className="text-xl font-bold text-ink-heading">Camelify</span>
    </div>
  );
}
