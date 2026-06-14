import { useEffect, useState } from "react";
import { getMyLinks, type Link } from "@/api/client";

type State = { links: Link[]; loading: boolean; error: string | null };

export function useLinks(): State & { refresh: () => void } {
  const [state, setState] = useState<State>({
    links: [],
    loading: true,
    error: null,
  });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const links = await getMyLinks();
        if (cancelled) return;
        setState({ links, loading: false, error: null });
      } catch (err) {
        if (cancelled) return;
        setState({
          links: [],
          loading: false,
          error: err instanceof Error ? err.message : "Failed to load links.",
        });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [version]);

  return { ...state, refresh: () => setVersion((v) => v + 1) };
}
