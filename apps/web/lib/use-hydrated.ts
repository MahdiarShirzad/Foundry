"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * False during SSR and the hydration render, true once the client owns the
 * tree. Use it to gate values that only exist in the browser so the first
 * client render matches the server HTML.
 */
export function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
