import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Check,
  Copy,
  ExternalLink,
  Link2,
  Pencil,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import type { Me } from "@/api/client";
import { LANDING_URL } from "@/api/client";
import { Avatar } from "@/components/Avatar";
import { getCategory } from "@/lib/categories";
import { useProfileContext } from "@/contexts/ProfileContext";
import { useLinks } from "@/hooks/useLinks";

export function Home({ user }: { user: Me }) {
  const { profile } = useProfileContext();
  const { links } = useLinks();
  const [copied, setCopied] = useState(false);

  const firstName = profile.display_name?.split(" ")[0] ?? user.name?.split(" ")[0] ?? user.email.split("@")[0];
  const bioUrl = `${LANDING_URL}/${profile.username}`;
  const bioUrlShort = bioUrl.replace(/^https?:\/\//, "");
  const category = getCategory(profile.category);

  const featuredCount = links.filter((l) => l.kind === "featured").length;
  const linkCount = links.filter((l) => l.kind === "link").length;
  const socialCount = links.filter((l) => l.kind === "social").length;

  async function copyBioLink() {
    try {
      await navigator.clipboard.writeText(bioUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
          Welcome
        </p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-ink-heading">
          Hi, {firstName} 👋
        </h1>
        <p className="mt-2 text-sm text-ink-body">
          Signed in as{" "}
          <span className="font-semibold text-ink-heading">{user.email}</span>
        </p>
      </div>

      {/* Your bio link */}
      <section
        aria-labelledby="biolink-heading"
        className="rounded-card bg-card p-5 sm:p-6"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
          <p
            id="biolink-heading"
            className="text-xs font-bold uppercase tracking-wider text-ink-label"
          >
            Your bio link
          </p>
        </div>
        <div className="mt-3 flex items-stretch gap-2">
          <div className="flex flex-1 items-center rounded-input border border-black/10 bg-surface px-3 text-sm font-semibold text-ink-heading">
            {bioUrlShort}
          </div>
          <button
            type="button"
            onClick={copyBioLink}
            className="inline-flex h-12 items-center gap-2 rounded-input bg-primary px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover active:scale-[0.99]"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <a
          href={bioUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-ink-label hover:text-primary"
        >
          View as visitor <ExternalLink className="h-3 w-3" aria-hidden="true" />
        </a>
      </section>

      {/* Profile preview */}
      <section
        aria-labelledby="preview-heading"
        className="rounded-card bg-surface p-5 ring-1 ring-black/5 sm:p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <p
            id="preview-heading"
            className="text-xs font-bold uppercase tracking-wider text-ink-label"
          >
            Profile
          </p>
          <RouterLink
            to="/profile"
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            <Pencil className="h-3 w-3" aria-hidden="true" /> Edit
          </RouterLink>
        </div>

        <div className="mt-4 flex items-start gap-4">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt=""
              width={64}
              height={64}
              className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-card"
            />
          ) : (
            <Avatar user={user} size={64} />
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-bold text-ink-heading">
              {profile.display_name ?? `@${profile.username}`}
            </p>
            <p className="truncate text-xs text-ink-muted">@{profile.username}</p>
            {category && (
              <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primary-soft/50 px-2.5 py-1 text-xs font-semibold text-ink-label">
                <span aria-hidden="true">{category.emoji}</span>
                {category.label}
              </p>
            )}
          </div>
        </div>

        {profile.bio && (
          <p className="mt-4 text-sm text-ink-body">{profile.bio}</p>
        )}
      </section>

      {/* Link counts */}
      <section aria-labelledby="links-heading" className="space-y-2">
        <div className="flex items-center justify-between">
          <p
            id="links-heading"
            className="text-xs font-bold uppercase tracking-wider text-ink-label"
          >
            Your links
          </p>
          <RouterLink
            to="/links"
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            <Pencil className="h-3 w-3" aria-hidden="true" /> Manage
          </RouterLink>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <StatCard icon={Star} label="Featured" value={featuredCount} />
          <StatCard icon={Link2} label="Links" value={linkCount} />
          <StatCard icon={Users} label="Socials" value={socialCount} />
        </div>
      </section>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Star;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-card bg-card p-4">
      <div className="flex items-center gap-1.5 text-ink-label">
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="text-[11px] font-semibold uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className="mt-2 text-2xl font-extrabold text-ink-heading">{value}</p>
    </div>
  );
}
