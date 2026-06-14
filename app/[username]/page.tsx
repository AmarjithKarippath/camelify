import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { clickUrl, fetchPublicProfile } from "@/lib/api";
import { SocialBadge } from "@/components/storefront/SocialBadge";
import { StorefrontLinkRow } from "@/components/storefront/StorefrontLinkRow";

type Props = { params: Promise<{ username: string }> };

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://camelify.com";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const profile = await fetchPublicProfile(username).catch(() => null);
  if (!profile) {
    return { title: `@${username}`, robots: { index: false, follow: false } };
  }

  const title = profile.display_name
    ? `${profile.display_name} (@${profile.username})`
    : `@${profile.username}`;
  const description =
    profile.bio || `Everything from @${profile.username} in one place — on Camelify.`;
  const ogImage = profile.avatar_url
    ? profile.avatar_url
    : `${siteUrl}/og-image.png`;

  return {
    title,
    description,
    alternates: { canonical: `/${profile.username}` },
    openGraph: {
      type: "profile",
      title,
      description,
      url: `${siteUrl}/${profile.username}`,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function StorefrontPage({ params }: Props) {
  const { username } = await params;
  const profile = await fetchPublicProfile(username);
  if (!profile) notFound();

  const initials = (profile.display_name || profile.username)
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .split(" ")
    .map((word) => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <main className="min-h-[100dvh] bg-page px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-md">
        <article className="overflow-hidden rounded-[28px] bg-surface shadow-[0_30px_80px_-30px_rgba(14,27,44,0.18)] ring-1 ring-black/5">
          {/* Banner */}
          <div
            className="relative h-28 sm:h-32"
            style={{
              background: profile.banner_url
                ? `center / cover no-repeat url('${profile.banner_url}')`
                : "linear-gradient(135deg, #C8E6C9 0%, #E8F4EA 35%, #DBE7F2 75%, #B7CDE8 100%)",
            }}
            aria-hidden="true"
          />

          <div className="-mt-12 flex flex-col items-center px-5 pb-7 sm:px-7">
            {/* Avatar */}
            <div className="relative">
              {profile.avatar_url ? (
                // Plain <img> on purpose — avoids Next image optimization
                // doing a server-side fetch (which fails on localhost from
                // inside the docker network).
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar_url}
                  alt={`Profile photo of ${profile.display_name ?? profile.username}`}
                  width={96}
                  height={96}
                  loading="eager"
                  decoding="async"
                  className="h-24 w-24 rounded-full object-cover shadow-md ring-4 ring-surface"
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-primary to-info text-2xl font-extrabold text-white shadow-md ring-4 ring-surface"
                >
                  {initials || "U"}
                </div>
              )}
            </div>

            {/* Name */}
            <h1 className="mt-4 text-center text-2xl font-extrabold tracking-tight text-ink-heading">
              {profile.display_name ?? `@${profile.username}`}
            </h1>

            {/* Bio */}
            {profile.bio && (
              <p className="mt-2 max-w-[320px] text-balance text-center text-sm text-ink-muted">
                {profile.bio}
              </p>
            )}

            {/* Social icons */}
            {profile.socials.length > 0 && (
              <div
                className="mt-5 flex flex-wrap items-center justify-center gap-2.5"
                aria-label="Social links"
              >
                {profile.socials.map((s) => (
                  <SocialBadge
                    key={s.id}
                    platform={s.platform}
                    href={clickUrl(s.id)}
                    title={s.title}
                  />
                ))}
              </div>
            )}

            {/* Featured link */}
            {profile.featured && (
              <div className="mt-6 w-full">
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
                {profile.links.map((link) => (
                  <StorefrontLinkRow
                    key={link.id}
                    href={clickUrl(link.id)}
                    title={link.title}
                    emoji={link.emoji}
                  />
                ))}
              </div>
            )}

            {/* Empty state */}
            {!profile.featured &&
              profile.links.length === 0 &&
              profile.socials.length === 0 && (
                <p className="mt-6 text-center text-sm text-ink-muted">
                  This creator hasn&apos;t added any links yet.
                </p>
              )}
          </div>
        </article>

        {/* Footer attribution — small but present */}
        <p className="mt-6 text-center text-xs text-ink-muted">
          Powered by{" "}
          <a href="/" className="font-semibold text-ink-heading hover:text-primary">
            Camelify
          </a>
        </p>
      </div>
    </main>
  );
}
