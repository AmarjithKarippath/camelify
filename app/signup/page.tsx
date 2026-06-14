import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { Divider } from "@/components/auth/Divider";
import { EmailPasswordForm } from "@/components/auth/EmailPasswordForm";

export const metadata: Metadata = {
  title: "Create your page",
  description: "Create your free Camelify account.",
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return (
    <main
      className="flex min-h-[100dvh] flex-col bg-page"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <header className="px-5 py-4">
        <Link href="/" aria-label="Back to home" className="inline-block">
          <Logo />
        </Link>
      </header>

      <div className="flex flex-1 items-center justify-center px-5">
        <div className="w-full max-w-sm">
          <div className="rounded-card bg-surface p-6 shadow-sm ring-1 ring-black/5 sm:p-8">
            <h1 className="text-2xl font-extrabold tracking-tight text-ink-heading">
              Create your free page
            </h1>
            <p className="mt-1.5 text-sm text-ink-body">
              No credit card. Live bio link in 3 minutes.
            </p>

            <div className="mt-6">
              <GoogleButton label="Continue with Google" />
            </div>

            <Divider label="or" />

            <EmailPasswordForm mode="signup" />

            <p className="mt-5 text-center text-xs text-ink-muted">
              By continuing you agree to our{" "}
              <Link href="/terms" className="underline hover:text-ink-heading">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline hover:text-ink-heading">
                Privacy Policy
              </Link>
              .
            </p>
          </div>

          <p className="mt-6 text-center text-sm text-ink-body">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>

      <footer
        className="px-5 py-5 text-center text-xs text-ink-muted"
        style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
      >
        © {new Date().getFullYear()} Camelify
      </footer>
    </main>
  );
}
