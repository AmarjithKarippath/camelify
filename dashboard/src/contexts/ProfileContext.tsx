import { createContext, useContext } from "react";
import type { Profile } from "@/api/client";

type Ctx = {
  profile: Profile;
  refresh: () => void;
};

const ProfileContext = createContext<Ctx | null>(null);

export const ProfileProvider = ProfileContext.Provider;

export function useProfileContext(): Ctx {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error("useProfileContext must be used inside <ProfileProvider />");
  }
  return ctx;
}
