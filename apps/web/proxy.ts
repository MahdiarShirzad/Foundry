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

// Every page request flows through here (static assets excluded), not just
// protected routes: the site nav is rendered by the (site) layout on every
// page, and it needs an unexpired access token to resolve the session on the
// first paint. Without this, a user whose 15-minute access token lapsed saw a
// guest nav on `/` until they happened to cross a proxy-matched route, which
// rotated their tokens for them.
export const config = {
  matcher: [
    "/((?!_next|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|css|js|mjs|map|txt|xml|json|woff2?|ttf|otf|eot|wasm)$).*)",
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
  const rawCookie = request.headers.get("cookie") ?? "";

  const hasAccessToken = /(?:^|;\s*)access_token=/.test(rawCookie);
  const hasRefreshToken = /(?:^|;\s*)refresh_token=/.test(rawCookie);
  const hasAuthCookies = hasAccessToken || hasRefreshToken;

  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  const isAuthPage = AUTH_PAGES.some((p) => pathname.startsWith(p));

  // Guests skip the API entirely — the landing page must stay cheap.
  if (!hasAuthCookies && !isProtected && !isAuthPage) {
    return NextResponse.next();
  }

  let authenticated = false;
  let issued: string[] = [];
  let rejected = false;

  if (hasAccessToken) {
    const session = await getSession(rawCookie);
    authenticated = session !== null;
  }

  // The access token expired (or is absent) but a refresh token exists, so
  // rotate now. This is what keeps a 15-minute token from logging the user
  // out on the site pages, where nothing else refreshes for them.
  if (!authenticated && hasRefreshToken) {
    const refreshed = await refreshTokens(rawCookie);
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

  // Pass the page through, handing rotated tokens to both sides: the browser
  // via Set-Cookie (appended below), and the render happening in this same
  // request via the rewritten request cookies — server components cannot set
  // cookies, but they do read the request when resolving the session.
  if (issued.length > 0) {
    for (const setCookie of issued) {
      const pair = setCookie.split(";")[0] ?? "";
      const at = pair.indexOf("=");
      if (at <= 0) continue;
      const name = pair.slice(0, at).trim();
      const value = pair.slice(at + 1).trim();
      if (value === "") request.cookies.delete(name);
      else request.cookies.set(name, value);
    }
  }
  return respond(
    NextResponse.next({ request: { headers: request.headers } }),
    issued,
    rejected,
  );
}
