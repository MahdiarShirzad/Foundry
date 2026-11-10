import { Session } from "./contract";
import { api, ApiError } from "../apiClient";
import {
  AuthError,
  AuthErrorCode,
  RequestResetInput,
  ResendResult,
  ResetPasswordInput,
  SignInInput,
  SignUpInput,
  VerifyEmailInput,
} from "./contract";

export const isAuthConfigured =
  (process.env.NEXT_PUBLIC_API_URL ?? "").length > 0;

/**
 * The API returns both a status and a `code`. Codes are more specific than the
 * status (several distinct 4xx bodies share one status), so they win when
 * present and the status is only a fallback.
 */
const API_CODE_MAP: Record<string, AuthErrorCode> = {
  EMAIL_INVALID: "email_invalid",
  EMAIL_TAKEN: "email_taken",
  EMAIL_NOT_VERIFIED: "email_not_verified",
  INVALID_CODE: "invalid_code",
  CODE_EXPIRED: "code_expired",
  INVALID_TOKEN: "invalid_token",
  TOO_MANY_REQUESTS: "rate_limited",
};

function toAuthError(err: unknown): never {
  if (err instanceof ApiError) {
    const mapped = err.code ? API_CODE_MAP[err.code] : undefined;
    if (mapped) {
      throw new AuthError(mapped);
    }

    switch (err.status) {
      case 401:
        throw new AuthError("invalid_credentials");
      case 403:
        throw new AuthError("email_not_verified");
      case 409:
        throw new AuthError("email_taken");
      case 410:
        throw new AuthError("code_expired");
      case 422:
        throw new AuthError("weak_password");
      case 429:
        throw new AuthError("rate_limited");
      default:
        throw new AuthError("server");
    }
  }
  if (err instanceof TypeError) {
    throw new AuthError("network");
  }
  throw new AuthError("unknown");
}

async function call<T>(fn: () => Promise<T>): Promise<T> {
  if (!isAuthConfigured) {
    throw new AuthError("not_configured");
  }
  try {
    return await fn();
  } catch (err) {
    if (err instanceof AuthError) {
      throw err;
    }
    throw toAuthError(err);
  }
}

export const authClient = {
  signIn: (input: SignInInput) =>
    call(() => api.post<Session>("/auth/login", input)),

  signUp: (input: SignUpInput) =>
    call(() => api.post<null>("/auth/register", input)),

  signOut: () => call(() => api.post<void>("/auth/logout")),

  currentSession: () => call(() => api.get<Session | null>("/auth/session")),

  verifyEmail: (input: VerifyEmailInput) =>
    call(() => api.post<{ verified: boolean }>("/auth/email/verify", input)),

  resendVerification: (input: { email: string }) =>
    call(() => api.post<ResendResult>("/auth/email/resend", input)),

  requestPasswordReset: (input: RequestResetInput) =>
    call(() => api.post<void>("/auth/password/forgot", input)),

  resetPassword: (input: ResetPasswordInput) =>
    call(() => api.post<void>("/auth/password/reset", input)),
};
