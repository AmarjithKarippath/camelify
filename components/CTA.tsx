import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section aria-labelledby="cta-heading" className="px-6 py-20">
      <div className="mx-auto max-w-container">
        <div className="relative overflow-hidden rounded-card bg-primary px-8 py-14 text-center sm:px-16">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.5) 0, transparent 40%), radial-gradient(circle at 80% 70%, rgba(14,27,44,0.4) 0, transparent 45%)",
            }}
          />
          <div className="relative">
            <h2
              id="cta-heading"
              className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
            >
              Your one link, ready in 3 minutes
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-white/90">
              Free forever. No surprise suspensions. Custom domain on every plan. Join the
              link-in-bio that puts creators first.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-input bg-ink-heading px-6 py-3.5 text-base font-semibold text-white hover:bg-ink-heading/90"
              >
                Create your page free <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-input border-2 border-white/30 bg-white/10 px-6 py-3.5 text-base font-semibold text-white hover:bg-white/20"
              >
                I already have an account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
