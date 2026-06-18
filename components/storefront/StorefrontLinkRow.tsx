import { ArrowUpRight } from "lucide-react";

type Props = {
  href: string;
  title: string;
  emoji?: string | null;
  featured?: boolean;
};

export function StorefrontLinkRow({ href, title, emoji, featured = false }: Props) {
  const base =
    "group flex w-full min-h-[56px] items-center gap-3 rounded-full px-5 py-3.5 text-left text-sm font-bold transition-all duration-300 ease-out-expo active:scale-[0.98] motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-lg";
  const variant = featured
    ? "bg-ink-heading text-white shadow-md hover:bg-ink-heading/90 hover:shadow-xl"
    : "border border-black/10 bg-surface text-ink-heading hover:border-primary/30 hover:bg-card/50 hover:shadow-md";

  const arrowWrap = featured
    ? "grid h-9 w-9 place-items-center rounded-full bg-surface transition-transform duration-300 ease-out-expo group-hover:scale-110 motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
    : "grid h-9 w-9 place-items-center rounded-full bg-page transition-transform duration-300 ease-out-expo group-hover:scale-110 motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5";
  const arrowColor = "text-ink-heading transition-transform duration-300 ease-out-expo";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} ${variant}`}
    >
      {emoji && (
        <span
          aria-hidden="true"
          className="transition-transform duration-300 ease-out-back group-hover:scale-110"
        >
          {emoji}
        </span>
      )}
      <span className="flex-1 truncate">{title}</span>
      <span aria-hidden="true" className={arrowWrap}>
        <ArrowUpRight className={`h-4 w-4 ${arrowColor}`} />
      </span>
    </a>
  );
}
