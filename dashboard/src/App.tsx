import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { ProfileProvider } from "@/contexts/ProfileContext";
import { AppShell } from "@/components/AppShell";
import { Home } from "@/pages/Home";
import { Settings } from "@/pages/Settings";
import { Profile } from "@/pages/Profile";
import { Links } from "@/pages/Links";
import { Onboarding } from "@/pages/Onboarding";
import { Admin } from "@/pages/Admin";

function Loading() {
  return (
    <div className="grid min-h-[100dvh] place-items-center bg-page">
      <Loader2 className="h-6 w-6 animate-spin text-primary" aria-label="Loading" />
    </div>
  );
}

export default function App() {
  const { user, loading: userLoading } = useAuth();

  if (userLoading) return <Loading />;
  if (!user) return null; // useAuth redirects to /login

  return (
    <Routes>
      <Route path="/onboarding" element={<OnboardingGate user={user} />} />
      <Route element={<RequireProfile />}>
        <Route element={<AppShell user={user} />}>
          <Route index element={<Home user={user} />} />
          <Route path="links" element={<Links />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings user={user} />} />
          {user.is_admin && <Route path="admin" element={<Admin />} />}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}

function RequireProfile() {
  const { profile, loading, refresh } = useProfile();
  if (loading) return <Loading />;
  if (!profile) return <Navigate to="/onboarding" replace />;
  return (
    <ProfileProvider value={{ profile, refresh }}>
      <Outlet />
    </ProfileProvider>
  );
}

function OnboardingGate({ user }: { user: ReturnType<typeof useAuth>["user"] }) {
  const { profile, loading } = useProfile();
  if (loading) return <Loading />;
  if (profile) return <Navigate to="/" replace />;
  if (!user) return null;
  return <Onboarding user={user} />;
}
