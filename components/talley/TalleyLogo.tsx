export function TalleyLogo({ className = "", size = "default" }: { className?: string; size?: "default" | "large" }) {
  const textSize = size === "large" ? "text-4xl md:text-5xl" : "text-3xl md:text-4xl";

  return (
    <span
      className={`font-display font-bold lowercase leading-none text-talley-purple ${textSize} ${className}`}
      aria-label="Talley"
    >
      talley
    </span>
  );
}
