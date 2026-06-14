import {
  ShieldCheck,
  Wallet,
  BarChart3,
  Smartphone,
  Sparkles,
  Download,
  Link2,
  Bell,
  LifeBuoy,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Never suspended without warning",
    body: "Every flag is reviewed by a human. You get a real reason, with a 24-hour window to respond. Other platforms suspend silently.",
  },
  {
    icon: Wallet,
    title: "Fair, predictable pricing",
    body: "Pay for what you use. Pricing changes communicated 60 days in advance — always. No surprise 67% hikes.",
  },
  {
    icon: Link2,
    title: "Custom domain on every plan",
    body: "Connect yourname.com from day one — including the free plan. Other platforms lock custom domains behind their top tier or skip it entirely.",
  },
  {
    icon: BarChart3,
    title: "Free analytics, no paywall",
    body: "Clicks, views, devices, top referrers — included in every plan, free tier too. Other platforms paywall this on day one.",
  },
  {
    icon: Download,
    title: "One-click data export",
    body: "Download your links, analytics history, and email capture list any time — even during account review. Other platforms paywall or block export.",
  },
  {
    icon: Smartphone,
    title: "Sub-500ms load times",
    body: "Server-rendered pages, optimized for mobile. Your audience sees content instantly, with rich link previews on every social platform.",
  },
  {
    icon: LifeBuoy,
    title: "Real human support",
    body: "Get help from a real human, with response in under 24 hours. Not a ticket queue, not a chatbot.",
  },
  {
    icon: Bell,
    title: "Smart in-app updates",
    body: "Instant notifications when links break, traffic spikes, or someone subscribes — without spammy emails.",
  },
  {
    icon: Sparkles,
    title: "AI page assistant",
    body: "Auto-surface your latest YouTube or Instagram post. Get weekly suggestions on what to feature based on click data.",
  },
];

export function Features() {
  return (
    <section id="features" aria-labelledby="features-heading" className="px-6 py-20">
      <div className="mx-auto max-w-container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-primary">Features</p>
          <h2
            id="features-heading"
            className="mt-3 text-3xl font-extrabold tracking-tight text-ink-heading sm:text-4xl"
          >
            Built with what other platforms left out
          </h2>
          <p className="mt-4 text-lg text-ink-body">
            A link-in-bio that respects your audience, your wallet, and your work.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <article key={f.title} className="rounded-card bg-card p-6">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft">
                <f.icon className="h-5 w-5 text-ink-label" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-ink-heading">{f.title}</h3>
              <p className="mt-2 text-sm text-ink-body">{f.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
