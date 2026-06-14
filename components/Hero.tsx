import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
} from "lucide-react";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden px-6 pb-20 pt-16 md:pt-24"
    >
      <div className="mx-auto grid max-w-container items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Left: copy */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft/60 px-3 py-1 text-xs font-semibold text-ink-label">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Creator-first · No surprises
          </span>

          <h1
            id="hero-heading"
            className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight text-ink-heading sm:text-5xl lg:text-6xl"
          >
            The link-in-bio <span className="text-primary">creators</span> actually deserve
          </h1>

          <p className="mt-6 max-w-xl text-lg text-ink-body">
            One page for everything you share. Fair pricing, no surprise suspensions, your data
            always yours, and tools other platforms never bothered to build. Set up in 3 minutes —
            free forever.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-input bg-primary px-6 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-primary-hover"
            >
              Create your page free <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 rounded-input border-2 border-ink-heading bg-surface px-6 py-3.5 text-base font-semibold text-ink-heading transition hover:bg-card"
            >
              See how it works
            </a>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-body">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" /> Free forever
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" /> No credit card
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" /> Custom domain on all plans
            </li>
          </ul>
        </div>

        {/* Right: profile preview card */}
        <div className="relative mx-auto w-full max-w-[420px]">
          <ProfilePreviewCard />
          <p className="mt-3 text-center text-xs text-ink-muted">
            Sample profile — yours will look like this once you sign up.
          </p>
        </div>
      </div>
    </section>
  );
}

function ProfilePreviewCard() {
  return (
    <div
      role="figure"
      aria-label="Demo profile preview"
      className="relative overflow-hidden rounded-[28px] bg-surface shadow-[0_30px_80px_-30px_rgba(14,27,44,0.25)] ring-1 ring-black/5"
    >
      {/* Demo badge */}
      <div className="absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-ink-heading/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm backdrop-blur">
        <span
          aria-hidden="true"
          className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-primary"
        />
        Demo preview
      </div>

      {/* Banner */}
      <div
        className="relative h-28"
        style={{
          background:
            "linear-gradient(135deg, #C8E6C9 0%, #E8F4EA 35%, #DBE7F2 75%, #B7CDE8 100%)",
        }}
        aria-hidden="true"
      />

      <div className="-mt-12 flex flex-col items-center px-6 pb-6">
        {/* Avatar */}
        <div className="relative">
          <Image
            src="/avatars/demo.jpg"
            alt="Profile photo of Arjun Mehta"
            width={96}
            height={96}
            priority
            className="h-24 w-24 rounded-full object-cover shadow-md ring-4 ring-surface"
          />
        </div>

        {/* Name + bio */}
        <h2 className="mt-4 text-2xl font-extrabold text-ink-heading">Arjun Mehta</h2>
        <p className="mt-2 max-w-[280px] text-center text-sm text-ink-muted">
          Fitness coach. Helping you build strength at home with simple, sustainable workouts.
        </p>

        {/* Social icons */}
        <div className="mt-5 flex items-center gap-3" aria-label="Social links">
          <SocialIcon icon={Facebook} label="Facebook" bg="bg-[#1877F2]" />
          <SocialIcon icon={Twitter} label="Twitter" bg="bg-[#1DA1F2]" />
          <SocialIcon
            icon={Instagram}
            label="Instagram"
            bg="bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF]"
          />
          <SocialIcon icon={Linkedin} label="LinkedIn" bg="bg-[#0A66C2]" />
          <SocialIcon icon={Youtube} label="YouTube" bg="bg-[#FF0000]" />
        </div>

        {/* Featured link */}
        <div className="mt-6 w-full">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-full bg-ink-heading px-5 py-3.5 text-left text-sm font-bold text-white"
          >
            <span aria-hidden="true">💪</span>
            <span className="flex-1">Book a coaching call</span>
            <span
              aria-hidden="true"
              className="grid h-8 w-8 place-items-center rounded-full bg-surface"
            >
              <ArrowUpRight className="h-4 w-4 text-ink-heading" />
            </span>
          </button>
        </div>

        {/* Other links */}
        <div className="mt-3 w-full space-y-3">
          <BioLink emoji="📝" label="Read my blog" />
          <BioLink emoji="🎙️" label="Listen to my podcast" />
          <BioLink emoji="🛍️" label="Shop my routine" />
          <BioLink emoji="🎬" label="Subscribe on YouTube" />
        </div>
      </div>
    </div>
  );
}

function SocialIcon({
  icon: Icon,
  label,
  bg,
}: {
  icon: typeof Facebook;
  label: string;
  bg: string;
}) {
  return (
    <span
      aria-label={label}
      role="img"
      className={`grid h-9 w-9 place-items-center rounded-full text-white ${bg}`}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </span>
  );
}

function BioLink({ emoji, label }: { emoji: string; label: string }) {
  return (
    <div className="flex w-full items-center gap-3 rounded-full border border-black/10 bg-surface px-5 py-3 text-sm font-semibold text-ink-heading">
      <span aria-hidden="true">{emoji}</span>
      <span className="flex-1">{label}</span>
      <span
        aria-hidden="true"
        className="grid h-8 w-8 place-items-center rounded-full bg-page"
      >
        <ArrowUpRight className="h-4 w-4 text-ink-heading" />
      </span>
    </div>
  );
}
