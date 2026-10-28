import type { Metadata } from "next";

import LoginForm from "@/components/auth/login-form";
import { safeRedirect } from "@/lib/auth/policy";

// Reads `?next=`, so it renders per request rather than at build time.
export const instant = false;

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to Foundry to continue where your idea left off.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const params = await searchParams;
  const next = safeRedirect(typeof params.next === "string" ? params.next : null);
  return <LoginForm next={next} />;
}
