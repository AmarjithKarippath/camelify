/**
 * Server-side API helper. Used inside Next.js server components.
 * Reads the API base URL from the runtime env so it works in Docker.
 */

const API_BASE =
  process.env.NEXT_INTERNAL_API_URL ?? // when running inside docker compose, hit http://api:8000
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8000";

export type PublicLink = {
  id: string;
  kind: "featured" | "link" | "social";
  platform: string;
  title: string;
  url: string;
  emoji: string | null;
  position: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
};

export type PublicProfile = {
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  banner_url: string | null;
  theme_id: string;
  featured: PublicLink | null;
  links: PublicLink[];
  socials: PublicLink[];
};

export async function fetchPublicProfile(username: string): Promise<PublicProfile | null> {
  const res = await fetch(`${API_BASE}/v1/public/${encodeURIComponent(username)}`, {
    next: { revalidate: 30 }, // ISR — re-fetch at most every 30s per username
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

export function clickUrl(linkId: string): string {
  const browserBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  return `${browserBase}/v1/public/click/${encodeURIComponent(linkId)}`;
}
