"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { authClient } from "@/lib/auth/client";
import { AuthError, describeAuthError } from "@/lib/auth/contract";
import { validateConfirmation, validateNewPassword } from "@/lib/auth/policy";

import { EASE, AuthEnter, AuthFoot, AuthHeading, AuthLink, AuthServiceNotice } from "./auth-frame";
import { PasswordField } from "./fields";
import { Alert, SubmitButton } from "./feedback";
import { AuthOutcome } from "./outcome";

type Terminal = { state: "invalid"; message: string } | { state: "done" } | null;

export default function ResetForm({ token }: { token: string }) {
  const reduce = useReducedMotion();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [attempted, setAttempted] = useState(false);
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<{ tone: "error" | "info"; text: string } | null>(null);
  const [terminal, setTerminal] = useState<Terminal>(null);

  const passwordError = validateNewPassword(password);
  const confirmationError = validateConfirmation(password, confirmation);
  const invalid = Boolean(passwordError || confirmationError);

  // A link without a token is not a valid reset link — say so instead of
  // rendering a form that could never succeed.
  const missingToken = token.trim().length === 0;
  if (missingToken && !terminal) {
    return (
      <AuthOutcome
        marker="Link not valid"
        title="This reset link is incomplete"
        primary={{ href: "/forgot-password", label: "Request a new link" }}
        secondary={{ href: "/login", label: "Back to sign in" }}
      >
        <p>
          The link is missing its token, which usually means it was copied partially or opened from
          a chat preview. Request a fresh link and use it in this browser.
        </p>
      </AuthOutcome>
    );
  }

  if (terminal?.state === "done") {
    return (
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.3, ease: EASE }}
      >
        <AuthOutcome
          marker="Password updated"
          title="You're back in"
          primary={{ href: "/login", label: "Sign in with the new password" }}
        >
          <p>
            Your password has been changed and the reset link is no longer valid. Any other open
            sessions keep their own credentials — sign in again on each device.
          </p>
        </AuthOutcome>
      </motion.div>
    );
  }

  if (terminal?.state === "invalid") {
    return (
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.3, ease: EASE }}
      >
        <AuthOutcome
          marker="Link expired"
          title="This link can't be used"
          primary={{ href: "/forgot-password", label: "Request a new link" }}
          secondary={{ href: "/login", label: "Back to sign in" }}
        >
          <p>{terminal.message}</p>
        </AuthOutcome>
      </motion.div>
    );
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setAttempted(true);
    setFeedback(null);
    if (invalid) return;

    setPending(true);
    try {
      await authClient.resetPassword({ token: token.trim(), password });
      setTerminal({ state: "done" });
    } catch (error) {
      const authError = error instanceof AuthError ? error : new AuthError("unknown");
      if (authError.code === "invalid_token") {
        setTerminal({
          state: "invalid",
          message: describeAuthError(authError.code, { action: "reset" }),
        });
        return;
      }
      setFeedback({
        tone: authError.code === "not_configured" ? "info" : "error",
        text: describeAuthError(authError.code, {
          retryAfter: authError.retryAfter,
          action: "reset",
        }),
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthEnter>
      <AuthHeading
        marker="New credentials"
        title="Set a new password"
        description="Choose something you don't use elsewhere. This link stops working once the password changes."
      />

      <form noValidate onSubmit={onSubmit} className="mt-8 space-y-5" aria-describedby="reset-status">
        <PasswordField
          id="reset-password"
          label="New password"
          autoComplete="new-password"
          value={password}
          onChange={(value) => {
            setPassword(value);
            setFeedback(null);
          }}
          error={attempted ? passwordError : null}
          showRules
          disabled={pending}
          autoFocus
        />

        <PasswordField
          id="reset-confirm"
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

        <div id="reset-status">
          <AnimatePresence initial={false}>
            {feedback ? <Alert tone={feedback.tone}>{feedback.text}</Alert> : null}
          </AnimatePresence>
        </div>

        <SubmitButton pending={pending} pendingLabel="Updating password…">
          Update password
        </SubmitButton>
      </form>

      <AuthFoot>
        <AuthLink href="/login">Back to sign in</AuthLink>
        <AuthLink href="/forgot-password">Request a new link</AuthLink>
      </AuthFoot>

      <AuthServiceNotice />
    </AuthEnter>
  );
}
