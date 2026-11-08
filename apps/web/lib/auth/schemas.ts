import { z } from "zod";

export const EMAIL_MAX_LENGTH = 254;
export const PASSWORD_MIN_LENGTH = 10;
export const PASSWORD_MAX_LENGTH = 128;
export const CODE_LENGTH = 6;

const emailField = z
  .string()
  .min(1, "Email is required.")
  .max(EMAIL_MAX_LENGTH, "Email is too long.")
  .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email address.");

const newPasswordField = z
  .string()
  .min(1, "Password is required.")
  .min(
    PASSWORD_MIN_LENGTH,
    `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`,
  )
  .max(PASSWORD_MAX_LENGTH, "Password is too long.")
  .regex(
    /(?=.*[A-Za-z])(?=.*\d)/,
    "Password must include at least one letter and one number.",
  );

const passwordPresenceField = z.string().min(1, "Password is required.");

export const loginSchema = z.object({
  email: emailField,
  password: passwordPresenceField,
});

export const registerSchema = z
  .object({
    email: emailField,
    password: newPasswordField,
    confirmation: z.string().min(1, "Please confirm your password."),
    accepted: z.literal(true, { message: "You must accept the terms." }),
  })
  .refine((d) => d.password === d.confirmation, {
    message: "Passwords do not match.",
    path: ["confirmation"],
  });

export const forgotSchema = z.object({
  email: emailField,
});

export const resetSchema = z
  .object({
    password: newPasswordField,
    confirmation: z.string().min(1, "Please confirm your password."),
  })
  .refine((d) => d.password === d.confirmation, {
    message: "Passwords do not match.",
    path: ["confirmation"],
  });

export const verifySchema = z.object({
  email: emailField,
  code: z
    .string()
    .length(CODE_LENGTH, `Code must be ${CODE_LENGTH} digits.`)
    .regex(/^\d+$/, "Code must contain only digits."),
});

export type LoginFields = z.infer<typeof loginSchema>;
export type RegisterFields = z.infer<typeof registerSchema>;
export type ForgotFields = z.infer<typeof forgotSchema>;
export type ResetFields = z.infer<typeof resetSchema>;
export type VerifyFields = z.infer<typeof verifySchema>;

export function safeRedirect(target: string | null | undefined): string {
  if (!target || !target.startsWith("/")) return "/";
  if (target.startsWith("/login") || target.startsWith("/register")) return "/";
  return target;
}
