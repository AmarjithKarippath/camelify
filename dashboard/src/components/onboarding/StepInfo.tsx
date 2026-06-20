import { CATEGORIES } from "@/lib/categories";
import { StepShell } from "./StepShell";

type Props = {
  category: string;
  onChangeCategory: (next: string) => void;
  onBack: () => void;
  onSkip: () => void;
  onNext: () => void;
  step: number;
  total: number;
};

export function StepInfo({
  category,
  onChangeCategory,
  onBack,
  onSkip,
  onNext,
  step,
  total,
}: Props) {
  return (
    <StepShell
      step={step}
      total={total}
      title="Pick your category"
      subtitle="Helps us recommend partners and templates. Optional."
      onBack={onBack}
      onSkip={onSkip}
      onNext={onNext}
    >
      <div>
        <p className="text-sm font-semibold text-ink-heading">
          What best describes you?
        </p>
        <p className="mt-1 text-xs text-ink-muted">
          Choose the one that fits best — you can always change it in Profile.
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