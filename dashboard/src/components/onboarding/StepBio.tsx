import { StepShell } from "./StepShell";

type Props = {
  bio: string;
  onChange: (next: string) => void;
  onBack: () => void;
  onSkip: () => void;
  onNext: () => void;
  step: number;
  total: number;
};

const MAX = 280;

export function StepBio({ bio, onChange, onBack, onSkip, onNext, step, total }: Props) {
  const remaining = MAX - bio.length;
  const over = remaining < 0;

  return (
    <StepShell
      step={step}
      total={total}
      title="Describe what you do"
      subtitle="One or two sentences. This shows under your name."
      onBack={onBack}
      onSkip={onSkip}
      onNext={onNext}
      nextDisabled={over}
    >
      <label htmlFor="bio" className="sr-only">
        Bio
      </label>
      <textarea
        id="bio"
        value={bio}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Fitness coach. Helping you build strength at home with simple, sustainable workouts."
        rows={5}
        maxLength={MAX + 40}
        className="w-full resize-y rounded-input border border-black/15 bg-surface px-3 py-3 text-base text-ink-heading placeholder:text-ink-muted focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary-soft/40"
      />
      <p
        className={`mt-2 text-right text-xs ${
          over ? "text-danger" : "text-ink-muted"
        }`}
        aria-live="polite"
      >
        {remaining} characters left
      </p>
    </StepShell>
  );
}
