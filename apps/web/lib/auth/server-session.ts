import { cookies } from "next/headers";

import type { Session } from "./contract";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Read the signed-in user for the current request, so server-rendered chrome
 * (like the site nav) knows the auth state on the very first paint.
 *
 * Returns:
 * - a session when the access token is valid,
 * - `null` when the request has no auth cookies (definitely a guest),
 * - `undefined` when auth cookies exist but the API could not confirm them.
 *   That usually means the access token expired; the client re-checks the
 *   session (and refreshes it), so render a loading state instead of a
 *   misleading "Sign in" button.
 *
 * This only reads: a Server Component cannot rotate cookies. The proxy owns
 * refresh rotation for protected routes.
 */
export async function getServerSession(): Promise<
  Session | null | undefined
> {
  const cookieStore = await cookies();
  const cookie = cookieStore.toString();
  if (!cookie) return null;

  const hasAuthCookie =
    cookieStore.has("access_token") || cookieStore.has("refresh_token");

  try {
    const res = await fetch(`${API_BASE_URL}/auth/session`, {
      headers: { cookie },
    });
    if (!res.ok) return hasAuthCookie ? undefined : null;

    const data = (await res.json().catch(() => null)) as Session | null;
    if (data?.userId) return data;

    return hasAuthCookie ? undefined : null;
  } catch {
    return hasAuthCookie ? undefined : null;
  }
}
