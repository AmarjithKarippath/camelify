import type { Me } from "@/api/client";

export function Avatar({ user, size = 40 }: { user: Me; size?: number }) {
  const dim = `${size}px`;
  if (user.image) {
    return (
      <img
        src={user.image}
        alt=""
        width={size}
        height={size}
        style={{ width: dim, height: dim }}
        className="rounded-full object-cover ring-2 ring-card"
      />
    );
  }
  const initial = (user.name?.[0] ?? user.email[0] ?? "?").toUpperCase();
  return (
    <span
      aria-hidden="true"
      style={{ width: dim, height: dim, fontSize: size * 0.4 }}
      className="grid place-items-center rounded-full bg-primary font-bold text-white ring-2 ring-card"
    >
      {initial}
    </span>
  );
}
