import { Outlet, Link } from "react-router-dom";
import type { Me } from "@/api/client";
import { Logo } from "./Logo";
import { Avatar } from "./Avatar";
import { BottomTabBar } from "./BottomTabBar";
import { DesktopSidebar } from "./DesktopSidebar";

export function AppShell({ user }: { user: Me }) {
  return (
    <div className="flex min-h-[100dvh] bg-page">
      <DesktopSidebar isAdmin={user.is_admin} />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header
          className="sticky top-0 z-30 border-b border-black/5 bg-page/95 backdrop-blur md:hidden"
          style={{ paddingTop: "env(safe-area-inset-top)" }}
        >
          <div className="flex h-14 items-center justify-between px-4">
            <Logo />
            <Link to="/settings" aria-label="Open settings">
              <Avatar user={user} />
            </Link>
          </div>
        </header>

        <main
          className="flex-1 px-4 pt-4 md:px-8 md:pt-6"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 88px)" }}
        >
          <div className="mx-auto w-full max-w-3xl pb-12">
            <Outlet />
          </div>
        </main>

        <BottomTabBar isAdmin={user.is_admin} />
      </div>
    </div>
  );
}
