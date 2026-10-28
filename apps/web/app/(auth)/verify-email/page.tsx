import type { Metadata } from "next";

import VerifyForm from "@/components/auth/verify-form";

// Reads `?email=` for the code target, so it renders per request.
export const instant = false;

export const metadata: Metadata = {
  title: "Verify email",
  description: "Enter the six-digit code sent to your address to confirm your Foundry account.",
  robots: { index: false, follow: false },
};

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string | string[] }>;
}) {
  const params = await searchParams;
  const email = typeof params.email === "string" ? params.email.slice(0, 254) : "";
  return <VerifyForm initialEmail={email} />;
}
