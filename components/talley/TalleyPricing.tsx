"use client";

import { useWaitlist } from "./WaitlistContext";

export function TalleyPricing() {
  const { openWaitlist } = useWaitlist();

  return (
    <section id="pricing" className="bg-surface px-6 py-20">
      <div className="mx-auto max-w-container text-center">
        <h2 className="font-display text-4xl font-semibold text-ink-heading md:text-5xl">
          Fair pricing. No surprises.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-ink-body">
          One simple price for all apps — just like you saw above.
        </p>

        <div className="mx-auto mt-12 max-w-sm">
          <p className="font-display text-5xl font-semibold text-talley-purple">
            ₹999 <span className="text-2xl text-ink-muted">/ month</span>
          </p>
          <p className="mt-1 text-ink-muted">for ALL apps · per business</p>

          <ul className="mt-8 space-y-2 text-left text-[15px] text-ink-body">
            {[
              "Accounting & invoicing",
              "Inventory management",
              "GST reports",
              "Unlimited users",
              "Cloud access",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="text-talley-purple">✓</span> {item}
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => openWaitlist("pricing")}
            className="mt-8 w-full rounded-md bg-talley-purple py-3.5 text-[17px] font-medium text-white transition hover:bg-talley-purple-dark"
          >
            Start now - It&apos;s free
          </button>
        </div>
      </div>
    </section>
  );
}
