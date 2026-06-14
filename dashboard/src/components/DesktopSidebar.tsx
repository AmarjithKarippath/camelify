import { NavLink } from "react-router-dom";
import {
  Home,
  Link2,
  User,
  Settings,
  ShieldCheck,
  MessageSquare,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "./Logo";

type Item = { to: string; label: string; icon: LucideIcon; end?: boolean };

const baseItems: Item[] = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/links", label: "Links", icon: Link2 },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/feedback", label: "Feedback", icon: MessageSquare },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function DesktopSidebar({ isAdmin = false }: { isAdmin?: boolean }) {
  const items: Item[] = isAdmin
    ? [...baseItems, { to: "/admin", label: "Admin", icon: ShieldCheck }]
    : baseItems;

  return (
    <aside className="hidden md:flex md:w-60 md:shrink-0 md:flex-col md:border-r md:border-black/10 md:bg-surface">
      <div className="px-5 py-5">
        <Logo />
      </div>
      <nav aria-label="Primary" className="flex-1 px-3 py-2">
        <ul className="space-y-1">
          {items.map((it) => (
            <li key={it.to}>
              <NavLink
                to={it.to}
                end={it.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-input px-3 py-2.5 text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-primary-soft/60 text-ink-heading"
                      : "text-ink-body hover:bg-card/60 hover:text-ink-heading"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <it.icon
                      className="h-5 w-5"
                      strokeWidth={isActive ? 2.5 : 2}
                      aria-hidden="true"
                    />
                    {it.label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
