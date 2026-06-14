import { useEffect, useState } from "react";
import { getMe, LANDING_URL, type Me } from "@/api/client";

type State = { user: Me | null; loading: boolean };

export function useAuth(redirectIfUnauthed = true): State {
  const [state, setState] = useState<State>({ user: null, loading: true });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const me = await getMe();
        if (cancelled) return;
        if (!me) {
          if (redirectIfUnauthed) {
            window.location.href = `${LANDING_URL}/login`;
          } else {
            setState({ user: null, loading: false });
          }
          return;
        }
        setState({ user: me, loading: false });
      } catch {
        if (!cancelled) setState({ user: null, loading: false });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [redirectIfUnauthed]);

  return state;
}
