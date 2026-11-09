"use client";

import Link from "next/link";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
import { TextField, PasswordField } from "./fields";
import { Alert, SubmitButton } from "./feedback";
import { LoginFields, loginSchema } from "@/lib/auth/schemas";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";
import { AuthError, describeAuthError } from "@/lib/auth/contract";
import { log } from "console";

export default function LoginForm({ next }: { next: string }) {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<{
    tone: "error" | "info";
    text: string;
  } | null>(null);

  const router = useRouter();

  async function onSubmit(data: LoginFields) {
    setPending(true);
    try {
      await authClient.signIn({
        email: data.email,
        password: data.password,
      });
      router.replace(next);
    } catch (err) {
      console.log(err);
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
        marker="Secure access"
        title="Sign in to Foundry"
        description="Pick the cycle back up — ideas, evidence, roadmap and launch stay in one workspace."
      />

      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 space-y-5"
        aria-describedby="login-status"
      >
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              id="login-email"
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

        <div>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <PasswordField
                id="login-password"
                label="Password"
                autoComplete="current-password"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.password?.message}
                disabled={pending}
              />
            )}
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
