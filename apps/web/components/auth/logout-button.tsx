"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { authClient } from "@/lib/auth/client";

export default function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onSignOut() {
    setPending(true);
    try {
      await authClient.signOut();
    } catch {
      // Best effort: leave the workspace even if the API call fails.
    } finally {
      router.replace("/login");
    }
  }

  return (
    <button
      type="button"
      onClick={onSignOut}
      disabled={pending}
      className="flex h-8 items-center gap-2 border border-line px-2.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-faint transition-colors hover:border-accent/60 hover:text-accent disabled:opacity-60"
    >
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}
