import { UserPlus, ListPlus, Link2, BarChart3 } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Sign up free",
    body: "Create your account with email or Google in under a minute. No credit card needed.",
  },
  {
    icon: ListPlus,
    title: "Add your links",
    body: "Drag and drop your YouTube, Instagram, WhatsApp, Calendly and more onto your page.",
  },
  {
    icon: Link2,
    title: "Share your bio link",
    body: "Drop camelify.com/yourname into every social bio. One link, every link.",
  },
  {
    icon: BarChart3,
    title: "Grow with real data",
    body: "See clicks, devices, and top referrers. Free analytics — never paywalled.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-heading" className="px-6 py-20">
      <div className="mx-auto max-w-container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-primary">
            How it works
          </p>
          <h2
            id="how-heading"
            className="mt-3 text-3xl font-extrabold tracking-tight text-ink-heading sm:text-4xl"
          >
            Your bio link, live in 3 minutes
          </h2>
          <p className="mt-4 text-lg text-ink-body">
            No setup screens. No upsells. Just a page that works.
          </p>
        </div>

        <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title} className="rounded-card bg-card p-6">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-sm font-bold text-white">
                  {i + 1}
                </span>
                <s.icon className="h-5 w-5 text-ink-label" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-base font-bold text-ink-heading">{s.title}</h3>
              <p className="mt-2 text-sm text-ink-body">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
