"use client";

import { useWaitlist } from "./WaitlistContext";
import { TalleyLogo } from "./TalleyLogo";

export function TalleyCTA() {
  const { openWaitlist } = useWaitlist();

  return (
    <section className="bg-talley-purple px-6 py-20 text-white">
      <div className="mx-auto max-w-container text-center">
        <h2 className="font-display text-4xl font-semibold md:text-5xl">
          Unleash your growth potential
        </h2>
        <button
          type="button"
          onClick={() => openWaitlist("bottom_cta")}
          className="mt-8 rounded-md bg-surface px-10 py-3.5 text-[17px] font-medium text-talley-purple transition hover:bg-[#F8F8F8]"
        >
          Start now - It&apos;s free
        </button>
        <p className="mt-3 text-sm text-white/70">No credit card required · Instant access</p>
      </div>
    </section>
  );
}

export function TalleyFooter() {
  return (
    <footer id="help" className="border-t border-black/5 bg-surface px-6 py-10">
      <div className="mx-auto flex max-w-container flex-col items-center justify-between gap-4 md:flex-row">
        <TalleyLogo />
        <p className="text-sm text-ink-muted">© {new Date().getFullYear()} Talley</p>
        <nav className="flex gap-6 text-sm text-ink-body">
          <a href="#apps" className="hover:text-talley-purple">Apps</a>
          <a href="#pricing" className="hover:text-talley-purple">Pricing</a>
          <a href="mailto:hello@talley.app" className="hover:text-talley-purple">Help</a>
        </nav>
      </div>
    </footer>
  );
}
