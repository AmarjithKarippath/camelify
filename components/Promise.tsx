import { ShieldCheck, MessageSquareText, Download, Clock } from "lucide-react";

const promises = [
  {
    icon: ShieldCheck,
    title: "Zero auto-suspensions",
    body: "Every action on your page is reviewed by a human first. No silent takedowns, ever — something other platforms can't say.",
  },
  {
    icon: MessageSquareText,
    title: "Real reasons, in your language",
    body: "If something is wrong, we tell you exactly what — on WhatsApp and email, in plain words. No template emails.",
  },
  {
    icon: Clock,
    title: "24-hour response window",
    body: "Before any restriction, you get 24 hours to respond or fix. Three strikes before anything escalates — and appeals reviewed within 24 hours.",
  },
  {
    icon: Download,
    title: "Export your data anytime",
    body: "One click downloads your links, analytics, and email list. Free on every plan — including during appeals or suspension.",
  },
];

export function Promise() {
  return (
    <section id="promise" aria-labelledby="promise-heading" className="px-6 py-20">
      <div className="mx-auto max-w-container rounded-card bg-ink-heading p-8 text-white sm:p-12 md:p-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-primary">Our promise</p>
          <h2
            id="promise-heading"
            className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl"
          >
            We&apos;ll never shut you down without telling you why
          </h2>
          <p className="mt-4 text-lg text-white/80">
            Most link-in-bio tools treat creators as a number. Camelify treats creators as the
            customer. These are commitments, not features.
          </p>
        </div>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2">
          {promises.map((p) => (
            <li key={p.title} className="rounded-card bg-white/5 p-6 ring-1 ring-white/10">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-white">
                <p.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-lg font-bold">{p.title}</h3>
              <p className="mt-2 text-sm text-white/75">{p.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
