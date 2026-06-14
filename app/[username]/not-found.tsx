import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function NotFound() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-page px-6 text-center">
      <Logo />
      <h1 className="mt-8 text-3xl font-extrabold tracking-tight text-ink-heading">
        Page not found
      </h1>
      <p className="mt-3 max-w-sm text-sm text-ink-muted">
        We couldn&apos;t find that creator on Camelify. The link may be wrong or the page
        hasn&apos;t been created yet.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-12 items-center justify-center rounded-input bg-primary px-6 text-sm font-semibold text-white hover:bg-primary-hover"
      >
        Go to Camelify home
      </Link>
    </main>
  );
}
