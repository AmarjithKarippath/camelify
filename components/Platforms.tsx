import {
  Instagram,
  Youtube,
  Twitter,
  Facebook,
  Linkedin,
  Music2,
  MessageCircle,
  Calendar,
  ShoppingBag,
  Mail,
  FileText,
  Video,
  Twitch,
  Rss,
  AtSign,
  Image as ImageIcon,
  Headphones,
  MapPin,
  ListChecks,
  Smartphone,
} from "lucide-react";

type Platform = {
  name: string;
  tagline: string;
  icon?: typeof Instagram;
  letter?: string;
  bg: string;
  fg?: string;
};

const platforms: Platform[] = [
  { name: "Instagram", tagline: "Posts & reels", icon: Instagram, bg: "bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF]" },
  { name: "YouTube", tagline: "Videos & channel", icon: Youtube, bg: "bg-[#FF0000]" },
  { name: "TikTok", tagline: "Latest TikToks", icon: Video, bg: "bg-black" },
  { name: "X (Twitter)", tagline: "Posts & feed", icon: Twitter, bg: "bg-black" },
  { name: "Facebook", tagline: "Page & posts", icon: Facebook, bg: "bg-[#1877F2]" },
  { name: "LinkedIn", tagline: "Profile & posts", icon: Linkedin, bg: "bg-[#0A66C2]" },
  { name: "Spotify", tagline: "Music & playlists", icon: Music2, bg: "bg-[#1DB954]" },
  { name: "Apple Music", tagline: "Songs & albums", icon: Music2, bg: "bg-gradient-to-br from-[#FA233B] to-[#FB5C74]" },
  { name: "SoundCloud", tagline: "Tracks & streams", icon: Headphones, bg: "bg-[#FF5500]" },
  { name: "Twitch", tagline: "Streams & clips", icon: Twitch, bg: "bg-[#9146FF]" },
  { name: "Pinterest", tagline: "Pins & boards", letter: "P", bg: "bg-[#E60023]" },
  { name: "Threads", tagline: "Latest threads", letter: "@", bg: "bg-black" },
  { name: "Snapchat", tagline: "Public profile", letter: "👻", bg: "bg-[#FFFC00]", fg: "text-black" },
  { name: "Reddit", tagline: "Profile & posts", letter: "R", bg: "bg-[#FF4500]" },
  { name: "WhatsApp", tagline: "Chat & community", icon: MessageCircle, bg: "bg-[#25D366]" },
  { name: "Calendly", tagline: "Bookings", icon: Calendar, bg: "bg-[#006BFF]" },
  { name: "Shopify", tagline: "Storefront", icon: ShoppingBag, bg: "bg-[#96BF48]" },
  { name: "Mailchimp", tagline: "Email capture", icon: Mail, bg: "bg-[#FFE01B]", fg: "text-black" },
  { name: "Klaviyo", tagline: "Email capture", icon: Mail, bg: "bg-[#D94F2C]" },
  { name: "Google Sheets", tagline: "Audience sync", icon: ListChecks, bg: "bg-[#0F9D58]" },
  { name: "Typeform", tagline: "Forms & surveys", icon: FileText, bg: "bg-black" },
  { name: "Substack", tagline: "Newsletter", icon: FileText, bg: "bg-[#FF6719]" },
  { name: "Stripe", tagline: "Payments & checkout", letter: "S", bg: "bg-[#635BFF]" },
  { name: "GoFundMe", tagline: "Causes & fundraising", letter: "G", bg: "bg-[#02A95C]" },
  { name: "RSS Feed", tagline: "Auto-pull posts", icon: Rss, bg: "bg-[#F26522]" },
  { name: "Maps", tagline: "Location pin", icon: MapPin, bg: "bg-[#7E57C2]" },
  { name: "Mobile App", tagline: "Promote downloads", icon: Smartphone, bg: "bg-[#6E59A5]" },
  { name: "Image Gallery", tagline: "Photo grid", icon: ImageIcon, bg: "bg-[#3B82F6]" },
  { name: "Vimeo", tagline: "Videos", icon: Video, bg: "bg-[#1AB7EA]" },
  { name: "Discord", tagline: "Community", icon: AtSign, bg: "bg-[#5865F2]" },
];

export function Platforms() {
  return (
    <section id="platforms" aria-labelledby="platforms-heading" className="px-6 py-16">
      <div className="mx-auto max-w-container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-primary">
            Platforms supported
          </p>
          <h2
            id="platforms-heading"
            className="mt-3 text-2xl font-extrabold tracking-tight text-ink-heading sm:text-3xl"
          >
            Connect everywhere your audience already is
          </h2>
          <p className="mt-3 text-base text-ink-body">
            30+ platforms at launch. Music, video, social, commerce, email, and booking — connected
            in two clicks.
          </p>
        </div>

        <ul
          aria-label="Supported platforms"
          className="mx-auto mt-10 grid max-w-6xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
        >
          {platforms.map((p) => (
            <li
              key={p.name}
              className="flex items-center gap-3 rounded-card bg-card px-4 py-3"
            >
              <span
                aria-hidden="true"
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-base font-extrabold text-white ${p.bg} ${p.fg ?? ""}`}
              >
                {p.icon ? <p.icon className="h-5 w-5" /> : <span>{p.letter}</span>}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold text-ink-heading">
                  {p.name}
                </span>
                <span className="block truncate text-xs text-ink-muted">{p.tagline}</span>
              </span>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-center text-sm text-ink-muted">
          And 29 more rolling out monthly — voted on by the community at{" "}
          <span className="font-semibold text-ink-heading">roadmap.camelify.com</span>
        </p>
      </div>
    </section>
  );
}
