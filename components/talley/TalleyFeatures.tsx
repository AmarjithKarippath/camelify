"use client";

import { useWaitlist } from "./WaitlistContext";

export function TalleyImagine() {
  const { openWaitlist } = useWaitlist();

  return (
    <section id="industries" className="bg-surface px-6 py-20">
      <div className="mx-auto max-w-[800px] text-center">
        <h2 className="font-display text-4xl font-semibold text-ink-heading md:text-5xl">
          Imagine without spreadsheets
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-body">
          A vast collection of business apps at your disposal. Got something to improve?
          There&apos;s an app for that. No complexity, no cost — just one click to get started.
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-ink-body">
          Each app simplifies a process and empowers more people. Record once — accounting,
          tax, and inventory update together.
        </p>
        <button
          type="button"
          onClick={() => openWaitlist("view_apps")}
          className="mt-8 text-[15px] font-medium text-talley-purple underline-offset-4 transition hover:underline"
        >
          View all Apps
        </button>
      </div>
    </section>
  );
}

const FEATURES = [
  {
    title: "Optimized for productivity",
    body: "Experience true speed, reduced data entry, and a fast UI. Invoicing and stock updates in seconds.",
  },
  {
    title: "GST built for India",
    body: "Compliant invoices, GSTR-ready exports, and tax calculations that work for every Indian business.",
  },
  {
    title: "Enterprise software, done right",
    body: "Open, honest pricing. No vendor lock-in. Your data stays yours — export anytime.",
  },
  {
    title: "Fair pricing",
    body: "No feature upselling, no long-term contracts, no surprises. One price for all apps.",
  },
  {
    title: "Work from anywhere",
    body: "Browser-based access from office, home, or on the go. Your business stays connected.",
  },
  {
    title: "Made for growing teams",
    body: "From a single shop to multi-branch operations — Talley scales with you.",
  },
];

export function TalleyFeatures() {
  return (
    <section id="features" className="bg-[#F8F8F8] px-6 py-20">
      <div className="mx-auto max-w-container">
        <div className="text-center">
          <h2 className="font-display text-4xl font-semibold text-ink-heading md:text-5xl">
            Level up your quality of work
          </h2>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ title, body }) => (
            <article key={title} className="text-center sm:text-left">
              <h3 className="text-lg font-bold text-ink-heading">{title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-body">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
