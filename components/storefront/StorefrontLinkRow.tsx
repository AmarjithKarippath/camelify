import { ArrowUpRight } from "lucide-react";

type Props = {
  href: string;
  title: string;
  emoji?: string | null;
  featured?: boolean;
};

export function StorefrontLinkRow({ href, title, emoji, featured = false }: Props) {
  const base =
    "group flex w-full min-h-[56px] items-center gap-3 rounded-full px-5 py-3.5 text-left text-sm font-bold transition active:scale-[0.99]";
  const variant = featured
    ? "bg-ink-heading text-white shadow-md hover:bg-ink-heading/90"
    : "border border-black/10 bg-surface text-ink-heading hover:border-black/20 hover:bg-card/40";

  const arrowWrap = featured
    ? "grid h-9 w-9 place-items-center rounded-full bg-surface"
    : "grid h-9 w-9 place-items-center rounded-full bg-page";
  const arrowColor = "text-ink-heading";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} ${variant}`}
    >
      {emoji && <span aria-hidden="true">{emoji}</span>}
      <span className="flex-1 truncate">{title}</span>
      <span aria-hidden="true" className={arrowWrap}>
        <ArrowUpRight className={`h-4 w-4 ${arrowColor}`} />
      </span>
    </a>
  );
}
