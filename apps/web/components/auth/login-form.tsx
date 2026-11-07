"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { AnimatePresence } from "motion/react";

import { AuthError, describeAuthError } from "@/lib/auth/contract";
import { validateEmail, validatePasswordPresence } from "@/lib/auth/policy";

import {
  AuthEnter,
  AuthFoot,
  AuthHeading,
  AuthLink,
  AuthServiceNotice,
} from "./auth-frame";
import { TextField, PasswordField } from "./fields";
import { Alert, SubmitButton } from "./feedback";

export default function LoginForm({ next }: { next: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [attempted, setAttempted] = useState(false);
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<{
    tone: "error" | "info";
    text: string;
  } | null>(null);

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

      <form
        noValidate
        onSubmit={onSubmit}
        className="mt-8 space-y-5"
        aria-describedby="login-status"
      >
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
            {feedback ? (
              <Alert tone={feedback.tone}>{feedback.text}</Alert>
            ) : null}
          </AnimatePresence>
        </div>

        <SubmitButton pending={pending} pendingLabel="Signing in…">
          Sign in
        </SubmitButton>
      </form>

      <AuthFoot>
        <span>
          New to Foundry?{" "}
          <AuthLink href="/register" emphasis>
            Create an account
          </AuthLink>
        </span>
        <AuthLink href="/verify-email">Verify an email</AuthLink>
      </AuthFoot>

      <AuthServiceNotice />
    </AuthEnter>
  );
}
