const faqs = [
  {
    q: "What is Camelify?",
    a: "Camelify is a link-in-bio tool for creators. You get a single page (camelify.com/yourname) to share all your important links — YouTube, Instagram, WhatsApp, your shop, your booking page — from one bio link.",
  },
  {
    q: "How is Camelify different from other link-in-bio platforms?",
    a: "Camelify puts creators first: custom domain on every plan, free analytics, free data export, and a firm no-surprise-suspension policy. Every flag is reviewed by a human, you get 24 hours to respond, and pricing changes are always communicated 60 days in advance.",
  },
  {
    q: "Is it really free?",
    a: "Yes. The Free plan includes unlimited links, basic analytics, an email capture form, and all launch integrations. Pages on the Free plan show a small Camelify watermark. Paid plans remove it and add more features.",
  },
  {
    q: "Which platforms can I link to?",
    a: "Launching with 30+ platforms — Instagram, YouTube, TikTok, X, Facebook, LinkedIn, Spotify, Apple Music, WhatsApp, Calendly, Shopify, Stripe, Mailchimp, Klaviyo, Substack, Twitch, Pinterest, and more. 29 more roll out monthly based on community votes.",
  },
  {
    q: "Will my page load fast?",
    a: "Every public page is server-rendered with a sub-500ms first-paint target. Audiences on slow mobile connections still get an instant experience, and link previews work correctly on WhatsApp, Instagram and Twitter.",
  },
  {
    q: "Can I export my data?",
    a: "Always. One click downloads your links, analytics history, and email capture list — on every plan, including Free, and even if your account is under review.",
  },
  {
    q: "What happens if you raise prices later?",
    a: "Any price change is communicated at least 60 days in advance, and existing subscribers are grandfathered for 6 months. This is published policy, not a tagline. No overnight 67% hikes — ever.",
  },
  {
    q: "Can I use my own domain?",
    a: "Yes — and unlike most platforms, custom domain works on every plan, including Free. Connect yourname.com with a one-click DNS setup. You build SEO equity on your own domain, not ours.",
  },
];

export function FAQ() {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-primary">FAQ</p>
          <h2
            id="faq-heading"
            className="mt-3 text-3xl font-extrabold tracking-tight text-ink-heading sm:text-4xl"
          >
            Frequently asked questions
          </h2>
        </div>

        <div className="mt-10 space-y-3">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="group rounded-card bg-card p-5 open:bg-card/90"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-base font-bold text-ink-heading marker:hidden [&::-webkit-details-marker]:hidden">
                {f.q}
                <span
                  aria-hidden="true"
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-white transition group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-ink-body">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};
