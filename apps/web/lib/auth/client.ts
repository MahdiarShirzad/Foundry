import { Session } from "./contract";
import { api, ApiError } from "../apiClient";
import {
  AuthError,
  RequestResetInput,
  ResendResult,
  ResetPasswordInput,
  SignInInput,
  SignUpInput,
  VerifyEmailInput,
} from "./contract";

export const isAuthConfigured =
  (process.env.NEXT_PUBLIC_API_URL ?? "").length > 0;

function toAuthError(err: unknown): never {
  if (err instanceof ApiError) {
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
