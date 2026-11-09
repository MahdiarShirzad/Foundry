"use client";

import { useEffect, useState } from "react";
import { authClient } from "./client";
import type { Session } from "./contract";

type SessionState =
  | { status: "loading" }
  | { status: "authenticated"; session: Session }
  | { status: "unauthenticated" };

export function useSession(): SessionState {
  const [state, setState] = useState<SessionState>({ status: "loading" });

  useEffect(() => {
    authClient
      .currentSession()
      .then((session) => {
        if (session) {
          setState({ status: "authenticated", session });
        } else {
          setState({ status: "unauthenticated" });
        }
      })
      .catch(() => setState({ status: "unauthenticated" }));
  }, []);

  return state;
}
