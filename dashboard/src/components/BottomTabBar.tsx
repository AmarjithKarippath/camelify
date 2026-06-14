import { NavLink } from "react-router-dom";
import {
  Home,
  Link2,
  User,
  Settings,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

type Tab = { to: string; label: string; icon: LucideIcon; end?: boolean };

const baseTabs: Tab[] = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/links", label: "Links", icon: Link2 },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function BottomTabBar({ isAdmin = false }: { isAdmin?: boolean }) {
  const tabs: Tab[] = isAdmin
    ? [...baseTabs, { to: "/admin", label: "Admin", icon: ShieldCheck }]
    : baseTabs;

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-surface/95 backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around">
        {tabs.map((t) => (
          <li key={t.to} className="flex-1">
            <NavLink
              to={t.to}
              end={t.end}
              className={({ isActive }) =>
                `flex min-h-[56px] flex-col items-center justify-center gap-1 py-2 text-[11px] font-semibold transition-colors ${
                  isActive ? "text-primary" : "text-ink-muted hover:text-ink-heading"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <t.icon
                    className="h-5 w-5"
                    strokeWidth={isActive ? 2.5 : 2}
                    aria-hidden="true"
                  />
                  {t.label}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
