import {
  Facebook,
  Instagram,
  Linkedin,
  Music2,
  Twitch,
  Twitter,
  Video,
  Youtube,
  Link as LinkIcon,
  MessageCircle,
  Mail,
  type LucideIcon,
} from "lucide-react";

type PlatformStyle = { icon: LucideIcon; bg: string };

const STYLES: Record<string, PlatformStyle> = {
  facebook: { icon: Facebook, bg: "bg-[#1877F2]" },
  twitter: { icon: Twitter, bg: "bg-[#1DA1F2]" },
  x: { icon: Twitter, bg: "bg-black" },
  instagram: {
    icon: Instagram,
    bg: "bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF]",
  },
  linkedin: { icon: Linkedin, bg: "bg-[#0A66C2]" },
  youtube: { icon: Youtube, bg: "bg-[#FF0000]" },
  tiktok: { icon: Video, bg: "bg-black" },
  spotify: { icon: Music2, bg: "bg-[#1DB954]" },
  apple_music: { icon: Music2, bg: "bg-gradient-to-br from-[#FA233B] to-[#FB5C74]" },
  soundcloud: { icon: Music2, bg: "bg-[#FF5500]" },
  twitch: { icon: Twitch, bg: "bg-[#9146FF]" },
  whatsapp: { icon: MessageCircle, bg: "bg-[#25D366]" },
  telegram: { icon: MessageCircle, bg: "bg-[#26A5E4]" },
  discord: { icon: MessageCircle, bg: "bg-[#5865F2]" },
  threads: { icon: Twitter, bg: "bg-black" },
  reddit: { icon: MessageCircle, bg: "bg-[#FF4500]" },
  substack: { icon: Mail, bg: "bg-[#FF6719]" },
  mailchimp: { icon: Mail, bg: "bg-[#FFE01B]" },
  custom: { icon: LinkIcon, bg: "bg-ink-heading" },
};

export function SocialBadge({
  platform,
  href,
  title,
  delayMs = 0,
}: {
  platform: string;
  href: string;
  title?: string;
  delayMs?: number;
}) {
  const style = STYLES[platform] ?? STYLES.custom;
  const Icon = style.icon;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={title ?? platform}
      style={{ animationDelay: `${delayMs}ms` }}
      className={`grid h-10 w-10 place-items-center rounded-full text-white shadow-sm transition-all duration-300 ease-out-expo active:scale-95 motion-safe:animate-storefront-scale-in motion-safe:hover:-translate-y-1 motion-safe:hover:scale-110 motion-safe:hover:shadow-lg ${style.bg}`}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </a>
  );
}
