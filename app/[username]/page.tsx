import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchPublicProfile } from "@/lib/api";
import { StorefrontProfile } from "@/components/storefront/StorefrontProfile";

type Props = { params: Promise<{ username: string }> };

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.camelify.com";

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

  return <StorefrontProfile profile={profile} initials={initials} />;
}
