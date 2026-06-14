import { Sparkles } from "lucide-react";

export function Placeholder({ title, body }: { title: string; body: string }) {
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink-heading">{title}</h1>
      <div className="rounded-card border-2 border-dashed border-ink-heading/15 bg-surface/60 p-8 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary-soft">
          <Sparkles className="h-5 w-5 text-ink-label" aria-hidden="true" />
        </div>
        <p className="mt-3 text-base font-bold text-ink-heading">Coming next</p>
        <p className="mt-1 text-sm text-ink-muted">{body}</p>
      </div>
    </div>
  );
}
