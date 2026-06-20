import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createLinksBulk, upsertProfile, type Me } from "@/api/client";
import { assignLinkKinds } from "@/lib/linkKinds";
import { StepUsername } from "@/components/onboarding/StepUsername";
import { StepPhoto } from "@/components/onboarding/StepPhoto";
import { StepInfo } from "@/components/onboarding/StepInfo";
import { StepBio } from "@/components/onboarding/StepBio";
import { StepLinks, type DraftLink } from "@/components/onboarding/StepLinks";

const TOTAL_STEPS = 5;

export function Onboarding({ user }: { user: Me }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState(user.name ?? "");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user.image ?? null);
  const [category, setCategory] = useState("");
  const [bio, setBio] = useState("");
  const [links, setLinks] = useState<DraftLink[]>([]);

  function back() {
    setStep((s) => Math.max(1, s - 1));
  }
  function next() {
    setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  }

  async function finish() {
    setSubmitError(null);
    setSubmitting(true);
    try {
      await upsertProfile({
        username,
        display_name: displayName.trim() || null,
        avatar_url: avatarUrl,
        bio: bio.trim() || null,
        category: category || null,
      });

      if (links.length > 0) {
        const items = assignLinkKinds(links).map((link) => ({
          title: link.title,
          url: link.url,
          kind: link.kind,
          platform: link.platform,
          emoji: link.emoji ?? null,
        }));
        await createLinksBulk(items);
      }

      navigate("/", { replace: true });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  function applyLinktreeProfile(patch: {
    bio?: string | null;
    avatar_url?: string | null;
    display_name?: string | null;
  }) {
    if (patch.bio && !bio.trim()) setBio(patch.bio);
    if (patch.avatar_url && !avatarUrl) setAvatarUrl(patch.avatar_url);
    if (patch.display_name && !displayName.trim()) {
      setDisplayName(patch.display_name);
    }
  }

  switch (step) {
    case 1:
      return (
        <StepUsername
          step={1}
          total={TOTAL_STEPS}
          value={username}
          onChange={setUsername}
          onNext={next}
        />
      );
    case 2:
      return (
        <StepPhoto
          step={2}
          total={TOTAL_STEPS}
          user={user}
          displayName={displayName}
          avatarUrl={avatarUrl}
          onChangeName={setDisplayName}
          onChangeAvatar={setAvatarUrl}
          onBack={back}
          onNext={next}
        />
      );
    case 3:
      return (
        <StepInfo
          step={3}
          total={TOTAL_STEPS}
          category={category}
          onChangeCategory={setCategory}
          onBack={back}
          onSkip={next}
          onNext={next}
        />
      );
    case 4:
      return (
        <StepBio
          step={4}
          total={TOTAL_STEPS}
          bio={bio}
          onChange={setBio}
          onBack={back}
          onSkip={next}
          onNext={next}
        />
      );
    case 5:
    default:
      return (
        <StepLinks
          step={5}
          total={TOTAL_STEPS}
          links={links}
          onChange={setLinks}
          onImportProfile={applyLinktreeProfile}
          onBack={back}
          onSkip={finish}
          onFinish={finish}
          submitting={submitting}
          error={submitError}
        />
      );
  }
}
