export type AuthErrorCode =
  | "not_configured"
  | "invalid_credentials"
  | "email_not_verified"
  | "email_taken"
  | "email_invalid"
  | "weak_password"
  | "invalid_code"
  | "code_expired"
  | "invalid_token"
  | "rate_limited"
  | "network"
  | "server"
  | "unknown";

export class AuthError extends Error {
  constructor(public readonly code: AuthErrorCode) {
    super(code);
  }
}

export type Session = { userId: string; email: string };

export type SignInInput = { email: string; password: string };
export type SignUpInput = { email: string; password: string };
export type VerifyEmailInput = { email: string; code: string };
export type ResetPasswordInput = { token: string; password: string };
export type RequestResetInput = { email: string };
export type ResendResult = { retryAfterSeconds?: number };

export function describeAuthError(code: AuthErrorCode): string {
  switch (code) {
    case "not_configured":
      return "Service is not available right now.";
    case "invalid_credentials":
      return "Incorrect email or password.";
    case "email_not_verified":
      return "Please verify your email before signing in.";
    case "email_taken":
      return "An account with this email already exists.";
    case "email_invalid":
      return "This email domain is not valid.";
    case "weak_password":
      return "Password must be at least 10 characters and include a letter and a number.";
    case "invalid_code":
      return "The code you entered is incorrect.";
    case "code_expired":
      return "This code has expired. Please request a new one.";
    case "invalid_token":
      return "This link is invalid or has expired.";
    case "rate_limited":
      return "Too many attempts. Please wait a moment and try again.";
    case "network":
      return "Network error. Please check your connection.";
    case "server":
      return "Something went wrong on our end. Please try again.";
    case "unknown":
      return "An unexpected error occurred. Please try again.";
  }
}
