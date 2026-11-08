"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { EASE, AuthEnter, AuthFoot, AuthHeading, AuthLink, AuthServiceNotice } from "./auth-frame";
import CodeInput from "./code-input";
import { TextField } from "./fields";
import { Alert, SubmitButton } from "./feedback";
import { AuthOutcome } from "./outcome";
import { verifySchema } from "@/lib/auth/schemas";

type Feedback = { tone: "error" | "info" | "success"; text: string } | null;

export default function VerifyForm({ initialEmail }: { initialEmail: string }) {
  const reduce = useReducedMotion();
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    mode: "onTouched",
  });

  const { register, formState: { errors }, watch, control, handleSubmit } = form;

  const email = watch("email");

  const [editingEmail, setEditingEmail] = useState(initialEmail.trim().length === 0);
  const [pending, setPending] = useState(false);
  const [resending, setResending] = useState(false);
  const [verified, setVerified] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const remaining = 0;

  async function onSubmit() {
    setPending(true);
    try {
      // TODO: implement
    } finally {
      setPending(false);
    }
  }

  async function resend() {
    setPending(false);
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

      <form noValidate onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" aria-describedby="verify-status">
        {editingEmail ? (
          <TextField
            id="verify-email"
            label="Email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@studio.com"
            {...register("email")}
            error={errors.email?.message}
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

        <Controller
          name="code"
          control={control}
          render={({ field }) => (
            <CodeInput
              id="verify-code"
              label="Six-digit code"
              value={field.value}
              onChange={field.onChange}
              length={6}
              disabled={pending}
              invalid={errors.code ? true : undefined}
            />
          )}
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
