import { clickUrl, type PublicProfile } from "@/lib/api";
import { SocialBadge } from "@/components/storefront/SocialBadge";
import { StorefrontAvatar } from "@/components/storefront/StorefrontAvatar";
import { StorefrontLinkRow } from "@/components/storefront/StorefrontLinkRow";

const STAGGER_MS = 55;
const LINKS_BASE_MS = 320;

type Props = {
  profile: PublicProfile;
  initials: string;
};

export function StorefrontProfile({ profile, initials }: Props) {
  const linkStartIndex =
    (profile.featured ? 1 : 0) + profile.socials.length;

  return (
    <main className="min-h-[100dvh] bg-page px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-md motion-reduce:animate-none">
        <article className="overflow-hidden rounded-[28px] bg-surface shadow-[0_30px_80px_-30px_rgba(14,27,44,0.18)] ring-1 ring-black/5 motion-safe:animate-storefront-rise">
          {/* Banner */}
          <div className="relative h-32 overflow-hidden sm:h-36" aria-hidden="true">
            <div
              className={`absolute inset-0 motion-safe:animate-storefront-banner-drift ${
                profile.banner_url ? "bg-cover bg-center" : ""
              }`}
              style={{
                background: profile.banner_url
                  ? `center / cover no-repeat url('${profile.banner_url}')`
                  : "linear-gradient(135deg, #C8E6C9 0%, #E8F4EA 35%, #DBE7F2 75%, #B7CDE8 100%)",
              }}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-surface/80" />
          </div>

          <div className="flex flex-col items-center px-5 pb-7 sm:px-7">
            <StorefrontAvatar
              avatarUrl={profile.avatar_url}
              displayName={profile.display_name ?? profile.username}
              username={profile.username}
              initials={initials}
            />

            {/* Name */}
            <h1
              className="mt-4 text-center text-2xl font-extrabold tracking-tight text-ink-heading motion-safe:animate-storefront-fade-up"
              style={{ animationDelay: "180ms" }}
            >
              {profile.display_name ?? `@${profile.username}`}
            </h1>

            {/* Bio */}
            {profile.bio && (
              <p
                className="mt-2 max-w-[320px] text-balance text-center text-sm text-ink-muted motion-safe:animate-storefront-fade-up"
                style={{ animationDelay: "230ms" }}
              >
                {profile.bio}
              </p>
            )}

            {/* Social icons */}
            {profile.socials.length > 0 && (
              <div
                className="mt-5 flex flex-wrap items-center justify-center gap-2.5"
                aria-label="Social links"
              >
                {profile.socials.map((s, i) => (
                  <SocialBadge
                    key={s.id}
                    platform={s.platform}
                    href={clickUrl(s.id)}
                    title={s.title}
                    delayMs={260 + i * STAGGER_MS}
                  />
                ))}
              </div>
            )}

            {/* Featured link */}
            {profile.featured && (
              <div
                className="mt-6 w-full motion-safe:animate-storefront-fade-up"
                style={{ animationDelay: `${LINKS_BASE_MS}ms` }}
              >
                <StorefrontLinkRow
                  href={clickUrl(profile.featured.id)}
                  title={profile.featured.title}
                  emoji={profile.featured.emoji}
                  featured
                />
              </div>
            )}

            {/* Standard links */}
            {profile.links.length > 0 && (
              <div className="mt-3 w-full space-y-3">
                {profile.links.map((link, i) => (
                  <div
                    key={link.id}
                    className="motion-safe:animate-storefront-fade-up"
                    style={{
                      animationDelay: `${LINKS_BASE_MS + (linkStartIndex + i) * STAGGER_MS}ms`,
                    }}
                  >
                    <StorefrontLinkRow
                      href={clickUrl(link.id)}
                      title={link.title}
                      emoji={link.emoji}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {!profile.featured &&
              profile.links.length === 0 &&
              profile.socials.length === 0 && (
                <p
                  className="mt-6 text-center text-sm text-ink-muted motion-safe:animate-storefront-fade-up"
                  style={{ animationDelay: "320ms" }}
                >
                  This creator hasn&apos;t added any links yet.
                </p>
              )}
          </div>
        </article>

        <p
          className="mt-6 text-center text-xs text-ink-muted motion-safe:animate-storefront-fade-up"
          style={{ animationDelay: "480ms" }}
        >
          Powered by{" "}
          <a
            href="/"
            className="font-semibold text-ink-heading transition-colors duration-300 hover:text-primary"
          >
            Camelify
          </a>
        </p>
      </div>
    </main>
  );
}
