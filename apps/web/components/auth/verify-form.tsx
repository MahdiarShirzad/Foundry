"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { authClient } from "@/lib/auth/client";
import { AuthError, describeAuthError } from "@/lib/auth/contract";
import { CODE_LENGTH, validateEmail } from "@/lib/auth/policy";

import { EASE, AuthEnter, AuthFoot, AuthHeading, AuthLink, AuthServiceNotice } from "./auth-frame";
import CodeInput from "./code-input";
import { TextField } from "./fields";
import { Alert, SubmitButton } from "./feedback";
import { AuthOutcome } from "./outcome";
import { RESEND_COOLDOWN_SECONDS, useCooldown } from "./use-cooldown";

type Feedback = { tone: "error" | "info" | "success"; text: string } | null;

export default function VerifyForm({ initialEmail }: { initialEmail: string }) {
  const reduce = useReducedMotion();
  const [email, setEmail] = useState(initialEmail);
  const [editingEmail, setEditingEmail] = useState(initialEmail.trim().length === 0);
  const [code, setCode] = useState("");
  const [attempted, setAttempted] = useState(false);
  const [pending, setPending] = useState(false);
  const [resending, setResending] = useState(false);
  const [verified, setVerified] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const { remaining, start } = useCooldown();

  const emailError = validateEmail(email);
  const codeError =
    code.length === CODE_LENGTH ? null : `Enter all ${CODE_LENGTH} digits of the code.`;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setAttempted(true);
    setFeedback(null);
    if (emailError || codeError) return;

    setPending(true);
    try {
      await authClient.verifyEmail({ email: email.trim(), code });
      setVerified(true);
    } catch (error) {
      const authError = error instanceof AuthError ? error : new AuthError("unknown");
      setFeedback({
        tone: authError.code === "not_configured" ? "info" : "error",
        text: describeAuthError(authError.code, {
          retryAfter: authError.retryAfter,
          action: "verify",
        }),
      });
      if (authError.code === "rate_limited" && authError.retryAfter) start(authError.retryAfter);
    } finally {
      setPending(false);
    }
  }

  async function resend() {
    if (resending || remaining > 0) return;
    setAttempted(true);
    setFeedback(null);
    if (emailError) {
      setEditingEmail(true);
      return;
    }
    setResending(true);
    try {
      const result = await authClient.resendVerification({ email: email.trim() });
      start(result?.retryAfterSeconds ?? RESEND_COOLDOWN_SECONDS);
      setFeedback({
        tone: "success",
        text: `A new six-digit code is on its way to ${email.trim()}.`,
      });
    } catch (error) {
      const authError = error instanceof AuthError ? error : new AuthError("unknown");
      if (authError.code === "rate_limited" && authError.retryAfter) start(authError.retryAfter);
      setFeedback({
        tone: authError.code === "not_configured" ? "info" : "error",
        text: describeAuthError(authError.code, { retryAfter: authError.retryAfter }),
      });
    } finally {
      setResending(false);
    }
  }

  if (verified) {
    return (
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.3, ease: EASE }}
      >
        <AuthOutcome
          marker="Email verified"
          title="That's the last step"
          primary={{ href: "/login", label: "Sign in to Foundry" }}
          secondary={{ href: "/docs", label: "Browse the documentation" }}
        >
          <p>
            <span className="text-fg">{email.trim()}</span> is confirmed. Sign in to start your
            first cycle — the eight modules are waiting.
          </p>
        </AuthOutcome>
      </motion.div>
    );
  }

  return (
    <AuthEnter>
      <AuthHeading
        marker="Two-step check"
        title="Verify your email"
        description={
          editingEmail
            ? "Enter the address you registered with and the six-digit code we sent to it."
            : `We sent a six-digit code to ${email.trim()}. It stays valid for a short while.`
        }
      />

      <form noValidate onSubmit={onSubmit} className="mt-8 space-y-5" aria-describedby="verify-status">
        {editingEmail ? (
          <TextField
            id="verify-email"
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
            hint={initialEmail ? "Change if you used another address" : undefined}
            disabled={pending}
          />
        ) : (
          <div className="flex items-baseline justify-between gap-3 border border-line bg-panel px-3 py-2.5">
            <span className="min-w-0 truncate text-[13.5px] text-fg">{email.trim()}</span>
            <button
              type="button"
              onClick={() => setEditingEmail(true)}
              className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-faint transition-colors hover:text-accent"
            >
              Change
            </button>
          </div>
        )}

        <CodeInput
          id="verify-code"
          label="Six-digit code"
          value={code}
          onChange={(next) => {
            setCode(next);
            setFeedback(null);
          }}
          length={CODE_LENGTH}
          disabled={pending}
          invalid={attempted && code.length > 0 && code.length < CODE_LENGTH}
        />

        <div id="verify-status">
          <AnimatePresence initial={false}>
            {feedback ? <Alert tone={feedback.tone}>{feedback.text}</Alert> : null}
          </AnimatePresence>
        </div>

        <SubmitButton pending={pending} pendingLabel="Verifying…">
          Verify email
        </SubmitButton>
      </form>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-x-5 gap-y-2 border-t border-line pt-5">
        <button
          type="button"
          onClick={resend}
          disabled={resending || remaining > 0}
          className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-fg transition-colors hover:text-accent disabled:cursor-not-allowed disabled:text-faint disabled:hover:text-faint"
        >
          {resending
            ? "Sending…"
            : remaining > 0
              ? `Resend code in ${remaining}s`
              : "Resend the code"}
        </button>
        <AuthLink href="/register">Use a different address</AuthLink>
      </div>

      <AuthFoot>
        <span>
          Already verified? <AuthLink href="/login" emphasis>Sign in</AuthLink>
        </span>
        <AuthLink href="/forgot-password">Forgot password</AuthLink>
      </AuthFoot>

      <AuthServiceNotice />
    </AuthEnter>
  );
}
