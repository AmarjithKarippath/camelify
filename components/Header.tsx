import Link from "next/link";
import { Logo } from "./Logo";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-card/60 bg-page/80 backdrop-blur">
      <div className="mx-auto flex max-w-container items-center justify-between px-6 py-4">
        <Link href="/" aria-label="Camelify home">
          <Logo />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
          <a href="#how-it-works" className="text-sm font-medium text-ink-body hover:text-primary">
            How it works
          </a>
          <a href="#features" className="text-sm font-medium text-ink-body hover:text-primary">
            Features
          </a>
          <a href="#compare" className="text-sm font-medium text-ink-body hover:text-primary">
            Compare
          </a>
          <a href="#promise" className="text-sm font-medium text-ink-body hover:text-primary">
            Our promise
          </a>
          <a href="#faq" className="text-sm font-medium text-ink-body hover:text-primary">
            FAQ
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden text-sm font-semibold text-ink-heading hover:text-primary sm:inline"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-input bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
