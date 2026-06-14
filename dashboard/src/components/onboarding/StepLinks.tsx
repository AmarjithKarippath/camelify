import { useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { detectPlatform, isSocialPlatform, suggestedTitle } from "@/lib/platform";
import { StepShell } from "./StepShell";

export type DraftLink = {
  id: string; // local-only id for keys/ordering
  title: string;
  url: string;
  emoji?: string;
  platform: string;
};

type Props = {
  links: DraftLink[];
  onChange: (next: DraftLink[]) => void;
  onBack: () => void;
  onSkip: () => void;
  onFinish: () => void;
  submitting: boolean;
  error: string | null;
  step: number;
  total: number;
};

export function StepLinks({
  links,
  onChange,
  onBack,
  onSkip,
  onFinish,
  submitting,
  error,
  step,
  total,
}: Props) {
  const [adding, setAdding] = useState(links.length === 0);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");

  function addLink() {
    const trimmedUrl = url.trim();
    if (!trimmedUrl) return;
    const platform = detectPlatform(trimmedUrl);
    const finalTitle = title.trim() || suggestedTitle(platform);
    const next: DraftLink = {
      id: crypto.randomUUID(),
      title: finalTitle,
      url: trimmedUrl,
      platform,
    };
    onChange([...links, next]);
    setUrl("");
    setTitle("");
    setAdding(false);
  }

  function move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= links.length) return;
    const copy = [...links];
    const [item] = copy.splice(index, 1);
    copy.splice(target, 0, item);
    onChange(copy);
  }

  function remove(id: string) {
    onChange(links.filter((l) => l.id !== id));
  }

  return (
    <StepShell
      step={step}
      total={total}
      title="Add your links"
      subtitle="The order here is the order they appear on your bio page."
      onBack={onBack}
      onSkip={links.length === 0 ? onSkip : undefined}
      onNext={onFinish}
      nextLabel="Finish & launch"
      submitting={submitting}
    >
      {links.length > 0 && (
        <ol className="space-y-2">
          {links.map((link, idx) => (
            <li
              key={link.id}
              className="flex items-center gap-2 rounded-card bg-surface p-3 ring-1 ring-black/5"
            >
              <div className="flex flex-col">
                <button
                  type="button"
                  aria-label="Move up"
                  onClick={() => move(idx, -1)}
                  disabled={idx === 0}
                  className="grid h-6 w-6 place-items-center rounded text-ink-muted hover:text-ink-heading disabled:opacity-30"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="Move down"
                  onClick={() => move(idx, 1)}
                  disabled={idx === links.length - 1}
                  className="grid h-6 w-6 place-items-center rounded text-ink-muted hover:text-ink-heading disabled:opacity-30"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-ink-heading">
                  {link.title}
                </p>
                <p className="truncate text-xs text-ink-muted">{link.url}</p>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-ink-label">
                  {link.platform === "custom" ? "Link" : link.platform}
                  {isSocialPlatform(link.platform) && " · social"}
                </p>
              </div>
              <button
                type="button"
                aria-label="Remove link"
                onClick={() => remove(link.id)}
                className="grid h-9 w-9 place-items-center rounded-input text-danger hover:bg-danger/5"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ol>
      )}

      {adding ? (
        <div className="mt-3 rounded-card bg-card p-4">
          <label htmlFor="link-url" className="text-xs font-semibold text-ink-label">
            URL
          </label>
          <input
            id="link-url"
            type="url"
            inputMode="url"
            autoComplete="off"
            placeholder="https://youtube.com/@yourname"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="mt-1.5 h-12 w-full rounded-input border border-black/15 bg-surface px-3 text-base text-ink-heading placeholder:text-ink-muted focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary-soft/40"
          />

          <label
            htmlFor="link-title"
            className="mt-3 block text-xs font-semibold text-ink-label"
          >
            Title <span className="font-normal text-ink-muted">(optional)</span>
          </label>
          <input
            id="link-title"
            type="text"
            placeholder="Subscribe to my channel"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1.5 h-12 w-full rounded-input border border-black/15 bg-surface px-3 text-base text-ink-heading placeholder:text-ink-muted focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary-soft/40"
          />

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={addLink}
              disabled={!url.trim()}
              className="h-11 rounded-input bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
            >
              Add link
            </button>
            {links.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setAdding(false);
                  setUrl("");
                  setTitle("");
                }}
                className="h-11 rounded-input px-3 text-sm font-semibold text-ink-muted hover:text-ink-heading"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-input border-2 border-dashed border-ink-heading/20 bg-surface/60 text-sm font-semibold text-ink-heading hover:border-ink-heading/40"
        >
          <Plus className="h-4 w-4" /> Add another link
        </button>
      )}

      {error && (
        <p
          role="alert"
          className="mt-3 rounded-input border border-danger/30 bg-danger/5 px-3 py-2 text-sm font-medium text-danger"
        >
          {error}
        </p>
      )}
    </StepShell>
  );
}
