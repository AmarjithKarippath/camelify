import Link from "next/link";
import { Check, X, AlertTriangle } from "lucide-react";

type Row = {
  label: string;
  others: string;
  camelify: string;
};

const rows: Row[] = [
  { label: "Custom domain", others: "Paid tier only", camelify: "All plans" },
  { label: "Suspension warning", others: "None", camelify: "Always" },
  { label: "Appeal process", others: "Slow / opaque", camelify: "24-hour SLA" },
  { label: "Data export", others: "Paywalled", camelify: "Always free" },
  { label: "Analytics", others: "Paywalled", camelify: "Free on all plans" },
  { label: "Human support", others: "Tickets / bots", camelify: "Real humans, <24h" },
  { label: "AI page assistant", others: "Not offered", camelify: "Included" },
  { label: "Pricing", others: "Steep monthly fee", camelify: "Pay what you use" },
  { label: "Recent price hike", others: "+67% in Nov 2025", camelify: "60-day notice, always" },
];

export function Comparison() {
  return (
    <section id="compare" aria-labelledby="compare-heading" className="px-6 py-20">
      <div className="mx-auto max-w-container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-primary">
            How we&apos;re different
          </p>
          <h2
            id="compare-heading"
            className="mt-3 text-3xl font-extrabold tracking-tight text-ink-heading sm:text-4xl"
          >
            Camelify vs. other link-in-bio platforms
          </h2>
          <p className="mt-4 text-lg text-ink-body">
            Other platforms grew big and stopped listening. We&apos;re building the one that puts
            creators first — and stays that way.
          </p>
        </div>

        {/* Recent price-hike callout */}
        <div className="mx-auto mt-8 flex max-w-3xl items-start gap-3 rounded-card border-2 border-danger/20 bg-danger/5 p-5">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-danger" aria-hidden="true" />
          <div className="text-sm">
            <p className="font-bold text-ink-heading">
              In November 2025, the leading platform raised prices by up to 67% overnight.
            </p>
            <p className="mt-1 text-ink-body">
              No new features. No warning. Most users were grandfathered briefly, then rolled onto
              new pricing. Camelify commits to 60 days&apos; notice on any price change — in
              writing, in our terms.
            </p>
          </div>
        </div>

        {/* Comparison cards */}
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {/* Others card */}
          <article className="rounded-card bg-card p-7">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-extrabold text-ink-heading">Other platforms</h3>
              <span className="rounded-full bg-ink-muted/15 px-3 py-1 text-xs font-semibold text-ink-muted">
                Current
              </span>
            </div>
            <ul className="mt-5 divide-y divide-ink-heading/10">
              {rows.map((r) => (
                <li
                  key={r.label}
                  className="flex items-center justify-between gap-4 py-3.5 text-sm"
                >
                  <span className="text-ink-body">{r.label}</span>
                  <span className="flex items-center gap-1.5 font-semibold text-danger">
                    <X className="h-4 w-4" aria-hidden="true" /> {r.others}
                  </span>
                </li>
              ))}
            </ul>
          </article>

          {/* Camelify card */}
          <article className="rounded-card border-2 border-primary bg-surface p-7 shadow-sm">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-extrabold text-ink-heading">Camelify</h3>
              <span className="rounded-full bg-primary-soft/80 px-3 py-1 text-xs font-semibold text-ink-label">
                Launching 2026
              </span>
            </div>
            <ul className="mt-5 divide-y divide-ink-heading/10">
              {rows.map((r) => (
                <li
                  key={r.label}
                  className="flex items-center justify-between gap-4 py-3.5 text-sm"
                >
                  <span className="text-ink-body">{r.label}</span>
                  <span className="flex items-center gap-1.5 font-semibold text-primary">
                    <Check className="h-4 w-4" aria-hidden="true" /> {r.camelify}
                  </span>
                </li>
              ))}
            </ul>
          </article>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-input bg-primary px-6 py-3.5 text-base font-semibold text-white hover:bg-primary-hover"
          >
            Switch to Camelify — free
          </Link>
          <p className="mt-3 text-xs text-ink-muted">
            We&apos;ll import your existing links in one click. Bring your audience, not the
            baggage.
          </p>
        </div>
      </div>
    </section>
  );
}
