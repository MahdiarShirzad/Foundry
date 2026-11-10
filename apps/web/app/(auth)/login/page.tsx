import type { Metadata } from "next";

import LoginForm from "@/components/auth/login-form";
import { safeRedirect } from "@/lib/auth/schemas";

// Reads `?next=` for the post-login destination, so it renders per request.
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
  const target = typeof params.next === "string" ? params.next : undefined;
  return <LoginForm next={safeRedirect(target ?? "/dashboard")} />;
}
