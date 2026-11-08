"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { loginSchema } from "@/lib/auth/schemas";

export default function LoginForm({ next }: { next: string }) {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  const { register, formState: { errors }, handleSubmit } = form;

  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<{
    tone: "error" | "info";
    text: string;
  } | null>(null);

  async function onSubmit() {
    setPending(true);
    try {
      // TODO: implement
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
          <TextField
            id="login-email"
            label="Email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@studio.com"
            {...register("email")}
            error={errors.email?.message}
            disabled={pending}
          />

        <div>
          <PasswordField
            id="login-password"
            label="Password"
            autoComplete="current-password"
            {...register("password")}
            error={errors.password?.message}
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
