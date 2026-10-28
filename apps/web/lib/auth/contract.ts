/**
 * The wire contract the auth UI expects from the Foundry REST API.
 *
 * Nothing here is implemented server-side yet: `apps/api` exposes `GET /` only.
 * Keeping the shapes in one file means the forms, the adapter and — later — the
 * NestJS controllers can be checked against a single definition.
 */

export type AuthErrorCode =
  | "not_configured"
  | "invalid_credentials"
  | "email_taken"
  | "weak_password"
  | "invalid_code"
  | "code_expired"
  | "invalid_token"
  | "rate_limited"
  | "network"
  | "server"
  | "unknown";

export class AuthError extends Error {
  readonly code: AuthErrorCode;
  /** Seconds to wait, present for `rate_limited`. */
  readonly retryAfter?: number;

  constructor(code: AuthErrorCode, options?: { retryAfter?: number; message?: string }) {
    super(options?.message ?? code);
    this.name = "AuthError";
    this.code = code;
    this.retryAfter = options?.retryAfter;
  }
}

export type SignInInput = { email: string; password: string };
export type SignUpInput = { email: string; password: string };
export type VerifyEmailInput = { email: string; code: string };
export type ResetPasswordInput = { token: string; password: string };
export type RequestResetInput = { email: string };

export type Session = { userId: string; email: string };

export type ResendResult = { retryAfterSeconds?: number };

/**
 * User-facing copy per error code. Deliberately non-specific where a specific
 * answer would reveal whether an account exists.
 */
export function describeAuthError(
  code: AuthErrorCode,
  options?: { retryAfter?: number; action?: "sign-in" | "reset" | "verify" },
): string {
  const retry = options?.retryAfter;
  switch (code) {
    case "invalid_credentials":
      return "That email and password don't match an account.";
    case "email_taken":
      return "An account with that email already exists. Try signing in instead.";
    case "weak_password":
      return "That password doesn't meet the requirements below.";
    case "invalid_code":
      return "That code isn't right. Check the six digits and try again.";
    case "code_expired":
      return "That code has expired. Request a new one.";
    case "invalid_token":
      return options?.action === "reset"
        ? "This reset link is invalid or has expired. Request a new one."
        : "This link is invalid or has expired.";
    case "rate_limited":
      return retry
        ? `Too many attempts. Try again in ${retry}s.`
        : "Too many attempts. Try again in a moment.";
    case "network":
      return "Couldn't reach the server. Check your connection and try again.";
    case "server":
      return "The server hit a problem. Try again in a moment.";
    case "not_configured":
      return "Authentication isn't connected in this build, so nothing was sent.";
    default:
      return "Something went wrong. Try again.";
  }
}

/** Codes that mean "this needs a new request", not "you typed it wrong". */
export function isExpiredOrUsed(code: AuthErrorCode): boolean {
  return code === "code_expired" || code === "invalid_token";
}
