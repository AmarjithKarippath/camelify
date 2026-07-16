"use client";

import Link from "next/link";
import { TalleyLogo } from "./TalleyLogo";
import { useWaitlist } from "./WaitlistContext";

const NAV = [
  { href: "#apps", label: "Apps" },
  { href: "#industries", label: "Industries" },
  { href: "#community", label: "Community" },
  { href: "#pricing", label: "Pricing" },
  { href: "#help", label: "Help" },
];

export function TalleyHeader() {
  const { openWaitlist } = useWaitlist();

  return (
    <header className="sticky top-0 z-50 bg-surface">
      <div className="mx-auto grid h-[60px] max-w-[1400px] grid-cols-[1fr_auto_1fr] items-center px-6 lg:px-10">
        <Link href="/" aria-label="Talley home" className="justify-self-start">
          <TalleyLogo />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-7 justify-self-center lg:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[15px] text-ink-body transition hover:text-talley-purple"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4 justify-self-end">
          <button
            type="button"
            onClick={() => openWaitlist("sign_in")}
            className="text-[15px] text-ink-body transition hover:text-talley-purple"
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => openWaitlist("try_free")}
            className="rounded-md bg-talley-purple px-4 py-2 text-[15px] font-medium text-white transition hover:bg-talley-purple-dark"
          >
            Try it free
          </button>
        </div>
      </div>
    </header>
  );
}
