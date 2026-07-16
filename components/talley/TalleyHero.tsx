"use client";

import { useWaitlist } from "./WaitlistContext";

export function TalleyHero() {
  const { openWaitlist } = useWaitlist();

  return (
    <section className="relative overflow-hidden bg-surface pb-0 pt-10 md:pt-14">
      <div className="relative mx-auto max-w-[900px] px-6 text-center">
        {/* Line 1 */}
        <h1 className="font-display text-[2.4rem] font-semibold leading-[1.15] text-ink-heading sm:text-5xl md:text-[3.5rem] lg:text-[4rem]">
          All your business on{" "}
          <span className="relative inline-block whitespace-nowrap">
            <span
              aria-hidden="true"
              className="absolute -inset-x-3 -inset-y-1 bottom-0 top-1 -skew-x-1 rounded-sm bg-talley-yellow/90"
            />
            <span className="relative">one platform.</span>
          </span>
        </h1>

        {/* Line 2 */}
        <p className="font-display mt-2 text-[2rem] font-semibold leading-[1.2] text-ink-heading sm:text-4xl md:text-[3.2rem] lg:text-[3.6rem]">
          Simple, efficient, yet{" "}
          <span className="relative inline-block">
            affordable!
            <span
              aria-hidden="true"
              className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full bg-talley-blue"
            />
          </span>
        </p>

        {/* Pricing annotation with arrow */}
        <div className="relative mx-auto mt-6 h-16 max-w-lg">
          <svg
            viewBox="0 0 280 60"
            className="absolute -right-4 top-0 hidden w-[220px] text-talley-purple md:block lg:-right-16 lg:w-[260px]"
            aria-hidden="true"
          >
            <path
              d="M 20 50 Q 80 10 160 8 L 200 8"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path d="M 194 4 L 202 8 L 194 12" fill="currentColor" />
          </svg>
          <p className="font-display absolute right-0 top-8 text-xl font-semibold text-talley-purple md:text-2xl">
            ₹999 / month
            <br />
            <span className="text-lg md:text-xl">for ALL apps</span>
          </p>
        </div>

        {/* Mobile pricing */}
        <p className="font-display mt-4 text-lg font-semibold text-talley-purple md:hidden">
          ₹999 / month for ALL apps
        </p>

        {/* CTA buttons */}
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <button
            type="button"
            onClick={() => openWaitlist("start_now")}
            className="min-w-[220px] rounded-md bg-talley-purple px-8 py-3.5 text-[17px] font-medium text-white shadow-sm transition hover:bg-talley-purple-dark"
          >
            Start now - It&apos;s free
          </button>
          <button
            type="button"
            onClick={() => openWaitlist("meet_advisor")}
            className="min-w-[220px] rounded-md border border-black/10 bg-surface px-8 py-3.5 text-[17px] font-medium text-ink-heading shadow-sm transition hover:bg-[#F8F8F8]"
          >
            Meet an advisor
          </button>
        </div>
      </div>

      {/* Curved transition to app grid */}
      <div className="relative mt-12 md:mt-16">
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          className="block h-[50px] w-full md:h-[70px]"
          aria-hidden="true"
        >
          <path
            d="M0,40 Q360,80 720,40 T1440,40 L1440,80 L0,80 Z"
            fill="#F0F0F0"
          />
        </svg>
      </div>
    </section>
  );
}
