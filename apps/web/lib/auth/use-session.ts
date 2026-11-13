"use client";

import { useEffect, useState } from "react";
import { authClient } from "./client";
import type { Session } from "./contract";

type SessionState =
  | { status: "loading" }
  | { status: "authenticated"; session: Session }
  | { status: "unauthenticated" };

/**
 * Client-side session state.
 *
 * Pass `initialSession` when the server already resolved the session, so the
 * first render matches the server HTML instead of flashing a loading/guest
 * state. The client still re-checks afterwards to pick up refreshed tokens or
 * sign-in/sign-out changes from another tab.
 */
export function useSession(initialSession?: Session | null): SessionState {
  const [state, setState] = useState<SessionState>(() =>
    initialSession === undefined
      ? { status: "loading" }
      : initialSession
        ? { status: "authenticated", session: initialSession }
        : { status: "unauthenticated" },
  );

  useEffect(() => {
    let cancelled = false;

    authClient
      .currentSession()
      .then((session) => {
        if (cancelled) return;
        setState(
          session
            ? { status: "authenticated", session }
            : { status: "unauthenticated" },
        );
      })
      .catch(() => {
        if (!cancelled) setState({ status: "unauthenticated" });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
