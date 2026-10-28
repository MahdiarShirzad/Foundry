import { AuthError, type AuthErrorCode, type ResendResult, type Session } from "./contract";

/**
 * The only place the browser talks auth.
 *
 * There is no auth API in this repository yet (`apps/api` serves `GET /`), so
 * with no `NEXT_PUBLIC_API_URL` configured every call rejects immediately with
 * `not_configured` — the UI reports that honestly instead of simulating a
 * signed-in user, a stored account, or a sent email. Point the variable at a
 * real deployment and these same calls become live: no component changes.
 *
 * Passwords are passed straight to `fetch` and never persisted; there is no
 * token in localStorage or any other browser storage.
 */

const BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

export const isAuthConfigured = BASE_URL.length > 0;

/** Planned endpoints — the roadmap in the repository README (Auth & Users). */
const ROUTES = {
  signIn: "/auth/login",
  signUp: "/auth/register",
  signOut: "/auth/logout",
  session: "/auth/session",
  requestReset: "/auth/password/forgot",
  resetPassword: "/auth/password/reset",
  verifyEmail: "/auth/email/verify",
  resendVerification: "/auth/email/resend",
} as const;

const TIMEOUT_MS = 12_000;

type RequestOptions = {
  method?: "GET" | "POST";
  body?: unknown;
  /** Endpoint hint used to translate a bare 401 into the right copy. */
  action?: "sign-in" | "reset" | "verify";
};

function codeFromStatus(status: number, body: unknown): AuthErrorCode {
  const reported = (body as { code?: string } | null)?.code;
  switch (reported) {
    case "EMAIL_TAKEN":
      return "email_taken";
    case "WEAK_PASSWORD":
      return "weak_password";
    case "INVALID_CODE":
      return "invalid_code";
    case "CODE_EXPIRED":
      return "code_expired";
    case "INVALID_TOKEN":
      return "invalid_token";
    case "RATE_LIMITED":
      return "rate_limited";
  }
  if (status === 409) return "email_taken";
  if (status === 410) return "code_expired";
  if (status === 422) return "weak_password";
  if (status === 429) return "rate_limited";
  if (status === 401) return "invalid_credentials";
  if (status === 403) return "invalid_token";
  if (status >= 500) return "server";
  return "unknown";
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (!isAuthConfigured) throw new AuthError("not_configured");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method: options.method ?? "POST",
      headers: options.body ? { "content-type": "application/json" } : undefined,
      body: options.body ? JSON.stringify(options.body) : undefined,
      credentials: "include",
      cache: "no-store",
      signal: controller.signal,
    });
  } catch {
    throw new AuthError("network");
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const retryAfter = Number(response.headers.get("retry-after"));
    throw new AuthError(codeFromStatus(response.status, body), {
      retryAfter: Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter : undefined,
    });
  }

  if (response.status === 204) return undefined as T;
  return (await response.json().catch(() => null)) as T;
}

export const authClient = {
  isConfigured: isAuthConfigured,

  signIn(input: { email: string; password: string }): Promise<Session> {
    return request<Session>(ROUTES.signIn, { body: input, action: "sign-in" });
  },

  signUp(input: { email: string; password: string }): Promise<Session | null> {
    return request<Session | null>(ROUTES.signUp, { body: input });
  },

  signOut(): Promise<void> {
    return request<void>(ROUTES.signOut);
  },

  currentSession(): Promise<Session | null> {
    return request<Session | null>(ROUTES.session, { method: "GET" });
  },

  requestPasswordReset(input: { email: string }): Promise<void> {
    return request<void>(ROUTES.requestReset, { body: input });
  },

  resetPassword(input: { token: string; password: string }): Promise<void> {
    return request<void>(ROUTES.resetPassword, { body: input, action: "reset" });
  },

  verifyEmail(input: { email: string; code: string }): Promise<Session | null> {
    return request<Session | null>(ROUTES.verifyEmail, { body: input, action: "verify" });
  },

  resendVerification(input: { email: string }): Promise<ResendResult> {
    return request<ResendResult>(ROUTES.resendVerification, { body: input });
  },
};
