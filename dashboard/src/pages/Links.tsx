import { useState } from "react";
import { ExternalLink, Loader2, Plus, Star, Trash2 } from "lucide-react";
import { createLink, deleteLink, type Link, type LinkKind } from "@/api/client";
import { useLinks } from "@/hooks/useLinks";
import { detectPlatform, isSocialPlatform, suggestedTitle } from "@/lib/platform";

export function Links() {
  const { links, loading, error: loadError, refresh } = useLinks();
  const [adding, setAdding] = useState(false);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [makeFeatured, setMakeFeatured] = useState(false);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const featured = links.filter((l) => l.kind === "featured");
  const regular = links.filter((l) => l.kind === "link");
  const socials = links.filter((l) => l.kind === "social");

  async function handleAdd() {
    const trimmedUrl = url.trim();
    if (!trimmedUrl) return;
    setBusy(true);
    setActionError(null);
    try {
      const platform = detectPlatform(trimmedUrl);
      const finalTitle = title.trim() || suggestedTitle(platform);
      let kind: LinkKind;
      if (makeFeatured) kind = "featured";
      else if (isSocialPlatform(platform)) kind = "social";
      else kind = "link";

      await createLink({
        title: finalTitle,
        url: trimmedUrl,
        platform,
        kind,
      });
      setUrl("");
      setTitle("");
      setMakeFeatured(false);
      setAdding(false);
      refresh();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not add link.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: string) {
    setBusy(true);
    setActionError(null);
    try {
      await deleteLink(id);
      refresh();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not delete link.");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="grid min-h-[40dvh] place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-24">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink-heading">
          Links
        </h1>
        <p className="mt-1 text-sm text-ink-body">
          What visitors see on your bio page.
        </p>
      </div>

      {loadError && (
        <p className="rounded-input border border-danger/30 bg-danger/5 px-3 py-2 text-sm text-danger">
          {loadError}
        </p>
      )}

      {links.length === 0 && !adding && (
        <div className="rounded-card border-2 border-dashed border-ink-heading/15 bg-surface/60 p-8 text-center">
          <p className="text-base font-bold text-ink-heading">No links yet</p>
          <p className="mt-1 text-sm text-ink-muted">
            Add your first link to make your bio page useful.
          </p>
        </div>
      )}

      {/* Featured */}
      {featured.length > 0 && (
        <Section title="Featured" icon={Star}>
          {featured.map((link) => (
            <Row
              key={link.id}
              link={link}
              busy={busy}
              onDelete={() => handleDelete(link.id)}
            />
          ))}
        </Section>
      )}

      {/* Links */}
      {regular.length > 0 && (
        <Section title="Links">
          {regular.map((link) => (
            <Row
              key={link.id}
              link={link}
              busy={busy}
              onDelete={() => handleDelete(link.id)}
            />
          ))}
        </Section>
      )}

      {/* Socials */}
      {socials.length > 0 && (
        <Section title="Social icons">
          {socials.map((link) => (
            <Row
              key={link.id}
              link={link}
              busy={busy}
              onDelete={() => handleDelete(link.id)}
            />
          ))}
        </Section>
      )}

      {/* Add form */}
      {adding ? (
        <div className="rounded-card bg-card p-4">
          <label htmlFor="link-url" className="text-xs font-semibold text-ink-label">
            URL
          </label>
          <input
            id="link-url"
            type="url"
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

          <label className="mt-3 flex items-center gap-2 text-sm text-ink-body">
            <input
              type="checkbox"
              checked={makeFeatured}
              onChange={(e) => setMakeFeatured(e.target.checked)}
              className="h-5 w-5 rounded border-black/20 text-primary focus:ring-primary-soft"
            />
            Make this the featured link
          </label>

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={handleAdd}
              disabled={busy || !url.trim()}
              className="inline-flex h-11 items-center gap-1.5 rounded-input bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              Save link
            </button>
            <button
              type="button"
              onClick={() => {
                setAdding(false);
                setUrl("");
                setTitle("");
                setMakeFeatured(false);
              }}
              className="h-11 rounded-input px-3 text-sm font-semibold text-ink-muted hover:text-ink-heading"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}

      {actionError && (
        <p className="rounded-input border border-danger/30 bg-danger/5 px-3 py-2 text-sm text-danger">
          {actionError}
        </p>
      )}

      {/* Sticky add CTA on mobile */}
      {!adding && (
        <div
          className="fixed inset-x-0 bottom-[64px] z-30 border-t border-black/10 bg-surface/95 p-3 backdrop-blur md:static md:left-60 md:border-0 md:bg-transparent md:p-0"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.75rem)" }}
        >
          <div className="mx-auto w-full max-w-3xl md:px-0">
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-input bg-primary text-base font-semibold text-white shadow-sm hover:bg-primary-hover active:scale-[0.99]"
            >
              <Plus className="h-5 w-5" /> Add a link
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon?: typeof Star;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-2 flex items-center gap-1.5">
        {Icon && <Icon className="h-3.5 w-3.5 text-ink-label" aria-hidden="true" />}
        <h2 className="text-xs font-bold uppercase tracking-wider text-ink-label">
          {title}
        </h2>
      </div>
      <ul className="space-y-2">{children}</ul>
    </section>
  );
}

function Row({
  link,
  busy,
  onDelete,
}: {
  link: Link;
  busy: boolean;
  onDelete: () => void;
}) {
  return (
    <li className="flex items-center gap-2 rounded-card bg-surface p-3 ring-1 ring-black/5">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-ink-heading">{link.title}</p>
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-0.5 inline-flex items-center gap-1 truncate text-xs text-ink-muted hover:text-primary"
        >
          {link.url.replace(/^https?:\/\//, "")}
          <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
        </a>
        <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-ink-label">
          {link.platform === "custom" ? "Link" : link.platform}
        </p>
      </div>
      <button
        type="button"
        onClick={onDelete}
        disabled={busy}
        aria-label="Delete link"
        className="grid h-9 w-9 place-items-center rounded-input text-danger hover:bg-danger/5 disabled:opacity-50"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </li>
  );
}
