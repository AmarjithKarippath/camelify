import type { Me } from "@/api/client";
import { AvatarUpload } from "@/components/AvatarUpload";
import { StepShell } from "./StepShell";

type Props = {
  user: Me;
  displayName: string;
  avatarUrl: string | null;
  onChangeName: (next: string) => void;
  onChangeAvatar: (next: string | null) => void;
  onBack: () => void;
  onNext: () => void;
  step: number;
  total: number;
};

export function StepPhoto({
  user,
  displayName,
  avatarUrl,
  onChangeName,
  onChangeAvatar,
  onBack,
  onNext,
  step,
  total,
}: Props) {
  const initials = (displayName || user.name || user.email)
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "U";

  return (
    <StepShell
      step={step}
      total={total}
      title="How should you appear?"
      subtitle="Your name and photo appear at the top of your bio page."
      onBack={onBack}
      onNext={onNext}
      nextDisabled={displayName.trim().length === 0}
    >
      <AvatarUpload
        currentUrl={avatarUrl}
        fallback={initials}
        size={112}
        onUploaded={onChangeAvatar}
        onRemove={() => onChangeAvatar(null)}
      />

      <div className="mt-8">
        <label
          htmlFor="display-name"
          className="text-sm font-semibold text-ink-heading"
        >
          Display name
        </label>
        <input
          id="display-name"
          type="text"
          value={displayName}
          onChange={(e) => onChangeName(e.target.value)}
          placeholder="Arjun Mehta"
          autoComplete="name"
          className="mt-1.5 h-12 w-full rounded-input border border-black/15 bg-surface px-3 text-base text-ink-heading placeholder:text-ink-muted focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary-soft/40"
        />
        <p className="mt-1.5 text-xs text-ink-muted">
          Shown above your bio. Can be different from your username.
        </p>
      </div>
    </StepShell>
  );
}
