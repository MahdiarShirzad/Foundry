import { NextResponse, NextRequest } from "next/server";

const BACKEND_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const SESSION_URL = `${BACKEND_BASE}/auth/session`;
const REFRESH_URL = `${BACKEND_BASE}/auth/refresh`;

const PROTECTED = ["/dashboard"];
const AUTH_PAGES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
  ],
};

type Session = { userId: string; email?: string };

async function getSession(cookie: string): Promise<Session | null> {
  try {
    const res = await fetch(SESSION_URL, {
      method: "GET",
      headers: { cookie },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json().catch(() => null);
    return data?.userId ? data : null;
  } catch {
    return null;
  }
}

function readSetCookies(res: Response): string[] {
  const headers = res.headers as Headers & { getSetCookie?: () => string[] };
  if (typeof headers.getSetCookie === "function") return headers.getSetCookie();
  const combined = res.headers.get("set-cookie");
  return combined ? [combined] : [];
}

/**
 * The access token lives 15 minutes, the refresh token 30 days. Without this,
 * every user is thrown back to /login mid-session the moment the short token
 * lapses. Rotating here also hands the browser a fresh access token before the
 * page renders.
 */
async function refreshTokens(cookie: string) {
  try {
    const res = await fetch(REFRESH_URL, {
      method: "POST",
      headers: { cookie },
      cache: "no-store",
    });
    return {
      ok: res.ok,
      rejected: res.status === 401,
      cookies: readSetCookies(res),
    };
  } catch {
    return { ok: false, rejected: false, cookies: [] };
  }
}

/**
 * A 401 means the session is gone (expired, revoked, or reused), so drop the
 * dead cookies instead of replaying them on every navigation.
 */
function respond(
  res: NextResponse,
  issued: string[],
  rejected: boolean,
): NextResponse {
  for (const value of issued) res.headers.append("set-cookie", value);

  if (rejected) {
    // Appended as raw headers: the cookie helper keys entries by name and would
    // drop one of the two refresh_token paths.
    const expiries = [
      "access_token=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax",
      "refresh_token=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax",
      // Cookie written by earlier builds, scoped to the refresh endpoint.
      "refresh_token=; Path=/auth; Max-Age=0; HttpOnly; SameSite=Lax",
    ];
    for (const value of expiries) res.headers.append("set-cookie", value);
  }

  return res;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookie = request.headers.get("cookie") ?? "";

  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  const isAuthPage = AUTH_PAGES.some((p) => pathname.startsWith(p));

  if (!isProtected && !isAuthPage) return NextResponse.next();

  const session = await getSession(cookie);

  let authenticated = session !== null;
  let issued: string[] = [];
  let rejected = false;

  if (!authenticated && /(?:^|;\s*)refresh_token=/.test(cookie)) {
    const refreshed = await refreshTokens(cookie);
    authenticated = refreshed.ok;
    issued = refreshed.cookies;
    rejected = refreshed.rejected;
  }

  if (isProtected && !authenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname + request.nextUrl.search);
    return respond(NextResponse.redirect(loginUrl), issued, rejected);
  }

  if (isAuthPage && authenticated) {
    return respond(
      NextResponse.redirect(new URL("/dashboard", request.url)),
      issued,
      rejected,
    );
  }

  return respond(NextResponse.next(), issued, rejected);
}
