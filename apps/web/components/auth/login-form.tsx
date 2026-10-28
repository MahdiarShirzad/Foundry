"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AnimatePresence } from "motion/react";

import { authClient } from "@/lib/auth/client";
import { AuthError, describeAuthError } from "@/lib/auth/contract";
import { validateEmail, validatePasswordPresence } from "@/lib/auth/policy";

import { AuthEnter, AuthFoot, AuthHeading, AuthLink, AuthServiceNotice } from "./auth-frame";
import { TextField, PasswordField } from "./fields";
import { Alert, SubmitButton } from "./feedback";

export default function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [attempted, setAttempted] = useState(false);
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<{ tone: "error" | "info"; text: string } | null>(null);

  const emailError = validateEmail(email);
  const passwordError = validatePasswordPresence(password);
  const invalid = Boolean(emailError || passwordError);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setAttempted(true);
    setFeedback(null);
    if (invalid) return;

    setPending(true);
    try {
      // On success the API sets the session cookie; the client never sees a token.
      await authClient.signIn({ email: email.trim(), password });
      router.replace(next);
    } catch (error) {
      const authError = error instanceof AuthError ? error : new AuthError("unknown");
      setFeedback({
        tone: authError.code === "not_configured" ? "info" : "error",
        text: describeAuthError(authError.code, {
          retryAfter: authError.retryAfter,
          action: "sign-in",
        }),
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthEnter>
      <AuthHeading
        marker="Secure access"
        title="Sign in to Foundry"
        description="Pick the cycle back up — ideas, evidence, roadmap and launch stay in one workspace."
      />

      <form noValidate onSubmit={onSubmit} className="mt-8 space-y-5" aria-describedby="login-status">
        <TextField
          id="login-email"
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

        <div>
          <PasswordField
            id="login-password"
            label="Password"
            autoComplete="current-password"
            value={password}
            onChange={(value) => {
              setPassword(value);
              setFeedback(null);
            }}
            error={attempted ? passwordError : null}
            disabled={pending}
          />
          <div className="mt-2 text-right">
            <Link
              href="/forgot-password"
              className="text-[12.5px] text-faint underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        <div id="login-status">
          <AnimatePresence initial={false}>
            {feedback ? <Alert tone={feedback.tone}>{feedback.text}</Alert> : null}
          </AnimatePresence>
        </div>

        <SubmitButton pending={pending} pendingLabel="Signing in…">
          Sign in
        </SubmitButton>
      </form>

      <AuthFoot>
        <span>
          New to Foundry? <AuthLink href="/register" emphasis>Create an account</AuthLink>
        </span>
        <AuthLink href="/verify-email">Verify an email</AuthLink>
      </AuthFoot>

      <AuthServiceNotice />
    </AuthEnter>
  );
}
