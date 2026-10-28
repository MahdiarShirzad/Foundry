import type { Metadata } from "next";

import RegisterForm from "@/components/auth/register-form";

// Reads `?email=` to prefill, so it renders per request.
export const instant = false;

export const metadata: Metadata = {
  title: "Create account",
  description: "Create a Foundry account and start the eight-stage cycle from idea to launch.",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string | string[] }>;
}) {
  const params = await searchParams;
  const email = typeof params.email === "string" ? params.email.slice(0, 254) : "";
  return <RegisterForm initialEmail={email} />;
}
