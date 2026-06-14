/** Detect a platform key from a URL — used to auto-select an icon and kind. */

const RULES: Array<{ test: RegExp; platform: string }> = [
  { test: /(?:^|\.)youtube\.com$|^youtu\.be$/, platform: "youtube" },
  { test: /(?:^|\.)instagram\.com$/, platform: "instagram" },
  { test: /(?:^|\.)tiktok\.com$/, platform: "tiktok" },
  { test: /(?:^|\.)twitter\.com$|^x\.com$/, platform: "x" },
  { test: /(?:^|\.)facebook\.com$|^fb\.me$/, platform: "facebook" },
  { test: /(?:^|\.)linkedin\.com$/, platform: "linkedin" },
  { test: /(?:^|\.)threads\.net$/, platform: "threads" },
  { test: /(?:^|\.)snapchat\.com$/, platform: "snapchat" },
  { test: /(?:^|\.)pinterest\.com$/, platform: "pinterest" },
  { test: /(?:^|\.)reddit\.com$/, platform: "reddit" },
  { test: /(?:^|\.)twitch\.tv$/, platform: "twitch" },
  { test: /(?:^|\.)spotify\.com$/, platform: "spotify" },
  { test: /(?:^|\.)music\.apple\.com$/, platform: "apple_music" },
  { test: /(?:^|\.)soundcloud\.com$/, platform: "soundcloud" },
  { test: /(?:^|\.)substack\.com$/, platform: "substack" },
  { test: /(?:^|\.)wa\.me$|(?:^|\.)whatsapp\.com$/, platform: "whatsapp" },
  { test: /(?:^|\.)t\.me$|(?:^|\.)telegram\.org$/, platform: "telegram" },
  { test: /(?:^|\.)discord\.gg$|(?:^|\.)discord\.com$/, platform: "discord" },
  { test: /(?:^|\.)calendly\.com$/, platform: "calendly" },
  { test: /(?:^|\.)shopify\.com$|\.myshopify\.com$/, platform: "shopify" },
];

const SOCIAL_PLATFORMS = new Set([
  "instagram", "youtube", "tiktok", "x", "facebook", "linkedin", "threads",
  "snapchat", "pinterest", "reddit", "twitch", "spotify", "apple_music",
  "soundcloud", "whatsapp", "telegram", "discord",
]);

export function detectPlatform(rawUrl: string): string {
  try {
    const url = new URL(rawUrl);
    const host = url.hostname.replace(/^www\./, "").toLowerCase();
    for (const rule of RULES) {
      if (rule.test.test(host)) return rule.platform;
    }
    return "custom";
  } catch {
    return "custom";
  }
}

export function isSocialPlatform(platform: string): boolean {
  return SOCIAL_PLATFORMS.has(platform);
}

export function suggestedTitle(platform: string): string {
  switch (platform) {
    case "youtube": return "Watch on YouTube";
    case "instagram": return "Follow on Instagram";
    case "tiktok": return "Follow on TikTok";
    case "x": return "Follow on X";
    case "facebook": return "Find me on Facebook";
    case "linkedin": return "Connect on LinkedIn";
    case "threads": return "Follow on Threads";
    case "spotify": return "Listen on Spotify";
    case "apple_music": return "Listen on Apple Music";
    case "soundcloud": return "Listen on SoundCloud";
    case "twitch": return "Watch on Twitch";
    case "whatsapp": return "Message on WhatsApp";
    case "calendly": return "Book a call";
    case "substack": return "Read my newsletter";
    case "shopify": return "Shop the collection";
    default: return "Visit link";
  }
}
