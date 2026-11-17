"use client";

import { useEffect, useState } from "react";
import { authClient } from "./client";
import { ApiError } from "../apiClient";
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
      .catch((err) => {
        if (cancelled) return;
        // A 401 is definitive: the api client already tried refreshing, so the
        // session is really gone. Show the guest nav.
        if (err instanceof ApiError && err.status === 401) {
          setState({ status: "unauthenticated" });
          return;
        }
        // Anything else (network blip, API restart) is transient. The server
        // already answered "definitely a guest" when it passed `null`, so
        // keep that; otherwise stay loading — flashing a "Sign in" button at
        // a signed-in user is worse than a brief empty nav.
        if (initialSession !== null) return;
        setState({ status: "unauthenticated" });
      });

    return () => {
      cancelled = true;
    };
  }, [initialSession]);

  return state;
}
