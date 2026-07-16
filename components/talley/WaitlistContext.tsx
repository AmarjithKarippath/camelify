"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { WaitlistModal } from "./WaitlistModal";

type WaitlistContextValue = {
  openWaitlist: (source?: string) => void;
  closeWaitlist: () => void;
};

const WaitlistContext = createContext<WaitlistContextValue | null>(null);

export function WaitlistProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [source, setSource] = useState("landing");

  const openWaitlist = useCallback((nextSource = "landing") => {
    setSource(nextSource);
    setOpen(true);
  }, []);

  const closeWaitlist = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ openWaitlist, closeWaitlist }),
    [openWaitlist, closeWaitlist]
  );

  return (
    <WaitlistContext.Provider value={value}>
      {children}
      <WaitlistModal open={open} source={source} onClose={closeWaitlist} />
    </WaitlistContext.Provider>
  );
}

export function useWaitlist() {
  const ctx = useContext(WaitlistContext);
  if (!ctx) throw new Error("useWaitlist must be used within WaitlistProvider");
  return ctx;
}

/** Auto-open waitlist when ?try=1 or on /login / /signup routes */
export function WaitlistAutoOpen({ trigger }: { trigger?: boolean }) {
  const { openWaitlist } = useWaitlist();

  useEffect(() => {
    if (trigger) openWaitlist("direct_link");
  }, [trigger, openWaitlist]);

  return null;
}
