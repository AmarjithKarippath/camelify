"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/?try=1");
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-page">
      <p className="text-sm text-ink-muted">Redirecting…</p>
    </main>
  );
}
