import { CATEGORIES } from "@/lib/categories";
import { StepShell } from "./StepShell";

type Props = {
  dob: string;
  category: string;
  onChangeDob: (next: string) => void;
  onChangeCategory: (next: string) => void;
  onBack: () => void;
  onSkip: () => void;
  onNext: () => void;
  step: number;
  total: number;
};

export function StepInfo({
  dob,
  category,
  onChangeDob,
  onChangeCategory,
  onBack,
  onSkip,
  onNext,
  step,
  total,
}: Props) {
  const today = new Date().toISOString().slice(0, 10);

  return (
    <StepShell
      step={step}
      total={total}
      title="Tell us about you"
      subtitle="Helps us recommend partners and templates. Optional."
      onBack={onBack}
      onSkip={onSkip}
      onNext={onNext}
    >
      <div>
        <label htmlFor="dob" className="text-sm font-semibold text-ink-heading">
          Date of birth
        </label>
        <input
          id="dob"
          type="date"
          value={dob}
          max={today}
          onChange={(e) => onChangeDob(e.target.value)}
          className="mt-1.5 h-12 w-full rounded-input border border-black/15 bg-surface px-3 text-base text-ink-heading focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary-soft/40"
        />
        <p className="mt-1.5 text-xs text-ink-muted">Never shown publicly.</p>
      </div>

      <div className="mt-6">
        <p className="text-sm font-semibold text-ink-heading">
          Pick your main category
        </p>
        <p className="mt-1 text-xs text-ink-muted">
          Choose the one that fits best — you can always change it.
        </p>

        <div
          role="radiogroup"
          aria-label="Category"
          className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3"
        >
          {CATEGORIES.map((c) => {
            const selected = category === c.id;
            return (
              <button
                key={c.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onChangeCategory(c.id)}
                className={`flex min-h-[64px] items-center gap-2.5 rounded-input border px-3 py-2 text-left text-sm font-semibold transition active:scale-[0.99] ${
                  selected
                    ? "border-primary bg-primary-soft/40 text-ink-heading"
                    : "border-black/10 bg-surface text-ink-body hover:border-black/20"
                }`}
              >
                <span aria-hidden="true" className="text-lg">
                  {c.emoji}
                </span>
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </StepShell>
  );
}
