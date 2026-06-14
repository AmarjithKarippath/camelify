"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

type Mode = "login" | "signup";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const DASHBOARD_URL =
  process.env.NEXT_PUBLIC_DASHBOARD_URL ?? "http://localhost:5173";

export function EmailPasswordForm({ mode }: { mode: Mode }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const path = mode === "signup" ? "/v1/auth/register" : "/v1/auth/login";
    const body = mode === "signup" ? { name, email, password } : { email, password };

    try {
      const res = await fetch(`${API_URL}${path}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const detail = data?.detail;
        setError(
          typeof detail === "string"
            ? detail
            : Array.isArray(detail) && detail[0]?.msg
              ? detail[0].msg
              : mode === "signup"
                ? "Could not create your account. Try again."
                : "Invalid email or password.",
        );
        setLoading(false);
        return;
      }

      // Success — bounce to the creator dashboard (separate Vite app on its own port).
      window.location.href = DASHBOARD_URL;
    } catch {
      setError("Network error. Check your connection and try again.");
      setLoading(false);
    }
  }

  const submitLabel =
    mode === "signup" ? "Create account" : "Log in";
  const loadingLabel =
    mode === "signup" ? "Creating account…" : "Signing in…";

  return (
    <form onSubmit={handleSubmit} className="mt-5 space-y-3" noValidate>
      {mode === "signup" && (
        <Field>
          <Label htmlFor="name">Your name</Label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Arjun Mehta"
            className={inputClass}
          />
        </Field>
      )}

      <Field>
        <Label htmlFor="email">Email</Label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className={inputClass}
        />
      </Field>

      <Field>
        <Label htmlFor="password">Password</Label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={mode === "signup" ? 8 : 1}
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={mode === "signup" ? "At least 8 characters" : "••••••••"}
          className={inputClass}
        />
      </Field>

      {error && (
        <p
          role="alert"
          className="rounded-input border border-danger/30 bg-danger/5 px-3 py-2 text-sm font-medium text-danger"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-input bg-primary text-base font-semibold text-white shadow-sm transition hover:bg-primary-hover active:scale-[0.99] disabled:opacity-70"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {loading ? loadingLabel : submitLabel}
      </button>
    </form>
  );
}

const inputClass =
  "h-12 w-full rounded-input border border-black/15 bg-surface px-4 text-base text-ink-heading placeholder:text-ink-muted focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary-soft/40";

function Field({ children }: { children: React.ReactNode }) {
  return <div className="space-y-1.5">{children}</div>;
}

function Label({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-semibold text-ink-heading">
      {children}
    </label>
  );
}
