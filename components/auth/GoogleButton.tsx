import { GoogleIcon } from "@/components/icons/GoogleIcon";

export function GoogleButton({ label }: { label: string }) {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  return (
    <a
      href={`${apiUrl}/v1/auth/google/login`}
      className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-input border-2 border-ink-heading bg-surface text-base font-semibold text-ink-heading transition hover:bg-card active:scale-[0.99]"
    >
      <GoogleIcon className="h-5 w-5" />
      {label}
    </a>
  );
}
