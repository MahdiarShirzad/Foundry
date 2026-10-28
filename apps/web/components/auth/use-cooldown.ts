"use client";

import { useCallback, useEffect, useState } from "react";

/** Default wait between verification-code resends (seconds). */
export const RESEND_COOLDOWN_SECONDS = 30;

/**
 * Countdown for "resend" actions. `start` seeds the remaining seconds so the
 * first render after a send is already correct; the interval only ticks it down.
 */
export function useCooldown() {
  const [until, setUntil] = useState(0);
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (!until) return;
    const id = window.setInterval(() => {
      const left = Math.max(0, Math.ceil((until - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0) window.clearInterval(id);
    }, 500);
    return () => window.clearInterval(id);
  }, [until]);

  const start = useCallback((seconds: number) => {
    if (seconds <= 0) {
      setUntil(0);
      setRemaining(0);
      return;
    }
    setUntil(Date.now() + seconds * 1000);
    setRemaining(seconds);
  }, []);

  return { remaining, start };
}
