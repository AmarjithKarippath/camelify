import { ArrowLeft, Loader2 } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Progress } from "./Progress";

type Props = {
  step: number;
  total: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onBack?: () => void;
  onSkip?: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  submitting?: boolean;
};

export function StepShell({
  step,
  total,
  title,
  subtitle,
  children,
  onBack,
  onSkip,
  onNext,
  nextLabel = "Continue",
  nextDisabled = false,
  submitting = false,
}: Props) {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-page">
      <header
        className="border-b border-black/5 bg-page/95 backdrop-blur"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="mx-auto flex w-full max-w-xl items-center gap-3 px-4 py-3 sm:px-6">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              aria-label="Back"
              className="grid h-10 w-10 place-items-center rounded-full text-ink-heading hover:bg-card active:scale-95"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          ) : (
            <div className="h-10 w-10" aria-hidden="true" />
          )}
          <div className="flex-1">
            <Progress step={step} total={total} />
          </div>
          <div className="hidden sm:block">
            <Logo />
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col px-4 pt-6 sm:px-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink-heading sm:text-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-sm text-ink-body sm:text-base">{subtitle}</p>
        )}

        <div className="mt-6 flex-1 pb-8">{children}</div>
      </main>

      <div
        className="sticky bottom-0 z-30 border-t border-black/5 bg-page/95 backdrop-blur"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto flex w-full max-w-xl items-center gap-3 px-4 py-3 sm:px-6">
          {onSkip && (
            <button
              type="button"
              onClick={onSkip}
              className="h-12 rounded-input px-4 text-sm font-semibold text-ink-muted hover:text-ink-heading"
            >
              Skip
            </button>
          )}
          <button
            type="button"
            onClick={onNext}
            disabled={nextDisabled || submitting}
            className="ml-auto inline-flex h-12 min-w-[140px] items-center justify-center gap-2 rounded-input bg-primary px-6 text-base font-semibold text-white shadow-sm transition hover:bg-primary-hover active:scale-[0.99] disabled:opacity-60"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {submitting ? "Saving…" : nextLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
