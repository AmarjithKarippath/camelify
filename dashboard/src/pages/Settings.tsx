import { useState } from "react";
import { LogOut, Loader2, ExternalLink } from "lucide-react";
import { logout, LANDING_URL, type Me } from "@/api/client";
import { Avatar } from "@/components/Avatar";
import { useProfileContext } from "@/contexts/ProfileContext";
import { getCategory } from "@/lib/categories";

export function Settings({ user }: { user: Me }) {
  const { profile } = useProfileContext();
  const [signingOut, setSigningOut] = useState(false);
  const category = getCategory(profile.category);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await logout();
    } finally {
      window.location.href = `${LANDING_URL}/`;
    }
  }

  const memberSince = new Date(user.created_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
  });

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink-heading">Settings</h1>

      {/* Account */}
      <section className="rounded-card bg-card p-5 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-ink-label">
          Signed in as
        </p>
        <div className="mt-3 flex items-center gap-4">
          <Avatar user={user} size={56} />
          <div className="min-w-0">
            <p className="truncate text-base font-bold text-ink-heading">
              {user.name ?? profile.display_name ?? "Your name"}
            </p>
            <p className="truncate text-sm text-ink-muted">{user.email}</p>
            <p className="mt-1 text-xs text-ink-muted">Member since {memberSince}</p>
          </div>
        </div>
      </section>

      {/* Profile summary */}
      <section className="rounded-card bg-surface p-5 ring-1 ring-black/5 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-ink-label">
          Your storefront
        </p>
        <a
          href={`${LANDING_URL}/${profile.username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-ink-heading hover:text-primary"
        >
          {LANDING_URL.replace(/^https?:\/\//, "")}/{profile.username}
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
        {category && (
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary-soft/50 px-2.5 py-1 text-xs font-semibold text-ink-label">
            <span aria-hidden="true">{category.emoji}</span>
            {category.label}
          </p>
        )}
        {profile.dob && (
          <p className="mt-3 text-xs text-ink-muted">
            DOB: {profile.dob} <span className="ml-1">(never shown publicly)</span>
          </p>
        )}
      </section>

      {/* Coming soon */}
      <section className="rounded-card bg-surface p-5 ring-1 ring-black/5">
        <p className="text-xs font-bold uppercase tracking-wider text-ink-label">
          Coming soon
        </p>
        <ul className="mt-3 space-y-2 text-sm text-ink-body">
          <li>• Change password</li>
          <li>• Custom domain</li>
          <li>• Notifications</li>
          <li>• Delete account</li>
        </ul>
      </section>

      {/* Sign out */}
      <section className="pt-2">
        <button
          type="button"
          onClick={handleSignOut}
          disabled={signingOut}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-input border-2 border-danger/30 bg-surface text-base font-semibold text-danger hover:bg-danger/5 active:scale-[0.99] disabled:opacity-70 sm:w-auto sm:px-6"
        >
          {signingOut ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <LogOut className="h-5 w-5" aria-hidden="true" />
          )}
          {signingOut ? "Signing out…" : "Sign out"}
        </button>
      </section>
    </div>
  );
}
