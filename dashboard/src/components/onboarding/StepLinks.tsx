import { useState } from "react";
import { ArrowDown, ArrowUp, Download, Loader2, Plus, Trash2 } from "lucide-react";
import { importFromLinktree } from "@/api/client";
import { detectPlatform, isSocialPlatform, suggestedTitle } from "@/lib/platform";
import { StepShell } from "./StepShell";

export type DraftLink = {
  id: string; // local-only id for keys/ordering
  title: string;
  url: string;
  emoji?: string;
  platform: string;
};

type ImportProfilePatch = {
  bio?: string | null;
  avatar_url?: string | null;
  display_name?: string | null;
};

type Props = {
  links: DraftLink[];
  onChange: (next: DraftLink[]) => void;
  onImportProfile?: (patch: ImportProfilePatch) => void;
  onBack: () => void;
  onSkip: () => void;
  onFinish: () => void;
  submitting: boolean;
  error: string | null;
  step: number;
  total: number;
};

function toDraftLink(item: { title: string; url: string }): DraftLink {
  const platform = detectPlatform(item.url);
  return {
    id: crypto.randomUUID(),
    title: item.title.trim() || suggestedTitle(platform),
    url: item.url,
    platform,
  };
}

export function StepLinks({
  links,
  onChange,
  onImportProfile,
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
  const [linktreeUrl, setLinktreeUrl] = useState("");
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importNotice, setImportNotice] = useState<string | null>(null);

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

  async function handleLinktreeImport() {
    const trimmed = linktreeUrl.trim();
    if (!trimmed) return;
    setImportError(null);
    setImportNotice(null);
    setImporting(true);
    try {
      const result = await importFromLinktree(trimmed);
      const imported = [
        ...result.links.map(toDraftLink),
        ...result.socials.map(toDraftLink),
      ];
      onChange(imported);
      onImportProfile?.({
        bio: result.bio,
        avatar_url: result.avatar_url,
        display_name: result.display_name,
      });
      setImportNotice(
        `Imported ${result.total_imported} links from @${result.username}` +
          (result.skipped_groups > 0
            ? ` (${result.skipped_groups} Linktree folders skipped)`
            : ""),
      );
      setAdding(false);
    } catch (err) {
      setImportError(err instanceof Error ? err.message : "Import failed.");
    } finally {
      setImporting(false);
    }
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

  const subtitle =
    links.length > 0
      ? `${links.length} link${links.length === 1 ? "" : "s"} ready — same order as your bio page.`
      : "Import from Linktree or add links manually.";

  return (
    <StepShell
      step={step}
      total={total}
      title="Add your links"
      subtitle={subtitle}
      onBack={onBack}
      onSkip={links.length === 0 ? onSkip : undefined}
      onNext={onFinish}
      nextLabel="Finish & launch"
      submitting={submitting}
    >
      <div className="rounded-card border border-primary/25 bg-primary-soft/25 p-4">
        <p className="text-sm font-bold text-ink-heading">Import from Linktree</p>
        <p className="mt-1 text-xs text-ink-muted">
          Paste your Linktree URL — we&apos;ll pull every link, title, bio, and photo.
        </p>
        <label htmlFor="linktree-url" className="sr-only">
          Linktree profile URL
        </label>
        <input
          id="linktree-url"
          type="url"
          inputMode="url"
          autoComplete="off"
          placeholder="linktr.ee/yourname"
          value={linktreeUrl}
          onChange={(e) => setLinktreeUrl(e.target.value)}
          className="mt-3 h-12 w-full rounded-input border border-black/15 bg-surface px-3 text-base text-ink-heading placeholder:text-ink-muted focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary-soft/40"
        />
        <button
          type="button"
          onClick={handleLinktreeImport}
          disabled={importing || !linktreeUrl.trim()}
          className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-input bg-ink-heading px-4 text-sm font-semibold text-white hover:bg-ink-heading/90 disabled:opacity-60"
        >
          {importing ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Download className="h-4 w-4" aria-hidden="true" />
          )}
          {importing ? "Importing…" : "Import all links"}
        </button>
        {importNotice && (
          <p className="mt-2 text-xs font-medium text-primary">{importNotice}</p>
        )}
        {importError && (
          <p role="alert" className="mt-2 text-xs font-medium text-danger">
            {importError}
          </p>
        )}
      </div>

      {links.length > 0 && (
        <ol className="mt-4 max-h-[min(420px,50vh)] space-y-2 overflow-y-auto pr-1">
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
