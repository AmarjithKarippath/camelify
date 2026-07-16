"use client";

import { useEffect, useRef, useState } from "react";
import { X, Loader2, PartyPopper } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

type Props = {
  open: boolean;
  source: string;
  onClose: () => void;
};

export function WaitlistModal({ open, source, onClose }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setError("");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/v1/waitlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), phone: phone.trim(), source }),
      });

      if (res.status === 409) {
        setSubmitted(true);
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const detail = data.detail;
        const message =
          typeof detail === "string"
            ? detail
            : Array.isArray(detail) && detail[0]?.msg
              ? detail[0].msg
              : "Something went wrong. Please try again.";
        throw new Error(message);
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    if (!loading) {
      setSubmitted(false);
      setName("");
      setEmail("");
      setPhone("");
      onClose();
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="waitlist-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-ink-heading/50 backdrop-blur-[2px]"
        aria-label="Close"
        onClick={handleClose}
      />

      <div
        ref={dialogRef}
        className="relative w-full max-w-md animate-storefront-rise rounded-2xl bg-surface p-7 shadow-2xl sm:p-8"
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-md p-1.5 text-ink-muted transition hover:bg-[#F0F0F0] hover:text-ink-heading"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {submitted ? (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-talley-purple/10 text-talley-purple">
              <PartyPopper className="h-7 w-7" />
            </div>
            <h2 id="waitlist-title" className="font-display text-3xl font-semibold text-ink-heading">
              You&apos;re on the list!
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-body">
              Thank you for your interest! Due to high demand, we have placed you on our
              exclusive waiting list. We will contact you at{" "}
              <strong className="text-ink-heading">{email}</strong> as soon as your account is
              ready.
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="mt-6 w-full rounded-md bg-talley-purple px-5 py-3 text-[15px] font-medium text-white transition hover:bg-talley-purple-dark"
            >
              Got it
            </button>
          </div>
        ) : (
          <>
            <h2 id="waitlist-title" className="font-display pr-8 text-3xl font-semibold text-ink-heading">
              Get started with Talley
            </h2>
            <p className="mt-2 text-[15px] text-ink-body">
              Enter your details and we&apos;ll set up your business workspace.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="waitlist-name" className="mb-1.5 block text-sm font-medium text-ink-heading">
                  Full name
                </label>
                <input
                  id="waitlist-name"
                  type="text"
                  required
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-md border border-black/15 bg-surface px-4 py-3 text-ink-heading outline-none transition focus:border-talley-purple focus:ring-2 focus:ring-talley-purple/15"
                />
              </div>

              <div>
                <label htmlFor="waitlist-email" className="mb-1.5 block text-sm font-medium text-ink-heading">
                  Email
                </label>
                <input
                  id="waitlist-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full rounded-md border border-black/15 bg-surface px-4 py-3 text-ink-heading outline-none transition focus:border-talley-purple focus:ring-2 focus:ring-talley-purple/15"
                />
              </div>

              <div>
                <label htmlFor="waitlist-phone" className="mb-1.5 block text-sm font-medium text-ink-heading">
                  Contact number
                </label>
                <input
                  id="waitlist-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full rounded-md border border-black/15 bg-surface px-4 py-3 text-ink-heading outline-none transition focus:border-talley-purple focus:ring-2 focus:ring-talley-purple/15"
                />
              </div>

              {error && (
                <p className="rounded-md bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-talley-purple px-5 py-3.5 text-[15px] font-medium text-white transition hover:bg-talley-purple-dark disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Submitting…
                  </>
                ) : (
                  "Continue"
                )}
              </button>
            </form>

            <p className="mt-4 text-center text-xs text-ink-muted">
              Free to start · No credit card required
            </p>
          </>
        )}
      </div>
    </div>
  );
}
