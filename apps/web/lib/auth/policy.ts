/**
 * Client-side credential rules.
 *
 * The API in `apps/api` has no auth module yet, so there is no server policy to
 * mirror. These constants are the single source of truth used by the forms and
 * their guidance copy; when the backend lands, change them here and the whole
 * UI follows.
 */

export const EMAIL_MAX_LENGTH = 254;
export const PASSWORD_MIN_LENGTH = 10;
export const PASSWORD_MAX_LENGTH = 128;

/** 6-digit email verification code — see `lib/auth/client.ts` for the contract. */
export const CODE_LENGTH = 6;

export type FieldError = string | null;

export function validateEmail(value: string): FieldError {
  const email = value.trim();
  if (!email) return "Enter your email address.";
  if (email.length > EMAIL_MAX_LENGTH) return "That email address is too long.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return "Enter a complete address, like you@studio.com.";
  }
  return null;
}

/** Login only checks presence: an existing password may predate the policy. */
export function validatePasswordPresence(value: string): FieldError {
  if (!value) return "Enter your password.";
  return null;
}

export function validateNewPassword(value: string): FieldError {
  if (!value) return "Choose a password.";
  if (value.length < PASSWORD_MIN_LENGTH) {
    return `Use at least ${PASSWORD_MIN_LENGTH} characters.`;
  }
  if (value.length > PASSWORD_MAX_LENGTH) {
    return `Use ${PASSWORD_MAX_LENGTH} characters or fewer.`;
  }
  if (!/[a-zA-Z]/.test(value)) return "Include at least one letter.";
  if (!/\d/.test(value)) return "Include at least one number.";
  return null;
}

export function validateConfirmation(
  password: string,
  confirmation: string,
): FieldError {
  if (!confirmation) return "Re-enter your password.";
  if (password !== confirmation) return "Those passwords don't match yet.";
  return null;
}

/** Rules shown next to password fields. */
export const PASSWORD_RULES = [
  `At least ${PASSWORD_MIN_LENGTH} characters`,
  "At least one letter",
  "At least one number",
] as const;

/** Rough strength signal for the meter — guidance, never a gate. */
export function passwordStrength(value: string): 0 | 1 | 2 | 3 {
  if (!value) return 0;
  let score = 0;
  if (value.length >= PASSWORD_MIN_LENGTH) score++;
  if (value.length >= 16) score++;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
  if (/\d/.test(value) && /[^A-Za-z0-9]/.test(value)) score++;
  return Math.min(score, 3) as 0 | 1 | 2 | 3;
}

/** Only same-origin relative paths are safe redirect targets. */
export function safeRedirect(target: string | null | undefined, fallback = "/"): string {
  if (!target) return fallback;
  if (!target.startsWith("/") || target.startsWith("//")) return fallback;
  if (target.startsWith("/login") || target.startsWith("/register")) return fallback;
  return target;
}
