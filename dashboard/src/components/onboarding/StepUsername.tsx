import { useEffect, useState } from "react";
import { Check, Loader2, X } from "lucide-react";
import { checkUsername, LANDING_URL } from "@/api/client";
import { StepShell } from "./StepShell";

type Props = {
  value: string;
  onChange: (next: string) => void;
  onNext: () => void;
  step: number;
  total: number;
};

type Status =
  | { state: "idle" }
  | { state: "checking" }
  | { state: "ok"; username: string }
  | { state: "error"; reason: string };

export function StepUsername({ value, onChange, onNext, step, total }: Props) {
  const [status, setStatus] = useState<Status>({ state: "idle" });

  useEffect(() => {
    const v = value.trim().toLowerCase();
    if (v.length < 3) {
      setStatus({ state: "idle" });
      return;
    }
    setStatus({ state: "checking" });
    const handle = setTimeout(async () => {
      try {
        const result = await checkUsername(v);
        if (result.available) {
          setStatus({ state: "ok", username: result.username });
        } else {
          setStatus({
            state: "error",
            reason: result.reason ?? "Not available.",
          });
        }
      } catch {
        setStatus({ state: "error", reason: "Couldn't check availability." });
      }
    }, 350);
    return () => clearTimeout(handle);
  }, [value]);

  const host = LANDING_URL.replace(/^https?:\/\//, "");

  return (
    <StepShell
      step={step}
      total={total}
      title="Pick your handle"
      subtitle="This becomes your bio link. You can change it later."
      onNext={onNext}
      nextDisabled={status.state !== "ok"}
    >
      <label htmlFor="username" className="sr-only">
        Username
      </label>
      <div className="flex items-stretch overflow-hidden rounded-input border border-black/15 bg-surface focus-within:border-primary focus-within:ring-4 focus-within:ring-primary-soft/40">
        <span className="grid place-items-center bg-page px-3 text-sm text-ink-muted">
          {host}/
        </span>
        <input
          id="username"
          name="username"
          type="text"
          inputMode="text"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          value={value}
          onChange={(e) =>
            onChange(e.target.value.toLowerCase().replace(/\s+/g, ""))
          }
          placeholder="yourname"
          className="h-12 flex-1 bg-surface px-3 text-base text-ink-heading placeholder:text-ink-muted focus:outline-none"
        />
        <span className="grid w-12 place-items-center" aria-hidden="true">
          <StatusIcon status={status} />
        </span>
      </div>

      <p
        className={`mt-3 text-sm ${
          status.state === "error"
            ? "text-danger"
            : status.state === "ok"
              ? "text-primary"
              : "text-ink-muted"
        }`}
        aria-live="polite"
      >
        {messageFor(status)}
      </p>

      <div className="mt-6 rounded-card bg-card p-4 text-sm text-ink-body">
        <p className="font-semibold text-ink-heading">Tips</p>
        <ul className="mt-2 space-y-1.5 text-ink-body">
          <li>• 3–40 characters</li>
          <li>• Lowercase letters, numbers, dashes, underscores</li>
          <li>• Make it short — it&apos;s going in your bio</li>
        </ul>
      </div>
    </StepShell>
  );
}

function StatusIcon({ status }: { status: Status }) {
  if (status.state === "checking") {
    return <Loader2 className="h-4 w-4 animate-spin text-ink-muted" aria-label="Checking" />;
  }
  if (status.state === "ok") {
    return <Check className="h-4 w-4 text-primary" aria-label="Available" />;
  }
  if (status.state === "error") {
    return <X className="h-4 w-4 text-danger" aria-label="Unavailable" />;
  }
  return null;
}

function messageFor(status: Status): string {
  switch (status.state) {
    case "idle":
      return "Enter at least 3 characters.";
    case "checking":
      return "Checking availability…";
    case "ok":
      return "Available — looks great.";
    case "error":
      return status.reason;
  }
}
