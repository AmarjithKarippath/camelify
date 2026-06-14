import { useEffect, useState } from "react";
import { getMyProfile, type Profile } from "@/api/client";

type State = { profile: Profile | null; loading: boolean; error: string | null };

export function useProfile(): State & { refresh: () => void } {
  const [state, setState] = useState<State>({
    profile: null,
    loading: true,
    error: null,
  });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const profile = await getMyProfile();
        if (cancelled) return;
        setState({ profile, loading: false, error: null });
      } catch (err) {
        if (cancelled) return;
        setState({
          profile: null,
          loading: false,
          error: err instanceof Error ? err.message : "Failed to load profile.",
        });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [version]);

  return { ...state, refresh: () => setVersion((v) => v + 1) };
}
