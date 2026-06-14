import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-card/60 bg-page">
      <div className="mx-auto grid max-w-container gap-10 px-6 py-14 md:grid-cols-3">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-ink-muted">
            Camelify is the creator-first link-in-bio. Fair pricing, no surprise suspensions, and
            policies you can actually rely on.
          </p>
        </div>

        <nav aria-label="Product" className="text-sm">
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-label">
            Product
          </h2>
          <ul className="space-y-2">
            <li><a href="#how-it-works" className="text-ink-body hover:text-primary">How it works</a></li>
            <li><a href="#features" className="text-ink-body hover:text-primary">Features</a></li>
            <li><a href="#promise" className="text-ink-body hover:text-primary">Our promise</a></li>
            <li><a href="#faq" className="text-ink-body hover:text-primary">FAQ</a></li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-card/60">
        <div className="mx-auto flex max-w-container flex-col items-center justify-between gap-3 px-6 py-5 text-xs text-ink-muted sm:flex-row">
          <p>© {new Date().getFullYear()} Camelify. Made for creators.</p>
          <p>hello@camelify.com</p>
        </div>
      </div>
    </footer>
  );
}
