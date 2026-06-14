import { useEffect, useState } from "react";
import { Check, Loader2, X } from "lucide-react";
import {
  checkUsername,
  LANDING_URL,
  upsertProfile,
  type Profile as ProfileT,
} from "@/api/client";
import { useProfileContext } from "@/contexts/ProfileContext";
import { CATEGORIES } from "@/lib/categories";
import { AvatarUpload } from "@/components/AvatarUpload";

type UsernameStatus =
  | { state: "idle" }
  | { state: "checking" }
  | { state: "ok" }
  | { state: "error"; reason: string };

export function Profile() {
  const { profile, refresh } = useProfileContext();

  const [username, setUsername] = useState(profile.username);
  const [displayName, setDisplayName] = useState(profile.display_name ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url ?? "");
  const [bannerUrl, setBannerUrl] = useState(profile.banner_url ?? "");
  const [category, setCategory] = useState(profile.category ?? "");
  const [dob, setDob] = useState(profile.dob ?? "");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedTick, setSavedTick] = useState(false);
  const [unameStatus, setUnameStatus] = useState<UsernameStatus>({ state: "idle" });

  // Username availability check — only when changed from current.
  useEffect(() => {
    const next = username.trim().toLowerCase();
    if (next === profile.username) {
      setUnameStatus({ state: "ok" });
      return;
    }
    if (next.length < 3) {
      setUnameStatus({ state: "idle" });
      return;
    }
    setUnameStatus({ state: "checking" });
    const handle = setTimeout(async () => {
      try {
        const r = await checkUsername(next);
        if (r.available) setUnameStatus({ state: "ok" });
        else setUnameStatus({ state: "error", reason: r.reason ?? "Not available." });
      } catch {
        setUnameStatus({ state: "error", reason: "Couldn't check availability." });
      }
    }, 350);
    return () => clearTimeout(handle);
  }, [username, profile.username]);

  const dirty = isDirty(profile, {
    username: username.trim().toLowerCase(),
    displayName,
    bio,
    avatarUrl,
    bannerUrl,
    category,
    dob,
  });
  const canSave = dirty && unameStatus.state === "ok" && !saving;

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      await upsertProfile({
        username: username.trim().toLowerCase(),
        display_name: displayName.trim() || null,
        bio: bio.trim() || null,
        avatar_url: avatarUrl.trim() || null,
        banner_url: bannerUrl.trim() || null,
        category: category || null,
        dob: dob || null,
      });
      setSavedTick(true);
      setTimeout(() => setSavedTick(false), 2000);
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save profile.");
    } finally {
      setSaving(false);
    }
  }

  const host = LANDING_URL.replace(/^https?:\/\//, "");

  return (
    <div className="space-y-5 pb-24">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink-heading">
          Profile
        </h1>
        <p className="mt-1 text-sm text-ink-body">
          This information appears on your public storefront at{" "}
          <span className="font-semibold text-ink-heading">
            {host}/{profile.username}
          </span>
          .
        </p>
      </div>

      {/* Username */}
      <Section title="Handle" subtitle="Your unique URL on Camelify.">
        <Field label="Username">
          <div className="flex items-stretch overflow-hidden rounded-input border border-black/15 bg-surface focus-within:border-primary focus-within:ring-4 focus-within:ring-primary-soft/40">
            <span className="grid place-items-center bg-page px-3 text-sm text-ink-muted">
              {host}/
            </span>
            <input
              type="text"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value.toLowerCase().replace(/\s+/g, ""))
              }
              className="h-12 flex-1 bg-surface px-3 text-base text-ink-heading focus:outline-none"
            />
            <span className="grid w-12 place-items-center" aria-hidden="true">
              <UsernameStatusIcon status={unameStatus} />
            </span>
          </div>
          <UsernameStatusMessage status={unameStatus} />
        </Field>
      </Section>

      {/* Identity */}
      <Section title="Identity" subtitle="How visitors see you.">
        <div className="flex flex-col items-center pb-2">
          <AvatarUpload
            currentUrl={avatarUrl || null}
            fallback={
              (displayName || profile.display_name || profile.username)
                .split(" ")
                .map((p) => p[0])
                .filter(Boolean)
                .slice(0, 2)
                .join("")
                .toUpperCase() || "U"
            }
            size={112}
            onUploaded={(url) => {
              // The backend already wrote avatar_url on upload. Reflect in
              // local form state and refresh the shared profile context.
              setAvatarUrl(url);
              refresh();
            }}
            onRemove={() => setAvatarUrl("")}
          />
        </div>

        <Field label="Display name">
          <Input
            value={displayName}
            onChange={setDisplayName}
            placeholder="Arjun Mehta"
          />
        </Field>
      </Section>

      {/* About */}
      <Section title="About" subtitle="A short description shown under your name.">
        <Field label="Bio">
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            maxLength={280}
            placeholder="What you do, in one or two sentences."
            className="w-full resize-y rounded-input border border-black/15 bg-surface px-3 py-3 text-base text-ink-heading placeholder:text-ink-muted focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary-soft/40"
          />
          <p className="text-right text-xs text-ink-muted">
            {280 - bio.length} characters left
          </p>
        </Field>
      </Section>

      {/* Category */}
      <Section title="Category" subtitle="Helps us recommend templates and partners.">
        <div
          role="radiogroup"
          aria-label="Category"
          className="grid grid-cols-2 gap-2 sm:grid-cols-3"
        >
          {CATEGORIES.map((c) => {
            const selected = category === c.id;
            return (
              <button
                key={c.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setCategory(selected ? "" : c.id)}
                className={`flex min-h-[60px] items-center gap-2.5 rounded-input border px-3 py-2 text-left text-sm font-semibold transition active:scale-[0.99] ${
                  selected
                    ? "border-primary bg-primary-soft/40 text-ink-heading"
                    : "border-black/10 bg-surface text-ink-body hover:border-black/20"
                }`}
              >
                <span aria-hidden="true" className="text-lg">
                  {c.emoji}
                </span>
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>
      </Section>

      {/* DOB */}
      <Section title="Date of birth" subtitle="Never shown publicly.">
        <Field label="Date of birth">
          <Input
            type="date"
            value={dob}
            onChange={setDob}
            max={new Date().toISOString().slice(0, 10)}
          />
        </Field>
      </Section>

      {error && (
        <p
          role="alert"
          className="rounded-input border border-danger/30 bg-danger/5 px-3 py-2 text-sm font-medium text-danger"
        >
          {error}
        </p>
      )}

      {/* Sticky save bar */}
      <div
        className="fixed inset-x-0 bottom-0 z-30 border-t border-black/10 bg-surface/95 backdrop-blur md:left-60"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 px-4 pt-3 sm:px-8">
          <p className="text-xs text-ink-muted">
            {dirty
              ? "Unsaved changes"
              : savedTick
                ? "✓ Saved"
                : "All changes saved"}
          </p>
          <button
            type="button"
            onClick={handleSave}
            disabled={!canSave}
            className="inline-flex h-12 min-w-[140px] items-center justify-center gap-2 rounded-input bg-primary px-6 text-base font-semibold text-white shadow-sm transition hover:bg-primary-hover active:scale-[0.99] disabled:opacity-60"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function isDirty(
  profile: ProfileT,
  next: {
    username: string;
    displayName: string;
    bio: string;
    avatarUrl: string;
    bannerUrl: string;
    category: string;
    dob: string;
  },
): boolean {
  return (
    next.username !== profile.username ||
    next.displayName !== (profile.display_name ?? "") ||
    next.bio !== (profile.bio ?? "") ||
    next.avatarUrl !== (profile.avatar_url ?? "") ||
    next.bannerUrl !== (profile.banner_url ?? "") ||
    next.category !== (profile.category ?? "") ||
    next.dob !== (profile.dob ?? "")
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-card bg-surface p-5 ring-1 ring-black/5 sm:p-6">
      <h2 className="text-sm font-bold text-ink-heading">{title}</h2>
      {subtitle && <p className="mt-1 text-xs text-ink-muted">{subtitle}</p>}
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-ink-label">{label}</label>
      {children}
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  max,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  max?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      max={max}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-12 w-full rounded-input border border-black/15 bg-surface px-3 text-base text-ink-heading placeholder:text-ink-muted focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary-soft/40"
    />
  );
}

function UsernameStatusIcon({ status }: { status: UsernameStatus }) {
  if (status.state === "checking")
    return <Loader2 className="h-4 w-4 animate-spin text-ink-muted" />;
  if (status.state === "ok") return <Check className="h-4 w-4 text-primary" />;
  if (status.state === "error") return <X className="h-4 w-4 text-danger" />;
  return null;
}

function UsernameStatusMessage({ status }: { status: UsernameStatus }) {
  if (status.state === "idle") return null;
  if (status.state === "ok")
    return <p className="text-xs text-primary">Available.</p>;
  if (status.state === "checking")
    return <p className="text-xs text-ink-muted">Checking…</p>;
  return <p className="text-xs text-danger">{status.reason}</p>;
}
