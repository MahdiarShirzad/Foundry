"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence } from "motion/react";

import {
  AuthEnter,
  AuthFoot,
  AuthHeading,
  AuthLink,
  AuthServiceNotice,
} from "./auth-frame";
import { CheckboxField, PasswordField, TextField } from "./fields";
import { Alert, SubmitButton } from "./feedback";
import { RegisterFields, registerSchema } from "@/lib/auth/schemas";
import { authClient } from "@/lib/auth/client";
import { AuthError, describeAuthError } from "@/lib/auth/contract";
import { useRouter } from "next/navigation";

export default function RegisterForm({
  initialEmail,
}: {
  initialEmail: string;
}) {
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
    defaultValues: {
      email: initialEmail,
      password: "",
      confirmation: "",
    },
  });

  const router = useRouter();

  const {
    formState: { errors },
    handleSubmit,
    control,
  } = form;

  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<{
    tone: "error" | "info";
    text: string;
  } | null>(null);

  async function onSubmit(data: RegisterFields) {
    setPending(true);
    try {
      await authClient.signUp({
        email: data.email,
        password: data.password,
      });
      router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
    } catch (err) {
      setFeedback({
        tone: "error",
        text:
          err instanceof AuthError
            ? describeAuthError(err.code)
            : describeAuthError("unknown"),
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

      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 space-y-5"
        aria-describedby="register-status"
      >
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              id="register-email"
              label="Email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@studio.com"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={errors.email?.message}
              disabled={pending}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <PasswordField
              id="register-password"
              label="Password"
              autoComplete="new-password"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={errors.password?.message}
              showRules
              disabled={pending}
            />
          )}
        />

        <Controller
          name="confirmation"
          control={control}
          render={({ field }) => (
            <PasswordField
              id="register-confirm"
              label="Confirm password"
              autoComplete="new-password"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={errors.confirmation?.message}
              disabled={pending}
            />
          )}
        />

        <Controller
          name="accepted"
          control={control}
          render={({ field }) => (
            <CheckboxField
              id="register-terms"
              checked={field.value}
              onChange={field.onChange}
              error={errors.accepted?.message}
            >
              I agree to the{" "}
              <Link
                href="/terms"
                className="text-fg underline decoration-line underline-offset-4 hover:decoration-accent"
              >
                terms of service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-fg underline decoration-line underline-offset-4 hover:decoration-accent"
              >
                privacy policy
              </Link>
              .
            </CheckboxField>
          )}
        />

        <div id="register-status">
          <AnimatePresence initial={false}>
            {feedback ? (
              <Alert tone={feedback.tone}>{feedback.text}</Alert>
            ) : null}
          </AnimatePresence>
        </div>

        <SubmitButton pending={pending} pendingLabel="Creating account…">
          Create account
        </SubmitButton>
      </form>

      <AuthFoot>
        <span>
          Already have an account?{" "}
          <AuthLink href="/login" emphasis>
            Sign in
          </AuthLink>
        </span>
        <AuthLink href="/verify-email">Verify an email</AuthLink>
      </AuthFoot>

      <AuthServiceNotice />
    </AuthEnter>
  );
}
