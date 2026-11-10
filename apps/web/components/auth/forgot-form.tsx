"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { EASE, AuthEnter, AuthFoot, AuthHeading, AuthLink, AuthServiceNotice } from "./auth-frame";
import { TextField } from "./fields";
import { Alert } from "./feedback";
import { AuthOutcome } from "./outcome";
import { forgotSchema } from "@/lib/auth/schemas";
import { authClient } from "@/lib/auth/client";
import { AuthError, describeAuthError } from "@/lib/auth/contract";
import { useCooldown } from "@/lib/auth/use-cooldown";

type Feedback = { tone: "error" | "info" | "success"; text: string } | null;

const RESEND_COOLDOWN_SECONDS = 30;

export default function ForgotForm() {
  const reduce = useReducedMotion();
  const form = useForm<z.infer<typeof forgotSchema>>({
    resolver: zodResolver(forgotSchema),
    mode: "onTouched",
    defaultValues: { email: "" },
  });

  const { register, formState: { errors }, watch, handleSubmit, getValues } = form;

  const email = watch("email");

  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const cooldown = useCooldown(RESEND_COOLDOWN_SECONDS);
  const remaining = cooldown.remaining;

  /**
   * The API answers 204 whether or not the address exists, on purpose, so the
   * caller never learns which emails have accounts. Any success is therefore
   * reported as "if that address belongs to an account…".
   */
  async function request(target: string, mode: "submit" | "resend") {
    setPending(true);
    setFeedback(null);
    try {
      await authClient.requestPasswordReset({ email: target });
      if (mode === "submit") {
        setSent(true);
      } else {
        cooldown.start(RESEND_COOLDOWN_SECONDS);
        setFeedback({
          tone: "success",
          text: "Another reset link is on its way. Only the newest link works.",
        });
      }
    } catch (err) {
      const code = err instanceof AuthError ? err.code : "unknown";
      if (code === "rate_limited") {
        cooldown.start(RESEND_COOLDOWN_SECONDS);
        setFeedback({ tone: "info", text: describeAuthError("rate_limited") });
      } else {
        setFeedback({ tone: "error", text: describeAuthError(code) });
      }
    } finally {
      setPending(false);
    }
  }

  async function onSubmit(data: z.infer<typeof forgotSchema>) {
    await request(data.email.trim().toLowerCase(), "submit");
  }

  if (sent) {
    return (
      <motion.div
        key="sent"
        initial={reduce ? false : { opacity: 0, x: 8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: reduce ? 0 : 0.3, ease: EASE }}
      >
        <AuthOutcome
          marker="Recovery sent"
          title="Check your inbox"
          primary={{ href: "/login", label: "Back to sign in" }}
          secondary={{ href: "/reset-password", label: "I already have a reset link" }}
        >
          <p>
            If <span className="text-fg">{email.trim()}</span> belongs to a Foundry account, a reset
            link is on its way. The link is single-use and expires shortly after it&apos;s issued.
          </p>
          <p className="text-[13px] text-faint">
            Nothing arrived? Check spam, or send another link below.
          </p>

          <div className="mt-5 border-t border-line pt-4">
            <button
              type="button"
              onClick={() => request(getValues("email").trim().toLowerCase(), "resend")}
              disabled={pending || remaining > 0}
              className="inline-flex h-10 items-center border border-line px-4 font-mono text-[10.5px] uppercase tracking-[0.18em] text-fg transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:border-line disabled:text-faint disabled:hover:border-line disabled:hover:text-faint"
            >
              {pending
                ? "Sending…"
                : remaining > 0
                  ? `Resend in ${remaining}s`
                  : "Resend the link"}
            </button>
            <button
              type="button"
              onClick={() => {
                setSent(false);
                setFeedback(null);
              }}
              className="ml-4 text-[12.5px] text-faint underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
            >
              Use a different email
            </button>

            <div aria-live="polite">
              <AnimatePresence initial={false}>
                {feedback ? <Alert tone={feedback.tone}>{feedback.text}</Alert> : null}
              </AnimatePresence>
            </div>
          </div>
        </AuthOutcome>
      </motion.div>
    );
  }

  return (
    <AuthEnter>
      <AuthHeading
        marker="Account recovery"
        title="Reset your password"
        description="Enter the address you signed up with. We'll send a single-use link to set a new password."
      />

      <form noValidate onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" aria-describedby="forgot-status">
        <TextField
          id="forgot-email"
          label="Email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@studio.com"
          {...register("email")}
          error={errors.email?.message}
          disabled={pending}
          autoFocus
        />

        <div id="forgot-status">
          <AnimatePresence initial={false}>
            {feedback ? <Alert tone={feedback.tone}>{feedback.text}</Alert> : null}
          </AnimatePresence>
        </div>

        <button
          type="submit"
          disabled={pending}
          aria-busy={pending}
          className="inline-flex h-11 w-full items-center justify-center gap-2.5 bg-mint px-5 text-[14.5px] font-medium text-ink transition duration-200 hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Sending link…" : "Send reset link"}
          {!pending ? <span aria-hidden>→</span> : null}
        </button>
      </form>

      <AuthFoot>
        <span>
          Remembered it? <AuthLink href="/login" emphasis>Back to sign in</AuthLink>
        </span>
        <AuthLink href="/register">Create an account</AuthLink>
      </AuthFoot>

      <AuthServiceNotice />
    </AuthEnter>
  );
}
