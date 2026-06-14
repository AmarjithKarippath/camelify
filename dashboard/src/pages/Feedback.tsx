import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bug, CheckCircle2, Loader2, Sparkles, MessageSquare } from "lucide-react";
import { submitFeedback, type FeedbackKind } from "@/api/client";

const KINDS: Array<{ id: FeedbackKind; label: string; icon: typeof Bug; tone: string }> = [
  { id: "bug", label: "Report a bug", icon: Bug, tone: "text-danger" },
  { id: "feature", label: "Feature request", icon: Sparkles, tone: "text-primary" },
  { id: "other", label: "Something else", icon: MessageSquare, tone: "text-info" },
];

const MAX = 4000;

export function Feedback() {
  const navigate = useNavigate();
  const [kind, setKind] = useState<FeedbackKind>("bug");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit() {
    const trimmed = message.trim();
    if (trimmed.length < 3) {
      setError("Tell us a little more.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await submitFeedback({ kind, message: trimmed });
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send.");
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <BackButton onClick={() => navigate("/settings")} />
          <h1 className="text-2xl font-extrabold tracking-tight text-ink-heading">
            Feedback
          </h1>
        </div>

        <div className="rounded-card bg-card p-8 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary text-white">
            <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
          </div>
          <h2 className="mt-4 text-lg font-extrabold text-ink-heading">Thanks!</h2>
          <p className="mt-2 text-sm text-ink-body">
            We&apos;ve got your note. Real humans will read it. We may reach out at your
            account email if we need more detail.
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                setSent(false);
                setMessage("");
              }}
              className="h-11 rounded-input border border-black/10 bg-surface px-4 text-sm font-semibold text-ink-heading hover:bg-card"
            >
              Send another
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="h-11 rounded-input bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-hover"
            >
              Back to home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const remaining = MAX - message.length;
  const over = remaining < 0;

  return (
    <div className="space-y-5 pb-32">
      <div className="flex items-center gap-2">
        <BackButton onClick={() => navigate("/settings")} />
        <h1 className="text-2xl font-extrabold tracking-tight text-ink-heading">
          Send feedback
        </h1>
      </div>

      <p className="text-sm text-ink-body">
        Found a bug? Got an idea? Tell us. We read every note.
      </p>

      {/* Kind picker */}
      <section>
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-ink-label">
          What kind of feedback?
        </p>
        <div role="radiogroup" aria-label="Feedback kind" className="grid gap-2 sm:grid-cols-3">
          {KINDS.map((k) => {
            const selected = kind === k.id;
            const Icon = k.icon;
            return (
              <button
                key={k.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setKind(k.id)}
                className={`flex min-h-[64px] items-center gap-3 rounded-card border px-4 py-3 text-left text-sm font-semibold transition active:scale-[0.99] ${
                  selected
                    ? "border-primary bg-primary-soft/40 text-ink-heading"
                    : "border-black/10 bg-surface text-ink-body hover:border-black/20"
                }`}
              >
                <Icon className={`h-5 w-5 ${k.tone}`} aria-hidden="true" />
                {k.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Message */}
      <section>
        <label
          htmlFor="message"
          className="mb-2 block text-xs font-bold uppercase tracking-wider text-ink-label"
        >
          Tell us more
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={
            kind === "bug"
              ? "What did you expect? What happened instead? Steps to reproduce, if you can."
              : kind === "feature"
                ? "Describe the feature, the problem it solves, and who it helps."
                : "Share anything — questions, compliments, ideas."
          }
          rows={8}
          maxLength={MAX + 100}
          className="w-full resize-y rounded-input border border-black/15 bg-surface px-3 py-3 text-base text-ink-heading placeholder:text-ink-muted focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary-soft/40"
        />
        <p
          className={`mt-2 text-right text-xs ${over ? "text-danger" : "text-ink-muted"}`}
          aria-live="polite"
        >
          {remaining} characters left
        </p>
      </section>

      {error && (
        <p
          role="alert"
          className="rounded-input border border-danger/30 bg-danger/5 px-3 py-2 text-sm font-medium text-danger"
        >
          {error}
        </p>
      )}

      {/* Sticky submit */}
      <div
        className="fixed inset-x-0 bottom-[64px] z-30 border-t border-black/10 bg-surface/95 p-3 backdrop-blur md:static md:left-60 md:border-0 md:bg-transparent md:p-0"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.75rem)" }}
      >
        <div className="mx-auto w-full max-w-3xl md:px-0">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || over || message.trim().length < 3}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-input bg-primary text-base font-semibold text-white shadow-sm transition hover:bg-primary-hover active:scale-[0.99] disabled:opacity-60"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitting ? "Sending…" : "Send feedback"}
          </button>
        </div>
      </div>
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Back"
      className="grid h-10 w-10 place-items-center rounded-full text-ink-heading hover:bg-card active:scale-95"
    >
      <ArrowLeft className="h-5 w-5" />
    </button>
  );
}
