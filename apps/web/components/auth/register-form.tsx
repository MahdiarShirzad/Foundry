"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AnimatePresence } from "motion/react";

import { authClient } from "@/lib/auth/client";
import { AuthError, describeAuthError } from "@/lib/auth/contract";
import {
  validateConfirmation,
  validateEmail,
  validateNewPassword,
} from "@/lib/auth/policy";

import { AuthEnter, AuthFoot, AuthHeading, AuthLink, AuthServiceNotice } from "./auth-frame";
import { CheckboxField, PasswordField, TextField } from "./fields";
import { Alert, SubmitButton } from "./feedback";

export default function RegisterForm({ initialEmail }: { initialEmail: string }) {
  const router = useRouter();
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<{ tone: "error" | "info"; text: string } | null>(null);

  const emailError = validateEmail(email);
  const passwordError = validateNewPassword(password);
  const confirmationError = validateConfirmation(password, confirmation);
  const termsError = accepted ? null : "Accept the terms and privacy policy to continue.";
  const invalid = Boolean(emailError || passwordError || confirmationError || termsError);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setAttempted(true);
    setFeedback(null);
    if (invalid) return;

    setPending(true);
    try {
      await authClient.signUp({ email: email.trim(), password });
      // Verification is required before the first sign-in.
      const target = `/verify-email?email=${encodeURIComponent(email.trim())}`;
      router.push(target);
    } catch (error) {
      const authError = error instanceof AuthError ? error : new AuthError("unknown");
      setFeedback({
        tone: authError.code === "not_configured" ? "info" : "error",
        text: describeAuthError(authError.code, { retryAfter: authError.retryAfter }),
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthEnter>
      <AuthHeading
        marker="New account"
        title="Start your first cycle"
        description="One account keeps every stage connected — from the first captured idea to the analytics that send you back with better evidence."
      />

      <form noValidate onSubmit={onSubmit} className="mt-8 space-y-5" aria-describedby="register-status">
        <TextField
          id="register-email"
          label="Email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@studio.com"
          value={email}
          onChange={(value) => {
            setEmail(value);
            setFeedback(null);
          }}
          error={attempted ? emailError : null}
          disabled={pending}
        />

        <PasswordField
          id="register-password"
          label="Password"
          autoComplete="new-password"
          value={password}
          onChange={(value) => {
            setPassword(value);
            setFeedback(null);
          }}
          error={attempted ? passwordError : null}
          showRules
          disabled={pending}
        />

        <PasswordField
          id="register-confirm"
          label="Confirm password"
          autoComplete="new-password"
          value={confirmation}
          onChange={(value) => {
            setConfirmation(value);
            setFeedback(null);
          }}
          error={attempted ? confirmationError : null}
          disabled={pending}
        />

        <CheckboxField
          id="register-terms"
          checked={accepted}
          onChange={(value) => {
            setAccepted(value);
            setFeedback(null);
          }}
          error={attempted ? termsError : null}
        >
          I agree to the{" "}
          <Link href="/terms" className="text-fg underline decoration-line underline-offset-4 hover:decoration-accent">
            terms of service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-fg underline decoration-line underline-offset-4 hover:decoration-accent">
            privacy policy
          </Link>
          .
        </CheckboxField>

        <div id="register-status">
          <AnimatePresence initial={false}>
            {feedback ? <Alert tone={feedback.tone}>{feedback.text}</Alert> : null}
          </AnimatePresence>
        </div>

        <SubmitButton pending={pending} pendingLabel="Creating account…">
          Create account
        </SubmitButton>
      </form>

      <AuthFoot>
        <span>
          Already have an account? <AuthLink href="/login" emphasis>Sign in</AuthLink>
        </span>
        <AuthLink href="/verify-email">Verify an email</AuthLink>
      </AuthFoot>

      <AuthServiceNotice />
    </AuthEnter>
  );
}
