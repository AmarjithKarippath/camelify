"use client";

import { useEffect, useState } from "react";

/** Default (resting) size after scroll — matches the original h-24. */
const AVATAR_MIN = 96;
/** Hero size at the top of the page. */
const AVATAR_MAX = 120;
/** How far the user scrolls before the avatar reaches resting size. */
const SCROLL_RANGE = 110;

type Props = {
  avatarUrl: string | null;
  displayName: string;
  username: string;
  initials: string;
};

export function StorefrontAvatar({
  avatarUrl,
  displayName,
  username,
  initials,
}: Props) {
  const [size, setSize] = useState(AVATAR_MAX);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => {
      if (media.matches) {
        setSize(AVATAR_MAX);
        return;
      }
      const progress = Math.min(1, Math.max(0, window.scrollY / SCROLL_RANGE));
      setSize(AVATAR_MAX - progress * (AVATAR_MAX - AVATAR_MIN));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    media.addEventListener("change", update);
    return () => {
      window.removeEventListener("scroll", update);
      media.removeEventListener("change", update);
    };
  }, []);

  const label = displayName ?? username;
  const overlap = size / 2;
  const initialsSize =
    size >= 112 ? "text-3xl" : size >= 104 ? "text-2xl" : "text-xl";

  return (
    <div
      className="relative motion-safe:animate-storefront-scale-in will-change-[width,height,margin]"
      style={{
        animationDelay: "120ms",
        width: size,
        height: size,
        marginTop: -overlap,
      }}
    >
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatarUrl}
          alt={`Profile photo of ${label}`}
          width={AVATAR_MAX}
          height={AVATAR_MAX}
          loading="eager"
          decoding="async"
          className="h-full w-full rounded-full object-cover shadow-md ring-4 ring-surface"
        />
      ) : (
        <div
          aria-hidden="true"
          className={`grid h-full w-full place-items-center rounded-full bg-gradient-to-br from-primary to-info font-extrabold text-white shadow-md ring-4 ring-surface ${initialsSize}`}
        >
          {initials || "U"}
        </div>
      )}
    </div>
  );
}
